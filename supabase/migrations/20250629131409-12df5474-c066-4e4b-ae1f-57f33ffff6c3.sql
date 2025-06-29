
-- Create appointments table to store bookings
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  therapist_id UUID REFERENCES public.terapeutas(id) NOT NULL,
  client_id UUID REFERENCES auth.users(id) NOT NULL,
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

-- Create availability_slots table for therapist availability
CREATE TABLE public.availability_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  therapist_id UUID REFERENCES public.terapeutas(id) NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  session_type TEXT NOT NULL DEFAULT 'both' CHECK (session_type IN ('online', 'in-person', 'both')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for appointments table
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Clients can view their own appointments
CREATE POLICY "Clients can view their own appointments" 
  ON public.appointments 
  FOR SELECT 
  USING (auth.uid() = client_id);

-- Therapists can view their appointments
CREATE POLICY "Therapists can view their appointments" 
  ON public.appointments 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.terapeutas 
      WHERE user_id = auth.uid() AND id = therapist_id
    )
  );

-- Clients can create appointments
CREATE POLICY "Clients can create appointments" 
  ON public.appointments 
  FOR INSERT 
  WITH CHECK (auth.uid() = client_id);

-- Clients can update their own appointments
CREATE POLICY "Clients can update their own appointments" 
  ON public.appointments 
  FOR UPDATE 
  USING (auth.uid() = client_id);

-- Therapists can update their appointments
CREATE POLICY "Therapists can update their appointments" 
  ON public.appointments 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.terapeutas 
      WHERE user_id = auth.uid() AND id = therapist_id
    )
  );

-- Add RLS policies for availability_slots table
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;

-- Therapists can manage their own availability
CREATE POLICY "Therapists can manage their availability" 
  ON public.availability_slots 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.terapeutas 
      WHERE user_id = auth.uid() AND id = therapist_id
    )
  );

-- Everyone can view availability (for booking)
CREATE POLICY "Everyone can view availability" 
  ON public.availability_slots 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Create triggers for updated_at columns
CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_availability_slots_updated_at
  BEFORE UPDATE ON public.availability_slots
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better query performance
CREATE INDEX idx_appointments_therapist_date ON public.appointments(therapist_id, appointment_date);
CREATE INDEX idx_appointments_client_date ON public.appointments(client_id, appointment_date);
CREATE INDEX idx_availability_slots_therapist_day ON public.availability_slots(therapist_id, day_of_week);
