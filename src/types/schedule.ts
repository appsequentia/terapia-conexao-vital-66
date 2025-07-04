export interface AvailabilityEvent {
  id: string;
  therapist_id: string;
  title: string;
  description?: string;
  event_type: 'block' | 'available' | 'recurring';
  recurrence_type?: 'one_time' | 'weekly' | 'monthly' | 'yearly';
  start_date: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  days_of_week?: number[];
  month_pattern?: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  is_recurring: boolean;
  month_day?: string;
  country_code?: string;
  state_code?: string;
  city_code?: string;
  blocks_appointments: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ScheduleSettings {
  id: string;
  therapist_id: string;
  min_advance_hours: number;
  max_advance_days: number;
  default_session_duration: number;
  break_between_sessions: number;
  allow_back_to_back: boolean;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface ProcessedAvailability {
  date: string;
  timeSlots: {
    time: string;
    available: boolean;
    reason?: string;
    eventId?: string;
  }[];
}

export interface CreateEventRequest {
  therapist_id: string;
  title: string;
  description?: string;
  event_type: 'block' | 'available';
  recurrence_type: 'one_time' | 'weekly' | 'monthly' | 'yearly';
  start_date: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  days_of_week?: number[];
  month_pattern?: any;
}

export interface RecurrencePattern {
  type: 'weekly' | 'monthly' | 'yearly';
  interval: number;
  days_of_week?: number[];
  month_day?: number;
  week_of_month?: number; // 1-4 para primeira, segunda, terceira, quarta semana; -1 para última
}