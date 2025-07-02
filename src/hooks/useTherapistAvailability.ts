import { useAvailability } from '@/hooks/useAvailability';

export const useTherapistAvailability = (therapistId: string) => {
  return useAvailability(therapistId);
};