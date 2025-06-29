
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, MapPin, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  therapistName: string;
  therapistSpecialties: string[];
  selectedDate: Date;
  selectedTime: string;
  sessionType: 'online' | 'in-person';
  sessionPrice?: number;
  isLoading?: boolean;
}

export const BookingConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  therapistName,
  therapistSpecialties,
  selectedDate,
  selectedTime,
  sessionType,
  sessionPrice,
  isLoading = false,
}: BookingConfirmationModalProps) => {
  console.log('BookingConfirmationModal props:', {
    therapistName,
    therapistSpecialties,
    selectedDate,
    selectedTime,
    sessionType,
    sessionPrice,
    isLoading
  });

  const formatDate = (date: Date) => {
    return format(date, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const getSessionTypeLabel = (type: 'online' | 'in-person') => {
    return type === 'online' ? 'Online' : 'Presencial';
  };

  const formatPrice = (price?: number) => {
    if (!price || price === 0) return 'Valor a combinar';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const displaySpecialties = Array.isArray(therapistSpecialties) 
    ? therapistSpecialties.join(', ') 
    : 'Especialidades não informadas';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Confirmar Agendamento
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">{therapistName}</p>
              <p className="text-sm text-muted-foreground">
                {displaySpecialties}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Data</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(selectedDate)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Horário</p>
              <p className="text-sm text-muted-foreground">{selectedTime}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Tipo de Consulta</p>
              <p className="text-sm text-muted-foreground">
                {getSessionTypeLabel(sessionType)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <DollarSign className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Valor da Sessão</p>
              <p className="text-sm text-muted-foreground font-semibold">
                {formatPrice(sessionPrice)}
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            className="w-full sm:w-auto"
            disabled={isLoading}
          >
            {isLoading ? 'Processando...' : 'Continuar para Pagamento'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
