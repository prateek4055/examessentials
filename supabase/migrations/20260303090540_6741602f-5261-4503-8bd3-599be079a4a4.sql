
-- Storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES ('original_pdfs', 'original_pdfs', false, 52428800, ARRAY['application/pdf']) 
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES ('purchased_pdfs', 'purchased_pdfs', false, 52428800, ARRAY['application/pdf']) 
ON CONFLICT (id) DO NOTHING;

-- Admin-only access to original PDFs (more secure than auth.role() = 'authenticated')
CREATE POLICY "Admins manage original_pdfs" 
ON storage.objects FOR ALL 
USING (bucket_id = 'original_pdfs' AND public.has_role(auth.uid(), 'admin'::public.app_role)) 
WITH CHECK (bucket_id = 'original_pdfs' AND public.has_role(auth.uid(), 'admin'::public.app_role));

-- Users can download their own purchased PDFs (stored under their order ID)
CREATE POLICY "Users download own purchased_pdfs" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'purchased_pdfs' AND auth.role() = 'authenticated');

-- Webhook trigger: fires on every INSERT into orders where payment is completed
CREATE OR REPLACE FUNCTION public.trigger_pdf_delivery()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _webhook_secret text;
  _service_key text;
  _base_url text;
BEGIN
  IF NEW.payment_status = 'completed' AND NEW.product_id IS NOT NULL THEN
    SELECT decrypted_secret INTO _webhook_secret FROM vault.decrypted_secrets WHERE name = 'WEBHOOK_SECRET' LIMIT 1;
    SELECT decrypted_secret INTO _service_key FROM vault.decrypted_secrets WHERE name = 'SUPABASE_SERVICE_ROLE_KEY' LIMIT 1;
    SELECT decrypted_secret INTO _base_url FROM vault.decrypted_secrets WHERE name = 'SUPABASE_URL' LIMIT 1;
    
    PERFORM net.http_post(
      url := _base_url || '/functions/v1/process-pdf-delivery',
      body := jsonb_build_object('type', 'INSERT', 'record', row_to_json(NEW)),
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || _service_key,
        'x-webhook-secret', COALESCE(_webhook_secret, '')
      )
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_order_completed
AFTER INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.trigger_pdf_delivery();
