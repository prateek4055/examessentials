import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

interface OrderRequest {
  amount: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
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
      JSON.stringify({ error: "Payments are only available on allowed websites" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      }
    );
  }

  try {
    const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID");
    const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      console.error("Missing Razorpay credentials");
      throw new Error("Razorpay credentials not configured");
    }

    const { amount, currency = "INR", receipt, notes }: OrderRequest = await req.json();

    if (!amount || amount <= 0) {
      throw new Error("Invalid amount");
    }

    console.log(`Creating Razorpay order for amount: ${amount} ${currency}`);

    // Razorpay expects amount in paise (smallest currency unit)
    const amountInPaise = Math.round(amount * 100);

    const credentials = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency,
        receipt: receipt || `receipt_${Date.now()}`,
        notes: notes || {},
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Razorpay API error:", errorData);
      throw new Error(`Razorpay API error: ${response.status}`);
    }

    const order = await response.json();
    console.log("Razorpay order created:", order.id);

    return new Response(
      JSON.stringify({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: RAZORPAY_KEY_ID,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error creating Razorpay order:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
