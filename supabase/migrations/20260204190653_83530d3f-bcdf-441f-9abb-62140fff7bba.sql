-- Create waitlist signups table for Coming Soon services
CREATE TABLE public.waitlist_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  service_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique constraint to prevent duplicate signups per service
CREATE UNIQUE INDEX idx_waitlist_unique_email_service ON public.waitlist_signups (email, service_type);

-- Enable Row Level Security
ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;

-- Allow anyone to sign up (public form)
CREATE POLICY "Anyone can submit waitlist signups"
ON public.waitlist_signups
FOR INSERT
WITH CHECK (true);

-- Only admins can view waitlist signups
CREATE POLICY "Admins can view waitlist signups"
ON public.waitlist_signups
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM user_roles
  WHERE user_roles.user_id = auth.uid()
  AND user_roles.role = 'admin'::app_role
));