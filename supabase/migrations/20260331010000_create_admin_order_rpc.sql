-- Create a server-side function to insert admin orders.
-- This bypasses PostgREST's schema cache which still thinks product_id is UUID.
CREATE OR REPLACE FUNCTION public.create_admin_order(
  p_id UUID,
  p_product_id TEXT,
  p_student_name TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_class TEXT,
  p_amount INTEGER,
  p_payment_status TEXT,
  p_razorpay_payment_id TEXT,
  p_razorpay_order_id TEXT
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.orders (
    id, product_id, student_name, email, phone, class,
    amount, payment_status, razorpay_payment_id, razorpay_order_id
  )
  VALUES (
    p_id, p_product_id, p_student_name, p_email, p_phone, p_class,
    p_amount, p_payment_status, p_razorpay_payment_id, p_razorpay_order_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Also force PostgREST to reload its schema cache
NOTIFY pgrst, 'reload schema';
