
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NovaEmpresaData } from '@/types/empresa';

interface EmpresaFormProps {
  onSubmit: (data: NovaEmpresaData) => Promise<void>;
  isLoading: boolean;
  planos: Array<{ nome: string; preco: number }>;
}

const EmpresaForm: React.FC<EmpresaFormProps> = ({ onSubmit, isLoading, planos }) => {
  const [formData, setFormData] = useState<NovaEmpresaData>({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    cnpj_cpf: '',
    plano: '',
    logoUrl: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateCnpjCpf = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length === 11) {
      return 'CPF';
    } else if (cleanValue.length === 14) {
      return 'CNPJ';
    }
    return null;
  };

  const formatCnpjCpf = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length <= 11) {
      // CPF: 000.000.000-00
      return cleanValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
      // CNPJ: 00.000.000/0000-00
      return cleanValue.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
  };

  const handleInputChange = (field: keyof NovaEmpresaData, value: string) => {
    if (field === 'cnpj_cpf') {
      const cleanValue = value.replace(/\D/g, '');
      if (cleanValue.length <= 14) {
        setFormData(prev => ({
          ...prev,
          [field]: cleanValue
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Limpar erro do campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome da empresa é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    }

    if (!formData.cnpj_cpf.trim()) {
      newErrors.cnpj_cpf = 'CNPJ/CPF é obrigatório';
    } else {
      const docType = validateCnpjCpf(formData.cnpj_cpf);
      if (!docType) {
        newErrors.cnpj_cpf = 'CNPJ deve ter 14 dígitos ou CPF deve ter 11 dígitos';
      }
    }

    if (!formData.plano) {
      newErrors.plano = 'Plano é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    await onSubmit(formData);
  };

  const getDocumentType = () => {
    if (!formData.cnpj_cpf) return '';
    const docType = validateCnpjCpf(formData.cnpj_cpf);
    return docType ? `(${docType})` : '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar Nova Empresa</CardTitle>
        <CardDescription>
          Preencha os dados da empresa para criar uma nova conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da Empresa *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                placeholder="Digite o nome da empresa"
                disabled={isLoading}
              />
              {errors.nome && <p className="text-sm text-red-500">{errors.nome}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cnpj_cpf">CNPJ/CPF * {getDocumentType()}</Label>
              <Input
                id="cnpj_cpf"
                value={formatCnpjCpf(formData.cnpj_cpf)}
                onChange={(e) => handleInputChange('cnpj_cpf', e.target.value)}
                placeholder="00.000.000/0000-00 ou 000.000.000-00"
                disabled={isLoading}
              />
              {errors.cnpj_cpf && <p className="text-sm text-red-500">{errors.cnpj_cpf}</p>}
              <p className="text-xs text-gray-500">
                Digite apenas números. CNPJ: 14 dígitos, CPF: 11 dígitos
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail de Acesso *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="admin@empresa.com"
                disabled={isLoading}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              <p className="text-xs text-gray-500">
                Este será o e-mail de login do administrador da empresa
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone *</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                placeholder="(11) 99999-9999"
                disabled={isLoading}
              />
              {errors.telefone && <p className="text-sm text-red-500">{errors.telefone}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Textarea
              id="endereco"
              value={formData.endereco || ''}
              onChange={(e) => handleInputChange('endereco', e.target.value)}
              placeholder="Digite o endereço completo da empresa"
              disabled={isLoading}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="plano">Plano *</Label>
            <Select
              value={formData.plano}
              onValueChange={(value) => handleInputChange('plano', value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um plano" />
              </SelectTrigger>
              <SelectContent>
                {planos.map((plano) => (
                  <SelectItem key={plano.nome} value={plano.nome}>
                    {plano.nome} - R$ {plano.preco.toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.plano && <p className="text-sm text-red-500">{errors.plano}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="logoUrl">URL do Logo</Label>
            <Input
              id="logoUrl"
              type="url"
              value={formData.logoUrl || ''}
              onChange={(e) => handleInputChange('logoUrl', e.target.value)}
              placeholder="https://exemplo.com/logo.png"
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Criando Empresa...
              </div>
            ) : (
              'Criar Empresa'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EmpresaForm;
