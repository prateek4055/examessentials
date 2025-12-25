-- Add policy to allow users to view their own orders based on email
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (email = auth.jwt()->>'email');