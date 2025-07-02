
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NovoUsuarioData } from '@/types/usuario';

const usuarioSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  role_empresa: z.enum(['gerente', 'funcionario', 'atendente', 'visualizador'], {
    required_error: 'Selecione um nível de acesso'
  })
});

interface UsuarioFormProps {
  onSubmit: (data: NovoUsuarioData) => void;
  isLoading?: boolean;
}

const UsuarioForm: React.FC<UsuarioFormProps> = ({ onSubmit, isLoading = false }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<NovoUsuarioData>({
    resolver: zodResolver(usuarioSchema)
  });

  const handleFormSubmit = (data: NovoUsuarioData) => {
    onSubmit(data);
    reset();
  };

  const roleEmpresaValue = watch('role_empresa');

  const getRoleLabel = (role: string) => {
    const labels = {
      'gerente': 'Gerente',
      'funcionario': 'Funcionário',
      'atendente': 'Atendente',
      'visualizador': 'Visualizador'
    };
    return labels[role as keyof typeof labels] || role;
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome Completo *</Label>
          <Input
            id="nome"
            {...register('nome')}
            placeholder="Digite o nome completo"
            disabled={isLoading}
          />
          {errors.nome && (
            <p className="text-sm text-red-600">{errors.nome.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-mail *</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="Digite o e-mail"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="role_empresa">Nível de Acesso *</Label>
        <Select
          value={roleEmpresaValue}
          onValueChange={(value: any) => setValue('role_empresa', value)}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o nível de acesso" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gerente">Gerente</SelectItem>
            <SelectItem value="funcionario">Funcionário</SelectItem>
            <SelectItem value="atendente">Atendente</SelectItem>
            <SelectItem value="visualizador">Visualizador</SelectItem>
          </SelectContent>
        </Select>
        {errors.role_empresa && (
          <p className="text-sm text-red-600">{errors.role_empresa.message}</p>
        )}
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Informação:</strong> Uma senha temporária será gerada automaticamente e enviada por e-mail para o usuário.
        </p>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-primary hover:bg-primary-hover"
        >
          {isLoading ? 'Criando...' : 'Criar Usuário'}
        </Button>
      </div>
    </form>
  );
};

export default UsuarioForm;
