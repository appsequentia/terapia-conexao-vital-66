
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { SupabaseTherapist } from '@/types/supabase';
import { mapSupabaseToTherapist } from '@/types/supabase';
import type { TherapistProfile } from '@/types/therapist';

export const useTherapists = () => {
  return useQuery({
    queryKey: ['therapists'],
    queryFn: async (): Promise<TherapistProfile[]> => {
      console.log('useTherapists - Fetching therapists from Supabase...');
      
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
        const mapped = mapSupabaseToTherapist(therapist);
        console.log(`useTherapists - Successfully mapped ${therapist.nome}:`, {
          hasSpecialties: mapped.specialties.length > 0,
          hasApproaches: mapped.approaches.length > 0,
          specialties: mapped.specialties.map(s => s.name),
          approaches: mapped.approaches.map(a => a.name)
        });
        return mapped;
      });
      
      console.log('useTherapists - Final result:', {
        totalMapped: mappedTherapists.length,
        allHaveNames: mappedTherapists.every(t => t.name),
        allHaveSpecialties: mappedTherapists.every(t => Array.isArray(t.specialties))
      });
      
      return mappedTherapists;
    },
  });
};
