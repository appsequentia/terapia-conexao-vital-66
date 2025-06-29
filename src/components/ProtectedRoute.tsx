
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
    userType: profile?.tipo_usuario,
    hasSession: !!session,
    hasAccessToken: !!session?.access_token
  });

  // Special handling for registration routes - allow if authenticated
  const isRegistrationRoute = [
    '/completar-cadastro-terapeuta',
    '/perfil-terapeuta',
    '/editar-perfil-terapeuta'
  ].includes(location.pathname);

  // Show loading while verifying authentication
  if (isLoading) {
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

  // For registration routes, allow access if properly authenticated
  if (isRegistrationRoute && isAuthenticated && session?.access_token) {
    console.log('ProtectedRoute - Allowing access to registration route:', location.pathname);
    return <>{children}</>;
  }

  // For non-auth routes (like login/register pages), redirect authenticated users away
  if (!requireAuth && isAuthenticated && session?.access_token) {
    console.log('ProtectedRoute - Authenticated user accessing non-auth route, allowing access');
    // Don't auto-redirect from non-auth pages to avoid loops
    return <>{children}</>;
  }

  // Render children in all other cases
  console.log('ProtectedRoute - Rendering children for path:', location.pathname);
  return <>{children}</>;
};

export default ProtectedRoute;
