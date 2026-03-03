import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { PDFDocument, rgb, StandardFonts, degrees } from "https://esm.sh/pdf-lib@1.17.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-webhook-secret",
};

function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 1. Verify webhook secret
    const webhookSecret = req.headers.get("x-webhook-secret");
    const expectedSecret = Deno.env.get("WEBHOOK_SECRET");

    if (!webhookSecret || webhookSecret !== expectedSecret) {
      console.error("Invalid webhook secret");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Parse payload
    const { type, record } = await req.json();

    if (type !== "INSERT" || !record || record.payment_status !== "completed") {
      console.log("Skipped: not a completed order INSERT");
      return new Response(JSON.stringify({ message: "Skipped" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!record.product_id) {
      console.log("Skipped: no product_id on order");
      return new Response(JSON.stringify({ message: "No product_id" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Processing PDF delivery for order ${record.id}, product ${record.product_id}`);

    // 3. Init Supabase with service role
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 4. Get product details
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("title, pdf_url, subject")
      .eq("id", record.product_id)
      .single();

    if (productError || !product) {
      console.error("Product not found:", productError);
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!product.pdf_url) {
      console.error("No PDF URL configured for product:", product.title);
      return new Response(
        JSON.stringify({ error: "No PDF configured for this product" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 5. Download original PDF
    let pdfBytes: Uint8Array;

    // Try from original_pdfs bucket first (strip any prefix to get just the path)
    const storagePath = product.pdf_url.includes("original_pdfs/")
      ? product.pdf_url.split("original_pdfs/").pop()!
      : product.pdf_url;

    console.log(`Attempting to download PDF from original_pdfs bucket: ${storagePath}`);

    const { data: fileData, error: downloadError } = await supabase.storage
      .from("original_pdfs")
      .download(storagePath);

    if (downloadError || !fileData) {
      console.warn("Bucket download failed, trying as direct URL:", downloadError?.message);
      // Fallback: try pdf_url as a direct URL
      try {
        const response = await fetch(product.pdf_url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        pdfBytes = new Uint8Array(await response.arrayBuffer());
      } catch (fetchErr) {
        console.error("Direct URL fetch also failed:", fetchErr);
        return new Response(
          JSON.stringify({ error: "Could not download the PDF file" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    } else {
      pdfBytes = new Uint8Array(await fileData.arrayBuffer());
    }

    console.log(`PDF downloaded: ${pdfBytes.length} bytes`);

    // 6. Watermark the PDF
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();

    const watermarkLine = `Licensed to: ${record.student_name} | Ph: ${record.phone} | Order: ${record.id.substring(0, 8)}`;

    for (const page of pages) {
      const { width, height } = page.getSize();

      // Bottom-center watermark text
      const fontSize = 7;
      const textWidth = font.widthOfTextAtSize(watermarkLine, fontSize);
      page.drawText(watermarkLine, {
        x: (width - textWidth) / 2,
        y: 12,
        size: fontSize,
        font,
        color: rgb(0.6, 0.6, 0.6),
        opacity: 0.6,
      });

      // Large diagonal watermark
      page.drawText(record.student_name, {
        x: width * 0.15,
        y: height * 0.4,
        size: 44,
        font,
        color: rgb(0.92, 0.92, 0.92),
        opacity: 0.12,
        rotate: degrees(45),
      });
    }

    const watermarkedBytes = await pdfDoc.save();
    console.log(`Watermarked PDF: ${watermarkedBytes.length} bytes, ${pages.length} pages`);

    // 7. Store watermarked copy in purchased_pdfs bucket
    const safeTitle = product.title.replace(/[^a-zA-Z0-9_-]/g, "_");
    const purchasedPath = `${record.id}/${safeTitle}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from("purchased_pdfs")
      .upload(purchasedPath, watermarkedBytes, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.warn("Failed to store watermarked copy (non-fatal):", uploadError.message);
    } else {
      console.log(`Stored watermarked PDF at purchased_pdfs/${purchasedPath}`);
    }

    // 8. Send email via Resend
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const base64Pdf = uint8ArrayToBase64(new Uint8Array(watermarkedBytes));

    const emailPayload = {
      from: "Exam Essentials <delivery@examessentials.in>",
      to: [record.email],
      subject: `Your ${product.title} Notes Are Ready! 📚`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #1a1a2e;">Hi ${record.student_name}! 🎉</h2>
          <p>Thank you for your purchase! Your <strong>${product.title}</strong> (${product.subject}) notes are attached to this email as a PDF.</p>
          <div style="background: #f0f4ff; border-radius: 12px; padding: 16px; margin: 20px 0;">
            <p style="margin: 4px 0;"><strong>Order ID:</strong> ${record.id.substring(0, 8)}</p>
            <p style="margin: 4px 0;"><strong>Amount Paid:</strong> ₹${record.amount}</p>
            <p style="margin: 4px 0;"><strong>Class:</strong> ${record.class}</p>
          </div>
          <p>This PDF is personalized for you. Please do not share it.</p>
          <p style="color: #666; font-size: 14px;">If you have any questions, just reply to this email or message us on WhatsApp.</p>
          <p>Happy studying! 📖</p>
          <p><strong>— Team Exam Essentials</strong></p>
        </div>
      `,
      attachments: [
        {
          filename: `${safeTitle}.pdf`,
          content: base64Pdf,
        },
      ],
    };

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      console.error("Resend API error:", errText);
      throw new Error(`Email send failed: ${errText}`);
    }

    const emailResult = await emailRes.json();
    console.log(`Email sent successfully to ${record.email}, Resend ID: ${emailResult.id}`);

    return new Response(
      JSON.stringify({ success: true, message: "PDF watermarked and delivered", email_id: emailResult.id }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("process-pdf-delivery error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
