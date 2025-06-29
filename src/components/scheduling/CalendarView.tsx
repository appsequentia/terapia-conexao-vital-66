'use client';

import * as React from 'react';
import { DayPicker } from 'react-day-picker';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { parseISO } from 'date-fns';

// Supondo que o estilo do shadcn/ui para o calendário já esteja configurado
// Este é um estilo comum para o DayPicker em projetos com shadcn/ui
import 'react-day-picker/dist/style.css';

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  availability: { [date: string]: string[] };
  onDateSelect: (date: Date) => void;
};

function CalendarView({
  availability,
  onDateSelect,
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const availableDays = Object.keys(availability).map(dateStr => parseISO(dateStr));

  const modifiers = {
    available: availableDays,
    disabled: [
      { before: new Date() }, // Desabilita dias passados
      (date: Date) => !availableDays.some(availableDay => 
        date.getFullYear() === availableDay.getFullYear() &&
        date.getMonth() === availableDay.getMonth() &&
        date.getDate() === availableDay.getDate()
      ) // Desabilita dias que não estão na lista de disponíveis
    ]
  };

  return (
    <div className="rounded-md border bg-card text-card-foreground shadow-sm">
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={className}
        classNames={{
          months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 p-4',
          month: 'space-y-4',
          caption: 'flex justify-center pt-1 relative items-center',
          caption_label: 'text-sm font-medium',
          nav: 'space-x-1 flex items-center',
          nav_button: 'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
          nav_button_previous: 'absolute left-1',
          nav_button_next: 'absolute right-1',
          table: 'w-full border-collapse space-y-1',
          head_row: 'flex',
          head_cell: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
          row: 'flex w-full mt-2',
          cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
          day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100',
          day_selected: 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
          day_today: 'bg-accent text-accent-foreground',
          day_outside: 'text-muted-foreground opacity-50',
          day_disabled: 'text-muted-foreground opacity-50',
          day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
          day_hidden: 'invisible',
          ...classNames,
        }}
        components={{
          IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
          IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
        }}
        modifiers={modifiers}
        onDayClick={(day, mods) => {
          if (!mods.disabled) {
            onDateSelect(day);
          }
        }}
        {...props}
      />
    </div>
  );
}
CalendarView.displayName = 'CalendarView';

export default CalendarView;
