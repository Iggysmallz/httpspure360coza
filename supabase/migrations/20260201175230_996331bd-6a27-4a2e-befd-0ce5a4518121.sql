-- Add policy allowing users to set their own initial client/worker role during registration
-- This prevents privilege escalation by:
-- 1. Only allowing client or worker roles (not admin)
-- 2. Only allowing users to set their own role (auth.uid() = user_id)
-- 3. Only allowing one role per user (NOT EXISTS check)

CREATE POLICY "Users can set own initial client or worker role"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id 
  AND role IN ('client'::app_role, 'worker'::app_role)
  AND NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid()
  )
);