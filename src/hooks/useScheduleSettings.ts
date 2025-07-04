import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ScheduleSettings } from '@/types/schedule';

export const useScheduleSettings = (therapistId: string) => {
  return useQuery({
    queryKey: ['schedule-settings', therapistId],
    queryFn: async (): Promise<ScheduleSettings | null> => {
      const { data, error } = await supabase
        .from('schedule_settings')
        .select('*')
        .eq('therapist_id', therapistId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!therapistId,
  });
};

export const useUpsertScheduleSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: Omit<ScheduleSettings, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('schedule_settings')
        .upsert(settings, { onConflict: 'therapist_id' })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['schedule-settings', data.therapist_id] });
      queryClient.invalidateQueries({ queryKey: ['processed-availability', data.therapist_id] });
      toast({
        title: "Configurações salvas",
        description: "As configurações da agenda foram salvas com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao salvar configurações",
        description: "Ocorreu um erro ao salvar as configurações. Tente novamente.",
        variant: "destructive",
      });
    }
  });
};