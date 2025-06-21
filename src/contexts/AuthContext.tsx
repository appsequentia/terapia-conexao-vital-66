
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
  console.log('Cleaning up auth state...');
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      console.log('Removing localStorage key:', key);
      localStorage.removeItem(key);
    }
  });
  
  if (typeof sessionStorage !== 'undefined') {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        console.log('Removing sessionStorage key:', key);
        sessionStorage.removeItem(key);
      }
    });
  }
};

// Função para verificar se terapeuta tem perfil completo
const checkTherapistProfile = async (userId: string): Promise<boolean> => {
  try {
    console.log('Checking therapist profile for user:', userId);
    
    const { data, error } = await supabase
      .from('terapeutas')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error checking therapist profile:', error);
      return false;
    }

    const hasProfile = !!data;
    console.log('Therapist profile check result:', hasProfile);
    return hasProfile;
  } catch (error) {
    console.error('Error in checkTherapistProfile:', error);
    return false;
  }
};

// Função para redirecionar usuário após carregamento do perfil
const handleUserRedirect = async (profile: UserProfile) => {
  console.log('Handling user redirect for:', profile.tipo_usuario, profile.email);
  
  if (profile.tipo_usuario === 'client') {
    console.log('Redirecting client to dashboard');
    window.location.href = '/dashboard-cliente';
  } else if (profile.tipo_usuario === 'therapist') {
    console.log('Checking therapist profile completion...');
    const hasProfile = await checkTherapistProfile(profile.id);
    
    if (hasProfile) {
      console.log('Therapist has profile, redirecting to dashboard');
      window.location.href = '/dashboard-terapeuta';
    } else {
      console.log('Therapist needs to complete profile, redirecting to profile form');
      window.location.href = '/perfil-terapeuta';
    }
  } else {
    console.log('Unknown user type, redirecting to home');
    window.location.href = '/';
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log('AuthProvider state:', { user: !!user, profile: !!profile, session: !!session, isLoading });

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
        return null;
      }

      console.log('Profile fetched:', data);

      const profileData: UserProfile = {
        ...data,
        tipo_usuario: data.tipo_usuario as 'client' | 'therapist'
      };

      setProfile(profileData);
      return profileData;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    // Timeout de segurança para evitar loading infinito
    const loadingTimeout = setTimeout(() => {
      console.log('Loading timeout reached, forcing loading to false');
      setIsLoading(false);
    }, 10000); // 10 segundos

    // Configurar listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        clearTimeout(loadingTimeout);
        
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          console.log('User authenticated, fetching profile...');
          // Buscar perfil do usuário
          setTimeout(async () => {
            const profileData = await fetchUserProfile(session.user.id);
            
            // Se o perfil foi carregado e estamos na página inicial, redirecionar
            if (profileData && window.location.pathname === '/') {
              console.log('Profile loaded, checking if should redirect...');
              await handleUserRedirect(profileData);
            }
          }, 100);
        } else {
          console.log('User not authenticated, clearing profile');
          setProfile(null);
        }

        setIsLoading(false);
      }
    );

    // Verificar sessão existente
    const checkSession = async () => {
      console.log('Checking existing session...');
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          console.log('Initial session check:', !!session, session?.user?.email);
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            setTimeout(async () => {
              await fetchUserProfile(session.user.id);
            }, 100);
          }
        }
      } catch (error) {
        console.error('Error in checkSession:', error);
      } finally {
        clearTimeout(loadingTimeout);
        setIsLoading(false);
      }
    };

    checkSession();

    return () => {
      console.log('Cleaning up auth listener');
      clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    console.log('Starting login process for:', email);
    setIsLoading(true);
    
    try {
      cleanupAuthState();
      
      // Tentar logout global primeiro
      try {
        await supabase.auth.signOut({ scope: 'global' });
        console.log('Global signout completed');
      } catch (err) {
        console.warn('Global signout failed:', err);
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        setIsLoading(false);
        throw error;
      }

      console.log('Login successful for:', data.user?.email);
      
      // Não fazer redirecionamento aqui - deixar o onAuthStateChange handle
      // O loading será resetado pelo onAuthStateChange
      
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      throw new Error(error instanceof Error ? error.message : 'Erro no login');
    }
  };

  const register = async (data: RegisterData) => {
    console.log('Starting registration process for:', data.email, 'type:', data.type);
    setIsLoading(true);
    
    try {
      cleanupAuthState();
      
      const redirectUrl = `${window.location.origin}/`;
      console.log('Using redirect URL:', redirectUrl);
      
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

      if (error) {
        console.error('Registration error:', error);
        setIsLoading(false);
        throw error;
      }

      console.log('Registration successful:', !!authData.user);
      
      if (authData.user && !authData.session) {
        console.log('User needs to confirm email');
        setIsLoading(false);
      } else if (authData.user && authData.session) {
        console.log('Auto-login successful, profile will be handled by onAuthStateChange');
        // Deixar o onAuthStateChange handle o redirecionamento
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
      
      cleanupAuthState();
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
        console.log('Global logout successful');
      } catch (err) {
        console.warn('Global signout failed:', err);
      }
      
      setUser(null);
      setProfile(null);
      setSession(null);
      
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    } catch (error) {
      console.error('Logout error:', error);
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
