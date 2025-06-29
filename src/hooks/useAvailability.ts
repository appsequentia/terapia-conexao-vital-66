
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AvailabilitySlot {
  id: string;
  therapist_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
  session_type: 'online' | 'in-person' | 'both';
}

export const useAvailability = (therapistId: string) => {
  return useQuery({
    queryKey: ['availability', therapistId],
    queryFn: async (): Promise<AvailabilitySlot[]> => {
      console.log('Fetching availability for therapist:', therapistId);
      
      const { data, error } = await supabase
        .from('availability_slots')
        .select('*')
        .eq('therapist_id', therapistId)
        .eq('is_available', true)
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Error fetching availability:', error);
        throw error;
      }

      console.log('Availability data:', data);
      return data || [];
    },
    enabled: !!therapistId,
  });
};
