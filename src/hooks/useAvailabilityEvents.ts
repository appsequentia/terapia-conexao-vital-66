import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AvailabilityEvent, CreateEventRequest } from '@/types/schedule';

export const useAvailabilityEvents = (therapistId: string) => {
  return useQuery({
    queryKey: ['availability-events', therapistId],
    queryFn: async (): Promise<AvailabilityEvent[]> => {
      const { data, error } = await supabase
        .from('availability_events')
        .select('*')
        .eq('therapist_id', therapistId)
        .eq('is_active', true)
        .order('start_date', { ascending: true });

      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        event_type: item.event_type as 'block' | 'available' | 'recurring',
        recurrence_type: item.recurrence_type as 'one_time' | 'weekly' | 'monthly' | 'yearly' | undefined
      }));
    },
    enabled: !!therapistId,
  });
};

export const useCreateAvailabilityEvent = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (event: CreateEventRequest) => {
      const { data, error } = await supabase
        .from('availability_events')
        .insert(event)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['availability-events', data.therapist_id] });
      queryClient.invalidateQueries({ queryKey: ['processed-availability', data.therapist_id] });
      toast({
        title: "Evento criado",
        description: "O evento foi criado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao criar evento",
        description: "Ocorreu um erro ao criar o evento. Tente novamente.",
        variant: "destructive",
      });
    }
  });
};

export const useUpdateAvailabilityEvent = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<AvailabilityEvent> }) => {
      const { data, error } = await supabase
        .from('availability_events')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['availability-events', data.therapist_id] });
      queryClient.invalidateQueries({ queryKey: ['processed-availability', data.therapist_id] });
      toast({
        title: "Evento atualizado",
        description: "O evento foi atualizado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar evento",
        description: "Ocorreu um erro ao atualizar o evento. Tente novamente.",
        variant: "destructive",
      });
    }
  });
};

export const useDeleteAvailabilityEvent = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('availability_events')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability-events'] });
      queryClient.invalidateQueries({ queryKey: ['processed-availability'] });
      toast({
        title: "Evento removido",
        description: "O evento foi removido com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao remover evento",
        description: "Ocorreu um erro ao remover o evento. Tente novamente.",
        variant: "destructive",
      });
    }
  });
};