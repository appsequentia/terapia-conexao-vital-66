
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useTherapistData = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['therapist-data', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('Usuário não autenticado');
      }

      console.log('Fetching therapist data for user:', user.id);

      const { data, error } = await supabase
        .from('terapeutas')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching therapist data:', error);
        throw error;
      }

      console.log('Therapist data found:', data);
      return data;
    },
    enabled: !!user?.id,
  });
};
