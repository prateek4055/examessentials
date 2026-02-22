import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts";

// Simple in-memory rate limiting (resets on cold starts, but provides basic protection)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5; // 5 verification attempts per minute per IP (stricter than order creation)

function getClientIP(req: Request): string {
  // Try various headers that proxies might use
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIP = req.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }
  const cfIP = req.headers.get("cf-connecting-ip");
  if (cfIP) {
    return cfIP;
  }
  return "unknown";
}

function isRateLimited(clientIP: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(clientIP);
  
  if (!record || now > record.resetTime) {
    // Reset or create new record
    rateLimitMap.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  
  record.count++;
  return false;
}

// Allowed origins for Razorpay payments
const ALLOWED_ORIGINS = [
  "https://examessentials.lovable.app",
  "https://jewjjbrdriccunhyoxww.lovableproject.com",
  "https://preview--jewjjbrdriccunhyoxww.lovable.app",
  "https://gptengineer.app",
  "https://examessentials.in",
  "http://localhost",
];

function isAllowedOrigin(origin: string | null): boolean {
  // Allow null origin for server-to-server calls (like supabase.functions.invoke)
  if (!origin) return true;
  return ALLOWED_ORIGINS.some(allowed => 
    origin === allowed || 
    origin.startsWith(allowed.replace(/\/$/, '')) ||
    origin.includes("lovable.app") ||
    origin.includes("lovableproject.com") ||
    origin.includes("examessentials.in") ||
    origin.includes("localhost")
  );
}

function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowedOrigin = origin && isAllowedOrigin(origin) ? origin : "*";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}

// Combo configurations - must match frontend exactly
const comboConfigs = [
  { id: "phy-chem", subjects: ["Physics", "Chemistry"], price: 99 },
  { id: "pcm", subjects: ["Physics", "Chemistry", "Maths"], price: 139 },
  { id: "pcb", subjects: ["Physics", "Chemistry", "Biology"], price: 149 },
  { id: "pcmb", subjects: ["Physics", "Chemistry", "Maths", "Biology"], price: 179 },
];

interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  orderData: {
    product_id: string | null;
    student_name: string;
    email: string;
    phone: string;
    class: string;
    amount: number;
  };
  isCartCheckout?: boolean;
  productIds?: string[];
  comboId?: string;
  totalAmount?: number;
}

// Detect best combo for given subjects (server-side validation)
function detectBestCombo(subjects: string[]): { id: string; price: number } | null {
  const uniqueSubjects = [...new Set(subjects.map(s => s.toLowerCase()))];
  
  const sortedCombos = [...comboConfigs].sort((a, b) => 
    (b.price) - (a.price)
  ).reverse();
  
  for (const combo of sortedCombos) {
    const comboSubjectsLower = combo.subjects.map(s => s.toLowerCase());
    const hasAllSubjects = comboSubjectsLower.every(sub => 
      uniqueSubjects.includes(sub)
    );
    
    if (hasAllSubjects) {
      return { id: combo.id, price: combo.price };
    }
  }
  
  return null;
}

