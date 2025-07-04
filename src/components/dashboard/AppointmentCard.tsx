import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Video, MapPin, MessageCircle, User, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AppointmentCardProps {
  appointment: {
    id: string;
    appointment_date: string;
    start_time: string;
    end_time: string;
    session_type: string;
    status: string;
    terapeutas?: {
      id: string;
      nome: string;
      foto_url?: string;
      especialidades?: string[];
    };
  };
  onDetailsClick: (appointmentId: string) => void;
  showActions?: boolean;
}

const AppointmentCard = ({ appointment, onDetailsClick, showActions = true }: AppointmentCardProps) => {
  const appointmentDate = new Date(`${appointment.appointment_date}T${appointment.start_time}`);
  const formattedDate = format(appointmentDate, "d 'de' MMMM", { locale: ptBR });
  const formattedTime = format(appointmentDate, 'HH:mm', { locale: ptBR });

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

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage 
                src={appointment.terapeutas?.foto_url} 
                alt={appointment.terapeutas?.nome} 
              />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">
                {appointment.terapeutas?.nome || 'Terapeuta'}
              </p>
              <p className="text-xs text-muted-foreground">
                {appointment.terapeutas?.especialidades?.[0] || 'Psicólogo'}
              </p>
            </div>
          </div>
          <Badge className={getStatusColor(appointment.status)}>
            {getStatusText(appointment.status)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{formattedTime}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          {appointment.session_type === 'online' ? (
            <>
              <Video className="h-4 w-4 text-muted-foreground" />
              <span>Sessão Online</span>
            </>
          ) : (
            <>
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>Sessão Presencial</span>
            </>
          )}
        </div>

        {showActions && (
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onDetailsClick(appointment.id)}
            >
              Ver Detalhes
            </Button>
            <Button variant="outline" size="sm">
              <MessageCircle className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;