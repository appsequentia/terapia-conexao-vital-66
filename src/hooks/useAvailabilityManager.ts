import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAvailability, AvailabilitySlot } from '@/hooks/useAvailability';
import { useTherapistData } from '@/hooks/useTherapistData';
import { useToast } from '@/hooks/use-toast';

export interface NewTimeSlot {
  day_of_week: number;
  start_time: string;
  end_time: string;
  session_type: 'online' | 'in-person' | 'both';
}

export const useAvailabilityManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  
  // Get therapist data to get the correct therapist ID
  const { data: therapistData } = useTherapistData();
  const therapistId = therapistData?.id;

  const { data: availabilitySlots, isLoading: slotsLoading } = useAvailability(therapistId || '');

  const addTimeSlotMutation = useMutation({
    mutationFn: async (newSlot: NewTimeSlot) => {
      if (!therapistId) throw new Error('Therapist ID not found');
      
      const { data, error } = await supabase
        .from('availability_slots')
        .insert({
          therapist_id: therapistId,
          ...newSlot,
          is_available: true
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability', therapistId] });
      toast({
        title: "Horário adicionado",
        description: "O horário foi adicionado com sucesso à sua agenda.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao adicionar horário",
        description: "Ocorreu um erro ao adicionar o horário. Tente novamente.",
        variant: "destructive",
      });
      console.error('Error adding time slot:', error);
    }
  });

  const removeTimeSlotMutation = useMutation({
    mutationFn: async (slotId: string) => {
      const { error } = await supabase
        .from('availability_slots')
        .delete()
        .eq('id', slotId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability', therapistId] });
      toast({
        title: "Horário removido",
        description: "O horário foi removido da sua agenda.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao remover horário",
        description: "Ocorreu um erro ao remover o horário. Tente novamente.",
        variant: "destructive",
      });
      console.error('Error removing time slot:', error);
    }
  });

  const updateTimeSlotMutation = useMutation({
    mutationFn: async ({ slotId, updates }: { slotId: string; updates: Partial<NewTimeSlot> }) => {
      const { data, error } = await supabase
        .from('availability_slots')
        .update(updates)
        .eq('id', slotId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability', therapistId] });
      toast({
        title: "Horário atualizado",
        description: "O horário foi atualizado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar horário",
        description: "Ocorreu um erro ao atualizar o horário. Tente novamente.",
        variant: "destructive",
      });
      console.error('Error updating time slot:', error);
    }
  });

  const addTimeSlot = (newSlot: NewTimeSlot) => {
    addTimeSlotMutation.mutate(newSlot);
  };

  const removeTimeSlot = (slotId: string) => {
    removeTimeSlotMutation.mutate(slotId);
  };

  const updateTimeSlot = (slotId: string, updates: Partial<NewTimeSlot>) => {
    updateTimeSlotMutation.mutate({ slotId, updates });
  };

  return {
    availabilitySlots: availabilitySlots || [],
    isLoading: slotsLoading || isLoading,
    addTimeSlot,
    removeTimeSlot,
    updateTimeSlot,
    isAddingSlot: addTimeSlotMutation.isPending,
    isRemovingSlot: removeTimeSlotMutation.isPending,
    isUpdatingSlot: updateTimeSlotMutation.isPending,
  };
};