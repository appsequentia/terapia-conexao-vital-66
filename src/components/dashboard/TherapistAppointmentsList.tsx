import { useState } from 'react';
import { useTherapistAppointments } from '@/hooks/useTherapistAppointments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Clock, MapPin, Video, User, MessageCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { useCreateOrFindChat } from '@/hooks/useCreateOrFindChat';

const TherapistAppointmentsList = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const { data: appointments, isLoading, error } = useTherapistAppointments(selectedDate);
  const { startChatWithClient } = useCreateOrFindChat();

  const handleSendMessage = async (clientId: string, clientName: string) => {
    try {
      console.log('Creating chat with client:', { clientId, clientName });
      await startChatWithClient(clientId, clientName);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmado';
      case 'scheduled': return 'Agendado';
      case 'completed': return 'Realizado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Agendamentos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Agendamentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">Erro ao carregar agendamentos: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  const upcomingAppointments = appointments?.filter(apt => 
    new Date(`${apt.appointment_date} ${apt.start_time}`) >= new Date()
  ) || [];

  const pastAppointments = appointments?.filter(apt => 
    new Date(`${apt.appointment_date} ${apt.start_time}`) < new Date()
  ) || [];

  return (
    <div className="space-y-6">
      {/* Próximos Agendamentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Próximos Agendamentos ({upcomingAppointments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingAppointments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Nenhum agendamento futuro encontrado.
            </p>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {appointment.client_name?.charAt(0).toUpperCase() || 'C'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="space-y-2">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {appointment.client_name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {appointment.client_email}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(parseISO(appointment.appointment_date), 'dd/MM/yyyy', { locale: ptBR })}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {appointment.start_time} - {appointment.end_time}
                          </div>
                          <div className="flex items-center gap-1">
                            {appointment.session_type === 'online' ? (
                              <>
                                <Video className="h-4 w-4" />
                                <span>Online</span>
                              </>
                            ) : (
                              <>
                                <MapPin className="h-4 w-4" />
                                <span>Presencial</span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        {appointment.notes && (
                          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                            <strong>Observações:</strong> {appointment.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant="outline" className={getStatusColor(appointment.status)}>
                        {getStatusText(appointment.status)}
                      </Badge>
                      
                      <div className="flex gap-2">
                        {appointment.session_type === 'online' && appointment.meeting_link && (
                          <Button size="sm" variant="outline">
                            <Video className="h-4 w-4 mr-1" />
                            Iniciar
                          </Button>
                        )}
                        
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleSendMessage(appointment.client_id, appointment.client_name || 'Cliente')}
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Mensagem
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Histórico de Agendamentos */}
      {pastAppointments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Histórico de Sessões ({pastAppointments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pastAppointments.slice(0, 10).map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {appointment.client_name?.charAt(0).toUpperCase() || 'C'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <h5 className="font-medium text-gray-900 text-sm">
                          {appointment.client_name}
                        </h5>
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          <span>
                            {format(parseISO(appointment.appointment_date), 'dd/MM/yyyy', { locale: ptBR })}
                          </span>
                          <span>{appointment.start_time}</span>
                          <span className="capitalize">{appointment.session_type}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Badge variant="outline" className={getStatusColor(appointment.status)}>
                      {getStatusText(appointment.status)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TherapistAppointmentsList;