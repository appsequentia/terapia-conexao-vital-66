
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { SupabaseTherapist } from '@/types/supabase';
import { mapSupabaseToTherapist } from '@/types/supabase';
import type { TherapistProfile } from '@/types/therapist';

export const useTherapists = () => {
  return useQuery({
    queryKey: ['therapists'],
    queryFn: async (): Promise<TherapistProfile[]> => {
      console.log('Fetching therapists from Supabase...');
      
      const { data, error } = await supabase
        .from('terapeutas')
        .select('*')
        .order('rating', { ascending: false });

      if (error) {
        console.error('Error fetching therapists:', error);
        throw error;
      }

      console.log('Fetched therapists raw data:', data);
      console.log('Number of therapists found:', data?.length || 0);
      
      if (!data || data.length === 0) {
        console.log('No therapists found in database');
        return [];
      }

      const mappedTherapists = (data as SupabaseTherapist[]).map((therapist, index) => {
        console.log(`Mapping therapist ${index + 1}:`, therapist.nome);
        const mapped = mapSupabaseToTherapist(therapist);
        console.log(`Mapped therapist ${index + 1}:`, mapped.name);
        return mapped;
      });
      
      console.log('Final mapped therapists:', mappedTherapists.length);
      return mappedTherapists;
    },
  });
};
