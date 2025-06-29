import React from 'react';

interface TimeSlotsProps {
  availableTimes: string[];
  onTimeSelect: (time: string) => void;
  selectedTime: string | null;
}

const TimeSlots: React.FC<TimeSlotsProps> = ({ availableTimes, onTimeSelect, selectedTime }) => {
  if (availableTimes.length === 0) {
    return <p className="text-gray-500 italic">Não há horários disponíveis para este dia.</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {availableTimes.map(time => (
        <button
          key={time}
          onClick={() => onTimeSelect(time)}
          className={`p-2 rounded-md text-center font-semibold border-2 transition-colors ${
            selectedTime === time
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-card hover:bg-accent hover:border-primary-focus border-border'
          }`}
        >
          {time}
        </button>
      ))}
    </div>
  );
};

export default TimeSlots;
