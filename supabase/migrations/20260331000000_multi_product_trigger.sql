-- Update the trigger to handle multiple products and pass a rich JSON array to the worker.
-- This ensures multiple PDFs can be watermarked and delivered in one email.

DROP TRIGGER IF EXISTS tr_render_delivery ON public.orders;

CREATE OR REPLACE FUNCTION public.handle_render_pdf_automated()
RETURNS TRIGGER AS $$
DECLARE
  v_products_json JSONB;
BEGIN
  -- NEW.product_id is a comma-separated string of UUIDs (from Admin panel or Checkout)
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', p.id,
      'title', p.title,
      'price', p.price,
      'image_url', p.image_url,
      'pdf_url', 'https://jfqjeqgwbpnnzdgcpbzw.supabase.co/storage/v1/object/public/original_pdfs/' || p.pdf_url
    )
  )
  INTO v_products_json
  FROM public.products p
  -- Use string_to_array and trim to handle spaces/commas correctly
  WHERE p.id::text = ANY(
    SELECT trim(s) FROM unnest(string_to_array(NEW.product_id, ',')) s
  );

  IF v_products_json IS NOT NULL AND jsonb_array_length(v_products_json) > 0 THEN
    -- Pass the rich multi-product payload to the Python worker
    PERFORM
      net.http_post(
        url := 'https://pdf-workerdf-workerpdf.onrender.com/process-pdf',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'x-worker-secret', 'ExamNotes@2026'
        ),
        body := jsonb_build_object(
          'products', v_products_json,
          'student_name', NEW.student_name,
          'phone', NEW.phone,
          'email', NEW.email,
          'order_id', NEW.id,
          'total_amount', NEW.amount
        )
      );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER tr_render_delivery
  AFTER INSERT
  ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_render_pdf_automated();
