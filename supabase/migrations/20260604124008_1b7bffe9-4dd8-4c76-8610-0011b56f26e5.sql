
DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;
CREATE POLICY "Anyone can insert leads with consent"
  ON public.leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (consent = true);
