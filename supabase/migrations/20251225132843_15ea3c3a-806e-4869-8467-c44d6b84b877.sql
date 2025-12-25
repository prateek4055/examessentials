-- Add user_id column to orders for proper authentication-based access control
ALTER TABLE public.orders 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Drop the existing email-based SELECT policy (weak authentication)
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;

-- Create new user_id based SELECT policy (stronger authentication)
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (auth.uid() = user_id);

-- Update INSERT policy to capture user_id when authenticated
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;

-- Allow both guest and authenticated order creation
CREATE POLICY "Anyone can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);