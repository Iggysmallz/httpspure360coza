-- Update bookings table CHECK constraint to include all instant-book service types
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_service_type_check;
ALTER TABLE public.bookings ADD CONSTRAINT bookings_service_type_check 
  CHECK (service_type IN (
    -- Original types (keeping for backwards compatibility)
    'regular', 'deep_clean', 'airbnb',
    -- New instant-book cleaning service types
    'indoor_cleaning', 'express_cleaning', 'moving_cleaning', 
    'one_time_cleaning', 'window_cleaning'
  ));

-- Update quote_requests table CHECK constraint to include all quote-based service types
ALTER TABLE public.quote_requests DROP CONSTRAINT IF EXISTS quote_requests_service_type_check;
ALTER TABLE public.quote_requests ADD CONSTRAINT quote_requests_service_type_check 
  CHECK (service_type IN (
    -- Original types (keeping for backwards compatibility)
    'removals', 'care',
    -- New quote-based cleaning service types
    'office_cleaning', 'commercial_cleaning', 'small_business_cleaning',
    'outdoor_services', 'gardening', 'laundry_ironing'
  ));