import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Video, MapPin, User, CreditCard, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SessionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: {
    id: string;
    appointment_date: string;
    start_time: string;
    end_time: string;
    session_type: string;
    status: string;
    payment_status: string;
    notes?: string;
    meeting_link?: string;
    terapeutas?: {
      id: string;
      nome: string;
      foto_url?: string;
      especialidades?: string[];
      bio?: string;
    };
  } | null;
}

const SessionDetailsModal = ({ isOpen, onClose, appointment }: SessionDetailsModalProps) => {
  if (!appointment) return null;

  const appointmentDate = new Date(`${appointment.appointment_date}T${appointment.start_time}`);
  const endDate = new Date(`${appointment.appointment_date}T${appointment.end_time}`);
  const formattedDate = format(appointmentDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
  const formattedTime = format(appointmentDate, 'HH:mm', { locale: ptBR });
  const formattedEndTime = format(endDate, 'HH:mm', { locale: ptBR });
  const duration = Math.round((endDate.getTime() - appointmentDate.getTime()) / (1000 * 60));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'scheduled':
        return 'Agendada';
      case 'completed':
        return 'Concluída';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Pago';
      case 'pending':
        return 'Pendente';
      case 'refunded':
        return 'Reembolsado';
      default:
        return status;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhes da Sessão</DialogTitle>
          <DialogDescription>
            Informações completas sobre sua consulta
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Therapist Info */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage 
                src={appointment.terapeutas?.foto_url} 
                alt={appointment.terapeutas?.nome} 
              />
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-medium">
                {appointment.terapeutas?.nome || 'Terapeuta'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {appointment.terapeutas?.especialidades?.[0] || 'Psicólogo'}
              </p>
            </div>
          </div>

          {/* Session Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{formattedDate}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{formattedTime} - {formattedEndTime} ({duration} min)</span>
            </div>
            
            <div className="flex items-center gap-3">
              {appointment.session_type === 'online' ? (
                <>
                  <Video className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Sessão Online</span>
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Sessão Presencial</span>
                </>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              <Badge className={getStatusColor(appointment.status)}>
                {getStatusText(appointment.status)}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <Badge className={getPaymentStatusColor(appointment.payment_status)}>
                {getPaymentStatusText(appointment.payment_status)}
              </Badge>
            </div>
          </div>

          {/* Notes */}
          {appointment.notes && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Observações:</span>
              </div>
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                {appointment.notes}
              </p>
            </div>
          )}

          {/* Meeting Link */}
          {appointment.meeting_link && appointment.session_type === 'online' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Link da Sessão:</span>
              </div>
              <p className="text-sm text-blue-600 bg-blue-50 p-3 rounded-md break-all">
                {appointment.meeting_link}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SessionDetailsModal;