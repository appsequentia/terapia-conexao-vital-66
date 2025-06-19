
import { TherapistProfile } from '@/types/therapist';

export const mockTherapists: TherapistProfile[] = [
  {
    id: "1",
    name: "Dra. Ana Silva",
    email: "ana.silva@email.com",
    photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
    bio: "Psicóloga clínica especializada em terapia cognitivo-comportamental com mais de 10 anos de experiência em ansiedade e depressão.",
    specialties: [
      { id: "1", name: "Ansiedade", category: "anxiety" },
      { id: "2", name: "Depressão", category: "depression" },
      { id: "3", name: "Terapia Cognitivo-Comportamental", category: "other" }
    ],
    approaches: [
      { id: "1", name: "Terapia Cognitivo-Comportamental", abbreviation: "TCC" },
      { id: "2", name: "Terapia de Aceitação e Compromisso", abbreviation: "ACT" }
    ],
    rating: 4.8,
    reviewCount: 127,
    pricePerSession: 150,
    isOnline: true,
    languages: ["Português", "Inglês"],
    experience: 10,
    credentials: [
      {
        id: "1",
        type: "CRP",
        number: "06/123456",
        issuingBody: "CRP-SP",
        verified: true
      }
    ],
    availability: [],
    location: {
      city: "São Paulo",
      state: "SP",
      offersOnline: true,
      offersInPerson: true
    },
    createdAt: "2023-01-15T00:00:00.000Z",
    updatedAt: "2024-01-15T00:00:00.000Z"
  },
  {
    id: "2",
    name: "Dr. Carlos Mendes",
    email: "carlos.mendes@email.com",
    photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
    bio: "Psicólogo especialista em relacionamentos e terapia de casal, com abordagem humanística e sistêmica.",
    specialties: [
      { id: "4", name: "Terapia de Casal", category: "relationship" },
      { id: "5", name: "Relacionamentos", category: "relationship" }
    ],
    approaches: [
      { id: "3", name: "Terapia Humanística", abbreviation: "TH" },
      { id: "4", name: "Terapia Sistêmica", abbreviation: "TS" }
    ],
    rating: 4.6,
    reviewCount: 89,
    pricePerSession: 180,
    isOnline: false,
    languages: ["Português"],
    experience: 8,
    credentials: [
      {
        id: "2",
        type: "CRP",
        number: "06/789012",
        issuingBody: "CRP-RJ",
        verified: true
      }
    ],
    availability: [],
    location: {
      city: "Rio de Janeiro",
      state: "RJ",
      offersOnline: false,
      offersInPerson: true
    },
    createdAt: "2023-02-20T00:00:00.000Z",
    updatedAt: "2024-02-20T00:00:00.000Z"
  },
  {
    id: "3",
    name: "Dra. Mariana Costa",
    email: "mariana.costa@email.com",
    photo: "https://images.unsplash.com/photo-1594824475863-15fdf4d44bd3?w=400&h=400&fit=crop&crop=face",
    bio: "Especialista em trauma e EMDR, com experiência em terapia para adolescentes e adultos jovens.",
    specialties: [
      { id: "6", name: "Trauma", category: "trauma" },
      { id: "7", name: "EMDR", category: "trauma" },
      { id: "8", name: "Adolescentes", category: "other" }
    ],
    approaches: [
      { id: "5", name: "EMDR", abbreviation: "EMDR" },
      { id: "6", name: "Terapia do Trauma", abbreviation: "TT" }
    ],
    rating: 4.9,
    reviewCount: 156,
    pricePerSession: 200,
    isOnline: true,
    languages: ["Português", "Espanhol"],
    experience: 12,
    credentials: [
      {
        id: "3",
        type: "CRP",
        number: "06/345678",
        issuingBody: "CRP-MG",
        verified: true
      }
    ],
    availability: [],
    location: {
      city: "Belo Horizonte",
      state: "MG",
      offersOnline: true,
      offersInPerson: true
    },
    createdAt: "2023-03-10T00:00:00.000Z",
    updatedAt: "2024-03-10T00:00:00.000Z"
  }
];
