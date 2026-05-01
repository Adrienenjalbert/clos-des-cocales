CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  lot_interest TEXT,
  message TEXT,
  consent BOOLEAN NOT NULL DEFAULT false,
  source TEXT DEFAULT 'landing_page',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Anyone (including anonymous visitors) can submit a lead
CREATE POLICY "Anyone can insert leads"
  ON public.leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated users (admin via dashboard) can read
CREATE POLICY "Authenticated users can view leads"
  ON public.leads
  FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX idx_leads_created_at ON public.leads(created_at DESC);