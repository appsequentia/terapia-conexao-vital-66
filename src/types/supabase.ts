
export interface SupabaseTherapist {
  id: string;
  nome: string;
  email: string;
  foto_url?: string;
  bio?: string;
  especialidades?: string[];
  abordagens?: string[];
  rating: number;
  review_count: number;
  price_per_session?: number;
  is_online: boolean;
  languages: string[];
  experience: number;
  cidade?: string;
  estado?: string;
  offers_online: boolean;
  offers_in_person: boolean;
  created_at: string;
  updated_at: string;
}

export function mapSupabaseToTherapist(supabaseTherapist: SupabaseTherapist): import('./therapist').TherapistProfile {
  return {
    id: supabaseTherapist.id,
    name: supabaseTherapist.nome,
    email: supabaseTherapist.email,
    photo: supabaseTherapist.foto_url || '',
    bio: supabaseTherapist.bio || '',
    specialties: (supabaseTherapist.especialidades || []).map((esp, index) => ({
      id: `${supabaseTherapist.id}-specialty-${index}`,
      name: esp,
      category: 'other' as const
    })),
    approaches: (supabaseTherapist.abordagens || []).map((abr, index) => ({
      id: `${supabaseTherapist.id}-approach-${index}`,
      name: abr,
      abbreviation: abr.split(' ').map(word => word[0]).join('').toUpperCase()
    })),
    rating: supabaseTherapist.rating,
    reviewCount: supabaseTherapist.review_count,
    pricePerSession: supabaseTherapist.price_per_session || 0,
    isOnline: supabaseTherapist.is_online,
    languages: supabaseTherapist.languages,
    experience: supabaseTherapist.experience,
    credentials: [], // Empty for now, could be expanded later
    availability: [], // Empty for now, could be expanded later
    location: {
      city: supabaseTherapist.cidade || '',
      state: supabaseTherapist.estado || '',
      offersOnline: supabaseTherapist.offers_online,
      offersInPerson: supabaseTherapist.offers_in_person
    },
    createdAt: supabaseTherapist.created_at,
    updatedAt: supabaseTherapist.updated_at
  };
}
