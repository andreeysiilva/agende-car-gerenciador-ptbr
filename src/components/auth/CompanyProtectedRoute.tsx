
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useCompanyAuth } from '@/contexts/CompanyAuthContext';

interface CompanyProtectedRouteProps {
  children: React.ReactNode;
}

export const CompanyProtectedRoute: React.FC<CompanyProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useCompanyAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Verificando acesso da empresa...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/app/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
