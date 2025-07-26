
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { SupabaseTherapist } from '@/types/supabase';
import { mapSupabaseToTherapist } from '@/types/supabase';
import type { TherapistProfile } from '@/types/therapist';

export const useTherapistDetail = (id: string) => {
  return useQuery({
    queryKey: ['therapist', id],
    queryFn: async (): Promise<TherapistProfile | null> => {
      console.log('[useTherapistDetail] Fetching therapist detail for id:', id);
      console.log('[useTherapistDetail] ID type:', typeof id);
      console.log('[useTherapistDetail] ID length:', id?.length);
      
      if (!id || id.trim() === '') {
        console.error('[useTherapistDetail] ID é vazio ou inválido');
        return null;
      }
      
      const { data, error } = await supabase
        .from('terapeutas')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching therapist detail:', error);
        throw error;
      }

      if (!data) {
        console.log('Therapist not found for id:', id);
        return null;
      }

      console.log('Fetched therapist detail:', data);
      
      return mapSupabaseToTherapist(data as SupabaseTherapist);
    },
    enabled: !!id,
  });
};
