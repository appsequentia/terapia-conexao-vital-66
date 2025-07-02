import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Calendar, Clock } from 'lucide-react';
import { useAvailabilityManager } from '@/hooks/useAvailabilityManager';
import TimeSlotForm from './TimeSlotForm';
import WeeklyScheduleGrid from './WeeklyScheduleGrid';

const AvailabilityManager = () => {
  const {
    availabilitySlots,
    isLoading,
    addTimeSlot,
    removeTimeSlot,
    isAddingSlot,
    isRemovingSlot,
  } = useAvailabilityManager();

  const totalSlots = availabilitySlots.length;
  const onlineSlots = availabilitySlots.filter(slot => slot.session_type === 'online' || slot.session_type === 'both').length;
  const inPersonSlots = availabilitySlots.filter(slot => slot.session_type === 'in-person' || slot.session_type === 'both').length;

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Gerenciar Disponibilidade
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Calendar className="w-3 h-3 mr-1" />
                {totalSlots} horários
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{totalSlots}</div>
              <div className="text-sm text-gray-600">Total de Horários</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">{onlineSlots}</div>
              <div className="text-sm text-blue-600">Atendimento Online</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">{inPersonSlots}</div>
              <div className="text-sm text-green-600">Atendimento Presencial</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Form Sidebar */}
        <div className="lg:col-span-1">
          <TimeSlotForm 
            onAddTimeSlot={addTimeSlot}
            isLoading={isAddingSlot}
          />
        </div>

        {/* Schedule Grid */}
        <div className="lg:col-span-3">
          <WeeklyScheduleGrid
            availabilitySlots={availabilitySlots}
            onRemoveTimeSlot={removeTimeSlot}
            isLoading={isRemovingSlot}
          />
        </div>
      </div>

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-2">Como funciona?</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Configure seus horários disponíveis para cada dia da semana</li>
                <li>• Escolha entre atendimento online, presencial ou ambos</li>
                <li>• Os pacientes só poderão agendar nos horários que você definir</li>
                <li>• Você pode adicionar múltiplos horários no mesmo dia</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AvailabilityManager;