import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const usePastAppointments = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['past-appointments', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          terapeutas (
            id,
            nome,
            foto_url,
            especialidades
          )
        `)
        .eq('client_id', user.id)
        .lt('appointment_date', new Date().toISOString().split('T')[0])
        .order('appointment_date', { ascending: false })
        .order('start_time', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching past appointments:', error);
        throw error;
      }

      return data;
    },
    enabled: !!user?.id,
  });
};