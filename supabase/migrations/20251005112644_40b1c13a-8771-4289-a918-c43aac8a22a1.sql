-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  tipo_usuario TEXT NOT NULL CHECK (tipo_usuario IN ('client', 'therapist')),
  avatar_url TEXT,
  genero TEXT CHECK (genero IN ('masculino', 'feminino', 'neutro', 'nao_informado')),
  telefone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create terapeutas table
CREATE TABLE IF NOT EXISTS public.terapeutas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  especialidades TEXT[] NOT NULL DEFAULT '{}',
  abordagens TEXT[] NOT NULL DEFAULT '{}',
  bio TEXT,
  preco_sessao DECIMAL(10, 2) NOT NULL DEFAULT 0,
  anos_experiencia INTEGER DEFAULT 0,
  crp TEXT,
  formacao TEXT[] DEFAULT '{}',
  avatar_url TEXT,
  rating DECIMAL(3, 2) DEFAULT 0,
  total_avaliacoes INTEGER DEFAULT 0,
  aceita_online BOOLEAN DEFAULT true,
  aceita_presencial BOOLEAN DEFAULT false,
  localizacao TEXT,
  idiomas TEXT[] DEFAULT '{"Português"}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  therapist_id UUID NOT NULL REFERENCES public.terapeutas(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  session_type TEXT NOT NULL CHECK (session_type IN ('online', 'in-person')),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  notes TEXT,
  meeting_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create availability_slots table
CREATE TABLE IF NOT EXISTS public.availability_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  therapist_id UUID NOT NULL REFERENCES public.terapeutas(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create availability_events table
CREATE TABLE IF NOT EXISTS public.availability_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  therapist_id UUID NOT NULL REFERENCES public.terapeutas(id) ON DELETE CASCADE,
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('unavailable', 'available')),
  reason TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create holidays table
CREATE TABLE IF NOT EXISTS public.holidays (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  therapist_id UUID NOT NULL REFERENCES public.terapeutas(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.terapeutas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.holidays ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for terapeutas
CREATE POLICY "Anyone can view therapists" ON public.terapeutas FOR SELECT USING (true);
CREATE POLICY "Therapists can update their own profile" ON public.terapeutas FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Therapists can insert their own profile" ON public.terapeutas FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for appointments
CREATE POLICY "Users can view their own appointments" ON public.appointments FOR SELECT USING (
  auth.uid() = client_id OR auth.uid() IN (SELECT user_id FROM public.terapeutas WHERE id = therapist_id)
);
CREATE POLICY "Clients can create appointments" ON public.appointments FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Users can update their own appointments" ON public.appointments FOR UPDATE USING (
  auth.uid() = client_id OR auth.uid() IN (SELECT user_id FROM public.terapeutas WHERE id = therapist_id)
);
CREATE POLICY "Users can delete their own appointments" ON public.appointments FOR DELETE USING (
  auth.uid() = client_id OR auth.uid() IN (SELECT user_id FROM public.terapeutas WHERE id = therapist_id)
);

-- RLS Policies for availability_slots
CREATE POLICY "Anyone can view availability slots" ON public.availability_slots FOR SELECT USING (true);
CREATE POLICY "Therapists can manage their own slots" ON public.availability_slots FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT user_id FROM public.terapeutas WHERE id = therapist_id)
);
CREATE POLICY "Therapists can update their own slots" ON public.availability_slots FOR UPDATE USING (
  auth.uid() IN (SELECT user_id FROM public.terapeutas WHERE id = therapist_id)
);
CREATE POLICY "Therapists can delete their own slots" ON public.availability_slots FOR DELETE USING (
  auth.uid() IN (SELECT user_id FROM public.terapeutas WHERE id = therapist_id)
);

-- RLS Policies for availability_events
CREATE POLICY "Anyone can view availability events" ON public.availability_events FOR SELECT USING (true);
CREATE POLICY "Therapists can manage their own events" ON public.availability_events FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT user_id FROM public.terapeutas WHERE id = therapist_id)
);
CREATE POLICY "Therapists can update their own events" ON public.availability_events FOR UPDATE USING (
  auth.uid() IN (SELECT user_id FROM public.terapeutas WHERE id = therapist_id)
);
CREATE POLICY "Therapists can delete their own events" ON public.availability_events FOR DELETE USING (
  auth.uid() IN (SELECT user_id FROM public.terapeutas WHERE id = therapist_id)
);

-- RLS Policies for holidays
CREATE POLICY "Anyone can view holidays" ON public.holidays FOR SELECT USING (true);
CREATE POLICY "Therapists can manage their own holidays" ON public.holidays FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT user_id FROM public.terapeutas WHERE id = therapist_id)
);
CREATE POLICY "Therapists can update their own holidays" ON public.holidays FOR UPDATE USING (
  auth.uid() IN (SELECT user_id FROM public.terapeutas WHERE id = therapist_id)
);
CREATE POLICY "Therapists can delete their own holidays" ON public.holidays FOR DELETE USING (
  auth.uid() IN (SELECT user_id FROM public.terapeutas WHERE id = therapist_id)
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_terapeutas_updated_at BEFORE UPDATE ON public.terapeutas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_availability_slots_updated_at BEFORE UPDATE ON public.availability_slots
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_availability_events_updated_at BEFORE UPDATE ON public.availability_events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_holidays_updated_at BEFORE UPDATE ON public.holidays
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, email, tipo_usuario)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'type', 'client')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();