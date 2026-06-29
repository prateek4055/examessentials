CREATE TABLE IF NOT EXISTS public.coupons (
    code text PRIMARY KEY,
    discount_percent integer NOT NULL DEFAULT 15,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Allow public read access to coupons (so anonymous users can check if a code is valid at checkout)
CREATE POLICY "Allow public read access" ON public.coupons
    FOR SELECT USING (true);

-- Allow service role / authenticated to insert/update/delete
CREATE POLICY "Allow all access to authenticated users" ON public.coupons
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow service role full access" ON public.coupons
    FOR ALL TO service_role USING (true) WITH CHECK (true);
