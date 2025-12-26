import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
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

    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      orderData 
    }: VerifyPaymentRequest = await req.json();

    // Validate required fields
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
