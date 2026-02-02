-- Create enquiries table for general booking requests
CREATE TABLE public.enquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  area_suburb TEXT NOT NULL,
  service_required TEXT NOT NULL,
  preferred_date DATE,
  additional_notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert enquiries (public form)
CREATE POLICY "Anyone can submit enquiries"
ON public.enquiries
FOR INSERT
WITH CHECK (true);

-- Only authenticated admins can view enquiries
CREATE POLICY "Admins can view enquiries"
ON public.enquiries
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Admins can update enquiries
CREATE POLICY "Admins can update enquiries"
ON public.enquiries
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Create trigger for updated_at
CREATE TRIGGER update_enquiries_updated_at
BEFORE UPDATE ON public.enquiries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();