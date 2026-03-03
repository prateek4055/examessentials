-- Create the strictly private 'original_pdfs' bucket for storing master PDFs
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'original_pdfs', 
    'original_pdfs', 
    false, 
    52428800, -- 50MB
    ARRAY['application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Policies for original_pdfs (Admin only)
CREATE POLICY "Admins can manage original_pdfs"
    ON storage.objects FOR ALL
    USING (bucket_id = 'original_pdfs' AND auth.role() = 'authenticated' AND public.has_role(auth.uid(), 'admin'))
    WITH CHECK (bucket_id = 'original_pdfs' AND auth.role() = 'authenticated' AND public.has_role(auth.uid(), 'admin'));

-- Create the private 'purchased_pdfs' bucket for storing watermarked PDFs
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'purchased_pdfs', 
    'purchased_pdfs', 
    false, 
    52428800, -- 50MB
    ARRAY['application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Service role bypasses RLS so no additional policies are strictly needed for the Edge Function.
-- The Edge Function uses supabase-js with the service_role key to upload and generate Signed URLs.
