import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

// Supondo que você tenha um hook para buscar detalhes do terapeuta
// import { useTherapist } from '../../hooks/useTherapist';

// Componentes que foram criados
import CalendarView from '../../components/scheduling/CalendarView';
import TimeSlots from '../../components/scheduling/TimeSlots';
import ConfirmationModal from '../../components/scheduling/ConfirmationModal';

const SchedulingPage: React.FC = () => {
  const { terapeutaId } = useParams<{ terapeutaId: string }>();
  const navigate = useNavigate();
  // const { therapist, isLoading, error } = useTherapist(terapeutaId);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock de dados enquanto o hook não está pronto
  // Datas atualizadas para o futuro para evitar que sejam desabilitadas
  const isLoading = false;
  const error = null;
  const therapist = {
    id: terapeutaId,
    name: 'Dr. Exemplo',
    specialty: 'Psicologia Cognitivo-Comportamental',
    price: 150,
    availability: {
      [format(new Date().setDate(new Date().getDate() + 2), 'yyyy-MM-dd')]: ['09:00', '10:00', '11:00'],
      [format(new Date().setDate(new Date().getDate() + 3), 'yyyy-MM-dd')]: ['14:00', '15:00'],
      [format(new Date().setDate(new Date().getDate() + 5), 'yyyy-MM-dd')]: ['09:00', '10:00', '14:00'],
    }
  };

  if (isLoading) {
    return <div className="container mx-auto p-8 text-center">Carregando...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-8 text-center text-red-500">Ocorreu um erro ao buscar os dados do terapeuta.</div>;
  }

  if (!therapist) {
    return <div className="container mx-auto p-8 text-center">Terapeuta não encontrado.</div>;
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setSelectedTime(null); // Reseta a hora ao mudar o dia
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setIsModalOpen(true);
  };

  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedTime) return;

    const appointmentDetails = {
      therapistName: therapist.name,
      date: selectedDate,
      time: selectedTime,
      price: therapist.price,
    };

    // Navega para a página de seleção de método de pagamento com os detalhes do agendamento
    navigate('/selecionar-pagamento', { state: { appointmentDetails } });
  };

  const getAvailableTimesForSelectedDate = () => {
    if (!selectedDate) return [];
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    return therapist.availability[dateKey as keyof typeof therapist.availability] || [];
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-2">Agendar com {therapist.name}</h1>
      <p className="text-lg text-gray-600 mb-6">{therapist.specialty}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">1. Selecione uma data</h2>
          <CalendarView 
            availability={therapist.availability} 
            onDateSelect={handleDateSelect}
            selected={selectedDate}
            onSelect={handleDateSelect}
            mode="single"
          />
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">2. Escolha um horário</h2>
          {selectedDate ? (
            <TimeSlots 
              availableTimes={getAvailableTimesForSelectedDate()} 
              onTimeSelect={handleTimeSelect}
              selectedTime={selectedTime}
            />
          ) : (
            <div className="p-4 bg-gray-100 rounded-lg text-center text-gray-500 h-full flex items-center justify-center">
              <p>Selecione uma data no calendário para ver os horários disponíveis.</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmBooking}
        therapistName={therapist.name}
        date={selectedDate ?? new Date()}
        time={selectedTime}
        price={therapist.price}
      />
    </div>
  );
};

export default SchedulingPage;
