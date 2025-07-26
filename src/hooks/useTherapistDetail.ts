
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
      
      console.log('[useTherapistDetail] ===== EXECUTANDO QUERY =====');
      console.log('[useTherapistDetail] Query: SELECT * FROM terapeutas WHERE id =', id);
      
      const { data, error } = await supabase
        .from('terapeutas')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      console.log('[useTherapistDetail] ===== RESULTADO DA QUERY =====');
      console.log('[useTherapistDetail] Error:', error);
      console.log('[useTherapistDetail] Data raw:', data);
      console.log('[useTherapistDetail] Data type:', typeof data);
      console.log('[useTherapistDetail] Data keys:', data ? Object.keys(data) : 'No data');

      if (error) {
        console.error('[useTherapistDetail] ❌ Erro na query Supabase:', error);
        throw error;
      }

      if (!data) {
        console.log('[useTherapistDetail] ❌ Nenhum terapeuta encontrado para ID:', id);
        return null;
      }

      console.log('[useTherapistDetail] ✅ Terapeuta encontrado:', data);
      console.log('[useTherapistDetail] ===== INICIANDO MAPEAMENTO =====');
      
      try {
        const mappedResult = mapSupabaseToTherapist(data as SupabaseTherapist);
        console.log('[useTherapistDetail] ✅ Mapeamento concluído:', mappedResult);
        return mappedResult;
      } catch (mappingError) {
        console.error('[useTherapistDetail] ❌ Erro no mapeamento:', mappingError);
        throw mappingError;
      }
    },
    enabled: !!id,
  });
};
