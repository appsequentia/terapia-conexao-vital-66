
import { TherapistProfile, Specialty, TherapyApproach, Credential } from '../types/therapist';

/**
 * Mock data for development and testing
 */

export const mockSpecialties: Specialty[] = [
  { id: '1', name: 'Ansiedade', category: 'anxiety' },
  { id: '2', name: 'Depressão', category: 'depression' },
  { id: '3', name: 'Relacionamentos', category: 'relationship' },
  { id: '4', name: 'Trauma', category: 'trauma' },
  { id: '5', name: 'Terapia de Casal', category: 'relationship' },
  { id: '6', name: 'Síndrome do Pânico', category: 'anxiety' },
  { id: '7', name: 'Luto', category: 'other' },
  { id: '8', name: 'Autoestima', category: 'other' },
];

export const mockApproaches: TherapyApproach[] = [
  { id: '1', name: 'Terapia Cognitivo-Comportamental', abbreviation: 'TCC' },
  { id: '2', name: 'Psicanálise', abbreviation: 'PSI' },
  { id: '3', name: 'Gestalt-terapia', abbreviation: 'GTT' },
  { id: '4', name: 'Terapia Humanística', abbreviation: 'TH' },
  { id: '5', name: 'Terapia Sistêmica', abbreviation: 'TS' },
];

export const mockTherapists: TherapistProfile[] = [
  {
    id: '1',
    name: 'Dra. Marina Santos',
    email: 'marina.santos@sequentia.com',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
    bio: 'Psicóloga clínica com mais de 8 anos de experiência em terapia cognitivo-comportamental. Especialista em transtornos de ansiedade e síndrome do pânico. Abordagem acolhedora e baseada em evidências científicas.',
    specialties: [mockSpecialties[0], mockSpecialties[5], mockSpecialties[7]],
    approaches: [mockApproaches[0], mockApproaches[3]],
    rating: 4.9,
    reviewCount: 127,
    pricePerSession: 150,
    isOnline: true,
    languages: ['Português', 'Inglês'],
    experience: 8,
    credentials: [
      {
        id: '1',
        type: 'CRP',
        number: '06/123456',
        issuingBody: 'Conselho Regional de Psicologia - SP',
        verified: true
      }
    ],
    availability: [
      { id: '1', dayOfWeek: 1, startTime: '08:00', endTime: '18:00', isAvailable: true, sessionType: 'both' },
      { id: '2', dayOfWeek: 2, startTime: '08:00', endTime: '18:00', isAvailable: true, sessionType: 'both' },
      { id: '3', dayOfWeek: 3, startTime: '08:00', endTime: '18:00', isAvailable: true, sessionType: 'both' },
    ],
    location: {
      city: 'São Paulo',
      state: 'SP',
      offersOnline: true,
      offersInPerson: true
    },
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Dr. Carlos Mendes',
    email: 'carlos.mendes@sequentia.com',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
    bio: 'Psicanalista com formação internacional. Trabalho com adolescentes e adultos em processo de autoconhecimento. Especialista em terapia de longo prazo e processos de elaboração profunda.',
    specialties: [mockSpecialties[1], mockSpecialties[2], mockSpecialties[7]],
    approaches: [mockApproaches[1], mockApproaches[4]],
    rating: 4.7,
    reviewCount: 89,
    pricePerSession: 200,
    isOnline: false,
    languages: ['Português', 'Espanhol'],
    experience: 12,
    credentials: [
      {
        id: '2',
        type: 'CRP',
        number: '06/789012',
        issuingBody: 'Conselho Regional de Psicologia - SP',
        verified: true
      }
    ],
    availability: [
      { id: '4', dayOfWeek: 2, startTime: '14:00', endTime: '20:00', isAvailable: true, sessionType: 'in-person' },
      { id: '5', dayOfWeek: 4, startTime: '14:00', endTime: '20:00', isAvailable: true, sessionType: 'in-person' },
      { id: '6', dayOfWeek: 5, startTime: '14:00', endTime: '20:00', isAvailable: true, sessionType: 'in-person' },
    ],
    location: {
      city: 'São Paulo',
      state: 'SP',
      offersOnline: false,
      offersInPerson: true
    },
    createdAt: '2022-08-20T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z'
  },
  {
    id: '3',
    name: 'Dra. Ana Rodrigues',
    email: 'ana.rodrigues@sequentia.com',
    photo: 'https://images.unsplash.com/photo-1594824928159-e0ad21d91dd3?w=400&h=400&fit=crop&crop=face',
    bio: 'Terapeuta familiar e de casal certificada. Trabalho com dinâmicas relacionais e comunicação não-violenta. Especialista em terapia sistêmica e mediação de conflitos.',
    specialties: [mockSpecialties[2], mockSpecialties[4], mockSpecialties[7]],
    approaches: [mockApproaches[4], mockApproaches[3]],
    rating: 4.8,
    reviewCount: 156,
    pricePerSession: 180,
    isOnline: true,
    languages: ['Português'],
    experience: 10,
    credentials: [
      {
        id: '3',
        type: 'CRP',
        number: '06/345678',
        issuingBody: 'Conselho Regional de Psicologia - SP',
        verified: true
      }
    ],
    availability: [
      { id: '7', dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isAvailable: true, sessionType: 'both' },
      { id: '8', dayOfWeek: 3, startTime: '09:00', endTime: '17:00', isAvailable: true, sessionType: 'both' },
      { id: '9', dayOfWeek: 6, startTime: '09:00', endTime: '13:00', isAvailable: true, sessionType: 'online' },
    ],
    location: {
      city: 'Rio de Janeiro',
      state: 'RJ',
      offersOnline: true,
      offersInPerson: true
    },
    createdAt: '2022-11-05T10:00:00Z',
    updatedAt: '2024-01-08T10:00:00Z'
  },
  {
    id: '4',
    name: 'Dr. Roberto Silva',
    email: 'roberto.silva@sequentia.com',
    photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face',
    bio: 'Gestalt-terapeuta com experiência em trauma e luto. Trabalho com integração de experiências e desenvolvimento da consciência corporal. Atendimento presencial e online.',
    specialties: [mockSpecialties[3], mockSpecialties[6], mockSpecialties[0]],
    approaches: [mockApproaches[2], mockApproaches[3]],
    rating: 4.6,
    reviewCount: 73,
    pricePerSession: 160,
    isOnline: true,
    languages: ['Português', 'Inglês'],
    experience: 6,
    credentials: [
      {
        id: '4',
        type: 'CRP',
        number: '06/567890',
        issuingBody: 'Conselho Regional de Psicologia - SP',
        verified: true
      }
    ],
    availability: [
      { id: '10', dayOfWeek: 0, startTime: '10:00', endTime: '16:00', isAvailable: true, sessionType: 'online' },
      { id: '11', dayOfWeek: 2, startTime: '08:00', endTime: '18:00', isAvailable: true, sessionType: 'both' },
      { id: '12', dayOfWeek: 4, startTime: '08:00', endTime: '18:00', isAvailable: true, sessionType: 'both' },
    ],
    location: {
      city: 'Belo Horizonte',
      state: 'MG',
      offersOnline: true,
      offersInPerson: true
    },
    createdAt: '2023-03-10T10:00:00Z',
    updatedAt: '2024-01-05T10:00:00Z'
  }
];

