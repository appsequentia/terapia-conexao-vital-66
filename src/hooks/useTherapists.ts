
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

      console.log('Fetched therapists:', data);
      
      return (data as SupabaseTherapist[]).map(mapSupabaseToTherapist);
    },
  });
};
