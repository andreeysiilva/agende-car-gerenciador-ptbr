
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Administrator, AdministratorFormData } from '@/types/administrator';

interface AdministratorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  formData: AdministratorFormData;
  setFormData: React.Dispatch<React.SetStateAction<AdministratorFormData>>;
  editingAdmin: Administrator | null;
}

const AdministratorForm: React.FC<AdministratorFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  editingAdmin
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingAdmin ? 'Editar Administrador' : 'Novo Administrador'}
          </DialogTitle>
          <DialogDescription>
            {editingAdmin 
              ? 'Edite as informações do administrador'
              : 'Preencha os dados para criar um novo administrador'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome Completo</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="nivel_acesso">Nível de Acesso</Label>
            <Select value={formData.nivel_acesso} onValueChange={(value) => setFormData({...formData, nivel_acesso: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="moderador">Moderador</SelectItem>
                <SelectItem value="suporte">Suporte</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="ativo"
              checked={formData.ativo}
              onChange={(e) => setFormData({...formData, ativo: e.target.checked})}
            />
            <Label htmlFor="ativo">Ativo</Label>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {editingAdmin ? 'Salvar Alterações' : 'Criar Administrador'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdministratorForm;
