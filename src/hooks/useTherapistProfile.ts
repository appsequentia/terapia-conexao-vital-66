
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
  estado?: string;
  experience?: number;
  offers_online?: boolean;
  offers_in_person?: boolean;
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

      console.log('Saving therapist profile for user:', user.id);
      console.log('Profile data:', data);

      // Primeiro, verificar se o terapeuta já existe
      const { data: existingTherapist, error: checkError } = await supabase
        .from('terapeutas')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing therapist:', checkError);
        throw checkError;
      }

      const therapistData = {
        user_id: user.id,
        nome: data.nome,
        email: data.email,
        foto_url: data.foto_url,
        bio: data.bio,
        especialidades: data.especialidades,
        abordagens: data.abordagens,
        cidade: data.cidade,
        estado: data.estado,
        experience: data.experience || 0,
        offers_online: data.offers_online || false,
        offers_in_person: data.offers_in_person || false,
        price_per_session: data.price_per_session,
        formacao: data.formacao,
        is_online: true,
        rating: 0,
        review_count: 0
      };

      if (existingTherapist) {
        // UPDATE - terapeuta já existe
        console.log('Updating existing therapist profile');
        const { data: result, error } = await supabase
          .from('terapeutas')
          .update(therapistData)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating therapist profile:', error);
          throw error;
        }

        console.log('Therapist profile updated successfully:', result);
        return result;
      } else {
        // INSERT - novo terapeuta
        console.log('Creating new therapist profile');
        const { data: result, error } = await supabase
          .from('terapeutas')
          .insert(therapistData)
          .select()
          .single();

        if (error) {
          console.error('Error creating therapist profile:', error);
          throw error;
        }

        console.log('Therapist profile created successfully:', result);
        return result;
      }
    },
  });
};
