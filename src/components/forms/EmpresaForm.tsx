
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NovaEmpresaData } from '@/types/empresa';

interface EmpresaFormProps {
  onSubmit: (dados: NovaEmpresaData) => void;
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
    telegramChatId: '',
    dataAtivacao: ''
  });

  const handleInputChange = (field: keyof NovaEmpresaData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Informações da Empresa</CardTitle>
        <CardDescription>
          Preencha os dados para criar uma nova empresa no sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome">Nome da Empresa *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                placeholder="Digite o nome da empresa"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="contato@empresa.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="telefone">Telefone *</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                placeholder="(11) 99999-9999"
                required
              />
            </div>

            <div>
              <Label htmlFor="cnpj_cpf">CNPJ/CPF *</Label>
              <Input
                id="cnpj_cpf"
                value={formData.cnpj_cpf}
                onChange={(e) => handleInputChange('cnpj_cpf', e.target.value)}
                placeholder="00.000.000/0000-00"
                required
              />
            </div>

            <div>
              <Label htmlFor="plano">Plano *</Label>
              <Select 
                value={formData.plano} 
                onValueChange={(value) => handleInputChange('plano', value)}
                required
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
            </div>

            <div>
              <Label htmlFor="dataAtivacao">Data de Ativação</Label>
              <Input
                id="dataAtivacao"
                type="date"
                value={formData.dataAtivacao}
                onChange={(e) => handleInputChange('dataAtivacao', e.target.value)}
                placeholder="Data de ativação da empresa"
              />
              <p className="text-xs text-gray-500 mt-1">
                Se não definida, a empresa será ativada imediatamente
              </p>
            </div>

            <div>
              <Label htmlFor="logoUrl">URL do Logo</Label>
              <Input
                id="logoUrl"
                value={formData.logoUrl}
                onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                placeholder="https://exemplo.com/logo.png"
              />
            </div>

            <div>
              <Label htmlFor="telegramChatId">Telegram Chat ID</Label>
              <Input
                id="telegramChatId"
                value={formData.telegramChatId}
                onChange={(e) => handleInputChange('telegramChatId', e.target.value)}
                placeholder="ID do chat do Telegram (opcional)"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="endereco">Endereço</Label>
            <Textarea
              id="endereco"
              value={formData.endereco}
              onChange={(e) => handleInputChange('endereco', e.target.value)}
              placeholder="Endereço completo da empresa"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Criando...' : 'Criar Empresa'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EmpresaForm;
