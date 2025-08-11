import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/' 
}) => {
  const { isAuthenticated } = useAuth();

  // Se não estiver autenticado, redirecionar para login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Se estiver autenticado, renderizar o conteúdo
  return <>{children}</>;
};

export default ProtectedRoute; 