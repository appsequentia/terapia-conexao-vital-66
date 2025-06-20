
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
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated, 'requireAuth:', requireAuth, 'location:', location.pathname);

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Se requer autenticação mas usuário não está autenticado
  if (requireAuth && !isAuthenticated) {
    console.log('Redirecting to login - user not authenticated');
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Se NÃO requer autenticação mas usuário ESTÁ autenticado
  if (!requireAuth && isAuthenticated) {
    console.log('Redirecting to home - user already authenticated');
    return <Navigate to="/" replace />;
  }

  // Renderizar children em todos os outros casos
  return <>{children}</>;
};

export default ProtectedRoute;
