
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

      // Primeiro, buscar os agendamentos
      let appointmentsQuery = supabase
        .from('appointments')
        .select('*')
        .eq('therapist_id', user.id)
        .order('appointment_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (dateFilter) {
        appointmentsQuery = appointmentsQuery.eq('appointment_date', dateFilter);
      }

      const { data: appointments, error: appointmentsError } = await appointmentsQuery;

      if (appointmentsError) {
        console.error('Error fetching therapist appointments:', appointmentsError);
        throw appointmentsError;
      }

      console.log('Raw appointments data:', appointments);

      // Se não há agendamentos, retornar array vazio
      if (!appointments || appointments.length === 0) {
        return [];
      }

      // Buscar os perfis dos clientes separadamente
      const clientIds = [...new Set(appointments.map(apt => apt.client_id))];
      
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, nome, email, avatar_url')
        .in('id', clientIds);

      if (profilesError) {
        console.error('Error fetching client profiles:', profilesError);
      }

      console.log('Client profiles data:', profiles);

      // Mapear os dados combinando agendamentos com perfis
      const typedData: TherapistAppointment[] = appointments.map(appointment => {
        const clientProfile = profiles?.find(profile => profile.id === appointment.client_id);
        
        return {
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
          client_name: clientProfile?.nome || 'Nome não disponível',
          client_email: clientProfile?.email || 'Email não disponível',
        };
      });

      return typedData;
    },
    enabled: !!user?.id,
  });
};
