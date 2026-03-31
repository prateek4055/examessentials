-- Allow Admins to Insert Orders
CREATE POLICY "Admins can insert orders" ON public.orders
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Allow Admins to Update Orders (Optional, but good for Admin Panel)
CREATE POLICY "Admins can update orders" ON public.orders
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);
