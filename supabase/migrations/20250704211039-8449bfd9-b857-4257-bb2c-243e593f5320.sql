-- Criar tabela de eventos de agenda
CREATE TABLE public.availability_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  therapist_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('block', 'available', 'recurring')),
  recurrence_type TEXT CHECK (recurrence_type IN ('one_time', 'weekly', 'monthly', 'yearly')),
  start_date DATE NOT NULL,
  end_date DATE,
  start_time TIME,
  end_time TIME,
  days_of_week INTEGER[],
  month_pattern JSONB, -- Para padrões como "primeira sexta do mês"
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar índices para performance
CREATE INDEX idx_availability_events_therapist_id ON public.availability_events(therapist_id);
CREATE INDEX idx_availability_events_dates ON public.availability_events(start_date, end_date);
CREATE INDEX idx_availability_events_type ON public.availability_events(event_type, recurrence_type);

-- RLS policies para availability_events
ALTER TABLE public.availability_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapists can manage their events"
ON public.availability_events
FOR ALL
USING (EXISTS (
  SELECT 1 FROM terapeutas
  WHERE terapeutas.user_id = auth.uid() 
  AND terapeutas.id = availability_events.therapist_id
));

CREATE POLICY "Everyone can view events for availability"
ON public.availability_events
FOR SELECT
USING (true);

-- Criar tabela de feriados
CREATE TABLE public.holidays (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  is_recurring BOOLEAN NOT NULL DEFAULT false,
  month_day TEXT, -- Para feriados recorrentes (ex: "12-25" para Natal)
  country_code TEXT DEFAULT 'BR',
  state_code TEXT,
  city_code TEXT,
  blocks_appointments BOOLEAN NOT NULL DEFAULT true,
  is_active BOOLEAN NOT NULL DEFAULT true,  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar índices para holidays
CREATE INDEX idx_holidays_date ON public.holidays(date);
CREATE INDEX idx_holidays_recurring ON public.holidays(is_recurring, month_day);

-- RLS policies para holidays
ALTER TABLE public.holidays ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view holidays"
ON public.holidays
FOR SELECT
USING (true);

-- Criar tabela de configurações de agenda
CREATE TABLE public.schedule_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  therapist_id UUID NOT NULL UNIQUE,
  min_advance_hours INTEGER NOT NULL DEFAULT 24,
  max_advance_days INTEGER NOT NULL DEFAULT 60,
  default_session_duration INTEGER NOT NULL DEFAULT 60, -- em minutos
  break_between_sessions INTEGER NOT NULL DEFAULT 0, -- em minutos
  allow_back_to_back BOOLEAN NOT NULL DEFAULT true,
  timezone TEXT NOT NULL DEFAULT 'America/Sao_Paulo',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS policies para schedule_settings
ALTER TABLE public.schedule_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapists can manage their settings"
ON public.schedule_settings
FOR ALL
USING (EXISTS (
  SELECT 1 FROM terapeutas
  WHERE terapeutas.user_id = auth.uid() 
  AND terapeutas.id = schedule_settings.therapist_id
));

-- Trigger para updated_at
CREATE TRIGGER update_availability_events_updated_at
  BEFORE UPDATE ON public.availability_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_holidays_updated_at
  BEFORE UPDATE ON public.holidays  
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_schedule_settings_updated_at
  BEFORE UPDATE ON public.schedule_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir alguns feriados brasileiros básicos
INSERT INTO public.holidays (name, date, is_recurring, month_day, blocks_appointments) VALUES
('Ano Novo', '2024-01-01', true, '01-01', true),
('Tiradentes', '2024-04-21', true, '04-21', true),
('Dia do Trabalho', '2024-05-01', true, '05-01', true),
('Independência do Brasil', '2024-09-07', true, '09-07', true),
('Nossa Senhora Aparecida', '2024-10-12', true, '10-12', true),
('Finados', '2024-11-02', true, '11-02', true),
('Proclamação da República', '2024-11-15', true, '11-15', true),
('Natal', '2024-12-25', true, '12-25', true);