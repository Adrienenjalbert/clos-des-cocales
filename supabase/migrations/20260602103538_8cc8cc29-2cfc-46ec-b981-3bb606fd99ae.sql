-- Enum des statuts
CREATE TYPE public.lot_statut AS ENUM ('disponible', 'option', 'reserve', 'vendu');

-- Table lots
CREATE TABLE public.lots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero INTEGER NOT NULL UNIQUE,
  surface INTEGER NOT NULL,
  sp INTEGER NOT NULL,
  prix INTEGER,
  statut public.lot_statut NOT NULL DEFAULT 'disponible',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Grants
GRANT SELECT ON public.lots TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lots TO authenticated;
GRANT ALL ON public.lots TO service_role;

-- RLS
ALTER TABLE public.lots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lots visibles publiquement"
ON public.lots FOR SELECT
USING (true);

CREATE POLICY "Utilisateurs connectés peuvent modifier les lots"
ON public.lots FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Utilisateurs connectés peuvent insérer des lots"
ON public.lots FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Utilisateurs connectés peuvent supprimer des lots"
ON public.lots FOR DELETE
TO authenticated
USING (true);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_lots_updated_at
BEFORE UPDATE ON public.lots
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed des lots
INSERT INTO public.lots (numero, surface, sp, prix, statut) VALUES
(16, 443, 140, 116900, 'disponible'),
(18, 508, 160, 130500, 'disponible'),
(24, 361, 140, 104900, 'disponible'),
(25, 340, 130, 99900, 'disponible'),
(26, 340, 160, 99900, 'disponible'),
(27, 340, 160, 99900, 'disponible'),
(28, 342, 160, 99900, 'disponible'),
(29, 346, 160, 99900, 'disponible'),
(30, 461, 220, 120900, 'disponible'),
(31, 832, 400, 189900, 'disponible'),
(34, 562, 270, 158900, 'disponible'),
(37, 335, 170, 101500, 'disponible'),
(39, 345, 170, 102900, 'disponible'),
(40, 350, 130, 101500, 'disponible'),
(41, 453, 160, 120900, 'disponible'),
(42, 515, 200, 132900, 'disponible'),
(43, 380, 150, 107900, 'disponible'),
(44, 367, 140, 105900, 'disponible'),
(45, 551, 200, 143400, 'disponible'),
(46, 477, 170, 125500, 'disponible'),
(47, 519, 200, 133500, 'disponible'),
(48, 341, 140, 101900, 'option'),
(49, 340, 140, 101700, 'disponible'),
(50, 446, 170, 118500, 'disponible'),
(51, 423, 170, 116900, 'disponible'),
(52, 357, 150, 104900, 'disponible'),
(59, 443, 170, 118900, 'disponible'),
(60, 377, 150, 105900, 'disponible'),
(61, 385, 150, 105900, 'disponible');