
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
  const { isAuthenticated, isLoading, profile } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute - Path:', location.pathname, {
    loading: isLoading,
    authenticated: isAuthenticated,
    requireAuth: requireAuth,
    hasProfile: !!profile,
    userType: profile?.tipo_usuario
  });

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    console.log('ProtectedRoute - Showing loading spinner for path:', location.pathname);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Se requer autenticação mas usuário não está autenticado
  if (requireAuth && !isAuthenticated) {
    console.log('ProtectedRoute - Redirecting to login, user not authenticated for path:', location.pathname);
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Renderizar children em todos os outros casos
  console.log('ProtectedRoute - Rendering children for path:', location.pathname);
  return <>{children}</>;
};

export default ProtectedRoute;
