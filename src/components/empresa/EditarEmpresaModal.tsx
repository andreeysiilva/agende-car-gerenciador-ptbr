
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Empresa } from '@/types/empresa';

interface EditarEmpresaModalProps {
  empresa: Empresa | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (empresaId: string, dadosAtualizados: Partial<Empresa>) => void;
  isLoading: boolean;
}

const EditarEmpresaModal: React.FC<EditarEmpresaModalProps> = ({
  empresa,
  isOpen,
  onClose,
  onSave,
  isLoading
}) => {
  const [formData, setFormData] = useState<Partial<Empresa>>({});

  useEffect(() => {
    if (empresa) {
      setFormData({
        nome: empresa.nome,
        email: empresa.email,
        telefone: empresa.telefone,
        endereco: empresa.endereco || '',
        cnpj_cpf: empresa.cnpj_cpf,
        status: empresa.status,
        data_ativacao: empresa.data_ativacao || '',
        telegram_chat_id: empresa.telegram_chat_id || ''
      });
    }
  }, [empresa]);

  const handleInputChange = (field: keyof Empresa, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (empresa) {
      onSave(empresa.id, formData);
    }
  };

  if (!empresa) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Empresa</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome">Nome da Empresa *</Label>
              <Input
                id="nome"
                value={formData.nome || ''}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="telefone">Telefone *</Label>
              <Input
                id="telefone"
                value={formData.telefone || ''}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="cnpj_cpf">CNPJ/CPF *</Label>
              <Input
                id="cnpj_cpf"
                value={formData.cnpj_cpf || ''}
                onChange={(e) => handleInputChange('cnpj_cpf', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status || 'Ativo'}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="data_ativacao">Data de Ativação</Label>
              <Input
                id="data_ativacao"
                type="date"
                value={formData.data_ativacao || ''}
                onChange={(e) => handleInputChange('data_ativacao', e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="telegram_chat_id">Telegram Chat ID</Label>
              <Input
                id="telegram_chat_id"
                value={formData.telegram_chat_id || ''}
                onChange={(e) => handleInputChange('telegram_chat_id', e.target.value)}
                placeholder="ID do chat do Telegram (opcional)"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="endereco">Endereço</Label>
            <Textarea
              id="endereco"
              value={formData.endereco || ''}
              onChange={(e) => handleInputChange('endereco', e.target.value)}
              placeholder="Endereço completo da empresa"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditarEmpresaModal;
