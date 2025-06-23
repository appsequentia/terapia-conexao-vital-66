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
  const [redirectTimeout, setRedirectTimeout] = useState<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Simplified authentication check - user must have valid session AND user object
  const isAuthenticated = Boolean(session && user);

  console.log('AuthContext - Current state:', {
    hasUser: !!user,
    hasSession: !!session,
    hasProfile: !!profile,
    isAuthenticated,
    isLoading,
    userEmail: user?.email,
    currentPath: location.pathname
  });

  // Enhanced function to check if user is in registration flow
  const isInRegistrationFlow = () => {
    const registrationPaths = [
      '/cadastro', 
      '/completar-cadastro-terapeuta', 
      '/perfil-terapeuta',
      '/editar-perfil-terapeuta'
    ];
    const isInFlow = registrationPaths.includes(location.pathname);
    console.log('AuthContext - Registration flow check:', {
      currentPath: location.pathname,
      isInFlow,
      registrationPaths
    });
    return isInFlow;
  };

  const handleUserRedirect = async (user: User, profile: Profile) => {
    console.log('AuthContext - handleUserRedirect called:', {
      userType: profile.tipo_usuario,
      currentPath: location.pathname,
      isInRegistrationFlow: isInRegistrationFlow()
    });

    // Don't redirect if user is already in registration flow
    if (isInRegistrationFlow()) {
      console.log('AuthContext - User in registration flow, skipping redirect');
      return;
    }

    // For therapists, check if they have completed their profile
    if (profile.tipo_usuario === 'therapist') {
      try {
        console.log('AuthContext - Checking therapist profile completion');
        const { data: therapistData, error } = await supabase
          .from('terapeutas')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('AuthContext - Error checking therapist profile:', error);
          return;
        }

        if (!therapistData) {
          console.log('AuthContext - Therapist profile incomplete, redirecting to setup');
          // Clear any existing timeout
          if (redirectTimeout) {
            clearTimeout(redirectTimeout);
          }
          // Set a timeout to prevent infinite loops
          const timeout = setTimeout(() => {
            if (location.pathname !== '/completar-cadastro-terapeuta') {
              navigate('/completar-cadastro-terapeuta');
            }
          }, 100);
          setRedirectTimeout(timeout);
          return;
        }

        console.log('AuthContext - Therapist profile complete');
      } catch (error) {
        console.error('AuthContext - Error checking therapist profile:', error);
        return;
      }
    }

    // Redirect to appropriate dashboard only if not already there
    const dashboardPath = profile.tipo_usuario === 'therapist' 
      ? '/dashboard-terapeuta' 
      : '/dashboard-cliente';
    
    if (location.pathname !== dashboardPath && !isInRegistrationFlow()) {
      console.log('AuthContext - Redirecting to dashboard:', dashboardPath);
      // Clear any existing timeout
      if (redirectTimeout) {
        clearTimeout(redirectTimeout);
      }
      // Set a timeout to prevent conflicts
      const timeout = setTimeout(() => {
        navigate(dashboardPath);
      }, 100);
      setRedirectTimeout(timeout);
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
              currentPath: location.pathname
            });
            
            // Always update session and user state immediately
            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
              console.log('AuthContext - User authenticated, fetching profile...');
              // Defer profile fetching to avoid blocking UI
              setTimeout(async () => {
                if (!mounted) return;
                const userProfile = await fetchProfile(session.user.id);
                if (mounted) {
                  setProfile(userProfile);
                  if (userProfile) {
                    // Only redirect if not in registration flow
                    if (!isInRegistrationFlow()) {
                      await handleUserRedirect(session.user, userProfile);
                    }
                  }
                }
              }, 100);
            } else {
              console.log('AuthContext - No user session, clearing profile');
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
            currentPath: location.pathname
          });
          
          setSession(initialSession);
          setUser(initialSession?.user ?? null);

          if (initialSession?.user) {
            console.log('AuthContext - Fetching profile for initial session...');
            // Defer profile fetching for initial session too
            setTimeout(async () => {
              if (!mounted) return;
              const userProfile = await fetchProfile(initialSession.user.id);
              if (mounted) {
                setProfile(userProfile);
                if (userProfile) {
                  // Only redirect if not in registration flow
                  if (!isInRegistrationFlow()) {
                    await handleUserRedirect(initialSession.user, userProfile);
                  }
                }
              }
            }, 100);
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
      if (redirectTimeout) {
        clearTimeout(redirectTimeout);
      }
      cleanup?.then(cleanupFn => cleanupFn?.());
    };
  }, [navigate, location.pathname]);

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
      
      // Clear any existing timeout
      if (redirectTimeout) {
        clearTimeout(redirectTimeout);
      }
      
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
