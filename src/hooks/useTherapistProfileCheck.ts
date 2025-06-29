
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useTherapistProfileCheck = () => {
  const { user, profile, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['therapist-profile-check', user?.id],
    queryFn: async () => {
      // Only proceed if user is properly authenticated and is the current user
      if (!isAuthenticated || !user?.id || profile?.tipo_usuario !== 'therapist' || user.id !== profile.id) {
        return { hasProfile: false, isTherapist: profile?.tipo_usuario === 'therapist' };
      }

      console.log('Checking therapist profile for authenticated user:', user.id);
      
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
      console.log('Therapist profile check result:', { hasProfile, isTherapist: true, userId: user.id });
      
      return { hasProfile, isTherapist: true };
    },
    enabled: !!user?.id && profile?.tipo_usuario === 'therapist' && isAuthenticated && user.id === profile?.id,
  });
};
