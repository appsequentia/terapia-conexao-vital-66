import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import { NewTimeSlot } from '@/hooks/useAvailabilityManager';

interface TimeSlotFormProps {
  onAddTimeSlot: (slot: NewTimeSlot) => void;
  isLoading?: boolean;
}

const DAYS_OF_WEEK = [
  { value: 1, label: 'Segunda-feira' },
  { value: 2, label: 'Terça-feira' },
  { value: 3, label: 'Quarta-feira' },
  { value: 4, label: 'Quinta-feira' },
  { value: 5, label: 'Sexta-feira' },
  { value: 6, label: 'Sábado' },
  { value: 0, label: 'Domingo' },
];

const SESSION_TYPES = [
  { value: 'online', label: 'Online' },
  { value: 'in-person', label: 'Presencial' },
  { value: 'both', label: 'Ambos' },
];

const TimeSlotForm = ({ onAddTimeSlot, isLoading }: TimeSlotFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<NewTimeSlot>({
    day_of_week: 1,
    start_time: '',
    end_time: '',
    session_type: 'both'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.start_time || !formData.end_time) {
      return;
    }

    if (formData.start_time >= formData.end_time) {
      return;
    }

    onAddTimeSlot(formData);
    
    // Reset form
    setFormData({
      day_of_week: 1,
      start_time: '',
      end_time: '',
      session_type: 'both'
    });
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
    setFormData({
      day_of_week: 1,
      start_time: '',
      end_time: '',
      session_type: 'both'
    });
  };

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        className="w-full"
        disabled={isLoading}
      >
        <Plus className="w-4 h-4 mr-2" />
        Adicionar Horário
      </Button>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Novo Horário</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="day_of_week">Dia da Semana</Label>
            <Select
              value={formData.day_of_week.toString()}
              onValueChange={(value) => setFormData(prev => ({ ...prev, day_of_week: parseInt(value) }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DAYS_OF_WEEK.map((day) => (
                  <SelectItem key={day.value} value={day.value.toString()}>
                    {day.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="start_time">Horário de Início</Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="end_time">Horário de Fim</Label>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="session_type">Tipo de Sessão</Label>
            <Select
              value={formData.session_type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, session_type: value as 'online' | 'in-person' | 'both' }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SESSION_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Adicionando...' : 'Adicionar'}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TimeSlotForm;