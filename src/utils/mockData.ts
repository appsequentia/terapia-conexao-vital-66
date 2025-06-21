
import { TherapistProfile } from '@/types/therapist';

export const mockTherapists: TherapistProfile[] = [
  {
    id: '1',
    name: 'Ana Silva',
    email: 'ana.silva@example.com',
    photo: '/placeholder.svg',
    bio: 'Especialista em terapia cognitivo-comportamental com mais de 10 anos de experiência. Trabalho com ansiedade, depressão e transtornos do humor.',
    specialties: [
      { id: '1', name: 'Ansiedade', category: 'anxiety' },
      { id: '2', name: 'Depressão', category: 'depression' },
      { id: '3', name: 'TCC', category: 'other' }
    ],
    approaches: [
      { id: '1', name: 'Terapia Cognitivo-Comportamental', abbreviation: 'TCC' }
    ],
    rating: 4.9,
    reviewCount: 127,
    pricePerSession: 150,
    isOnline: true,
    languages: ['Português'],
    experience: 10,
    credentials: [],
    availability: [],
    location: {
      city: 'São Paulo',
      state: 'SP',
      offersOnline: true,
      offersInPerson: true
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Carlos Mendes',
    email: 'carlos.mendes@example.com',
    photo: '/placeholder.svg',
    bio: 'Psicólogo clínico especializado em terapia familiar e de casal. Atendimento presencial e online disponível.',
    specialties: [
      { id: '4', name: 'Terapia de Casal', category: 'relationship' },
      { id: '5', name: 'Terapia Familiar', category: 'relationship' },
      { id: '6', name: 'Relacionamentos', category: 'relationship' }
    ],
    approaches: [
      { id: '2', name: 'Terapia Familiar Sistêmica', abbreviation: 'TFS' }
    ],
    rating: 4.8,
    reviewCount: 89,
    pricePerSession: 120,
    isOnline: false,
    languages: ['Português'],
    experience: 8,
    credentials: [],
    availability: [],
    location: {
      city: 'Rio de Janeiro',
      state: 'RJ',
      offersOnline: true,
      offersInPerson: true
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Maria Santos',
    email: 'maria.santos@example.com',
    photo: '/placeholder.svg',
    bio: 'Psicanalista com formação em psicanálise lacaniana. Atendo adolescentes e adultos em processo de autoconhecimento.',
    specialties: [
      { id: '7', name: 'Psicanálise', category: 'other' },
      { id: '8', name: 'Adolescentes', category: 'other' },
      { id: '9', name: 'Autoconhecimento', category: 'other' }
    ],
    approaches: [
      { id: '3', name: 'Psicanálise Lacaniana', abbreviation: 'PL' }
    ],
    rating: 4.7,
    reviewCount: 156,
    pricePerSession: 180,
    isOnline: true,
    languages: ['Português'],
    experience: 15,
    credentials: [],
    availability: [],
    location: {
      city: 'Belo Horizonte',
      state: 'MG',
      offersOnline: true,
      offersInPerson: true
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'Pedro Costa',
    email: 'pedro.costa@example.com',
    photo: '/placeholder.svg',
    bio: 'Especialista em EMDR e trauma. Trabalho com pessoas que passaram por situações traumáticas e estressantes.',
    specialties: [
      { id: '10', name: 'EMDR', category: 'trauma' },
      { id: '11', name: 'Trauma', category: 'trauma' },
      { id: '12', name: 'TEPT', category: 'trauma' }
    ],
    approaches: [
      { id: '4', name: 'EMDR', abbreviation: 'EMDR' }
    ],
    rating: 4.9,
    reviewCount: 203,
    pricePerSession: 200,
    isOnline: true,
    languages: ['Português'],
    experience: 12,
    credentials: [],
    availability: [],
    location: {
      city: 'Porto Alegre',
      state: 'RS',
      offersOnline: true,
      offersInPerson: false
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '5',
    name: 'Juliana Oliveira',
    email: 'juliana.oliveira@example.com',
    photo: '/placeholder.svg',
    bio: 'Psicóloga comportamental especializada em fobias, TOC e transtornos de ansiedade. Abordagem prática e eficaz.',
    specialties: [
      { id: '13', name: 'Fobias', category: 'anxiety' },
      { id: '14', name: 'TOC', category: 'anxiety' },
      { id: '15', name: 'Transtornos de Ansiedade', category: 'anxiety' }
    ],
    approaches: [
      { id: '5', name: 'Terapia Comportamental', abbreviation: 'TC' }
    ],
    rating: 4.8,
    reviewCount: 94,
    pricePerSession: 140,
    isOnline: false,
    languages: ['Português'],
    experience: 7,
    credentials: [],
    availability: [],
    location: {
      city: 'Brasília',
      state: 'DF',
      offersOnline: true,
      offersInPerson: true
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: '6',
    name: 'Roberto Lima',
    email: 'roberto.lima@example.com',
    photo: '/placeholder.svg',
    bio: 'Psicólogo humanista com experiência em gestalt-terapia. Foco no desenvolvimento pessoal e profissional.',
    specialties: [
      { id: '16', name: 'Gestalt-terapia', category: 'other' },
      { id: '17', name: 'Desenvolvimento Pessoal', category: 'other' },
      { id: '18', name: 'Coaching', category: 'other' }
    ],
    approaches: [
      { id: '6', name: 'Gestalt-terapia', abbreviation: 'GT' }
    ],
    rating: 4.6,
    reviewCount: 67,
    pricePerSession: 110,
    isOnline: true,
    languages: ['Português'],
    experience: 9,
    credentials: [],
    availability: [],
    location: {
      city: 'Curitiba',
      state: 'PR',
      offersOnline: true,
      offersInPerson: true
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  }
];
