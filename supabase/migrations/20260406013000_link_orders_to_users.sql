-- Migration: Link poster_orders to authenticated users
-- This allows customers to track their order progress in their profile.

ALTER TABLE poster_orders 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Optional: Create index for faster lookups on user profile
CREATE INDEX IF NOT EXISTS idx_poster_orders_user_id ON poster_orders(user_id);
