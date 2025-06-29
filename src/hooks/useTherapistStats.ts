
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface TherapistStats {
  todaySessions: number;
  weekSessions: number;
  monthSessions: number;
  activeClients: number;
  newClientsThisMonth: number;
  monthlyRevenue: number;
  todayRevenue: number;
  pendingAppointments: number;
  completedSessions: number;
}

export const useTherapistStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['therapist-stats', user?.id],
    queryFn: async (): Promise<TherapistStats> => {
      if (!user?.id) {
        throw new Error('Usuário não autenticado');
      }

      console.log('Fetching therapist stats for user:', user.id);

      const today = new Date().toISOString().split('T')[0];
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
      const startOfWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // Buscar sessões de hoje
      const { data: todaySessions, error: todayError } = await supabase
        .from('appointments')
        .select('*')
        .eq('therapist_id', user.id)
        .eq('appointment_date', today)
        .in('status', ['scheduled', 'confirmed']);

      if (todayError) {
        console.error('Error fetching today sessions:', todayError);
        throw todayError;
      }

      // Buscar sessões da semana
      const { data: weekSessions, error: weekError } = await supabase
        .from('appointments')
        .select('*')
        .eq('therapist_id', user.id)
        .gte('appointment_date', startOfWeek)
        .in('status', ['scheduled', 'confirmed']);

      if (weekError) {
        console.error('Error fetching week sessions:', weekError);
        throw weekError;
      }

      // Buscar sessões do mês
      const { data: monthSessions, error: monthError } = await supabase
        .from('appointments')
        .select('*')
        .eq('therapist_id', user.id)
        .gte('appointment_date', startOfMonth)
        .in('status', ['scheduled', 'confirmed']);

      if (monthError) {
        console.error('Error fetching month sessions:', monthError);
        throw monthError;
      }

      // Buscar clientes únicos
      const { data: allAppointments, error: clientsError } = await supabase
        .from('appointments')
        .select('client_id, created_at')
        .eq('therapist_id', user.id)
        .eq('status', 'completed');

      if (clientsError) {
        console.error('Error fetching clients:', clientsError);
        throw clientsError;
      }

      // Calcular clientes ativos e novos
      const uniqueClients = new Set(allAppointments?.map(a => a.client_id) || []);
      const newClientsThisMonth = allAppointments?.filter(a => 
        a.created_at >= startOfMonth
      ).length || 0;

      // Buscar dados do terapeuta para calcular receita
      const { data: therapistData, error: therapistError } = await supabase
        .from('terapeutas')
        .select('price_per_session')
        .eq('user_id', user.id)
        .single();

      if (therapistError) {
        console.error('Error fetching therapist data:', therapistError);
        throw therapistError;
      }

      const pricePerSession = therapistData?.price_per_session || 0;

      return {
        todaySessions: todaySessions?.length || 0,
        weekSessions: weekSessions?.length || 0,
        monthSessions: monthSessions?.length || 0,
        activeClients: uniqueClients.size,
        newClientsThisMonth,
        monthlyRevenue: (monthSessions?.length || 0) * pricePerSession,
        todayRevenue: (todaySessions?.length || 0) * pricePerSession,
        pendingAppointments: todaySessions?.filter(a => a.status === 'scheduled').length || 0,
        completedSessions: allAppointments?.length || 0,
      };
    },
    enabled: !!user?.id,
  });
};
