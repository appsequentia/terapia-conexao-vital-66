import { useState } from 'react';
import { Calendar, Plus, Edit, Trash2, Clock, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { useAvailabilityEvents, useDeleteAvailabilityEvent } from '@/hooks/useAvailabilityEvents';
import { useTherapistData } from '@/hooks/useTherapistData';
import { EventForm } from './EventForm';
import { AvailabilityEvent } from '@/types/schedule';

export const EventManager = () => {
  const { data: therapistData } = useTherapistData();
  const { data: events = [], isLoading } = useAvailabilityEvents(therapistData?.id || '');
  const deleteEventMutation = useDeleteAvailabilityEvent();
  const [selectedEvent, setSelectedEvent] = useState<AvailabilityEvent | null>(null);
  const [showForm, setShowForm] = useState(false);

  const blockEvents = events.filter(event => event.event_type === 'block');
  const availableEvents = events.filter(event => event.event_type === 'available');

  const handleEditEvent = (event: AvailabilityEvent) => {
    setSelectedEvent(event);
    setShowForm(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    deleteEventMutation.mutate(eventId);
  };

  const handleCloseForm = () => {
    setSelectedEvent(null);
    setShowForm(false);
  };

  const getRecurrenceLabel = (event: AvailabilityEvent) => {
    switch (event.recurrence_type) {
      case 'one_time':
        return 'Único';
      case 'weekly':
        return 'Semanal';
      case 'monthly':
        return 'Mensal';
      case 'yearly':
        return 'Anual';
      default:
        return 'Único';
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'block':
        return 'destructive';
      case 'available':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const EventCard = ({ event }: { event: AvailabilityEvent }) => (
    <Card className="relative">
      <CardContent className="pt-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-sm">{event.title}</h4>
            {event.description && (
              <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
            )}
          </div>
          <div className="flex items-center gap-1 ml-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => handleEditEvent(event)}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={() => handleDeleteEvent(event.id)}
              disabled={deleteEventMutation.isPending}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <CalendarDays className="h-3 w-3" />
            <span>{format(new Date(event.start_date), 'dd/MM/yyyy', { locale: ptBR })}</span>
            {event.end_date && (
              <span>até {format(new Date(event.end_date), 'dd/MM/yyyy', { locale: ptBR })}</span>
            )}
          </div>
          
          {event.start_time && event.end_time && (
            <div className="flex items-center gap-2 text-xs">
              <Clock className="h-3 w-3" />
              <span>{event.start_time} - {event.end_time}</span>
            </div>
          )}
          
          <div className="flex items-center gap-1 flex-wrap">
            <Badge variant={getEventTypeColor(event.event_type)} className="text-xs">
              {event.event_type === 'block' ? 'Bloqueio' : 'Disponível'}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {getRecurrenceLabel(event)}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            Carregando eventos...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Gerenciar Eventos de Agenda</h2>
          <p className="text-sm text-muted-foreground">
            Configure bloqueios e disponibilidades extras para sua agenda
          </p>
        </div>
        
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedEvent(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Evento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedEvent ? 'Editar Evento' : 'Criar Novo Evento'}
              </DialogTitle>
            </DialogHeader>
            <EventForm
              event={selectedEvent}
              onSuccess={handleCloseForm}
              onCancel={handleCloseForm}
            />
          </DialogContent>
        </Dialog>
      </div>

      {events.length === 0 ? (
        <Alert>
          <Calendar className="h-4 w-4" />
          <AlertDescription>
            Você ainda não tem eventos configurados. Crie eventos para bloquear horários específicos 
            ou adicionar disponibilidades extras à sua agenda.
          </AlertDescription>
        </Alert>
      ) : (
        <Tabs defaultValue="blocks" className="w-full">
          <TabsList>
            <TabsTrigger value="blocks" className="flex items-center gap-2">
              <span>Bloqueios</span>
              {blockEvents.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {blockEvents.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="extras" className="flex items-center gap-2">
              <span>Disponibilidades Extra</span>
              {availableEvents.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {availableEvents.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="blocks" className="space-y-4">
            {blockEvents.length === 0 ? (
              <Alert>
                <AlertDescription>
                  Nenhum bloqueio configurado. Crie eventos de bloqueio para indisponibilizar 
                  horários específicos em sua agenda.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {blockEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="extras" className="space-y-4">
            {availableEvents.length === 0 ? (
              <Alert>
                <AlertDescription>
                  Nenhuma disponibilidade extra configurada. Crie eventos de disponibilidade 
                  para adicionar horários fora de sua agenda regular.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {availableEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};