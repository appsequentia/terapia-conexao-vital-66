
/**
 * Core types for the Sequentia platform
 */

export interface TherapistProfile {
  id: string;
  name: string;
  email: string;
  photo: string;
  bio: string;
  specialties: Specialty[];
  approaches: TherapyApproach[];
  rating: number;
  reviewCount: number;
  pricePerSession: number;
  isOnline: boolean;
  languages: string[];
  experience: number; // years
  credentials: Credential[];
  availability: AvailabilitySlot[];
  location: {
    city: string;
    state: string;
    offersOnline: boolean;
    offersInPerson: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Specialty {
  id: string;
  name: string;
  category: 'anxiety' | 'depression' | 'relationship' | 'trauma' | 'addiction' | 'other';
}

export interface TherapyApproach {
  id: string;
  name: string;
  abbreviation: string; // CBT, DBT, etc.
}

export interface Credential {
  id: string;
  type: 'CRP' | 'CRM' | 'Certificate';
  number: string;
  issuingBody: string;
  expiryDate?: string;
  verified: boolean;
}

export interface AvailabilitySlot {
  id: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm format
  endTime: string;
  isAvailable: boolean;
  sessionType: 'online' | 'in-person' | 'both';
}

export interface Appointment {
  id: string;
  therapistId: string;
  clientId: string;
  date: string; // ISO date string
  startTime: string;
  endTime: string;
  sessionType: 'online' | 'in-person';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  notes?: string;
  meetingLink?: string; // for online sessions
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  photo?: string;
  dateOfBirth?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  favoriteTherapists: string[];
  appointmentHistory: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SearchFilters {
  query?: string;
  specialties: string[];
  approaches: string[];
  priceRange: {
    min: number;
    max: number;
  };
  sessionType: 'online' | 'in-person' | 'both';
  availability: {
    dayOfWeek?: number;
    timeRange?: {
      start: string;
      end: string;
    };
  };
  rating: number; // minimum rating
  location?: {
    city?: string;
    state?: string;
    radius?: number; // km
  };
  languages: string[];
  gender?: 'male' | 'female' | 'non-binary' | 'any';
}

export interface Review {
  id: string;
  therapistId: string;
  clientId: string;
  rating: number; // 1-5
  comment: string;
  isAnonymous: boolean;
  createdAt: string;
  helpfulCount: number;
}

/**
 * UI State interfaces
 */
export interface UIState {
  isLoading: boolean;
  error?: string;
  searchResults: TherapistProfile[];
  selectedTherapist?: TherapistProfile;
  activeFilters: SearchFilters;
  viewMode: 'grid' | 'list';
}

/**
 * Form interfaces
 */
export interface BookingFormData {
  therapistId: string;
  date: string;
  timeSlot: string;
  sessionType: 'online' | 'in-person';
  notes?: string;
  emergencyContact: {
    name: string;
    phone: string;
  };
}

export interface PaymentData {
  amount: number;
  currency: string;
  method: 'card' | 'pix' | 'boleto';
  appointmentId: string;
}