// Calculate expected price for cart
function calculateExpectedCartTotal(products: { price: number; subject: string }[], comboId?: string): number {
  const subjects = products.map(p => p.subject);
  const bestCombo = detectBestCombo(subjects);
  
  if (bestCombo && (!comboId || comboId === bestCombo.id)) {
    const comboConfig = comboConfigs.find(c => c.id === bestCombo.id);
    if (comboConfig) {
      const comboSubjectsLower = comboConfig.subjects.map(s => s.toLowerCase());
      const nonComboProducts = products.filter(p => 
        !comboSubjectsLower.includes(p.subject.toLowerCase())
      );
      const nonComboTotal = nonComboProducts.reduce((sum, p) => sum + p.price, 0);
      return comboConfig.price + nonComboTotal;
    }
  }
  
  return products.reduce((sum, p) => sum + p.price, 0);
}

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Block requests from non-allowed origins
  if (!isAllowedOrigin(origin)) {
    console.log(`Blocked request from origin: ${origin}`);
    return new Response(
      JSON.stringify({ error: "Payments are only available on allowed websites", verified: false }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      }
    );
  }

  // Rate limiting check
  const clientIP = getClientIP(req);
  if (isRateLimited(clientIP)) {
    console.log(`Rate limited verification request from IP: ${clientIP}`);
    return new Response(
      JSON.stringify({ error: "Too many verification attempts. Please try again later.", verified: false }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 429,
      }
    );
  }

  try {
    const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!RAZORPAY_KEY_SECRET) {
      console.error("Missing Razorpay secret");
      throw new Error("Razorpay credentials not configured");
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing Supabase credentials");
      throw new Error("Supabase credentials not configured");
    }

    const requestData: VerifyPaymentRequest = await req.json();
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      orderData,
      isCartCheckout,
      productIds,
      comboId,
      totalAmount
    } = requestData;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.error("Missing payment verification fields");
      throw new Error("Missing payment verification fields");
    }

    if (!orderData) {
      console.error("Missing order data");
      throw new Error("Missing order data");
    }

    console.log(`Verifying payment: ${razorpay_payment_id} for order: ${razorpay_order_id}`);

    // Verify the signature using HMAC SHA256
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("Invalid payment signature");
      console.error(`Expected: ${expectedSignature.substring(0, 20)}...`);
      console.error(`Received: ${razorpay_signature.substring(0, 20)}...`);
      return new Response(
        JSON.stringify({ error: "Invalid payment signature", verified: false }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    console.log("Payment signature verified successfully");

    // Create Supabase client with service role key
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Validate order data fields
    const validClasses = ["11", "12"];
    if (!validClasses.includes(orderData.class)) {
      throw new Error("Invalid class value");
    }

    if (!orderData.student_name || orderData.student_name.length < 2 || orderData.student_name.length > 100) {
      throw new Error("Invalid student name");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!orderData.email || !emailRegex.test(orderData.email)) {
      throw new Error("Invalid email address");
    }

    const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
    if (!orderData.phone || !phoneRegex.test(orderData.phone)) {
      throw new Error("Invalid phone number");
    }

    if (!orderData.amount || orderData.amount <= 0) {
      throw new Error("Invalid amount");
    }

    // SERVER-SIDE PRICE VALIDATION
    console.log("Validating price against database...");

    if (isCartCheckout && productIds && productIds.length > 0) {
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("id, price, subject")
        .in("id", productIds)
        .eq("published", true);

      if (productsError || !products || products.length !== productIds.length) {
        console.error("Failed to fetch products for validation:", productsError);
        throw new Error("Invalid products in cart");
      }

      const expectedTotal = calculateExpectedCartTotal(products, comboId);
      const providedTotal = totalAmount || orderData.amount;

      console.log(`Cart validation - Expected: ${expectedTotal}, Provided: ${providedTotal}`);

      if (providedTotal !== expectedTotal) {
        console.error(`Price mismatch! Expected: ${expectedTotal}, Got: ${providedTotal}`);
        return new Response(
          JSON.stringify({ error: "Price mismatch detected. Please refresh and try again.", verified: false }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
      }

      console.log("Cart price validated successfully");
    } else if (orderData.product_id) {
      const { data: product, error: productError } = await supabase
        .from("products")
        .select("id, price")
        .eq("id", orderData.product_id)
        .eq("published", true)
        .maybeSingle();

      if (productError || !product) {
        console.error("Failed to fetch product for validation:", productError);
        throw new Error("Product not found or not available");
      }

      console.log(`Single product validation - DB Price: ${product.price}, Provided: ${orderData.amount}`);

      if (product.price !== orderData.amount) {
        console.error(`Price mismatch! Expected: ${product.price}, Got: ${orderData.amount}`);
        return new Response(
          JSON.stringify({ error: "Price mismatch detected. Please refresh and try again.", verified: false }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
      }

      console.log("Single product price validated successfully");
    } else {
      throw new Error("No product information provided for validation");
    }

    // Get user ID from JWT if authenticated
    let userId = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    // Create order in database with verified payment
    const { data, error } = await supabase
      .from("orders")
      .insert({
        product_id: orderData.product_id,
        student_name: orderData.student_name.trim(),
        email: orderData.email.trim().toLowerCase(),
        phone: orderData.phone.trim(),
        class: orderData.class,
        amount: orderData.amount,
        payment_status: "completed",
        razorpay_payment_id,
        razorpay_order_id,
        user_id: userId,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating order:", error);
      throw new Error("Failed to create order");
    }

    console.log("Order created successfully:", data.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        verified: true,
        order: data 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error verifying payment:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage, verified: false }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
