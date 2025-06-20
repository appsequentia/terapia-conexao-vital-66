
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface TherapistProfileData {
  nome: string;
  email: string;
  foto_url?: string;
  bio: string;
  especialidades: string[];
  abordagens: string[];
  cidade: string;
  price_per_session: number;
  formacao: Array<{
    institution: string;
    year: string;
  }>;
}

export const useTherapistProfile = () => {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: TherapistProfileData) => {
      if (!user?.id) {
        throw new Error('Usuário não autenticado');
      }

      console.log('Saving therapist profile:', data);

      // Inserir dados na tabela terapeutas
      const { data: result, error } = await supabase
        .from('terapeutas')
        .insert({
          user_id: user.id,
          nome: data.nome,
          email: data.email,
          foto_url: data.foto_url,
          bio: data.bio,
          especialidades: data.especialidades,
          abordagens: data.abordagens,
          cidade: data.cidade,
          price_per_session: data.price_per_session,
          // Serializar formação como JSON
          formacao: JSON.stringify(data.formacao),
          offers_online: true,
          offers_in_person: true,
          is_online: true,
          experience: 0,
          rating: 0,
          review_count: 0
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving therapist profile:', error);
        throw error;
      }

      return result;
    },
  });
};
