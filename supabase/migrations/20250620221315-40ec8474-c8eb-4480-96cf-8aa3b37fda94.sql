
-- Create the terapeutas table with complete structure
CREATE TABLE public.terapeutas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  email text UNIQUE NOT NULL,
  foto_url text,
  bio text,
  especialidades text[],
  abordagens text[],
  rating numeric(2,1) DEFAULT 0,
  review_count integer DEFAULT 0,
  price_per_session numeric(10,2),
  is_online boolean DEFAULT false,
  languages text[] DEFAULT ARRAY['Português'],
  experience integer DEFAULT 0,
  cidade text,
  estado text,
  offers_online boolean DEFAULT true,
  offers_in_person boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc', now()),
  updated_at timestamp with time zone DEFAULT timezone('utc', now())
);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc', now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_terapeutas_updated_at 
    BEFORE UPDATE ON public.terapeutas 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.terapeutas ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (anyone can view therapists)
CREATE POLICY "Anyone can view therapists" ON public.terapeutas
    FOR SELECT USING (true);

-- Insert sample data based on existing mock data (using proper UUIDs)
INSERT INTO public.terapeutas (
  nome, email, foto_url, bio, especialidades, abordagens, 
  rating, review_count, price_per_session, is_online, languages, 
  experience, cidade, estado, offers_online, offers_in_person
) VALUES 
(
  'Dra. Ana Silva',
  'ana.silva@email.com',
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
  'Psicóloga clínica especializada em terapia cognitivo-comportamental com mais de 10 anos de experiência em ansiedade e depressão.',
  ARRAY['Ansiedade', 'Depressão', 'Terapia Cognitivo-Comportamental'],
  ARRAY['Terapia Cognitivo-Comportamental', 'Terapia de Aceitação e Compromisso'],
  4.8,
  127,
  150.00,
  true,
  ARRAY['Português', 'Inglês'],
  10,
  'São Paulo',
  'SP',
  true,
  true
),
(
  'Dr. Carlos Mendes',
  'carlos.mendes@email.com',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
  'Psicólogo especialista em relacionamentos e terapia de casal, com abordagem humanística e sistêmica.',
  ARRAY['Terapia de Casal', 'Relacionamentos'],
  ARRAY['Terapia Humanística', 'Terapia Sistêmica'],
  4.6,
  89,
  180.00,
  false,
  ARRAY['Português'],
  8,
  'Rio de Janeiro',
  'RJ',
  false,
  true
),
(
  'Dra. Mariana Costa',
  'mariana.costa@email.com',
  'https://images.unsplash.com/photo-1594824475863-15fdf4d44bd3?w=400&h=400&fit=crop&crop=face',
  'Especialista em trauma e EMDR, com experiência em terapia para adolescentes e adultos jovens.',
  ARRAY['Trauma', 'EMDR', 'Adolescentes'],
  ARRAY['EMDR', 'Terapia do Trauma'],
  4.9,
  156,
  200.00,
  true,
  ARRAY['Português', 'Espanhol'],
  12,
  'Belo Horizonte',
  'MG',
  true,
  true
);
