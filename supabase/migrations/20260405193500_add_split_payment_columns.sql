-- Add split payment tracking columns to poster_orders table
-- This migration was generated automatically by Antigravity

ALTER TABLE poster_orders 
ADD COLUMN IF NOT EXISTS payment_plan TEXT DEFAULT 'full',
ADD COLUMN IF NOT EXISTS amount_paid NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS balance_due NUMERIC DEFAULT 0;

-- Update existing records to reflect 'full' payment status
UPDATE poster_orders 
SET payment_plan = 'full', 
    amount_paid = total_amount, 
    balance_due = 0 
WHERE payment_plan IS NULL;
