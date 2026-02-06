
-- Create storage bucket for worker application documents
INSERT INTO storage.buckets (id, name, public) VALUES ('worker-documents', 'worker-documents', true);

-- Allow anyone to upload to worker-documents bucket
CREATE POLICY "Anyone can upload worker documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'worker-documents');

-- Allow public read access to worker documents
CREATE POLICY "Worker documents are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'worker-documents');

-- Add document URL columns to worker_applications
ALTER TABLE public.worker_applications
ADD COLUMN cv_url text,
ADD COLUMN id_document_url text,
ADD COLUMN profile_picture_url text;
