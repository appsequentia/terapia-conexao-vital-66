import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useFutureAppointments = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['future-appointments', user?.id],
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
        .in('status', ['scheduled', 'confirmed'])
        .gte('appointment_date', new Date().toISOString().split('T')[0])
        .order('appointment_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Error fetching future appointments:', error);
        throw error;
      }

      return data;
    },
    enabled: !!user?.id,
  });
};