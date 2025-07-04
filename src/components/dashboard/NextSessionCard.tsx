import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Video, MapPin, MessageCircle, User } from 'lucide-react';
import { useNextAppointment } from '@/hooks/useClientAppointments';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

const NextSessionCard = () => {
  const { data: nextAppointment, isLoading, error } = useNextAppointment();
  const navigate = useNavigate();

  const handleScheduleClick = () => {
    navigate('/encontrar-terapeutas');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Próxima Sessão
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Próxima Sessão
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Erro ao carregar sessões
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!nextAppointment) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Próxima Sessão
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              Nenhuma sessão agendada
            </p>
            <Button size="sm" className="w-full" onClick={handleScheduleClick}>
              Agendar Sessão
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const appointmentDate = new Date(`${nextAppointment.appointment_date}T${nextAppointment.start_time}`);
  const isToday = format(appointmentDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  const formattedDate = format(appointmentDate, "d 'de' MMMM", { locale: ptBR });
  const formattedTime = format(appointmentDate, 'HH:mm', { locale: ptBR });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
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
      default:
        return status;
    }
  };

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Próxima Sessão
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(nextAppointment.status)}>
            {getStatusText(nextAppointment.status)}
          </Badge>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Therapist Info */}
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage 
              src={nextAppointment.terapeutas?.foto_url} 
              alt={nextAppointment.terapeutas?.nome} 
            />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">
              {nextAppointment.terapeutas?.nome || 'Terapeuta'}
            </p>
            <p className="text-xs text-muted-foreground">
              {nextAppointment.terapeutas?.especialidades?.[0] || 'Psicólogo'}
            </p>
          </div>
        </div>

        {/* Session Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formattedDate}</span>
            {isToday && (
              <Badge variant="secondary" className="text-xs">
                Hoje
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{formattedTime}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {nextAppointment.session_type === 'online' ? (
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
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {isToday && nextAppointment.session_type === 'online' && nextAppointment.status === 'confirmed' ? (
            <Button size="sm" className="flex-1">
              <Video className="h-4 w-4 mr-2" />
              Entrar na Sessão
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="flex-1">
              <MessageCircle className="h-4 w-4 mr-2" />
              Enviar Mensagem
            </Button>
          )}
          <Button variant="outline" size="sm">
            Ver Detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NextSessionCard;