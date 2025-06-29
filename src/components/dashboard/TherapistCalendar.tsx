
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronLeft, ChevronRight, MessageCircle, Check } from 'lucide-react';
import { useTherapistAppointments } from '@/hooks/useTherapistAppointments';
import { format, addDays, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const TherapistCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { data: appointments, isLoading } = useTherapistAppointments(
    format(selectedDate, 'yyyy-MM-dd')
  );

  const handlePrevDay = () => {
    setSelectedDate(prev => subDays(prev, 1));
  };

  const handleNextDay = () => {
    setSelectedDate(prev => addDays(prev, 1));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
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
      case 'scheduled':
        return 'Agendado';
      case 'confirmed':
        return 'Confirmado';
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Agenda do Dia
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrevDay}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-[140px] text-center">
              {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
            </span>
            <Button variant="outline" size="sm" onClick={handleNextDay}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : appointments && appointments.length > 0 ? (
          <div className="space-y-3">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">
                        {appointment.start_time} - {appointment.end_time}
                      </span>
                      <Badge className={getStatusColor(appointment.status)}>
                        {getStatusText(appointment.status)}
                      </Badge>
                      <Badge variant="outline">
                        {appointment.session_type === 'online' ? 'Online' : 'Presencial'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Paciente:</strong> {appointment.client_name || 'Nome não disponível'}
                    </p>
                    {appointment.notes && (
                      <p className="text-sm text-gray-500">
                        <strong>Observações:</strong> {appointment.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    {appointment.status === 'scheduled' && (
                      <Button size="sm" variant="outline">
                        <Check className="w-4 h-4 mr-1" />
                        Confirmar
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Mensagem
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhuma sessão agendada para este dia</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TherapistCalendar;
