
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Appointment {
  id: string;
  therapist_id: string;
  client_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  session_type: 'online' | 'in-person';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'refunded';
  notes?: string;
  meeting_link?: string;
}

export interface CreateAppointmentData {
  therapist_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  session_type: 'online' | 'in-person';
  notes?: string;
}

export const useAppointments = (therapistId: string, date: string) => {
  return useQuery({
    queryKey: ['appointments', therapistId, date],
    queryFn: async (): Promise<Appointment[]> => {
      console.log('Fetching appointments for therapist:', therapistId, 'date:', date);
      
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('therapist_id', therapistId)
        .eq('appointment_date', date)
        .in('status', ['scheduled', 'confirmed']);

      if (error) {
        console.error('Error fetching appointments:', error);
        throw error;
      }

      console.log('Appointments data:', data);
      
      // Type cast the data to match our interface
      const typedData: Appointment[] = (data || []).map(appointment => ({
        ...appointment,
        session_type: appointment.session_type as 'online' | 'in-person',
        status: appointment.status as 'scheduled' | 'confirmed' | 'completed' | 'cancelled',
        payment_status: appointment.payment_status as 'pending' | 'paid' | 'refunded'
      }));
      
      return typedData;
    },
    enabled: !!therapistId && !!date,
  });
};

export const useCreateAppointment = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAppointmentData): Promise<Appointment> => {
      if (!user?.id) {
        throw new Error('Usuário não autenticado');
      }

      console.log('Creating appointment:', data);

      const appointmentData = {
        ...data,
        client_id: user.id,
        status: 'scheduled', // Criar como agendado, será confirmado após pagamento
        payment_status: 'pending', // Pendente até o pagamento
      };

      const { data: result, error } = await supabase
        .from('appointments')
        .insert(appointmentData)
        .select()
        .single();

      if (error) {
        console.error('Error creating appointment:', error);
        throw error;
      }

      console.log('Appointment created successfully:', result);
      
      // Type cast the result to match our interface
      const typedResult: Appointment = {
        ...result,
        session_type: result.session_type as 'online' | 'in-person',
        status: result.status as 'scheduled' | 'confirmed' | 'completed' | 'cancelled',
        payment_status: result.payment_status as 'pending' | 'paid' | 'refunded'
      };
      
      return typedResult;
    },
    onSuccess: (data) => {
      // Invalidate and refetch appointments
      queryClient.invalidateQueries({ 
        queryKey: ['appointments', data.therapist_id] 
      });
      
      toast({
        title: 'Agendamento criado!',
        description: 'Prossiga para o pagamento para confirmar sua consulta.',
      });
    },
    onError: (error) => {
      console.error('Error creating appointment:', error);
      toast({
        title: 'Erro ao agendar',
        description: 'Não foi possível criar o agendamento. Tente novamente.',
        variant: 'destructive',
      });
    },
  });
};
