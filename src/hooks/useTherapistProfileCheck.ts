
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';

export const useTherapistProfileCheck = () => {
  const { user, profile, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectExecutedRef = useRef(false);

  const query = useQuery({
    queryKey: ['therapist-profile-check', user?.id],
    queryFn: async () => {
      // Only proceed if user is properly authenticated and is the current user
      if (!isAuthenticated || !user?.id || profile?.tipo_usuario !== 'therapist' || user.id !== profile.id) {
        return { hasProfile: false, isTherapist: profile?.tipo_usuario === 'therapist' };
      }

      console.log('useTherapistProfileCheck - Checking therapist profile for user:', user.id);
      
      const { data, error } = await supabase
        .from('terapeutas')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('useTherapistProfileCheck - Error checking therapist profile:', error);
        throw error;
      }

      const hasProfile = !!data;
      console.log('useTherapistProfileCheck - Profile check result:', { hasProfile, isTherapist: true, userId: user.id });
      
      return { hasProfile, isTherapist: true };
    },
    enabled: !!user?.id && profile?.tipo_usuario === 'therapist' && isAuthenticated && user.id === profile?.id,
    refetchOnWindowFocus: false,
    staleTime: 30000, // Consider data fresh for 30 seconds to prevent excessive queries
  });

  // Handle redirection based on profile completion status
  useEffect(() => {
    if (!query.data || query.isLoading || redirectExecutedRef.current) return;

    const { hasProfile, isTherapist } = query.data;
    
    // Define registration flow paths
    const registrationPaths = [
      '/completar-cadastro-terapeuta', 
      '/perfil-terapeuta',
      '/editar-perfil-terapeuta',
      '/agendamento'
    ];
    
    const isInRegistrationFlow = registrationPaths.includes(location.pathname);
    
    if (isTherapist && isAuthenticated) {
      if (!hasProfile && !isInRegistrationFlow) {
        console.log('useTherapistProfileCheck - Redirecting to profile completion');
        redirectExecutedRef.current = true;
        navigate('/completar-cadastro-terapeuta');
      } else if (hasProfile && location.pathname !== '/dashboard-terapeuta' && !isInRegistrationFlow) {
        console.log('useTherapistProfileCheck - Redirecting to therapist dashboard');
        redirectExecutedRef.current = true;
        navigate('/dashboard-terapeuta');
      }
    }
  }, [query.data, query.isLoading, isAuthenticated, location.pathname, navigate]);

  // Reset redirect flag when user navigates away
  useEffect(() => {
    redirectExecutedRef.current = false;
  }, [location.pathname]);

  return query;
};
