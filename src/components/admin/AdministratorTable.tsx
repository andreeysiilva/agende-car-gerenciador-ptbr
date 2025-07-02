
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Administrator } from '@/types/administrator';

interface AdministratorTableProps {
  administrators: Administrator[];
  isLoading: boolean;
  onEdit: (admin: Administrator) => void;
  onDelete: (admin: Administrator) => void;
  onToggleStatus: (admin: Administrator) => void;
}

const AdministratorTable: React.FC<AdministratorTableProps> = ({
  administrators,
  isLoading,
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  const getNivelBadge = (nivel: string) => {
    const variants = {
      super_admin: 'bg-red-100 text-red-800',
      admin: 'bg-blue-100 text-blue-800',
      moderador: 'bg-yellow-100 text-yellow-800',
      suporte: 'bg-green-100 text-green-800'
    };

    const labels = {
      super_admin: 'Super Admin',
      admin: 'Admin',
      moderador: 'Moderador',
      suporte: 'Suporte'
    };

    return (
      <Badge className={variants[nivel as keyof typeof variants]}>
        {labels[nivel as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Administradores ({administrators.length})</CardTitle>
        <CardDescription>
          Lista de todos os administradores do sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Nível</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Último Acesso</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {administrators.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="font-medium">{admin.nome}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{getNivelBadge(admin.nivel_acesso)}</TableCell>
                  <TableCell>
                    <Badge variant={admin.ativo ? "default" : "secondary"}>
                      {admin.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {admin.ultimo_acesso 
                      ? format(new Date(admin.ultimo_acesso), 'dd/MM/yyyy HH:mm', { locale: ptBR })
                      : 'Nunca'
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(admin)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onToggleStatus(admin)}
                      >
                        {admin.ativo ? 'Desativar' : 'Ativar'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDelete(admin)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        
        {!isLoading && administrators.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhum administrador encontrado.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdministratorTable;
