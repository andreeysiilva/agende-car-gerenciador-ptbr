
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-xl font-bold text-gray-900">
            Acesso Negado
          </CardTitle>
          <CardDescription className="text-gray-600">
            Você não tem permissão para acessar esta página
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center">
          <p className="text-sm text-gray-500 mb-6">
            Entre em contato com o administrador do sistema se você acredita que deveria ter acesso a esta área.
          </p>
          
          <Button 
            onClick={() => navigate(-1)}
            variant="outline"
            className="w-full"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Unauthorized;
