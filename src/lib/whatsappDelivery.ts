/**
 * WhatsApp Delivery & PDF Streaming Utilities for Admin Portal
 * Enables admins to dispatch password-protected PDFs and pretyped WhatsApp messages.
 */

export interface DispatchProduct {
  id: string;
  title: string;
  price?: number;
  pdf_url?: string | null;
  secure_download_url?: string;
}

export interface DispatchDetails {
  studentName: string;
  phone: string;
  email?: string;
  orderId?: string;
  products: DispatchProduct[];
  cleanPassword?: string;
  emailSent?: boolean;
  emailError?: string | null;
}

const WORKER_SECRET = "ExamNotes@2026";
const WORKER_BASE_URL = "https://pdf-workerdf-workerpdf.onrender.com";

/**
 * Normalizes phone numbers into:
 * 1. cleanPassword: last 10 digits used as the PDF user password
 * 2. fullWhatsAppPhone: valid country-coded phone number (defaults to India 91)
 */
export function formatWhatsAppPhone(phone: string): { fullPhone: string; cleanPassword: string } {
  const digits = (phone || "").replace(/\D/g, "");
  
  let cleanPassword = digits;
  if (digits.length > 10) {
    cleanPassword = digits.slice(-10);
  }
  
  let fullPhone = digits;
  if (digits.length === 10) {
    fullPhone = `91${digits}`;
  } else if (digits.length === 11 && digits.startsWith("0")) {
    fullPhone = `91${digits.slice(1)}`;
  } else if (digits.length === 12 && digits.startsWith("91")) {
    fullPhone = digits;
  } else if (digits.length < 10) {
    fullPhone = digits;
  }
  
  return { fullPhone, cleanPassword };
}

/**
 * Creates an HMAC-SHA256 JWT using Web Crypto API.
 * Matches Python's `jwt.encode(payload, WORKER_SECRET, algorithm="HS256")`.
 */
export async function signDownloadJwt(payload: Record<string, unknown>, secret: string = WORKER_SECRET): Promise<string> {
  const enc = new TextEncoder();
  const header = { alg: "HS256", typ: "JWT" };
  
  const base64Url = (bytes: Uint8Array) => {
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  };
  
  const stringToBase64Url = (str: string) => base64Url(enc.encode(str));
  const encodedHeader = stringToBase64Url(JSON.stringify(header));
  const encodedPayload = stringToBase64Url(JSON.stringify(payload));
  const data = enc.encode(`${encodedHeader}.${encodedPayload}`);

  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, data);
  const encodedSignature = base64Url(new Uint8Array(signature));

  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

/**
 * Generates a 7-day secure streaming download URL for a given product and student.
 */
export async function generateProductDownloadUrl(
  product: { id: string; title: string; pdf_url?: string | null },
  studentName: string,
  phone: string
): Promise<string> {
  const expTime = Math.floor(Date.now() / 1000) + 7 * 86400; // 7 days
  
  // Format the raw pdf_url path or full URL
  const rawPdfUrl = product.pdf_url || `${product.id}.pdf`;
  const fullPdfUrl = rawPdfUrl.startsWith("http")
    ? rawPdfUrl
    : `https://jfqjeqgwbpnnzdgcpbzw.supabase.co/storage/v1/object/public/original_pdfs/${rawPdfUrl}`;

  const token = await signDownloadJwt({
    student_name: studentName.trim(),
    phone: phone.trim(),
    pdf_url: fullPdfUrl,
    title: product.title,
    exp: expTime,
  });

  return `${WORKER_BASE_URL}/download?token=${token}`;
}

/**
 * Generates a pretyped, professional WhatsApp message for the student.
 * Designed specifically as an attachment caption — NO DOWNLOAD LINKS included.
 * The customer receives the protected PDF file directly and unlocks it with their phone number.
 */
export function generateWhatsAppMessage(details: {
  studentName: string;
  phone: string;
  cleanPassword: string;
  products: { title: string }[];
  orderId?: string;
}): string {
  const name = details.studentName.trim() || "Student";
  const pwd = details.cleanPassword;
  
  const productList = details.products
    .map((p, idx) => `  ${idx + 1}. *${p.title}*`)
    .join("\n");

  return `*Exam Essentials - Study Material Delivery* 📚✨

Dear *${name}*,

Thank you for choosing Exam Essentials! Here are your requested handwritten notes / study material:

📖 *Attached Notes:*
${productList}

🔐 *PDF Password:* *${pwd}*
_(Use your 10-digit registered mobile number to open the attached PDF)_

💡 *How to Open:*
1. Tap on the attached PDF file in this chat to open it.
2. When prompted for password, enter: *${pwd}*
3. Save or star the document for offline revision anytime!

⚠️ *Personal License:* This document is watermarked and encrypted with your student license for personal study.

Best of luck with your preparation! 🎯🚀
- Team Exam Essentials
https://examessentials.in`;
}

/**
 * Triggers a browser download of a protected PDF from a URL.
 */
export async function downloadPdfFromUrl(url: string, filename: string): Promise<void> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.warn("Direct blob download failed, falling back to window.open", err);
    window.open(url, "_blank");
  }
}

/**
 * Attempts to share the PDF file directly via Web Share API if supported.
 * On mobile/Mac, this allows attaching the actual PDF directly into WhatsApp!
 */
export async function sharePdfFileDirectly(
  url: string,
  filename: string,
  caption: string
): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.share) {
    return false;
  }
  
  try {
    const res = await fetch(url);
    if (!res.ok) return false;
    const blob = await res.blob();
    const safeName = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
    const file = new File([blob], safeName, { type: "application/pdf" });
    
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: safeName,
        text: caption,
      });
      return true;
    }
  } catch (err: any) {
    // If user cancelled share sheet, don't throw an alert
    if (err?.name === "AbortError") {
      return true;
    }
    console.warn("Web Share API failed:", err);
  }
  return false;
}

/**
 * Opens WhatsApp Web or App with pretyped message for a given phone number.
 */
export function openWhatsAppChat(fullPhone: string, message: string): void {
  const encoded = encodeURIComponent(message);
  // Uses wa.me which automatically redirects to WhatsApp Web on Desktop or WhatsApp App on Mobile
  const url = `https://wa.me/${fullPhone}?text=${encoded}`;
  window.open(url, "_blank");
}

