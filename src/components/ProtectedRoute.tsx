
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  redirectTo = '/login' 
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, profile, session } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute - Path:', location.pathname, {
    loading: isLoading,
    authenticated: isAuthenticated,
    requireAuth: requireAuth,
    hasProfile: !!profile,
    userType: profile?.tipo_usuario
  });

  // Special handling for registration routes
  const isRegistrationRoute = [
    '/completar-cadastro-terapeuta',
    '/perfil-terapeuta',
    '/editar-perfil-terapeuta'
  ].includes(location.pathname);

  // Mostrar loading enquanto verifica autenticação
  // We must wait for the profile to be loaded for authenticated users on protected routes.
  // The context's `isLoading` only covers session verification, not profile fetching.
  const isProfilePending = requireAuth && isAuthenticated && !profile;

  if (isLoading || isProfilePending) {
    console.log('ProtectedRoute - Showing loading spinner for path:', location.pathname);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If authentication is required but user is not properly authenticated
  if (requireAuth && (!isAuthenticated || !session?.access_token)) {
    console.log('ProtectedRoute - Redirecting to login, user not properly authenticated for path:', location.pathname);
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // For non-auth routes (like login/register pages), allow access regardless of auth status
  if (!requireAuth) {
    console.log('ProtectedRoute - Non-auth route, allowing access to:', location.pathname);
    return <>{children}</>;
  }

  // Render children for authenticated routes
  console.log('ProtectedRoute - Rendering children for authenticated path:', location.pathname);
  return <>{children}</>;
};

export default ProtectedRoute;
