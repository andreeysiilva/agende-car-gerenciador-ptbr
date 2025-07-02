
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

  console.log('🛡️ ProtectedRoute check:', {
    isAuthenticated,
    isLoading,
    isSuperAdmin,
    isGlobalAdmin,
    isCompanyUser,
    requireGlobalAdmin,
    requireSuperAdmin,
    requireCompanyAccess,
    path: location.pathname
  });

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
    console.log('❌ Usuário não autenticado, redirecionando para login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar permissões específicas
  if (requireSuperAdmin && !isSuperAdmin) {
    console.log('❌ Usuário não é super admin');
    return <Navigate to="/unauthorized" replace />;
  }

  if (requireGlobalAdmin && !isGlobalAdmin) {
    console.log('❌ Usuário não é admin global');
    return <Navigate to="/unauthorized" replace />;
  }

  if (requireCompanyAccess && !isCompanyUser) {
    console.log('❌ Usuário não pertence a uma empresa');
    return <Navigate to="/unauthorized" replace />;
  }

  console.log('✅ Acesso autorizado');
  return <>{children}</>;
};
