-- Drop existing RESTRICTIVE policies on bookings table
DROP POLICY IF EXISTS "Admins can update all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can create their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can delete their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;

-- Recreate as PERMISSIVE policies (default) for bookings
CREATE POLICY "Users can view their own bookings"
ON public.bookings FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all bookings"
ON public.bookings FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create their own bookings"
ON public.bookings FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
ON public.bookings FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can update all bookings"
ON public.bookings FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can delete their own bookings"
ON public.bookings FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Drop existing RESTRICTIVE policies on quote_requests table
DROP POLICY IF EXISTS "Admins can update all quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Admins can view all quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Users can create their own quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Users can delete their own quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Users can update their own quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Users can view their own quote requests" ON public.quote_requests;

-- Recreate as PERMISSIVE policies (default) for quote_requests
CREATE POLICY "Users can view their own quote requests"
ON public.quote_requests FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all quote requests"
ON public.quote_requests FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create their own quote requests"
ON public.quote_requests FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quote requests"
ON public.quote_requests FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can update all quote requests"
ON public.quote_requests FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can delete their own quote requests"
ON public.quote_requests FOR DELETE
TO authenticated
USING (auth.uid() = user_id);