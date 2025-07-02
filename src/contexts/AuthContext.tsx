
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  nome: string;
  email: string;
  tipo_usuario: 'client' | 'therapist';
  avatar_url?: string;
  genero?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
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

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Strict authentication check - user must have valid session AND user object
  const isAuthenticated = Boolean(session && user && session.access_token);

  // Define public routes that should NEVER trigger redirects
  const PUBLIC_ROUTES = [
    '/',
    '/encontrar-terapeutas',
    '/terapeuta',
    '/como-funciona',
    '/para-terapeutas',
    '/login',
    '/cadastro',
    '/esqueci-senha'
  ];

  // Check if current path is a public route
  const isPublicRoute = () => {
    return PUBLIC_ROUTES.some(route => 
      location.pathname === route || 
      location.pathname.startsWith(route + '/')
    );
  };

  console.log('AuthContext - Current state:', {
    hasUser: !!user,
    hasSession: !!session,
    hasProfile: !!profile,
    isAuthenticated,
    isLoading,
    userEmail: user?.email,
    userType: profile?.tipo_usuario,
    currentPath: location.pathname,
    isPublicRoute: isPublicRoute()
  });

  // Enhanced function to check if user is in registration flow
  const isInRegistrationFlow = () => {
    const registrationPaths = [
      '/cadastro', 
      '/completar-cadastro-terapeuta', 
      '/perfil-terapeuta',
      '/editar-perfil-terapeuta'
    ];
    return registrationPaths.includes(location.pathname);
  };

  const handleUserRedirect = async (user: User, profile: Profile) => {
    // CRITICAL: Only redirect if user is properly authenticated
    if (!isAuthenticated || !session?.access_token) {
      console.log('AuthContext - User not properly authenticated, skipping redirect');
      return;
    }

    // NEVER redirect from public routes
    if (isPublicRoute()) {
      console.log('AuthContext - User on public route, skipping redirect');
      return;
    }

    // Don't redirect if user is already in registration flow
    if (isInRegistrationFlow()) {
      console.log('AuthContext - User in registration flow, skipping redirect');
      return;
    }

    console.log('AuthContext - handleUserRedirect called:', {
      userType: profile.tipo_usuario,
      currentPath: location.pathname,
      userId: user.id,
      profileId: profile.id
    });

    // For clients, redirect to dashboard if not already there
    if (profile.tipo_usuario === 'client') {
      const dashboardPath = '/dashboard-cliente';
      if (location.pathname !== dashboardPath && !isPublicRoute() && !isInRegistrationFlow()) {
        console.log('AuthContext - Redirecting client to dashboard:', dashboardPath);
        navigate(dashboardPath);
      }
      return;
    }

    // For therapists, let the useTherapistProfileCheck hook handle the redirection logic
    // This prevents double checking and race conditions
    if (profile.tipo_usuario === 'therapist') {
      console.log('AuthContext - Therapist user detected, letting profile check hook handle redirection');
      return;
    }
  };

  const fetchProfile = async (userId: string) => {
    try {
      console.log('AuthContext - Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('AuthContext - Error fetching profile:', error);
        return null;
      }

      console.log('AuthContext - Profile fetched successfully:', data);
      return data as Profile;
    } catch (error) {
      console.error('AuthContext - Error fetching profile:', error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('AuthContext - Initializing auth...');
        
        // Set up auth state listener FIRST  
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) return;

            console.log('AuthContext - Auth state changed:', event, {
              hasSession: !!session,
              userId: session?.user?.id,
              currentPath: location.pathname,
              hasAccessToken: !!session?.access_token,
              isPublicRoute: isPublicRoute()
            });
            
            // Always update session and user state immediately
            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user && session?.access_token) {
              console.log('AuthContext - Valid session detected, fetching profile...');
              // Defer profile fetching to avoid blocking UI
              setTimeout(async () => {
                if (!mounted) return;
                const userProfile = await fetchProfile(session.user.id);
                if (mounted) {
                  setProfile(userProfile);
                  // Only attempt redirect if we have a valid profile and user is authenticated
                  if (userProfile && session?.access_token && !isPublicRoute()) {
                    await handleUserRedirect(session.user, userProfile);
                  }
                }
              }, 200);
            } else {
              console.log('AuthContext - No valid session, clearing profile');
              if (mounted) {
                setProfile(null);
              }
            }
          }
        );

        // THEN check for existing session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (mounted) {
          console.log('AuthContext - Initial session check:', {
            hasSession: !!initialSession,
            userId: initialSession?.user?.id,
            currentPath: location.pathname,
            hasAccessToken: !!initialSession?.access_token,
            isPublicRoute: isPublicRoute()
          });
          
          setSession(initialSession);
          setUser(initialSession?.user ?? null);

          if (initialSession?.user && initialSession?.access_token) {
            console.log('AuthContext - Fetching profile for initial valid session...');
            // Defer profile fetching for initial session too
            setTimeout(async () => {
              if (!mounted) return;
              const userProfile = await fetchProfile(initialSession.user.id);
              if (mounted) {
                setProfile(userProfile);
                // Only attempt redirect if we have a valid profile and user is authenticated
                if (userProfile && initialSession?.access_token && !isPublicRoute()) {
                  await handleUserRedirect(initialSession.user, userProfile);
                }
              }
            }, 200);
          }
        }

        // Set loading to false after initial setup
        if (mounted) {
          console.log('AuthContext - Auth initialization complete');
          setIsLoading(false);
        }

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('AuthContext - Error initializing auth:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    const cleanup = initializeAuth();

    return () => {
      mounted = false;
      cleanup?.then(cleanupFn => cleanupFn?.());
    };
  }, [navigate]);

  const login = async (email: string, password: string) => {
    try {
      console.log('AuthContext - Attempting login for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log('AuthContext - Login successful');
      toast({
        title: 'Login realizado com sucesso!',
        description: 'Bem-vindo de volta.',
      });
    } catch (error) {
      console.error('AuthContext - Login error:', error);
      throw error;
    }
  };

  const register = async ({ name, email, password, type }: RegisterData) => {
    try {
      console.log('AuthContext - Attempting registration for:', email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            type,
          },
        },
      });

      if (error) throw error;

      if (data.user && !data.user.email_confirmed_at) {
        toast({
          title: 'Conta criada!',
          description: 'Verifique seu e-mail para confirmar sua conta.',
        });
      }
    } catch (error) {
      console.error('AuthContext - Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('AuthContext - Attempting logout...');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear all state immediately
      setUser(null);
      setProfile(null);
      setSession(null);
      
      console.log('AuthContext - Logout successful, redirecting to home');
      navigate('/');

      toast({
        title: 'Logout realizado com sucesso!',
        description: 'Até logo!',
      });
    } catch (error) {
      console.error('AuthContext - Logout error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: 'E-mail enviado!',
        description: 'Verifique sua caixa de entrada para redefinir sua senha.',
      });
    } catch (error) {
      console.error('AuthContext - Reset password error:', error);
      throw error;
    }
  };

  const value = {
    user,
    profile,
    session,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
