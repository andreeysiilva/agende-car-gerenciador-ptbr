
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Users, Send, Edit, Trash } from 'lucide-react';
import { toast } from 'sonner';

// Interface para definir a estrutura de uma empresa
interface Empresa {
  id: number;
  nome: string;
  email: string;
  subdominio: string;
  telefone: string;
  plano: string;
  status: 'Ativo' | 'Inativo' | 'Pendente';
  senhaTemporaria?: string;
  dataCriacao: string;
}

// Dados mockados de empresas para demonstração
const empresasMock: Empresa[] = [
  {
    id: 1,
    nome: 'Auto Lavagem Premium',
    email: 'contato@autopremium.com',
    subdominio: 'autopremium',
    telefone: '(11) 99999-1111',
    plano: 'Premium',
    status: 'Ativo',
    dataCriacao: '2024-01-15'
  },
  {
    id: 2,
    nome: 'Lava Car Express',
    email: 'admin@lavacarexpress.com',
    subdominio: 'lavacarexpress',
    telefone: '(11) 99999-2222',
    plano: 'Básico',
    status: 'Ativo',
    dataCriacao: '2024-02-20'
  },
  {
    id: 3,
    nome: 'Detailing Master',
    email: 'contato@detailingmaster.com',
    subdominio: 'detailingmaster',
    telefone: '(11) 99999-3333',
    plano: 'Premium',
    status: 'Pendente',
    dataCriacao: '2024-03-10'
  }
];

const planosDisponiveis = ['Básico', 'Premium', 'Enterprise'];

// Página para gerenciamento de empresas
const Empresas: React.FC = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>(empresasMock);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [empresaEditando, setEmpresaEditando] = useState<Empresa | null>(null);
  
  // Estados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    subdominio: '',
    telefone: '',
    plano: ''
  });

  // Função para gerar senha temporária de 6 dígitos
  const gerarSenhaTemporaria = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Função para resetar o formulário
  const resetarFormulario = () => {
    setFormData({
      nome: '',
      email: '',
      subdominio: '',
      telefone: '',
      plano: ''
    });
    setEmpresaEditando(null);
  };

  // Função para preparar edição de empresa
  const iniciarEdicao = (empresa: Empresa) => {
    setEmpresaEditando(empresa);
    setFormData({
      nome: empresa.nome,
      email: empresa.email,
      subdominio: empresa.subdominio,
      telefone: empresa.telefone,
      plano: empresa.plano
    });
    setIsDialogOpen(true);
  };

  // Função para salvar empresa (criar ou atualizar)
  const salvarEmpresa = () => {
    if (!formData.nome || !formData.email || !formData.subdominio || !formData.telefone || !formData.plano) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (empresaEditando) {
      // Atualizar empresa existente
      setEmpresas(prev => prev.map(emp => 
        emp.id === empresaEditando.id 
          ? { ...emp, ...formData }
          : emp
      ));
      toast.success('Empresa atualizada com sucesso!');
    } else {
      // Criar nova empresa
      const senhaTemporaria = gerarSenhaTemporaria();
      const novaEmpresa: Empresa = {
        id: empresas.length + 1,
        ...formData,
        status: 'Pendente',
        senhaTemporaria,
        dataCriacao: new Date().toISOString().split('T')[0]
      };
      
      setEmpresas(prev => [...prev, novaEmpresa]);
      
      // Simular envio da senha via Telegram
      console.log(`Enviando senha temporária via Telegram para ${formData.telefone}: ${senhaTemporaria}`);
      
      toast.success(`Empresa criada! Senha temporária: ${senhaTemporaria}`);
    }

    setIsDialogOpen(false);
    resetarFormulario();
  };

  // Função para excluir empresa
  const excluirEmpresa = (id: number) => {
    setEmpresas(prev => prev.filter(emp => emp.id !== id));
    toast.success('Empresa excluída com sucesso!');
  };

  // Função para reenviar senha via Telegram
  const reenviarSenha = (empresa: Empresa) => {
    const novaSenha = gerarSenhaTemporaria();
    
    setEmpresas(prev => prev.map(emp => 
      emp.id === empresa.id 
        ? { ...emp, senhaTemporaria: novaSenha }
        : emp
    ));
    
    console.log(`Reenviando senha via Telegram para ${empresa.telefone}: ${novaSenha}`);
    toast.success(`Nova senha enviada via Telegram: ${novaSenha}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cabeçalho da página */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Empresas</h1>
          <p className="text-gray-600">
            Administre todas as empresas cadastradas na plataforma
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetarFormulario();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Nova Empresa
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {empresaEditando ? 'Editar Empresa' : 'Cadastrar Nova Empresa'}
              </DialogTitle>
              <DialogDescription>
                {empresaEditando 
                  ? 'Atualize as informações da empresa.'
                  : 'Preencha os dados para criar uma nova empresa.'
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="nome">Nome da Empresa *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  placeholder="Ex: Auto Lavagem Premium"
                />
              </div>
              
              <div>
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="contato@empresa.com"
                />
              </div>
              
              <div>
                <Label htmlFor="subdominio">Subdomínio *</Label>
                <Input
                  id="subdominio"
                  value={formData.subdominio}
                  onChange={(e) => setFormData({...formData, subdominio: e.target.value})}
                  placeholder="minhaempresa"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Será usado como: {formData.subdominio || 'subdominio'}.agendecar.com
                </p>
              </div>
              
              <div>
                <Label htmlFor="telefone">Telefone (WhatsApp/Telegram) *</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                  placeholder="(11) 99999-9999"
                />
              </div>
              
              <div>
                <Label htmlFor="plano">Plano *</Label>
                <Select value={formData.plano} onValueChange={(value) => setFormData({...formData, plano: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um plano" />
                  </SelectTrigger>
                  <SelectContent>
                    {planosDisponiveis.map((plano) => (
                      <SelectItem key={plano} value={plano}>{plano}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button 
                onClick={salvarEmpresa}
                className="flex-1 bg-primary hover:bg-primary-600"
              >
                {empresaEditando ? 'Atualizar' : 'Criar Empresa'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Card com estatísticas */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Resumo das Empresas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{empresas.length}</div>
              <div className="text-sm text-gray-600">Total de Empresas</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {empresas.filter(e => e.status === 'Ativo').length}
              </div>
              <div className="text-sm text-gray-600">Empresas Ativas</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {empresas.filter(e => e.status === 'Pendente').length}
              </div>
              <div className="text-sm text-gray-600">Aguardando Ativação</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de empresas */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>Lista de Empresas Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Subdomínio</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data de Criação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {empresas.map((empresa) => (
                  <TableRow key={empresa.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{empresa.nome}</div>
                        <div className="text-sm text-gray-500">{empresa.email}</div>
                        <div className="text-sm text-gray-500">{empresa.telefone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {empresa.subdominio}.agendecar.com
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{empresa.plano}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          empresa.status === 'Ativo' ? 'default' : 
                          empresa.status === 'Pendente' ? 'secondary' : 'destructive'
                        }
                      >
                        {empresa.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(empresa.dataCriacao).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        {empresa.status === 'Pendente' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => reenviarSenha(empresa)}
                            className="h-8"
                          >
                            <Send className="h-3 w-3 mr-1" />
                            Reenviar
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => iniciarEdicao(empresa)}
                          className="h-8"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => excluirEmpresa(empresa.id)}
                          className="h-8"
                        >
                          <Trash className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Empresas;
