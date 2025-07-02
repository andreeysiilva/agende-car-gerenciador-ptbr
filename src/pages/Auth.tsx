
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getClientLoginUrl } from '@/utils/linkUtils';

// Página de redirecionamento para evitar confusão
const Auth: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirecionar automaticamente para área do cliente
    navigate(getClientLoginUrl(), { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecionando...</p>
      </div>
    </div>
  );
};

export default Auth;
