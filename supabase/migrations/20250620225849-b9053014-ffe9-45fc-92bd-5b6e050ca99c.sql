
-- Criar bucket para fotos dos terapeutas
INSERT INTO storage.buckets (id, name, public)
VALUES ('therapist-photos', 'therapist-photos', true);

-- Criar políticas para o bucket therapist-photos
CREATE POLICY "Allow authenticated users to upload photos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'therapist-photos' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow public read access to therapist photos" ON storage.objects
FOR SELECT USING (bucket_id = 'therapist-photos');

CREATE POLICY "Allow users to update their own photos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'therapist-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Allow users to delete their own photos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'therapist-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
