-- Add separate address fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS unit_number TEXT,
ADD COLUMN IF NOT EXISTS complex_name TEXT,
ADD COLUMN IF NOT EXISTS street_address TEXT,
ADD COLUMN IF NOT EXISTS suburb TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS province TEXT,
ADD COLUMN IF NOT EXISTS postal_code TEXT;

-- Add comment for clarity
COMMENT ON COLUMN public.profiles.unit_number IS 'Unit or flat number for complexes';
COMMENT ON COLUMN public.profiles.complex_name IS 'Complex or building name';
COMMENT ON COLUMN public.profiles.street_address IS 'Street number and name';
COMMENT ON COLUMN public.profiles.suburb IS 'Suburb - used for zone-based pricing';
COMMENT ON COLUMN public.profiles.city IS 'City name';
COMMENT ON COLUMN public.profiles.province IS 'South African province';
COMMENT ON COLUMN public.profiles.postal_code IS '4-digit postal code';