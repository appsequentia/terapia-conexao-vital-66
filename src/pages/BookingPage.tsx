
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format, addMinutes, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTherapistDetail } from '@/hooks/useTherapistDetail';
import { useAvailability } from '@/hooks/useAvailability';
import { useAppointments, useCreateAppointment } from '@/hooks/useAppointments';
import { TimeSlotButton } from '@/components/booking/TimeSlotButton';
import { BookingConfirmationModal } from '@/components/booking/BookingConfirmationModal';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';

const BookingPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [sessionType, setSessionType] = useState<'online' | 'in-person'>('online');

  const { data: therapist, isLoading: therapistLoading } = useTherapistDetail(id!);
  const { data: availability, isLoading: availabilityLoading } = useAvailability(id!);
  const { data: appointments, isLoading: appointmentsLoading } = useAppointments(
    id!,
    selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''
  );
  const createAppointmentMutation = useCreateAppointment();

  console.log('BookingPage - Therapist data:', therapist);
  console.log('BookingPage - Availability data:', availability);
  console.log('BookingPage - Appointments data:', appointments);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">
                Você precisa estar logado para agendar uma consulta.
              </p>
              <Button onClick={() => navigate('/login')}>
                Fazer Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (therapistLoading || !therapist) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  const generateTimeSlots = () => {
    if (!selectedDate || !availability) return [];

    const dayOfWeek = selectedDate.getDay();
    const dayAvailability = availability.filter(slot => slot.day_of_week === dayOfWeek);
    
    if (dayAvailability.length === 0) return [];

    const timeSlots: { time: string; available: boolean }[] = [];
    
    dayAvailability.forEach(slot => {
      const startTime = parseISO(`2000-01-01T${slot.start_time}`);
      const endTime = parseISO(`2000-01-01T${slot.end_time}`);
      
      let currentTime = startTime;
      while (currentTime < endTime) {
        const timeString = format(currentTime, 'HH:mm');
        
        // Check if this time slot is already booked
        const isBooked = appointments?.some(appointment => 
          appointment.start_time === timeString
        ) || false;
        
        timeSlots.push({
          time: timeString,
          available: !isBooked
        });
        
        currentTime = addMinutes(currentTime, 60); // 60-minute sessions
      }
    });

    return timeSlots;
  };

  const handleTimeSelect = (time: string) => {
    console.log('Time selected:', time);
    setSelectedTime(time);
    setShowConfirmation(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedTime || !therapist) {
      console.error('Missing required data for booking');
      return;
    }

    console.log('Confirming booking with data:', {
      therapist_id: id,
      selectedDate: format(selectedDate, 'yyyy-MM-dd'),
      selectedTime,
      sessionType
    });

    const endTime = format(addMinutes(parseISO(`2000-01-01T${selectedTime}`), 60), 'HH:mm');

    try {
      const appointment = await createAppointmentMutation.mutateAsync({
        therapist_id: id!,
        appointment_date: format(selectedDate, 'yyyy-MM-dd'),
        start_time: selectedTime,
        end_time: endTime,
        session_type: sessionType,
      });

      console.log('Appointment created:', appointment);
      
      setShowConfirmation(false);
      setSelectedTime(undefined);
      
      // Redirecionar para seleção de método de pagamento
      navigate(`/payment-method/${appointment.id}`);
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
    }
  };

  const timeSlots = generateTimeSlots();

  // Preparar dados para o modal de confirmação
  const therapistName = therapist.name || therapist.nome || 'Terapeuta';
  const therapistSpecialties = therapist.specialties?.map(s => s.name) || 
                              therapist.especialidades || 
                              [];
  const sessionPrice = therapist.pricePerSession || therapist.price_per_session || 0;

  console.log('Modal data:', {
    therapistName,
    therapistSpecialties,
    sessionPrice,
    selectedDate,
    selectedTime
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          
          <div className="flex items-center gap-2 mb-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold">Agendamento de Consulta</h1>
          </div>
          
          <p className="text-muted-foreground">
            Agende sua consulta com {therapistName}
          </p>
          
          <div className="flex flex-wrap gap-2 mt-3">
            {therapistSpecialties.map((specialty, index) => (
              <Badge key={index} variant="secondary">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calendar Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Selecione uma Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date() || date < new Date(Date.now() - 86400000)}
                className="rounded-md border w-full"
              />
            </CardContent>
          </Card>

          {/* Time Slots Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Horários Disponíveis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedDate ? (
                <p className="text-muted-foreground text-center py-8">
                  Selecione uma data para ver os horários disponíveis
                </p>
              ) : availabilityLoading || appointmentsLoading ? (
                <div className="grid grid-cols-2 gap-3">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-12" />
                  ))}
                </div>
              ) : timeSlots.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Nenhum horário disponível para esta data
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {timeSlots.map(({ time, available }) => (
                      <TimeSlotButton
                        key={time}
                        time={time}
                        isAvailable={available}
                        isSelected={selectedTime === time}
                        onClick={() => available && handleTimeSelect(time)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {showConfirmation && selectedDate && selectedTime && (
        <BookingConfirmationModal
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          onConfirm={handleConfirmBooking}
          therapistName={therapistName}
          therapistSpecialties={therapistSpecialties}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          sessionType={sessionType}
          sessionPrice={sessionPrice}
          isLoading={createAppointmentMutation.isPending}
        />
      )}
    </div>
  );
};

export default BookingPage;
