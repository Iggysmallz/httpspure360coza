-- Create worker applications table
CREATE TABLE public.worker_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  area TEXT NOT NULL,
  work_type TEXT NOT NULL,
  years_experience TEXT,
  additional_notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.worker_applications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit applications (public form)
CREATE POLICY "Anyone can submit worker applications"
ON public.worker_applications
FOR INSERT
WITH CHECK (true);

-- Only admins can view applications
CREATE POLICY "Admins can view worker applications"
ON public.worker_applications
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Admins can update applications
CREATE POLICY "Admins can update worker applications"
ON public.worker_applications
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Create trigger for updated_at
CREATE TRIGGER update_worker_applications_updated_at
BEFORE UPDATE ON public.worker_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();