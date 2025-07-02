
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireSuperAdmin?: boolean;
  requireCompanyAccess?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requireSuperAdmin = false,
  requireCompanyAccess = false,
}) => {
  const { isAuthenticated, isLoading, isSuperAdmin, isCompanyUser } = useAuth();
  const location = useLocation();

  // Mostrar loading durante verificação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  // Verificar se requer autenticação
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar permissões específicas
  if (requireSuperAdmin && !isSuperAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Super admins podem acessar qualquer rota (admin ou empresa)
  if (requireCompanyAccess && !isCompanyUser && !isSuperAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
