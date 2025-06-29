
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TimeSlotButtonProps {
  time: string;
  isAvailable: boolean;
  isSelected: boolean;
  onClick: () => void;
}

export const TimeSlotButton = ({ 
  time, 
  isAvailable, 
  isSelected, 
  onClick 
}: TimeSlotButtonProps) => {
  return (
    <Button
      variant={isSelected ? "default" : "outline"}
      className={cn(
        "w-full h-12 text-sm font-medium transition-all duration-200",
        isAvailable 
          ? "hover:bg-primary hover:text-primary-foreground cursor-pointer" 
          : "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50",
        isSelected && "bg-primary text-primary-foreground"
      )}
      onClick={onClick}
      disabled={!isAvailable}
    >
      {time}
    </Button>
  );
};
