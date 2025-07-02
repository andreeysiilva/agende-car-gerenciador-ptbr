
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { Administrator, AdministratorFormData } from '@/types/administrator';
import { useAdministradores } from '@/hooks/useAdministradores';
import AdministratorForm from '@/components/admin/AdministratorForm';
import AdministratorFilters from '@/components/admin/AdministratorFilters';
import AdministratorTable from '@/components/admin/AdministratorTable';

const AdminAdministradores: React.FC = () => {
  const { administrators, isLoading, saveAdministrator, deleteAdministrator, toggleAdministratorStatus } = useAdministradores();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Administrator | null>(null);

  // Formulário
  const [formData, setFormData] = useState<AdministratorFormData>({
    nome: '',
    email: '',
    password: '',
    nivel_acesso: 'admin',
    ativo: true
  });

  // Filtrar administradores
  const filteredAdministrators = administrators.filter(admin => {
    const matchesSearch = admin.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === 'all' || admin.nivel_acesso === filterLevel;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && admin.ativo) ||
                         (filterStatus === 'inactive' && !admin.ativo);
    
    return matchesSearch && matchesLevel && matchesStatus;
  });

  // Criar/Editar administrador
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await saveAdministrator(formData, editingAdmin);
    if (success) {
      setIsDialogOpen(false);
      resetForm();
    }
  };

  // Resetar formulário
  const resetForm = () => {
    setFormData({
      nome: '',
      email: '',
      password: '',
      nivel_acesso: 'admin',
      ativo: true
    });
    setEditingAdmin(null);
  };

  // Editar administrador
  const handleEdit = (admin: Administrator) => {
    setEditingAdmin(admin);
    setFormData({
      nome: admin.nome,
      email: admin.email,
      password: '',
      nivel_acesso: admin.nivel_acesso,
      ativo: admin.ativo
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Administradores</h1>
          <p className="text-gray-600">Gerencie administradores do sistema</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Administrador
            </Button>
          </DialogTrigger>
          <AdministratorForm
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            onSubmit={handleSubmit}
            formData={formData}
            setFormData={setFormData}
            editingAdmin={editingAdmin}
          />
        </Dialog>
      </div>

      <AdministratorFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterLevel={filterLevel}
        setFilterLevel={setFilterLevel}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      <AdministratorTable
        administrators={filteredAdministrators}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={deleteAdministrator}
        onToggleStatus={toggleAdministratorStatus}
      />
    </div>
  );
};

export default AdminAdministradores;
