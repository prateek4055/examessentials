-- Update the pg_net trigger to pass product details directly to the Render worker
-- so that it can dynamically generate accurate Invoices and styled HTML templates.

-- Drop the old trigger entirely
DROP TRIGGER IF EXISTS tr_render_delivery ON public.orders;

-- Replace the function
CREATE OR REPLACE FUNCTION public.handle_render_pdf_automated()
RETURNS TRIGGER AS $$
DECLARE
  v_pdf_url TEXT;
  v_product_name TEXT;
  v_price NUMERIC;
  v_first_product_id TEXT;
  v_full_pdf_url TEXT;
BEGIN
  -- Extract first product ID if multiple exist
  v_first_product_id := trim(split_part(NEW.product_id, ',', 1));

  -- Fetch PDF URL, Product Name, and Price using explicit cast to avoid operator mismatch
  SELECT pdf_url, title, price INTO v_pdf_url, v_product_name, v_price
  FROM public.products
  WHERE id::text = v_first_product_id;

  -- Construct full authenticating URL if it exists
  IF v_pdf_url IS NOT NULL THEN
    v_full_pdf_url := 'https://jfqjeqgwbpnnzdgcpbzw.supabase.co/storage/v1/object/public/original_pdfs/' || v_pdf_url;

    -- Call Render worker via pg_net with rich payload
    PERFORM
      net.http_post(
        url := 'https://pdf-workerdf-workerpdf.onrender.com/process-pdf',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'x-worker-secret', 'ExamNotes@2026'
        ),
        body := jsonb_build_object(
          'pdf_url', v_full_pdf_url,
          'student_name', NEW.student_name,
          'phone', NEW.phone,
          'email', NEW.email,
          'order_id', NEW.id,
          'product_name', v_product_name,
          'price', v_price
        )
      );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-attach the trigger
CREATE TRIGGER tr_render_delivery
  AFTER INSERT
  ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_render_pdf_automated();
