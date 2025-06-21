
export interface UserProfile {
  id: string;
  nome: string;
  email: string;
  tipo_usuario: 'client' | 'therapist';
  genero?: 'masculino' | 'feminino' | 'neutro' | 'nao_informado';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProfileData {
  nome: string;
  email: string;
  tipo_usuario: 'client' | 'therapist';
  genero?: 'masculino' | 'feminino' | 'neutro' | 'nao_informado';
  avatar_url?: string;
}
