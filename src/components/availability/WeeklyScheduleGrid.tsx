import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Clock, Trash2, Video, User, Globe } from 'lucide-react';
import { AvailabilitySlot } from '@/hooks/useAvailability';

interface WeeklyScheduleGridProps {
  availabilitySlots: AvailabilitySlot[];
  onRemoveTimeSlot: (slotId: string) => void;
  isLoading?: boolean;
}

const DAYS_OF_WEEK = [
  { value: 1, label: 'Segunda', short: 'SEG' },
  { value: 2, label: 'Terça', short: 'TER' },
  { value: 3, label: 'Quarta', short: 'QUA' },
  { value: 4, label: 'Quinta', short: 'QUI' },
  { value: 5, label: 'Sexta', short: 'SEX' },
  { value: 6, label: 'Sábado', short: 'SÁB' },
  { value: 0, label: 'Domingo', short: 'DOM' },
];

const WeeklyScheduleGrid = ({ availabilitySlots, onRemoveTimeSlot, isLoading }: WeeklyScheduleGridProps) => {
  const [selectedSlotToDelete, setSelectedSlotToDelete] = useState<string | null>(null);

  const getSessionTypeIcon = (sessionType: string) => {
    switch (sessionType) {
      case 'online':
        return <Video className="w-3 h-3" />;
      case 'in-person':
        return <User className="w-3 h-3" />;
      case 'both':
        return <Globe className="w-3 h-3" />;
      default:
        return <Globe className="w-3 h-3" />;
    }
  };

  const getSessionTypeColor = (sessionType: string) => {
    switch (sessionType) {
      case 'online':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-person':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'both':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSessionTypeLabel = (sessionType: string) => {
    switch (sessionType) {
      case 'online':
        return 'Online';
      case 'in-person':
        return 'Presencial';
      case 'both':
        return 'Ambos';
      default:
        return sessionType;
    }
  };

  const formatTime = (time: string) => {
    return time.slice(0, 5); // Remove seconds if present
  };

  const groupSlotsByDay = (slots: AvailabilitySlot[]) => {
    const grouped: { [key: number]: AvailabilitySlot[] } = {};
    
    DAYS_OF_WEEK.forEach(day => {
      grouped[day.value] = slots
        .filter(slot => slot.day_of_week === day.value)
        .sort((a, b) => a.start_time.localeCompare(b.start_time));
    });
    
    return grouped;
  };

  const groupedSlots = groupSlotsByDay(availabilitySlots);

  const handleDeleteConfirm = () => {
    if (selectedSlotToDelete) {
      onRemoveTimeSlot(selectedSlotToDelete);
      setSelectedSlotToDelete(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Horários Configurados
        </CardTitle>
      </CardHeader>
      <CardContent>
        {availabilitySlots.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">Nenhum horário configurado</p>
            <p className="text-sm">Adicione horários para que os pacientes possam agendar consultas com você.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day.value} className="space-y-3">
                <h3 className="font-semibold text-sm text-gray-700 text-center py-2 bg-gray-50 rounded-lg">
                  {day.label}
                </h3>
                <div className="space-y-2">
                  {groupedSlots[day.value].length === 0 ? (
                    <div className="text-center py-4 text-gray-400 text-xs">
                      Sem horários
                    </div>
                  ) : (
                    groupedSlots[day.value].map((slot) => (
                      <div
                        key={slot.id}
                        className="group relative border rounded-lg p-3 hover:shadow-sm transition-all bg-white"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-medium text-gray-900">
                            {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                          </div>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                disabled={isLoading}
                                onClick={() => setSelectedSlotToDelete(slot.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remover Horário</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja remover este horário? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleDeleteConfirm}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Remover
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                        <Badge 
                          variant="outline"
                          className={`text-xs ${getSessionTypeColor(slot.session_type)}`}
                        >
                          <span className="mr-1">{getSessionTypeIcon(slot.session_type)}</span>
                          {getSessionTypeLabel(slot.session_type)}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeeklyScheduleGrid;