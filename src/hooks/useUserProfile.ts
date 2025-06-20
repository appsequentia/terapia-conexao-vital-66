
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfile } from '@/types/profile';

export const useUserProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async (): Promise<UserProfile | null> => {
      if (!user?.id) return null;

      console.log('Fetching user profile for:', user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        throw error;
      }

      // Fazer type assertion para garantir o tipo correto
      const profileData: UserProfile = {
        ...data,
        tipo_usuario: data.tipo_usuario as 'client' | 'therapist'
      };

      return profileData;
    },
    enabled: !!user?.id,
  });
};
