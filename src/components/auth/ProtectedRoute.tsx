
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireGlobalAdmin?: boolean;
  requireSuperAdmin?: boolean;
  requireCompanyAccess?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requireGlobalAdmin = false,
  requireSuperAdmin = false,
  requireCompanyAccess = false,
}) => {
  const { isAuthenticated, isLoading, isSuperAdmin, isGlobalAdmin, isCompanyUser } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute check:', {
    isAuthenticated,
    isLoading,
    isSuperAdmin,
    isGlobalAdmin,
    isCompanyUser,
    requireGlobalAdmin,
    requireSuperAdmin,
    requireCompanyAccess
  });

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Verificar se requer autenticação
  if (requireAuth && !isAuthenticated) {
    // Redirecionar para login apropriado baseado no tipo de acesso requerido
    if (requireGlobalAdmin || requireSuperAdmin) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    } else if (requireCompanyAccess) {
      return <Navigate to="/cliente/login" state={{ from: location }} replace />;
    } else {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  // Verificar permissões específicas
  if (requireSuperAdmin && !isSuperAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requireGlobalAdmin && !isGlobalAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requireCompanyAccess && !isCompanyUser) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
