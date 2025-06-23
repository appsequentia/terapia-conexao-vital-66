// src/components/therapist/AvailabilityCalendar.tsx

import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addDays, subDays, startOfWeek, format, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AvailabilityData {
  [date: string]: string[];
}

// Função para gerar dados mockados dinamicamente para uma semana
const generateMockAvailability = (start: Date): AvailabilityData => {
  const availability: AvailabilityData = {};
  const possibleTimes = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

  for (let i = 0; i < 7; i++) {
    const date = addDays(start, i);
    const dateString = format(date, 'yyyy-MM-dd');
    
    // Não gera horários para Domingos
    if (i === 0) {
      availability[dateString] = [];
      continue;
    }

    // Gera um número aleatório de horários para o dia
    const numSlots = Math.floor(Math.random() * 5) + 1;
    availability[dateString] = [...possibleTimes]
      .sort(() => 0.5 - Math.random())
      .slice(0, numSlots)
      .sort();
  }
  return availability;
};

export function AvailabilityCalendar() {
  const { id: therapistId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 }); // Semana começa no Domingo

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [weekStart]);

  const availability = useMemo(() => generateMockAvailability(weekStart), [weekStart]);

  const handleNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  const handlePreviousWeek = () => {
    setCurrentDate(subDays(currentDate, 7));
  };

  const handleTimeSlotClick = (date: Date, time: string) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    navigate(`/agendamento?therapistId=${therapistId}&date=${formattedDate}&time=${time}`);
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
      </CardContent>
    </Card>
  );
}
