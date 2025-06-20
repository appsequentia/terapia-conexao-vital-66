
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useTherapistProfileCheck = () => {
  const { user, profile } = useAuth();

  return useQuery({
    queryKey: ['therapist-profile-check', user?.id],
    queryFn: async () => {
      if (!user?.id || profile?.tipo_usuario !== 'therapist') {
        return { hasProfile: false, isTherapist: false };
      }

      console.log('Checking therapist profile for user:', user.id);
      
      const { data, error } = await supabase
        .from('terapeutas')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking therapist profile:', error);
        throw error;
      }

      const hasProfile = !!data;
      console.log('Therapist profile check result:', { hasProfile, isTherapist: true });
      
      return { hasProfile, isTherapist: true };
    },
    enabled: !!user?.id && profile?.tipo_usuario === 'therapist',
  });
};
