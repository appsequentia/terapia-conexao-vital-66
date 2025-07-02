
// src/components/therapist/AvailabilityCalendar.tsx

import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addDays, subDays, startOfWeek, format, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTherapistAvailability } from '@/hooks/useTherapistAvailability';

interface AvailabilityData {
  [date: string]: string[];
}

// Mapeia os dias da semana (0 = domingo, 1 = segunda, etc.)
const dayOfWeekMap = {
  0: 0, // domingo
  1: 1, // segunda
  2: 2, // terça
  3: 3, // quarta
  4: 4, // quinta
  5: 5, // sexta
  6: 6, // sábado
};

// Converte availability slots para formato de calendário
const convertSlotsToAvailability = (slots: any[], weekStart: Date): AvailabilityData => {
  const availability: AvailabilityData = {};
  
  for (let i = 0; i < 7; i++) {
    const date = addDays(weekStart, i);
    const dateString = format(date, 'yyyy-MM-dd');
    const dayOfWeek = date.getDay();
    
    // Filtra slots para o dia da semana atual
    const daySlots = slots.filter(slot => slot.day_of_week === dayOfWeek);
    
    // Extrai apenas os horários de início
    availability[dateString] = daySlots.map(slot => slot.start_time.substring(0, 5)); // Remove segundos se houver
  }
  
  return availability;
};

export function AvailabilityCalendar() {
  const { id: therapistId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const { data: availabilitySlots = [], isLoading } = useTherapistAvailability(therapistId || '');

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 }); // Semana começa no Domingo

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [weekStart]);

  const availability = useMemo(() => convertSlotsToAvailability(availabilitySlots, weekStart), [availabilitySlots, weekStart]);

  const handleNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  const handlePreviousWeek = () => {
    setCurrentDate(subDays(currentDate, 7));
  };

  const handleTimeSlotClick = (date: Date, time: string) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    // Usar a rota correta com o ID do terapeuta e query parameters para data e hora
    navigate(`/agendamento/${therapistId}?date=${formattedDate}&time=${time}`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Horários Disponíveis</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium w-48 text-center">
            {format(weekStart, 'd MMM', { locale: ptBR })} - {format(addDays(weekStart, 6), 'd MMM, yyyy', { locale: ptBR })}
          </span>
          <Button variant="outline" size="icon" onClick={handleNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="text-gray-500">Carregando horários...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
          {weekDays.map((day) => {
            const dateString = format(day, 'yyyy-MM-dd');
            const daySlots = availability[dateString] || [];

            return (
              <div key={dateString} className="flex flex-col gap-2">
                <div className="text-center">
                  <p className="font-semibold text-sm capitalize">
                    {format(day, 'EEE', { locale: ptBR })}
                  </p>
                  <p className={cn(
                    "font-bold text-lg",
                    isToday(day) && "text-primary"
                  )}>
                    {format(day, 'd')}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  {daySlots.length > 0 ? (
                    daySlots.map((time) => (
                      <Button 
                        key={time} 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleTimeSlotClick(day, time)}
                      >
                        {time}
                      </Button>
                    ))
                  ) : (
                    <div className="text-center text-sm text-muted-foreground pt-2 h-9">-</div>
                  )}
                </div>
              </div>
            );
          })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
