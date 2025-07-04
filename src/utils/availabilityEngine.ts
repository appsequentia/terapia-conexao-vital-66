import { format, addDays, parseISO, isSameDay, getDay, addMinutes, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns';
import { AvailabilitySlot } from '@/hooks/useAvailability';
import { AvailabilityEvent, Holiday, ScheduleSettings, ProcessedAvailability } from '@/types/schedule';

interface EngineInput {
  baseSlots: AvailabilitySlot[];
  events: AvailabilityEvent[];
  holidays: Holiday[];
  settings?: ScheduleSettings;
  appointments: Array<{ appointment_date: string; start_time: string; end_time: string }>;
}

type TimeSlot = {
  time: string;
  available: boolean;
  reason?: string;
  eventId?: string;
};

// Verifica se uma data é feriado
const isHoliday = (date: Date, holidays: Holiday[]): Holiday | null => {
  const dateStr = format(date, 'yyyy-MM-dd');
  const monthDay = format(date, 'MM-dd');
  
  for (const holiday of holidays) {
    if (!holiday.is_active || !holiday.blocks_appointments) continue;
    
    if (holiday.is_recurring && holiday.month_day === monthDay) {
      return holiday;
    }
    
    if (!holiday.is_recurring && holiday.date === dateStr) {
      return holiday;
    }
  }
  
  return null;
};

// Verifica se um evento se aplica a uma data específica
const doesEventApplyToDate = (event: AvailabilityEvent, date: Date): boolean => {
  const eventStartDate = parseISO(event.start_date);
  const eventEndDate = event.end_date ? parseISO(event.end_date) : null;
  
  // Verifica se a data está no range do evento
  if (isBefore(date, startOfDay(eventStartDate))) return false;
  if (eventEndDate && isAfter(date, endOfDay(eventEndDate))) return false;
  
  const dayOfWeek = getDay(date);
  
  switch (event.recurrence_type) {
    case 'one_time':
      return isSameDay(date, eventStartDate);
      
    case 'weekly':
      return event.days_of_week?.includes(dayOfWeek) ?? false;
      
    case 'monthly':
      // Para recorrência mensal, implementar lógica baseada em month_pattern
      // Por enquanto, implementação simples
      return event.days_of_week?.includes(dayOfWeek) ?? false;
      
    case 'yearly':
      const eventMonth = eventStartDate.getMonth();
      const eventDay = eventStartDate.getDate();
      return date.getMonth() === eventMonth && date.getDate() === eventDay;
      
    default:
      return false;
  }
};

// Gera slots de tempo para um dia baseado nos horários base
const generateBaseSlotsForDay = (date: Date, baseSlots: AvailabilitySlot[]): string[] => {
  const dayOfWeek = getDay(date);
  const daySlots = baseSlots.filter(slot => slot.day_of_week === dayOfWeek && slot.is_available);
  
  const timeSlots: string[] = [];
  
  daySlots.forEach(slot => {
    const startTime = parseISO(`2000-01-01T${slot.start_time}`);
    const endTime = parseISO(`2000-01-01T${slot.end_time}`);
    
    let currentTime = startTime;
    while (currentTime < endTime) {
      timeSlots.push(format(currentTime, 'HH:mm'));
      currentTime = addMinutes(currentTime, 60); // Sessões de 1 hora
    }
  });
  
  return timeSlots.sort();
};

// Aplica eventos a um conjunto de slots
const applyEventsToSlots = (
  slots: string[], 
  date: Date, 
  events: AvailabilityEvent[]
): TimeSlot[] => {
  const result: TimeSlot[] = slots.map(time => ({ time, available: true }));
  
  // Aplica eventos de bloqueio primeiro
  events
    .filter(event => event.event_type === 'block' && doesEventApplyToDate(event, date))
    .forEach(event => {
      if (event.start_time && event.end_time) {
        const eventStart = parseISO(`2000-01-01T${event.start_time}`);
        const eventEnd = parseISO(`2000-01-01T${event.end_time}`);
        
        result.forEach(slot => {
          const slotTime = parseISO(`2000-01-01T${slot.time}`);
          if (slotTime >= eventStart && slotTime < eventEnd) {
            slot.available = false;
            slot.reason = event.title;
            slot.eventId = event.id;
          }
        });
      } else {
        // Se não tem horário específico, bloqueia o dia todo
        result.forEach(slot => {
          slot.available = false;
          slot.reason = event.title;
          slot.eventId = event.id;
        });
      }
    });
  
  // Adiciona slots de eventos de disponibilidade extra
  const extraSlots: TimeSlot[] = [];
  events
    .filter(event => event.event_type === 'available' && doesEventApplyToDate(event, date))
    .forEach(event => {
      if (event.start_time && event.end_time) {
        const eventStart = parseISO(`2000-01-01T${event.start_time}`);
        const eventEnd = parseISO(`2000-01-01T${event.end_time}`);
        
        let currentTime = eventStart;
        while (currentTime < eventEnd) {
          const timeStr = format(currentTime, 'HH:mm');
          // Só adiciona se não existe nos slots base
          if (!result.find(slot => slot.time === timeStr)) {
            extraSlots.push({
              time: timeStr,
              available: true,
              reason: event.title,
              eventId: event.id
            });
          }
          currentTime = addMinutes(currentTime, 60);
        }
      }
    });
  
  return [...result, ...extraSlots].sort((a, b) => a.time.localeCompare(b.time));
};

// Remove slots já agendados
const removeBookedSlots = (
  slots: TimeSlot[],
  date: Date,
  appointments: Array<{ appointment_date: string; start_time: string; end_time: string }>
): TimeSlot[] => {
  const dateStr = format(date, 'yyyy-MM-dd');
  const dayAppointments = appointments.filter(apt => apt.appointment_date === dateStr);
  
  return slots.map(slot => {
    const isBooked = dayAppointments.some(apt => apt.start_time === slot.time);
    if (isBooked && slot.available) {
      return {
        ...slot,
        available: false,
        reason: 'Já agendado'
      };
    }
    return slot;
  });
};

// Função principal do motor de disponibilidade
export const processAvailability = (
  startDate: Date,
  endDate: Date,
  input: EngineInput
): ProcessedAvailability[] => {
  const { baseSlots, events, holidays, appointments } = input;
  const result: ProcessedAvailability[] = [];
  
  let currentDate = startDate;
  while (currentDate <= endDate) {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    
    // Verifica se é feriado
    const holiday = isHoliday(currentDate, holidays);
    if (holiday) {
      result.push({
        date: dateStr,
        timeSlots: [{
          time: 'all-day',
          available: false,
          reason: holiday.name
        }]
      });
      currentDate = addDays(currentDate, 1);
      continue;
    }
    
    // Gera slots base para o dia
    let daySlots = generateBaseSlotsForDay(currentDate, baseSlots);
    
    // Se não há slots base, verifica se há eventos de disponibilidade extra
    if (daySlots.length === 0) {
      const extraEvents = events.filter(event => 
        event.event_type === 'available' && doesEventApplyToDate(event, currentDate)
      );
      
      if (extraEvents.length === 0) {
        result.push({
          date: dateStr,
          timeSlots: []
        });
        currentDate = addDays(currentDate, 1);
        continue;
      }
    }
    
    // Aplica eventos aos slots
    const slotsWithEvents = applyEventsToSlots(daySlots, currentDate, events);
    
    // Remove slots já agendados
    const finalSlots = removeBookedSlots(slotsWithEvents, currentDate, appointments);
    
    result.push({
      date: dateStr,
      timeSlots: finalSlots
    });
    
    currentDate = addDays(currentDate, 1);
  }
  
  return result;
};

// Função para obter disponibilidade de uma semana específica
export const getWeekAvailability = (
  weekStart: Date,
  input: EngineInput
): ProcessedAvailability[] => {
  const weekEnd = addDays(weekStart, 6);
  return processAvailability(weekStart, weekEnd, input);
};

// Função utilitária para converter para o formato esperado pelo AvailabilityCalendar
export const convertToCalendarFormat = (processed: ProcessedAvailability[]): { [date: string]: string[] } => {
  const result: { [date: string]: string[] } = {};
  
  processed.forEach(day => {
    result[day.date] = day.timeSlots
      .filter(slot => slot.available && slot.time !== 'all-day')
      .map(slot => slot.time);
  });
  
  return result;
};