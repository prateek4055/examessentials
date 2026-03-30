-- Migration to fix PDF delivery trigger for standalone Supabase
-- This handles the UUID vs TEXT mismatch and supports comma-separated product IDs

ALTER TABLE IF EXISTS public.orders ALTER COLUMN product_id TYPE TEXT;

CREATE OR REPLACE FUNCTION public.handle_render_pdf_automated()
RETURNS TRIGGER AS $$
DECLARE
  v_pdf_url TEXT;
  v_first_product_id TEXT;
BEGIN
  -- Extract first product ID if multiple exist
  v_first_product_id := trim(split_part(NEW.product_id, ',', 1));

  -- Fetch PDF URL using explicit cast to avoid operator mismatch
  SELECT pdf_url INTO v_pdf_url
  FROM public.products
  WHERE id::text = v_first_product_id;

  -- Call Render worker via pg_net (Supabase Hook)
  IF v_pdf_url IS NOT NULL THEN
    PERFORM
      net.http_post(
        url := 'https://pdf-workerdf-workerpdf.onrender.com/process-pdf',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'x-worker-secret', 'ExamNotes@2026'
        ),
        body := jsonb_build_object(
          'pdf_url', v_pdf_url,
          'student_name', NEW.student_name,
          'phone', NEW.phone,
          'email', NEW.email,
          'order_id', NEW.id
        )
      );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-enable the trigger
DROP TRIGGER IF EXISTS tr_render_delivery ON public.orders;
CREATE TRIGGER tr_render_delivery
AFTER INSERT ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.handle_render_pdf_automated();
