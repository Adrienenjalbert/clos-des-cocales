CREATE OR REPLACE FUNCTION public.validate_lead()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF NEW.consent IS NOT TRUE THEN
    RAISE EXCEPTION 'Le consentement RGPD est obligatoire';
  END IF;

  IF length(trim(NEW.name)) < 2 OR length(NEW.name) > 120 THEN
    RAISE EXCEPTION 'Nom invalide';
  END IF;

  IF NEW.email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' OR length(NEW.email) > 254 THEN
    RAISE EXCEPTION 'Email invalide';
  END IF;

  IF NEW.phone IS NOT NULL AND length(NEW.phone) > 40 THEN
    RAISE EXCEPTION 'Téléphone invalide';
  END IF;

  IF NEW.lot_interest IS NOT NULL AND length(NEW.lot_interest) > 80 THEN
    RAISE EXCEPTION 'Lot invalide';
  END IF;

  IF NEW.message IS NOT NULL AND length(NEW.message) > 2000 THEN
    RAISE EXCEPTION 'Message trop long';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_lead_before_insert
  BEFORE INSERT ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_lead();