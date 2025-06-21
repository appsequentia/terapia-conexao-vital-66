
import { TherapistProfile } from '@/types/therapist';

export const mockTherapists: TherapistProfile[] = [
  {
    id: '1',
    name: 'Ana Silva',
    bio: 'Especialista em terapia cognitivo-comportamental com mais de 10 anos de experiência. Trabalho com ansiedade, depressão e transtornos do humor.',
    photo: '/placeholder.svg',
    rating: 4.9,
    reviewCount: 127,
    pricePerSession: 150,
    specialties: [
      { id: '1', name: 'Ansiedade' },
      { id: '2', name: 'Depressão' },
      { id: '3', name: 'TCC' }
    ],
    location: {
      city: 'São Paulo',
      state: 'SP',
      offersOnline: true,
      offersInPerson: true
    },
    experience: 10,
    isOnline: true
  },
  {
    id: '2',
    name: 'Carlos Mendes',
    bio: 'Psicólogo clínico especializado em terapia familiar e de casal. Atendimento presencial e online disponível.',
    photo: '/placeholder.svg',
    rating: 4.8,
    reviewCount: 89,
    pricePerSession: 120,
    specialties: [
      { id: '4', name: 'Terapia de Casal' },
      { id: '5', name: 'Terapia Familiar' },
      { id: '6', name: 'Relacionamentos' }
    ],
    location: {
      city: 'Rio de Janeiro',
      state: 'RJ',
      offersOnline: true,
      offersInPerson: true
    },
    experience: 8,
    isOnline: false
  },
  {
    id: '3',
    name: 'Maria Santos',
    bio: 'Psicanalista com formação em psicanálise lacaniana. Atendo adolescentes e adultos em processo de autoconhecimento.',
    photo: '/placeholder.svg',
    rating: 4.7,
    reviewCount: 156,
    pricePerSession: 180,
    specialties: [
      { id: '7', name: 'Psicanálise' },
      { id: '8', name: 'Adolescentes' },
      { id: '9', name: 'Autoconhecimento' }
    ],
    location: {
      city: 'Belo Horizonte',
      state: 'MG',
      offersOnline: true,
      offersInPerson: true
    },
    experience: 15,
    isOnline: true
  },
  {
    id: '4',
    name: 'Pedro Costa',
    bio: 'Especialista em EMDR e trauma. Trabalho com pessoas que passaram por situações traumáticas e estressantes.',
    photo: '/placeholder.svg',
    rating: 4.9,
    reviewCount: 203,
    pricePerSession: 200,
    specialties: [
      { id: '10', name: 'EMDR' },
      { id: '11', name: 'Trauma' },
      { id: '12', name: 'TEPT' }
    ],
    location: {
      city: 'Porto Alegre',
      state: 'RS',
      offersOnline: true,
      offersInPerson: false
    },
    experience: 12,
    isOnline: true
  },
  {
    id: '5',
    name: 'Juliana Oliveira',
    bio: 'Psicóloga comportamental especializada em fobias, TOC e transtornos de ansiedade. Abordagem prática e eficaz.',
    photo: '/placeholder.svg',
    rating: 4.8,
    reviewCount: 94,
    pricePerSession: 140,
    specialties: [
      { id: '13', name: 'Fobias' },
      { id: '14', name: 'TOC' },
      { id: '15', name: 'Transtornos de Ansiedade' }
    ],
    location: {
      city: 'Brasília',
      state: 'DF',
      offersOnline: true,
      offersInPerson: true
    },
    experience: 7,
    isOnline: false
  },
  {
    id: '6',
    name: 'Roberto Lima',
    bio: 'Psicólogo humanista com experiência em gestalt-terapia. Foco no desenvolvimento pessoal e profissional.',
    photo: '/placeholder.svg',
    rating: 4.6,
    reviewCount: 67,
    pricePerSession: 110,
    specialties: [
      { id: '16', name: 'Gestalt-terapia' },
      { id: '17', name: 'Desenvolvimento Pessoal' },
      { id: '18', name: 'Coaching' }
    ],
    location: {
      city: 'Curitiba',
      state: 'PR',
      offersOnline: true,
      offersInPerson: true
    },
    experience: 9,
    isOnline: true
  }
];
