
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { SupabaseTherapist } from '@/types/supabase';
import { mapSupabaseToTherapist } from '@/types/supabase';
import type { TherapistProfile } from '@/types/therapist';

export const useTherapists = () => {
  return useQuery({
    queryKey: ['therapists'],
    queryFn: async (): Promise<TherapistProfile[]> => {
      console.log('useTherapists - Fetching therapists from Supabase (public access)...');
      
      try {
        const { data, error } = await supabase
          .from('terapeutas')
          .select('*')
          .order('rating', { ascending: false });

        if (error) {
          console.error('useTherapists - Error fetching therapists:', error);
          throw error;
        }

        console.log('useTherapists - Raw data fetched:', {
          count: data?.length || 0,
          firstItem: data?.[0] ? {
            id: data[0].id,
            nome: data[0].nome,
            especialidades: data[0].especialidades,
            abordagens: data[0].abordagens
          } : null
        });
        
        if (!data || data.length === 0) {
          console.log('useTherapists - No therapists found in database');
          return [];
        }

        const mappedTherapists = (data as SupabaseTherapist[]).map((therapist, index) => {
          console.log(`useTherapists - Mapping therapist ${index + 1}: ${therapist.nome}`);
          try {
            const mapped = mapSupabaseToTherapist(therapist);
            console.log(`useTherapists - Successfully mapped ${therapist.nome}:`, {
              hasSpecialties: mapped.specialties.length > 0,
              hasApproaches: mapped.approaches.length > 0,
              specialties: mapped.specialties.map(s => s.name),
              approaches: mapped.approaches.map(a => a.name)
            });
            return mapped;
          } catch (mappingError) {
            console.error(`useTherapists - Error mapping therapist ${therapist.nome}:`, mappingError);
            // Return a safe fallback instead of failing completely
            return {
              id: therapist.id,
              name: therapist.nome || 'Nome não disponível',
              email: therapist.email || '',
              photo: therapist.foto_url || '',
              bio: therapist.bio || '',
              specialties: [],
              approaches: [],
              rating: therapist.rating || 0,
              reviewCount: therapist.review_count || 0,
              pricePerSession: therapist.price_per_session || 0,
              isOnline: therapist.is_online || false,
              languages: therapist.languages || ['Português'],
              experience: therapist.experience || 0,
              credentials: [],
              availability: [],
              location: {
                city: therapist.cidade || '',
                state: therapist.estado || '',
                offersOnline: therapist.offers_online || false,
                offersInPerson: therapist.offers_in_person || false
              },
              createdAt: therapist.created_at,
              updatedAt: therapist.updated_at
            } as TherapistProfile;
          }
        });
        
        console.log('useTherapists - Final result:', {
          totalMapped: mappedTherapists.length,
          allHaveNames: mappedTherapists.every(t => t.name),
          allHaveSpecialties: mappedTherapists.every(t => Array.isArray(t.specialties))
        });
        
        return mappedTherapists;
      } catch (error) {
        console.error('useTherapists - Fetch error:', error);
        throw error;
      }
    },
    // Enhanced query options for better reliability
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    // This query should work regardless of authentication status
    enabled: true
  });
};
