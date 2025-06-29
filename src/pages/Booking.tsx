// src/pages/Booking.tsx

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

// --- Mock Data (substituir pela API real) ---
const mockTherapist = {
  id: '1',
  name: 'Dr. Ana Silva',
  specialty: 'Terapia Cognitivo-Comportamental',
  avatarUrl: 'https://github.com/shadcn.png',
  sessionPrice: 150.0,
};

// Simula a busca de horários disponíveis para um terapeuta em uma data específica
const getMockAvailability = (date: Date): string[] => {
  // Apenas para exemplo, a disponibilidade muda com base no dia da semana
  const dayOfWeek = date.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) return []; // Fim de semana
  return ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
};
// ---------------------------------------------

export default function BookingPage() {
  const { therapistId } = useParams<{ therapistId: string }>();
  const [therapist, setTherapist] = useState(mockTherapist); // Em um caso real, buscaria com base no therapistId
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Simula a busca de dados do terapeuta quando o componente monta
    // Em um caso real: fetch(`/api/therapists/${therapistId}`).then(res => res.json()).then(data => setTherapist(data))
    setTherapist(mockTherapist);
  }, [therapistId]);

  useEffect(() => {
    // Atualiza os horários disponíveis sempre que a data selecionada muda
    if (date) {
      const times = getMockAvailability(date);
      setAvailableTimes(times);
      setSelectedTime(null); // Reseta a hora selecionada
    }
  }, [date]);

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Coluna da Esquerda: Informações do Terapeuta e Calendário */}
        <div className="md:col-span-1 flex flex-col gap-8">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={therapist.avatarUrl} alt={therapist.name} />
                <AvatarFallback>{therapist.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{therapist.name}</CardTitle>
                <p className="text-muted-foreground">{therapist.specialty}</p>
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Selecione uma data</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(day) => day < new Date(new Date().setDate(new Date().getDate() - 1))}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </div>

        {/* Coluna da Direita: Horários Disponíveis */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Escolha um horário</CardTitle>
              <p className="text-muted-foreground">
                Para o dia {date ? date.toLocaleDateString('pt-BR') : '...'}
              </p>
            </CardHeader>
            <CardContent>
              {availableTimes.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {availableTimes.map((time) => (
                    <Button key={time} variant="outline" onClick={() => handleTimeSelect(time)}>
                      {time}
                    </Button>
                  ))}
                </div>
              ) : (
                <p>Não há horários disponíveis para esta data.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de Confirmação */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Agendamento</DialogTitle>
            <DialogDescription>Revise os detalhes da sua consulta antes de prosseguir.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p><strong>Terapeuta:</strong> {therapist.name}</p>
            <p><strong>Data:</strong> {date?.toLocaleDateString('pt-BR')}</p>
            <p><strong>Horário:</strong> {selectedTime}</p>
            <p className="font-bold text-lg"><strong>Valor:</strong> R$ {therapist.sessionPrice.toFixed(2)}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={() => alert('Redirecionando para pagamento...')}>Confirmar e Pagar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
