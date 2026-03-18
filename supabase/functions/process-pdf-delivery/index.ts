import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { PDFDocument, rgb, StandardFonts } from "https://esm.sh/pdf-lib@1.17.1";

// ─── HELPERS ────────────────────────────────────────────────────────────────

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
        body.attachments = attachments;
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

function uint8ToBase64(bytes: Uint8Array): string {
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

// ─── INVOICE PDF GENERATOR (lightweight, ~50KB) ────────────────────────────

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
    const page = doc.addPage([595, 842]);
    const { width, height } = page.getSize();

    const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await doc.embedFont(StandardFonts.Helvetica);

    const purple = rgb(0.42, 0, 0.68);
    const black = rgb(0.1, 0.1, 0.1);
    const gray = rgb(0.45, 0.45, 0.45);
    const lightGray = rgb(0.92, 0.92, 0.92);
    const white = rgb(1, 1, 1);

    let y = height - 50;

    // Header bar
    page.drawRectangle({ x: 0, y: y - 10, width, height: 60, color: purple });
    page.drawText("INVOICE", { x: 40, y: y + 5, size: 28, font: fontBold, color: white });

    // Embed logo in header (top right)
    try {
        const logoRes = await fetch("https://examessentials.in/logo.jpeg");
        if (logoRes.ok) {
            const logoBytes = new Uint8Array(await logoRes.arrayBuffer());
            const logoImage = await doc.embedJpg(logoBytes);
            page.drawImage(logoImage, {
                x: width - 90,
                y: y - 5,
                width: 40,
                height: 40,
            });
        }
    } catch (e) {
        console.log("Logo embed failed, skipping:", e);
    }

    page.drawText("Exam Essentials", { x: width - 230, y: y + 10, size: 14, font: fontBold, color: white });
    page.drawText("examessentials.in", { x: width - 230, y: y - 6, size: 10, font: fontRegular, color: rgb(0.85, 0.78, 1) });

    y -= 80;

    const shortOrderId = order.id ? order.id.split("-")[0].toUpperCase() : "N/A";
    const orderDate = order.created_at
        ? new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
        : new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

    page.drawText(`Invoice #EE-${shortOrderId}`, { x: 40, y, size: 12, font: fontBold, color: purple });
    page.drawText(`Date: ${orderDate}`, { x: width - 200, y, size: 10, font: fontRegular, color: gray });
    y -= 16;
    page.drawText(`Razorpay ID: ${order.razorpay_payment_id || "N/A"}`, { x: 40, y, size: 9, font: fontRegular, color: gray });
    y -= 30;

    page.drawText("Bill To:", { x: 40, y, size: 11, font: fontBold, color: black });
    y -= 16;
    page.drawText(order.student_name || "Student", { x: 40, y, size: 10, font: fontRegular, color: black });
    y -= 14;
    page.drawText(order.email || "", { x: 40, y, size: 10, font: fontRegular, color: gray });
    y -= 14;
    page.drawText(order.phone || "", { x: 40, y, size: 10, font: fontRegular, color: gray });
    y -= 30;

    page.drawText("From:", { x: width - 200, y: y + 60, size: 11, font: fontBold, color: black });
    page.drawText("Exam Essentials", { x: width - 200, y: y + 46, size: 10, font: fontRegular, color: black });
    page.drawText("GSTIN: 08EFMPG9686D1ZV", { x: width - 200, y: y + 32, size: 9, font: fontRegular, color: gray });

    // Table header
    page.drawRectangle({ x: 40, y: y - 4, width: width - 80, height: 22, color: purple });
    page.drawText("Product", { x: 50, y: y + 2, size: 10, font: fontBold, color: white });
    page.drawText("Qty", { x: 370, y: y + 2, size: 10, font: fontBold, color: white });
    page.drawText("Price", { x: 430, y: y + 2, size: 10, font: fontBold, color: white });
    page.drawText("Amount", { x: 490, y: y + 2, size: 10, font: fontBold, color: white });
    y -= 28;

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
        console.log("[DEBUG] Edge Function invoked!");

        // Auth
        const webhookSecret = Deno.env.get("WEBHOOK_SECRET");
        const reqSecret = req.headers.get("x-webhook-secret");
        const authHeader = req.headers.get("authorization");
        const hasWebhookSecret = reqSecret && reqSecret === webhookSecret;
        const hasBearerToken = authHeader && authHeader.startsWith("Bearer ");
        console.log(`[DEBUG] Auth check - webhook: ${hasWebhookSecret}, serviceRole: ${!!hasBearerToken}`);
        if (!hasWebhookSecret && !hasBearerToken) {
            return new Response("Unauthorized", { status: 401 });
        }

        const payload = await req.json();
        console.log(`[DEBUG] Payload type: ${payload.type}, table: ${payload.table}`);

        if (payload.type !== "INSERT" || payload.table !== "orders") {
            return new Response("Not an INSERT on orders", { status: 200 });
        }

        const order = payload.record;
        console.log(`[DEBUG] Order id: ${order.id}, payment_status: ${order.payment_status}, product_id: ${order.product_id}`);

        if (order.payment_status !== "completed") {
            return new Response("Order not completed, skipping", { status: 200 });
        }

        console.log("[DEBUG] All checks passed, starting PDF processing...");

        const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
        const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
        const PDFCO_API_KEY = Deno.env.get("PDFCO_API_KEY");

        if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
            throw new Error("Missing Supabase credentials");
        }

        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

        // Parse custom prices from razorpay_payment_id if present
        let customPriceMap: Record<string, number> | null = null;
        const paymentId = order.razorpay_payment_id || "";
        if (paymentId.startsWith("admin_custom_")) {
            try {
                customPriceMap = JSON.parse(paymentId.replace("admin_custom_", ""));
                console.log("[DEBUG] Custom price map parsed:", customPriceMap);
            } catch (e) {
                console.error("Failed to parse custom prices:", e);
            }
        }

        const isFreeDelivery = !order.amount || order.amount === 0;
        console.log(`[DEBUG] isFreeDelivery: ${isFreeDelivery}`);

        // Resolve product IDs
        let productIds: string[] = [];
        if (order.product_id) {
            productIds = order.product_id.split(",").map((id: string) => id.trim()).filter((id: string) => id.length > 0);
        }
        if (productIds.length === 0) {
            throw new Error("No product IDs found in order");
        }

        console.log(`Processing ${productIds.length} product(s) for order ${order.id}`);

        const { data: products, error: productsError } = await supabase
            .from("products")
            .select("*")
            .in("id", productIds);

        if (productsError || !products || products.length === 0) {
            throw new Error(`Failed to fetch products: ${productsError?.message}`);
        }

        // ── Process each PDF via URL-based APIs (NO in-memory loading) ──
        const downloadEntries: { title: string; imageUrl: string | null; downloadUrl: string; price: number }[] = [];

        for (const product of products) {
            if (!product.pdf_url) {
                console.log(`Product ${product.id} has no pdf_url, skipping`);
                continue;
            }

            // Get the storage file path
            let filePath = product.pdf_url;
            if (filePath.startsWith("http")) {
                const urlParts = new URL(filePath).pathname.split("/");
                const bucketIndex = urlParts.indexOf("original_pdfs");
                if (bucketIndex !== -1 && bucketIndex < urlParts.length - 1) {
                    filePath = urlParts.slice(bucketIndex + 1).join("/");
                }
            }

            // Get a signed URL (valid 1 hour) — no download into memory!
            const { data: signedUrlData, error: signedUrlError } = await supabase.storage
                .from("original_pdfs")
                .createSignedUrl(filePath, 60 * 60);

            if (signedUrlError || !signedUrlData?.signedUrl) {
                console.error(`Failed to get signed URL for ${filePath}: ${signedUrlError?.message}`);
                continue;
            }

            const originalSignedUrl = signedUrlData.signedUrl;
            console.log(`Got signed URL for ${product.title}`);

            let finalUrl = originalSignedUrl;

            // Use PDF.co for watermark + encryption (all via URL, zero memory usage)
            if (PDFCO_API_KEY) {
                try {
                    // Step 1: Add text watermark via PDF.co
                    const watermarkText = `Licensed to ${order.student_name} - ${order.phone}`;
                    console.log(`[PDF.co] Adding watermark to ${product.title}...`);

                    const watermarkRes = await fetch("https://api.pdf.co/v1/pdf/edit/add", {
                        method: "POST",
                        headers: { "x-api-key": PDFCO_API_KEY, "Content-Type": "application/json" },
                        body: JSON.stringify({
                            url: originalSignedUrl,
                            annotations: [{
                                text: watermarkText,
                                x: 150,
                                y: 400,
                                size: 16,
                                color: "808080",
                                pages: "0-",
                            }],
                        }),
                    });

                    const watermarkData = await watermarkRes.json();
                    let urlForEncryption = originalSignedUrl;

                    if (!watermarkData.error && watermarkData.url) {
                        urlForEncryption = watermarkData.url;
                        console.log(`[PDF.co] Watermark added successfully`);
                    } else {
                        console.log(`[PDF.co] Watermark failed, proceeding without: ${watermarkData.message || 'unknown error'}`);
                    }

                    // Step 2: Encrypt with password
                    console.log(`[PDF.co] Encrypting ${product.title}...`);
                    const encryptRes = await fetch("https://api.pdf.co/v1/pdf/security/add", {
                        method: "POST",
                        headers: { "x-api-key": PDFCO_API_KEY, "Content-Type": "application/json" },
                        body: JSON.stringify({
                            url: urlForEncryption,
                            userPassword: order.phone,
                            ownerPassword: Math.random().toString(36).substring(2, 15),
                            allowPrint: true,
                            allowCopyDocument: false,
                            allowModifyDocument: false,
                        }),
                    });

                    const encryptData = await encryptRes.json();
                    if (!encryptData.error && encryptData.url) {
                        finalUrl = encryptData.url;
                        console.log(`[PDF.co] Encrypted ${product.title} successfully`);
                    } else {
                        console.log(`[PDF.co] Encryption failed: ${encryptData.message || 'unknown error'}, using watermarked URL`);
                        finalUrl = urlForEncryption;
                    }
                } catch (e) {
                    console.error("[PDF.co] API call failed:", e);
                    // Fall back to the original signed URL
                }
            } else {
                console.log("No PDFCO_API_KEY, sending original PDF without watermark/encryption");
            }

            // Use custom price if available, otherwise default product price
            const entryPrice = customPriceMap && customPriceMap[product.id] !== undefined
                ? customPriceMap[product.id]
                : product.price;

            const coverImage = product.images && product.images.length > 0 ? product.images[0] : null;
            downloadEntries.push({ title: product.title, imageUrl: coverImage, downloadUrl: finalUrl, price: entryPrice });
        }

        if (downloadEntries.length === 0) {
            throw new Error("No PDFs were successfully processed");
        }

        // ── Conditionally generate Invoice ──
        let invoiceBase64: string | null = null;
        let shortOrderId = order.id ? order.id.split("-")[0].toUpperCase() : "N/A";
        let orderDate = order.created_at
            ? new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
            : "Today";

        if (!isFreeDelivery) {
            const invoiceProducts: InvoiceProduct[] = downloadEntries.map((e) => ({ title: e.title, price: e.price }));
            const totalPaid = order.amount || downloadEntries.reduce((sum: number, e: any) => sum + e.price, 0);
            const invoicePdfBytes = await generateInvoicePdf(order, invoiceProducts, totalPaid);
            invoiceBase64 = uint8ToBase64(invoicePdfBytes);
        }

        const totalPaid = order.amount || downloadEntries.reduce((sum: number, e: any) => sum + e.price, 0);
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

        // Build order summary section (or free delivery note)
        let orderSummaryHtml = "";
        if (isFreeDelivery) {
            orderSummaryHtml = `
            <div style="padding: 0 20px;">
                <p style="font-size: 13px; color: #888; font-style: italic; text-align: center; margin: 20px 0;">(Free Replacement / Direct Delivery)</p>
            </div>`;
        } else {
            const invoiceItemRows = downloadEntries.map((entry) => `
                <tr>
                    <td style="border: 1px solid #e0e0e0; padding: 10px; font-size: 12px; color: #333;">${entry.title}</td>
                    <td style="border: 1px solid #e0e0e0; padding: 10px; text-align: center; font-size: 12px;">1</td>
                    <td style="border: 1px solid #e0e0e0; padding: 10px; text-align: right; font-size: 12px;">Rs.${entry.price.toFixed(2)}</td>
                </tr>`).join("");

            orderSummaryHtml = `
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
            </div>`;
        }

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

            ${orderSummaryHtml}

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

        // Send email — attach invoice only if not free
        if (RESEND_API_KEY) {
            const attachments = invoiceBase64
                ? [{ filename: `Invoice-EE-${shortOrderId}.pdf`, content: invoiceBase64 }]
                : undefined;

            await sendResendEmail(
                RESEND_API_KEY,
                order.email,
                `Your Exam Essentials order is now complete - ${order.student_name}`,
                emailHtml,
                attachments
            );
            console.log(`Email sent to ${order.email}${invoiceBase64 ? ' with invoice' : ' (no invoice - free delivery)'}!`);
        }

        return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : String(error);
        console.error("[DEBUG] Delivery error:", errMsg);
        return new Response(JSON.stringify({ error: errMsg }), { status: 500 });
    }
});
