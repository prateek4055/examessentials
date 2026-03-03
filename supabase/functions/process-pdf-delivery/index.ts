import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { PDFDocument, rgb, degrees, StandardFonts } from "https://esm.sh/pdf-lib@1.17.1";

async function sendResendEmail(apiKey: string, to: string, subject: string, html: string) {
    const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            from: "Exam Essentials <notes@examessentials.in>",
            to: [to],
            subject: subject,
            html: html
        })
    });
    if (!res.ok) {
        throw new Error(`Resend Error: ${res.status} ${await res.text()}`);
    }
    return await res.json();
}

serve(async (req) => {
    try {
        const webhookSecret = Deno.env.get("WEBHOOK_SECRET");
        const reqSecret = req.headers.get("x-webhook-secret");
        if (webhookSecret && reqSecret !== webhookSecret) {
            return new Response("Unauthorized", { status: 401 });
        }

        const payload = await req.json();

        if (payload.type !== "INSERT" || payload.table !== "orders") {
            return new Response("Not an INSERT payload", { status: 200 });
        }

        const order = payload.record;

        if (order.payment_status !== "completed") return new Response("Order not completed", { status: 200 });
        if (!order.product_id) throw new Error("Order has no product_id");

        const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
        const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
        const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
        const PDFCO_API_KEY = Deno.env.get("PDFCO_API_KEY");

        if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Missing Supabase credentials");

        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        const { data: product, error: productError } = await supabase
            .from("products")
            .select("pdf_url, title")
            .eq("id", order.product_id)
            .single();

        if (productError || !product || !product.pdf_url) throw new Error(`Product or PDF URL not found`);

        let filePath = product.pdf_url;
        if (filePath.startsWith('http')) {
            const urlParts = new URL(filePath).pathname.split('/');
            const bucketIndex = urlParts.indexOf('original_pdfs');
            if (bucketIndex !== -1 && bucketIndex < urlParts.length - 1) {
                filePath = urlParts.slice(bucketIndex + 1).join('/');
            }
        }

        const { data: pdfData, error: downloadError } = await supabase.storage.from('original_pdfs').download(filePath);
        if (downloadError || !pdfData) throw new Error(`Failed to download master PDF: ${downloadError?.message}`);

        const originalPdfBytes = await pdfData.arrayBuffer();
        const pdfDoc = await PDFDocument.load(originalPdfBytes);
        const pages = pdfDoc.getPages();
        const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const watermarkText = `Licensed to ${order.student_name} - ${order.phone}`;

        pages.forEach((page) => {
            const { width, height } = page.getSize();
            page.drawText(watermarkText, { x: width / 2 - 200, y: height / 2, size: 24, font: font, color: rgb(0.7, 0.7, 0.7), rotate: degrees(45), opacity: 0.5 });
            page.drawText(watermarkText, { x: 50, y: 30, size: 10, font: font, color: rgb(0.5, 0.5, 0.5), opacity: 0.8 });
        });

        const watermarkedPdfBytes = await pdfDoc.save();

        const fileName = `${order.id}/${order.product_id}_${Date.now()}.pdf`;
        const { error: uploadError } = await supabase.storage.from("purchased_pdfs").upload(fileName, watermarkedPdfBytes, { contentType: "application/pdf" });
        if (uploadError) throw uploadError;

        const { data: tempUrlData } = await supabase.storage.from("purchased_pdfs").createSignedUrl(fileName, 60 * 5); 
        if (!tempUrlData) throw new Error("Failed to create temporary URL");

        let finalDownloadUrl = tempUrlData.signedUrl;

        if (PDFCO_API_KEY) {
            const pdfcoRes = await fetch("https://api.pdf.co/v1/pdf/security/add", {
                method: "POST",
                headers: { "x-api-key": PDFCO_API_KEY, "Content-Type": "application/json" },
                body: JSON.stringify({
                    url: tempUrlData.signedUrl,
                    userPassword: order.phone,
                    ownerPassword: Math.random().toString(36).substring(2, 15),
                    allowPrint: true,
                    allowCopyDocument: false,
                    allowModifyDocument: false
                })
            });

            const pdfcoData = await pdfcoRes.json();
            if (!pdfcoData.error) {
                finalDownloadUrl = pdfcoData.url; 
            }
        }

        if (RESEND_API_KEY) {
            const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Hi ${order.student_name},</h2>
            <p>Thank you for purchasing <strong>${product.title}</strong>!</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${finalDownloadUrl}" style="background-color: #4CAF50; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-size: 16px;">
                Download Your Notes
              </a>
            </div>
            <hr style="border: 1px solid #eee; margin: 20px 0;" />
            <p>🔒 <strong>IMPORTANT: PDF Password</strong></p>
            <p>Your PDF is highly secured and password protected.</p>
            <p><strong>Password:</strong> Your mobile number (<code>${order.phone}</code>)</p>
            <hr style="border: 1px solid #eee; margin: 20px 0;" />
            <p style="color: #888;">Note: Ensure you download and save this file to your device today!</p>
            <p>Best regards,<br/>Exam Essentials</p>
          </div>`;

            await sendResendEmail(RESEND_API_KEY, order.email, `[Secure PDF] Your Notes: ${product.title}`, emailHtml);
        }

        return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" }});
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
});
