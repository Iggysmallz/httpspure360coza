-- Add INSERT policy to user_roles table to restrict role creation to admins only
CREATE POLICY "Admins can create roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));