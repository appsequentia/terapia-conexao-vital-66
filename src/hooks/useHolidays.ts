import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Holiday } from '@/types/schedule';

export const useHolidays = () => {
  return useQuery({
    queryKey: ['holidays'],
    queryFn: async (): Promise<Holiday[]> => {
      const { data, error } = await supabase
        .from('holidays')
        .select('*')
        .eq('is_active', true)
        .order('date', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useCreateHoliday = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (holiday: Omit<Holiday, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('holidays')
        .insert(holiday)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['holidays'] });
      queryClient.invalidateQueries({ queryKey: ['processed-availability'] });
      toast({
        title: "Feriado criado",
        description: "O feriado foi criado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao criar feriado",
        description: "Ocorreu um erro ao criar o feriado. Tente novamente.",
        variant: "destructive",
      });
    }
  });
};

export const useUpdateHoliday = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Holiday> }) => {
      const { data, error } = await supabase
        .from('holidays')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['holidays'] });
      queryClient.invalidateQueries({ queryKey: ['processed-availability'] });
      toast({
        title: "Feriado atualizado",
        description: "O feriado foi atualizado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar feriado",
        description: "Ocorreu um erro ao atualizar o feriado. Tente novamente.",
        variant: "destructive",
      });
    }
  });
};