/**
 * Helper functions for mock data
 */
export const getTherapistById = (id: string): TherapistProfile | undefined => {
  return mockTherapists.find(therapist => therapist.id === id);
};

export const searchTherapists = (query: string): TherapistProfile[] => {
  if (!query.trim()) return mockTherapists;
  
  const lowerQuery = query.toLowerCase();
  return mockTherapists.filter(therapist => 
    therapist.name.toLowerCase().includes(lowerQuery) ||
    therapist.specialties.some(specialty => 
      specialty.name.toLowerCase().includes(lowerQuery)
    ) ||
    therapist.approaches.some(approach => 
      approach.name.toLowerCase().includes(lowerQuery) ||
      approach.abbreviation.toLowerCase().includes(lowerQuery)
    )
  );
};

export const filterTherapistsBySpecialty = (specialtyIds: string[]): TherapistProfile[] => {
  if (specialtyIds.length === 0) return mockTherapists;
  
  return mockTherapists.filter(therapist =>
    therapist.specialties.some(specialty =>
      specialtyIds.includes(specialty.id)
    )
  );
};

export const getAvailableTimeSlots = (therapistId: string, date: Date): string[] => {
  const therapist = getTherapistById(therapistId);
  if (!therapist) return [];
  
  const dayOfWeek = date.getDay();
  const availability = therapist.availability.find(slot => 
    slot.dayOfWeek === dayOfWeek && slot.isAvailable
  );
  
  if (!availability) return [];
  
  // Generate 50-minute slots
  const slots: string[] = [];
  const startHour = parseInt(availability.startTime.split(':')[0]);
  const endHour = parseInt(availability.endTime.split(':')[0]);
  
  for (let hour = startHour; hour < endHour; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour + 1 < endHour) {
      // Add slot at :50 if there's room for a full session
      // (assuming sessions are 50 minutes with 10-minute break)
    }
  }
  
  return slots;
};
