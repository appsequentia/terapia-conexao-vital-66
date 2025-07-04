import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

import { useCreateAvailabilityEvent, useUpdateAvailabilityEvent } from '@/hooks/useAvailabilityEvents';
import { useTherapistData } from '@/hooks/useTherapistData';
import { AvailabilityEvent, CreateEventRequest } from '@/types/schedule';

const formSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  event_type: z.enum(['block', 'available']),
  recurrence_type: z.enum(['one_time', 'weekly', 'monthly', 'yearly']),
  start_date: z.date({ required_error: 'Data de início é obrigatória' }),
  end_date: z.date().optional(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  days_of_week: z.array(z.number()).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface EventFormProps {
  event?: AvailabilityEvent | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const daysOfWeek = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Segunda-feira' },
  { value: 2, label: 'Terça-feira' },
  { value: 3, label: 'Quarta-feira' },
  { value: 4, label: 'Quinta-feira' },
  { value: 5, label: 'Sexta-feira' },
  { value: 6, label: 'Sábado' },
];

export const EventForm = ({ event, onSuccess, onCancel }: EventFormProps) => {
  const { data: therapistData } = useTherapistData();
  const createMutation = useCreateAvailabilityEvent();
  const updateMutation = useUpdateAvailabilityEvent();
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      event_type: 'block',
      recurrence_type: 'one_time',
      start_date: new Date(),
      days_of_week: [],
    },
  });

  const watchRecurrenceType = form.watch('recurrence_type');
  const watchEventType = form.watch('event_type');

  useEffect(() => {
    if (event) {
      form.reset({
        title: event.title,
        description: event.description || '',
        event_type: event.event_type === 'recurring' ? 'block' : event.event_type,
        recurrence_type: event.recurrence_type || 'one_time',
        start_date: new Date(event.start_date),
        end_date: event.end_date ? new Date(event.end_date) : undefined,
        start_time: event.start_time || '',
        end_time: event.end_time || '',
        days_of_week: event.days_of_week || [],
      });
      setSelectedDays(event.days_of_week || []);
    }
  }, [event, form]);

  const onSubmit = (data: FormData) => {
    if (!therapistData?.id) return;

    const eventData: CreateEventRequest = {
      therapist_id: therapistData.id,
      title: data.title,
      description: data.description,
      event_type: data.event_type,
      recurrence_type: data.recurrence_type,
      start_date: format(data.start_date, 'yyyy-MM-dd'),
      end_date: data.end_date ? format(data.end_date, 'yyyy-MM-dd') : undefined,
      start_time: data.start_time || undefined,
      end_time: data.end_time || undefined,
      days_of_week: selectedDays.length > 0 ? selectedDays : undefined,
    };

    if (event) {
      updateMutation.mutate(
        { id: event.id, updates: eventData },
        { onSuccess }
      );
    } else {
      createMutation.mutate(eventData, { onSuccess });
    }
  };

  const handleDayToggle = (dayValue: number) => {
    setSelectedDays(prev => {
      const newDays = prev.includes(dayValue)
        ? prev.filter(d => d !== dayValue)
        : [...prev, dayValue];
      form.setValue('days_of_week', newDays);
      return newDays;
    });
  };

  const needsDaysOfWeek = ['weekly', 'monthly'].includes(watchRecurrenceType);
  const needsTimeRange = watchEventType === 'available' || watchRecurrenceType !== 'one_time';

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título*</Label>
          <Input
            id="title"
            {...form.register('title')}
            placeholder="Ex: Viagem, Reunião, Plantão Extra"
          />
          {form.formState.errors.title && (
            <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="event_type">Tipo de Evento*</Label>
          <Select 
            value={form.watch('event_type')} 
            onValueChange={(value) => form.setValue('event_type', value as 'block' | 'available')}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="block">Bloqueio (Indisponível)</SelectItem>
              <SelectItem value="available">Disponibilidade Extra</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          {...form.register('description')}
          placeholder="Detalhes adicionais sobre o evento..."
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label>Recorrência*</Label>
        <Select 
          value={form.watch('recurrence_type')} 
          onValueChange={(value) => form.setValue('recurrence_type', value as any)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="one_time">Evento Único</SelectItem>
            <SelectItem value="weekly">Semanal</SelectItem>
            <SelectItem value="monthly">Mensal</SelectItem>
            <SelectItem value="yearly">Anual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Data de Início*</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("justify-start text-left font-normal", !form.watch('start_date') && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {form.watch('start_date') ? format(form.watch('start_date'), 'dd/MM/yyyy') : 'Selecionar data'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={form.watch('start_date')}
                onSelect={(date) => date && form.setValue('start_date', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {watchRecurrenceType !== 'one_time' && (
          <div className="space-y-2">
            <Label>Data de Fim</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("justify-start text-left font-normal", !form.watch('end_date') && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {form.watch('end_date') ? format(form.watch('end_date'), 'dd/MM/yyyy') : 'Sem fim'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={form.watch('end_date')}
                  onSelect={(date) => form.setValue('end_date', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>

      {needsTimeRange && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Horário (Opcional)
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time">Hora Início</Label>
              <Input
                id="start_time"
                type="time"
                {...form.register('start_time')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_time">Hora Fim</Label>
              <Input
                id="end_time"
                type="time"
                {...form.register('end_time')}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {needsDaysOfWeek && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Dias da Semana</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {daysOfWeek.map((day) => (
                <div key={day.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`day-${day.value}`}
                    checked={selectedDays.includes(day.value)}
                    onCheckedChange={() => handleDayToggle(day.value)}
                  />
                  <Label htmlFor={`day-${day.value}`} className="text-sm">
                    {day.label}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {event ? 'Atualizar' : 'Criar'} Evento
        </Button>
      </div>
    </form>
  );
};