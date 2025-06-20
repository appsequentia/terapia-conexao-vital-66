
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  nome: string;
  email: string;
  tipo_usuario: 'client' | 'therapist';
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  type: 'client' | 'therapist';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Função para limpar estado de auth
const cleanupAuthState = () => {
  // Limpar chaves do localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Limpar chaves do sessionStorage se existir
  if (typeof sessionStorage !== 'undefined') {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Função para buscar o perfil do usuário
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      console.log('Profile fetched:', data);

      // Fazer type assertion para garantir o tipo correto
      const profileData: UserProfile = {
        ...data,
        tipo_usuario: data.tipo_usuario as 'client' | 'therapist'
      };

      setProfile(profileData);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    // Configurar listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Buscar perfil do usuário com delay para evitar deadlock
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }

        setIsLoading(false);
      }
    );

    // Verificar sessão existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          fetchUserProfile(session.user.id);
        }, 0);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Limpar estado antes do login
      cleanupAuthState();
      
      // Tentar logout global primeiro
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue mesmo se falhar
        console.warn('Global signout failed:', err);
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log('Login successful:', data);
      
      // Forçar refresh da página para garantir estado limpo
      if (data.user) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      throw new Error(error instanceof Error ? error.message : 'Erro no login');
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      // Limpar estado antes do registro
      cleanupAuthState();
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: data.name,
            type: data.type,
          }
        }
      });

      if (error) throw error;

      console.log('Registration successful:', authData);
      
      // Aguardar um pouco para que o trigger crie o perfil
      if (authData.user && !authData.session) {
        // Usuário precisa confirmar email
        console.log('User needs to confirm email');
      } else if (authData.user && authData.session) {
        // Login automático - aguardar criação do perfil
        console.log('Auto-login successful, waiting for profile creation');
        
        // Aguardar alguns segundos para o trigger criar o perfil
        setTimeout(() => {
          if (data.type === 'therapist') {
            window.location.href = '/perfil-terapeuta';
          } else {
            window.location.href = '/';
          }
        }, 2000);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      throw new Error(error instanceof Error ? error.message : 'Erro ao criar conta');
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out...');
      
      // Limpar estado primeiro
      cleanupAuthState();
      
      // Tentar logout global
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.warn('Global signout failed:', err);
      }
      
      // Limpar estado local
      setUser(null);
      setProfile(null);
      setSession(null);
      
      // Forçar refresh da página
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Mesmo se der erro, limpar estado local e redirecionar
      setUser(null);
      setProfile(null);
      setSession(null);
      window.location.href = '/';
    }
  };

  const isAuthenticated = !!user && !!session;

  const value = {
    user,
    profile,
    session,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
