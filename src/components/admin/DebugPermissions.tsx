
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { RefreshCw, Bug } from 'lucide-react';

interface PermissionData {
  email: string;
  auth_user_id: string;
  role: string;
  nivel_acesso: string;
  empresa_id: string | null;
  role_empresa: string | null;
  ativo: boolean;
  is_super_admin: boolean;
  auth_uid_result: string;
}

const DebugPermissions: React.FC = () => {
  const [permissionData, setPermissionData] = useState<PermissionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { profile, isSuperAdmin, isCompanyUser } = useAuth();

  const debugPermissions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('debug_user_permissions');
      
      if (error) {
        console.error('Erro ao verificar permissões:', error);
        return;
      }

      console.log('🔍 Debug de permissões:', data);
      setPermissionData(data?.[0] || null);
    } catch (error) {
      console.error('Erro inesperado:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (profile) {
      debugPermissions();
    }
  }, [profile]);

  if (!profile) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="h-5 w-5" />
          Debug de Permissões
        </CardTitle>
        <CardDescription>
          Informações detalhadas sobre as permissões do usuário atual
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Status do AuthContext:</span>
            <div className="flex gap-2">
              <Badge variant={isSuperAdmin ? "default" : "secondary"}>
                Super Admin: {isSuperAdmin ? "Sim" : "Não"}
              </Badge>
              <Badge variant={isCompanyUser ? "default" : "secondary"}>
                Company User: {isCompanyUser ? "Sim" : "Não"}
              </Badge>
            </div>
          </div>

          {permissionData && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium mb-3">Dados do Banco:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><strong>Email:</strong> {permissionData.email}</div>
                <div><strong>Role:</strong> {permissionData.role}</div>
                <div><strong>Nível Acesso:</strong> {permissionData.nivel_acesso}</div>
                <div><strong>Empresa ID:</strong> {permissionData.empresa_id || 'NULL'}</div>
                <div><strong>Role Empresa:</strong> {permissionData.role_empresa || 'NULL'}</div>
                <div><strong>Ativo:</strong> {permissionData.ativo ? 'Sim' : 'Não'}</div>
                <div><strong>Is Super Admin (DB):</strong> {permissionData.is_super_admin ? 'Sim' : 'Não'}</div>
                <div><strong>Auth UID:</strong> {permissionData.auth_uid_result}</div>
              </div>
            </div>
          )}

          <Button 
            onClick={debugPermissions} 
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar Debug
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DebugPermissions;
