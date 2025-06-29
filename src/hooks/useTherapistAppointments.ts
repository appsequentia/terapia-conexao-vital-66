
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface TherapistAppointment {
  id: string;
  client_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  session_type: 'online' | 'in-person';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'refunded';
  notes?: string;
  meeting_link?: string;
  client_name?: string;
  client_email?: string;
}

export const useTherapistAppointments = (dateFilter?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['therapist-appointments', user?.id, dateFilter],
    queryFn: async (): Promise<TherapistAppointment[]> => {
      if (!user?.id) {
        throw new Error('Usuário não autenticado');
      }

      console.log('Fetching therapist appointments for user:', user.id, 'date:', dateFilter);

      let query = supabase
        .from('appointments')
        .select(`
          *,
          profiles!appointments_client_id_fkey (
            nome,
            email
          )
        `)
        .eq('therapist_id', user.id)
        .order('appointment_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (dateFilter) {
        query = query.eq('appointment_date', dateFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching therapist appointments:', error);
        throw error;
      }

      console.log('Therapist appointments data:', data);

      // Mapear e tipar os dados
      const typedData: TherapistAppointment[] = (data || []).map(appointment => ({
        id: appointment.id,
        client_id: appointment.client_id,
        appointment_date: appointment.appointment_date,
        start_time: appointment.start_time,
        end_time: appointment.end_time,
        session_type: appointment.session_type as 'online' | 'in-person',
        status: appointment.status as 'scheduled' | 'confirmed' | 'completed' | 'cancelled',
        payment_status: appointment.payment_status as 'pending' | 'paid' | 'refunded',
        notes: appointment.notes,
        meeting_link: appointment.meeting_link,
        client_name: appointment.profiles?.nome,
        client_email: appointment.profiles?.email,
      }));

      return typedData;
    },
    enabled: !!user?.id,
  });
};
