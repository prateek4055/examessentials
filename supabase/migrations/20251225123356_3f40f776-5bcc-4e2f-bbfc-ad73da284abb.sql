-- Add category column to products table
ALTER TABLE public.products 
ADD COLUMN category text NOT NULL DEFAULT 'handwritten-notes';

-- Add check constraint for valid categories
ALTER TABLE public.products
ADD CONSTRAINT valid_category CHECK (category IN ('formula-sheet', 'mindmaps', 'handwritten-notes', 'pyqs'));