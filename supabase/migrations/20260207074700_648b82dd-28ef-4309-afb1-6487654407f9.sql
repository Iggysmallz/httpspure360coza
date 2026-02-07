
-- Create booking_requests table for enquiry-based bookings
CREATE TABLE public.booking_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  service_type TEXT NOT NULL,
  full_name TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  email TEXT,
  service_address TEXT NOT NULL,
  preferred_date DATE,
  preferred_time_window TEXT,
  -- Home Cleaning specific
  cleaning_type TEXT,
  property_type TEXT,
  number_of_rooms TEXT,
  special_instructions TEXT,
  -- Removal specific
  item_types TEXT,
  load_size TEXT,
  accessibility_notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own requests
CREATE POLICY "Users can view their own booking requests"
ON public.booking_requests FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own requests
CREATE POLICY "Users can create their own booking requests"
ON public.booking_requests FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can view all
CREATE POLICY "Admins can view all booking requests"
ON public.booking_requests FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update all
CREATE POLICY "Admins can update all booking requests"
ON public.booking_requests FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_booking_requests_updated_at
BEFORE UPDATE ON public.booking_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
