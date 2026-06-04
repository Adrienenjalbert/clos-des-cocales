
-- Restrict leads SELECT to admins
DROP POLICY IF EXISTS "Authenticated users can view leads" ON public.leads;
CREATE POLICY "Admins can view leads"
  ON public.leads
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Lock down SECURITY DEFINER functions: revoke public/anon/authenticated EXECUTE
REVOKE EXECUTE ON FUNCTION public.assign_first_user_admin() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.validate_lead() FROM PUBLIC, anon, authenticated;

-- has_role is used in RLS policies; keep authenticated EXECUTE, revoke anon/public
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
