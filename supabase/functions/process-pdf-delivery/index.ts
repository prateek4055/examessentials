import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { PDFDocument, rgb, degrees, StandardFonts, PDFPage } from "https://esm.sh/pdf-lib@1.17.1";

// ─── HELPERS ────────────────────────────────────────────────────────────────

/**
 * Send an email via Resend with optional file attachments.
 */
async function sendResendEmail(
    apiKey: string,
    to: string,
    subject: string,
    html: string,
    attachments?: { filename: string; content: string }[]
) {
    const body: Record<string, unknown> = {
        from: "Exam Essentials <contact@examessentials.in>",
        to: [to],
        subject,
        html,
    };

    if (attachments && attachments.length > 0) {
        body.attachments = attachments; // Resend accepts base64 content
    }

    const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        throw new Error(`Resend Error: ${res.status} ${await res.text()}`);
    }
    return await res.json();
}

/**
 * Encode a Uint8Array to a base64 string (for email attachments).
 */
function uint8ToBase64(bytes: Uint8Array): string {
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

// ─── INVOICE PDF GENERATOR ─────────────────────────────────────────────────

interface InvoiceProduct {
    title: string;
    price: number;
}

async function generateInvoicePdf(
    order: Record<string, any>,
    products: InvoiceProduct[],
    totalPaid: number
): Promise<Uint8Array> {
    const doc = await PDFDocument.create();
    const page = doc.addPage([595, 842]); // A4
    const { width, height } = page.getSize();

    const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await doc.embedFont(StandardFonts.Helvetica);

    const purple = rgb(0.42, 0, 0.68);
    const black = rgb(0.1, 0.1, 0.1);
    const gray = rgb(0.45, 0.45, 0.45);
    const lightGray = rgb(0.92, 0.92, 0.92);
    const white = rgb(1, 1, 1);

    let y = height - 50;

    // ── Header Band ──
    page.drawRectangle({ x: 0, y: y - 10, width, height: 60, color: purple });
    page.drawText("INVOICE", {
        x: 40, y: y + 5, size: 28, font: fontBold, color: white,
    });
    page.drawText("Exam Essentials", {
        x: width - 180, y: y + 10, size: 14, font: fontBold, color: white,
    });
    page.drawText("examessentials.in", {
        x: width - 180, y: y - 6, size: 10, font: fontRegular, color: rgb(0.85, 0.78, 1),
    });

    y -= 80;

    // ── Order Meta ──
    const shortOrderId = order.id ? order.id.split("-")[0].toUpperCase() : "N/A";
    const orderDate = order.created_at
        ? new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
        : new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

    page.drawText(`Invoice #EE-${shortOrderId}`, { x: 40, y, size: 12, font: fontBold, color: purple });
    page.drawText(`Date: ${orderDate}`, { x: width - 200, y, size: 10, font: fontRegular, color: gray });
    y -= 16;
    page.drawText(`Razorpay ID: ${order.razorpay_payment_id || "N/A"}`, { x: 40, y, size: 9, font: fontRegular, color: gray });
    y -= 30;

    // ── Bill To ──
    page.drawText("Bill To:", { x: 40, y, size: 11, font: fontBold, color: black });
    y -= 16;
    page.drawText(order.student_name || "Student", { x: 40, y, size: 10, font: fontRegular, color: black });
    y -= 14;
    page.drawText(order.email || "", { x: 40, y, size: 10, font: fontRegular, color: gray });
    y -= 14;
    page.drawText(order.phone || "", { x: 40, y, size: 10, font: fontRegular, color: gray });
    y -= 30;

    // ── Seller Info ──
    page.drawText("From:", { x: width - 200, y: y + 60, size: 11, font: fontBold, color: black });
    page.drawText("Exam Essentials", { x: width - 200, y: y + 46, size: 10, font: fontRegular, color: black });
    page.drawText("GSTIN: Applied For", { x: width - 200, y: y + 32, size: 9, font: fontRegular, color: gray });

    // ── Items Table Header ──
    page.drawRectangle({ x: 40, y: y - 4, width: width - 80, height: 22, color: purple });
    page.drawText("Product", { x: 50, y: y + 2, size: 10, font: fontBold, color: white });
    page.drawText("Qty", { x: 370, y: y + 2, size: 10, font: fontBold, color: white });
    page.drawText("Price", { x: 430, y: y + 2, size: 10, font: fontBold, color: white });
    page.drawText("Amount", { x: 490, y: y + 2, size: 10, font: fontBold, color: white });
    y -= 28;

    // ── Items Rows ──
    for (let i = 0; i < products.length; i++) {
        const p = products[i];
        const rowColor = i % 2 === 0 ? lightGray : white;
        page.drawRectangle({ x: 40, y: y - 4, width: width - 80, height: 22, color: rowColor });

        let title = p.title;
        if (title.length > 40) title = title.substring(0, 37) + "...";

        page.drawText(title, { x: 50, y: y + 2, size: 9, font: fontRegular, color: black });
        page.drawText("1", { x: 378, y: y + 2, size: 9, font: fontRegular, color: black });
        page.drawText(`Rs.${p.price.toFixed(2)}`, { x: 425, y: y + 2, size: 9, font: fontRegular, color: black });
        page.drawText(`Rs.${p.price.toFixed(2)}`, { x: 485, y: y + 2, size: 9, font: fontRegular, color: black });
        y -= 24;
    }

    y -= 10;

    // ── Totals ──
    const gstRate = 0.05;
    const subtotalExclTax = totalPaid / (1 + gstRate);
    const gstAmount = totalPaid - subtotalExclTax;

    page.drawLine({ start: { x: 380, y: y + 6 }, end: { x: width - 40, y: y + 6 }, thickness: 1, color: gray });
    y -= 6;

    page.drawText("Subtotal (Excl. Tax):", { x: 380, y, size: 10, font: fontRegular, color: black });
    page.drawText(`Rs.${subtotalExclTax.toFixed(2)}`, { x: 490, y, size: 10, font: fontRegular, color: black });
    y -= 18;

    page.drawText("IGST (5%):", { x: 380, y, size: 10, font: fontRegular, color: black });
    page.drawText(`Rs.${gstAmount.toFixed(2)}`, { x: 490, y, size: 10, font: fontRegular, color: black });
    y -= 22;

    page.drawRectangle({ x: 370, y: y - 6, width: width - 410, height: 24, color: purple });
    page.drawText("Total Paid:", { x: 380, y: y + 2, size: 11, font: fontBold, color: white });
    page.drawText(`Rs.${totalPaid.toFixed(2)}`, { x: 490, y: y + 2, size: 11, font: fontBold, color: white });

    y -= 50;

    // ── Footer ──
    page.drawLine({ start: { x: 40, y }, end: { x: width - 40, y }, thickness: 0.5, color: gray });
    y -= 16;
    page.drawText("This is a computer-generated invoice and does not require a signature.", { x: 40, y, size: 8, font: fontRegular, color: gray });
    y -= 12;
    page.drawText("For queries, contact: contact@examessentials.in", { x: 40, y, size: 8, font: fontRegular, color: gray });

    return await doc.save();
}

// ─── MAIN HANDLER ───────────────────────────────────────────────────────────

serve(async (req) => {
    try {
        // ── Auth ──
        const webhookSecret = Deno.env.get("WEBHOOK_SECRET");
        const reqSecret = req.headers.get("x-webhook-secret");
        if (webhookSecret && reqSecret !== webhookSecret) {
            return new Response("Unauthorized", { status: 401 });
        }

        const payload = await req.json();

        if (payload.type !== "INSERT" || payload.table !== "orders") {
            return new Response("Not an INSERT on orders", { status: 200 });
        }

        const order = payload.record;

        if (order.payment_status !== "completed") {
            return new Response("Order not completed, skipping", { status: 200 });
        }

        // ── Env ──
        const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
        const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
        const PDFCO_API_KEY = Deno.env.get("PDFCO_API_KEY");

        if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
            throw new Error("Missing Supabase credentials");
        }

        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        // ── Resolve Product IDs ──
        let productIds: string[] = [];
        if (order.product_id) {
            productIds = order.product_id.split(",").map((id: string) => id.trim()).filter((id: string) => id.length > 0);
        }

        if (productIds.length === 0) {
            throw new Error("No product IDs found in order");
        }

        console.log(`Processing ${productIds.length} product(s) for order ${order.id}`);

        // ── Fetch All Products ──
        const { data: products, error: productsError } = await supabase
            .from("products")
            .select("*")
            .in("id", productIds);

        if (productsError || !products || products.length === 0) {
            throw new Error(`Failed to fetch products: ${productsError?.message}`);
        }

        // ── Process Each PDF ──
        const downloadEntries: { title: string; imageUrl: string | null; downloadUrl: string; price: number }[] = [];

        for (const product of products) {
            if (!product.pdf_url) {
                console.log(`Product ${product.id} has no pdf_url, skipping`);
                continue;
            }

            let filePath = product.pdf_url;
            if (filePath.startsWith("http")) {
                const urlParts = new URL(filePath).pathname.split("/");
                const bucketIndex = urlParts.indexOf("original_pdfs");
                if (bucketIndex !== -1 && bucketIndex < urlParts.length - 1) {
                    filePath = urlParts.slice(bucketIndex + 1).join("/");
                }
            }

            const { data: pdfData, error: downloadError } = await supabase.storage.from("original_pdfs").download(filePath);
            if (downloadError || !pdfData) {
                console.error(`Failed to download ${filePath}: ${downloadError?.message}`);
                continue;
            }

            // Watermark
            const originalBytes = await pdfData.arrayBuffer();
            const pdfDoc = await PDFDocument.load(originalBytes);
            const pages = pdfDoc.getPages();
            const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
            const watermarkText = `Licensed to ${order.student_name} - ${order.phone}`;

            pages.forEach((page: any) => {
                const { width, height } = page.getSize();
                page.drawText(watermarkText, { x: width / 2 - 200, y: height / 2, size: 24, font, color: rgb(0.7, 0.7, 0.7), rotate: degrees(45), opacity: 0.5 });
                page.drawText(watermarkText, { x: 50, y: 30, size: 10, font, color: rgb(0.5, 0.5, 0.5), opacity: 0.8 });
            });

            const watermarkedBytes = await pdfDoc.save();

            // Upload
            const fileName = `${order.id}/${product.id}_${Date.now()}.pdf`;
            const { error: uploadError } = await supabase.storage.from("purchased_pdfs").upload(fileName, watermarkedBytes, { contentType: "application/pdf" });
            if (uploadError) { console.error(`Upload error:`, uploadError); continue; }

            // Signed URL (7 days)
            const { data: signedUrlData } = await supabase.storage.from("purchased_pdfs").createSignedUrl(fileName, 60 * 60 * 24 * 7);
            if (!signedUrlData) { console.error(`Signed URL error for ${product.id}`); continue; }

            let finalUrl = signedUrlData.signedUrl;

            // Encrypt via PDF.co
            if (PDFCO_API_KEY) {
                try {
                    const pdfcoRes = await fetch("https://api.pdf.co/v1/pdf/security/add", {
                        method: "POST",
                        headers: { "x-api-key": PDFCO_API_KEY, "Content-Type": "application/json" },
                        body: JSON.stringify({
                            url: signedUrlData.signedUrl,
                            userPassword: order.phone,
                            ownerPassword: Math.random().toString(36).substring(2, 15),
                            allowPrint: true, allowCopyDocument: false, allowModifyDocument: false,
                        }),
                    });
                    const pdfcoData = await pdfcoRes.json();
                    if (!pdfcoData.error && pdfcoData.url) {
                        finalUrl = pdfcoData.url;
                        console.log(`Encrypted ${product.title} via PDF.co`);
                    }
                } catch (e) { console.error("PDF.co call failed:", e); }
            }

            const coverImage = product.images && product.images.length > 0 ? product.images[0] : null;
            downloadEntries.push({ title: product.title, imageUrl: coverImage, downloadUrl: finalUrl, price: product.price });
        }

        if (downloadEntries.length === 0) {
            throw new Error("No PDFs were successfully processed");
        }

        // ── Generate Invoice PDF ──
        const invoiceProducts: InvoiceProduct[] = downloadEntries.map((e) => ({ title: e.title, price: e.price }));
        const totalPaid = order.amount || downloadEntries.reduce((sum, e) => sum + e.price, 0);
        const invoicePdfBytes = await generateInvoicePdf(order, invoiceProducts, totalPaid);
        const invoiceBase64 = uint8ToBase64(invoicePdfBytes);

        const shortOrderId = order.id ? order.id.split("-")[0].toUpperCase() : "N/A";
        const orderDate = order.created_at
            ? new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
            : "Today";

        const gstRate = 0.05;
        const subtotalExclTax = totalPaid / (1 + gstRate);
        const gstAmount = totalPaid - subtotalExclTax;

        // Build download rows
        const downloadRows = downloadEntries.map((entry) => `
            <tr>
                <td style="border: 1px solid #e0e0e0; padding: 14px; vertical-align: middle;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        ${entry.imageUrl
                ? `<img src="${entry.imageUrl}" alt="${entry.title}" style="width: 60px; height: 75px; object-fit: cover; border-radius: 6px; border: 1px solid #e0e0e0;" />`
                : `<div style="width: 60px; height: 75px; background: #f3e8ff; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 24px;">📄</div>`
            }
                        <div>
                            <strong style="color: #6a0dad; font-size: 13px;">${entry.title}</strong><br/>
                            <span style="color: #888; font-size: 11px;">Digital Handwritten Notes</span>
                        </div>
                    </div>
                </td>
                <td style="border: 1px solid #e0e0e0; padding: 14px; text-align: center; vertical-align: middle;">
                    <a href="${entry.downloadUrl}" style="display: inline-block; padding: 10px 20px; background: linear-gradient(135deg, #8B5CF6, #6D28D9); color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 13px;">Download</a>
                </td>
            </tr>`).join("");

        // Build invoice item rows
        const invoiceItemRows = downloadEntries.map((entry) => `
            <tr>
                <td style="border: 1px solid #e0e0e0; padding: 10px; font-size: 12px; color: #333;">${entry.title}</td>
                <td style="border: 1px solid #e0e0e0; padding: 10px; text-align: center; font-size: 12px;">1</td>
                <td style="border: 1px solid #e0e0e0; padding: 10px; text-align: right; font-size: 12px;">Rs.${entry.price.toFixed(2)}</td>
            </tr>`).join("");

        const emailHtml = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #e0e0e0; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #6D28D9, #8B5CF6); padding: 28px 20px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 26px; letter-spacing: 1px;">Thanks, Action Taker!</h1>
                <p style="color: #e0d4f7; margin: 8px 0 0 0; font-size: 14px;">Your notes are ready to download</p>
            </div>

            <div style="background: #fdf2f8; border-left: 4px solid #d926a9; margin: 20px; padding: 16px 20px; border-radius: 0 8px 8px 0;">
                <p style="margin: 0; font-size: 13px; color: #333;">Hi <strong>${order.student_name}</strong>,</p>
                <h2 style="margin: 10px 0 0 0; font-size: 20px; color: #1a1a1a;">Your PDF Password = <span style="color: #d926a9;">${order.phone}</span></h2>
                <p style="margin: 6px 0 0 0; font-size: 11px; color: #888;">Use your registered mobile number to unlock your notes</p>
            </div>

            <div style="padding: 0 20px;">
                <h3 style="color: #6D28D9; font-size: 16px; margin-bottom: 10px;">Your Downloads</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                    <thead>
                        <tr>
                            <th style="border: 1px solid #e0e0e0; padding: 12px; background-color: #f3e8ff; text-align: left; color: #6D28D9;">Product</th>
                            <th style="border: 1px solid #e0e0e0; padding: 12px; background-color: #f3e8ff; text-align: center; color: #6D28D9; width: 130px;">Action</th>
                        </tr>
                    </thead>
                    <tbody>${downloadRows}</tbody>
                </table>
                <p style="font-size: 11px; color: #999; margin-top: 8px;">Download links expire in 7 days. Save your files immediately!</p>
            </div>

            <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); margin: 20px; padding: 18px; border-radius: 8px; text-align: center; border: 1px dashed #f59e0b;">
                <p style="margin: 0 0 6px 0; font-size: 14px; color: #92400e;"><strong>Exclusive Discount for You!</strong></p>
                <p style="margin: 0 0 10px 0; font-size: 12px; color: #a16207;">Get 30% OFF on your next Combo purchase</p>
                <div style="display: inline-block; background: #ffffff; border: 2px dashed #f59e0b; padding: 8px 24px; border-radius: 6px;">
                    <span style="font-size: 20px; font-weight: bold; color: #d97706; letter-spacing: 3px;">WELCOME30</span>
                </div>
                <p style="margin: 8px 0 0 0; font-size: 10px; color: #b45309;">*Applicable on Combo packs only</p>
            </div>

            <div style="padding: 0 20px;">
                <h3 style="color: #6D28D9; font-size: 16px; margin-bottom: 10px;">Order Summary</h3>
                <p style="font-size: 11px; color: #888; margin-bottom: 8px;">[Order #EE-${shortOrderId}] | ${orderDate}</p>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="border: 1px solid #e0e0e0; padding: 10px; background: #fafafa; text-align: left; font-size: 11px;">Product</th>
                            <th style="border: 1px solid #e0e0e0; padding: 10px; background: #fafafa; text-align: center; font-size: 11px; width: 50px;">Qty</th>
                            <th style="border: 1px solid #e0e0e0; padding: 10px; background: #fafafa; text-align: right; font-size: 11px; width: 80px;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${invoiceItemRows}
                        <tr>
                            <td colspan="2" style="border: 1px solid #e0e0e0; padding: 8px 10px; text-align: right; font-size: 11px; color: #666;">Subtotal (Excl. Tax):</td>
                            <td style="border: 1px solid #e0e0e0; padding: 8px 10px; text-align: right; font-size: 11px;">Rs.${subtotalExclTax.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colspan="2" style="border: 1px solid #e0e0e0; padding: 8px 10px; text-align: right; font-size: 11px; color: #666;">IGST (5%):</td>
                            <td style="border: 1px solid #e0e0e0; padding: 8px 10px; text-align: right; font-size: 11px;">Rs.${gstAmount.toFixed(2)}</td>
                        </tr>
                        <tr style="background: #f3e8ff;">
                            <td colspan="2" style="border: 1px solid #e0e0e0; padding: 10px; text-align: right; font-weight: bold; font-size: 13px; color: #6D28D9;">Total Paid:</td>
                            <td style="border: 1px solid #e0e0e0; padding: 10px; text-align: right; font-weight: bold; font-size: 13px; color: #6D28D9;">Rs.${totalPaid.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div style="padding: 20px;">
                <h3 style="color: #6D28D9; font-size: 14px; margin-bottom: 8px;">Billing Address</h3>
                <p style="font-size: 12px; color: #666; margin: 0; line-height: 1.8;">
                    <strong>${order.student_name}</strong><br/>
                    Phone: ${order.phone}<br/>
                    Email: <a href="mailto:${order.email}" style="color: #6D28D9; text-decoration: none;">${order.email}</a>
                </p>
            </div>

            <div style="background: #f9fafb; padding: 16px 20px; text-align: center; border-top: 1px solid #e0e0e0;">
                <p style="margin: 0; font-size: 11px; color: #999;">Need help? Reply to this email or WhatsApp us.<br/>Exam Essentials | examessentials.in</p>
            </div>
        </div>`;

        // ── Send Email with Invoice Attachment ──
        if (RESEND_API_KEY) {
            await sendResendEmail(
                RESEND_API_KEY,
                order.email,
                `Your Exam Essentials order is now complete - ${order.student_name}`,
                emailHtml,
                [{ filename: `Invoice-EE-${shortOrderId}.pdf`, content: invoiceBase64 }]
            );
            console.log(`Email sent to ${order.email} with invoice attachment!`);
        }

        return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
    } catch (error) {
        console.error("Delivery error:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
});
