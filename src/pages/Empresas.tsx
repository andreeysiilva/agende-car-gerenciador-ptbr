
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Building2, Calendar, DollarSign, Users, ExternalLink, Upload, Image } from 'lucide-react';
import { toast } from 'sonner';

// Interface para empresas
interface Empresa {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  subdominio: string;
  plano: string;
  status: 'Ativo' | 'Inativo' | 'Suspenso';
  dataVencimento: string;
  logoUrl?: string;
}

// Dados mock das empresas cadastradas
const empresasMock: Empresa[] = [
  {
    id: 1,
    nome: 'Lava Rápido do Robson',
    email: 'robson@lavarapido.com',
    telefone: '(11) 99999-1234',
    endereco: 'Rua das Flores, 123',
    subdominio: 'robson.agendicar.com',
    plano: 'Premium',
    status: 'Ativo',
    dataVencimento: '2024-02-15',
    logoUrl: '/placeholder.svg'
  },
  {
    id: 2,
    nome: 'AutoLavagem Silva',
    email: 'silva@autolavagem.com',
    telefone: '(11) 99999-5678',
    endereco: 'Av. Principal, 456',
    subdominio: 'silva.agendicar.com',
    plano: 'Básico',
    status: 'Ativo',
    dataVencimento: '2024-01-30',
    logoUrl: '/placeholder.svg'
  },
  {
    id: 3,
    nome: 'Detalhamento Premium',
    email: 'contato@detalhamentopremium.com',
    telefone: '(11) 99999-9012',
    endereco: 'Rua dos Carros, 789',
    subdominio: 'detalhamento.agendicar.com',
    plano: 'Premium',
    status: 'Suspenso',
    dataVencimento: '2024-01-01',
    logoUrl: '/placeholder.svg'
  }
];

const Empresas: React.FC = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>(empresasMock);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');

  // Formulário para nova empresa
  const [novaEmpresa, setNovaEmpresa] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    plano: ''
  });

  // Função para gerar subdomínio automaticamente
  const gerarSubdominio = (nome: string) => {
    return nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .trim()
      .split(' ')[0] + '.agendicar.com';
  };

  // Função para lidar com upload de logo
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('O arquivo deve ter no máximo 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione uma imagem válida');
        return;
      }

      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Função para cadastrar nova empresa
  const cadastrarEmpresa = () => {
    if (!novaEmpresa.nome || !novaEmpresa.email || !novaEmpresa.telefone || !novaEmpresa.plano) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const subdominio = gerarSubdominio(novaEmpresa.nome);
    const novaEmpresaCompleta: Empresa = {
      id: empresas.length + 1,
      ...novaEmpresa,
      subdominio,
      status: 'Ativo',
      dataVencimento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      logoUrl: logoPreview || '/placeholder.svg'
    };

    setEmpresas([...empresas, novaEmpresaCompleta]);
    
    // Reset formulário
    setNovaEmpresa({
      nome: '',
      email: '',
      telefone: '',
      endereco: '',
      plano: ''
    });
    setLogoFile(null);
    setLogoPreview('');
    setDialogAberto(false);
    
    toast.success(`Empresa ${novaEmpresa.nome} cadastrada com sucesso! Subdomínio: ${subdominio}`);
  };

  // Função para abrir link do subdomínio
  const abrirSubdominio = (subdominio: string) => {
    window.open(`https://${subdominio}`, '_blank');
  };

  // Filtrar empresas por status
  const empresasFiltradas = empresas.filter(empresa => {
    if (filtroStatus === 'todos') return true;
    return empresa.status.toLowerCase() === filtroStatus;
  });

  // Estatísticas das empresas
  const estatisticas = {
    total: empresas.length,
    ativas: empresas.filter(e => e.status === 'Ativo').length,
    inativas: empresas.filter(e => e.status === 'Inativo').length,
    suspensas: empresas.filter(e => e.status === 'Suspenso').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Empresas</h1>
          <p className="text-gray-600">Cadastre e gerencie as empresas clientes</p>
        </div>
        
        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Nova Empresa
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-md mx-auto max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Cadastrar Nova Empresa</DialogTitle>
              <DialogDescription>
                Preencha os dados da empresa. O subdomínio será gerado automaticamente.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              {/* Upload de Logo */}
              <div className="space-y-2">
                <Label htmlFor="logo">Logo da Empresa</Label>
                <div className="flex flex-col items-center gap-3">
                  {logoPreview ? (
                    <div className="w-20 h-20 rounded-lg border-2 border-gray-200 overflow-hidden">
                      <img 
                        src={logoPreview} 
                        alt="Preview logo" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <Image className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  
                  <div className="relative">
                    <input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('logo')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Selecionar Logo
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="nome">Nome da Empresa *</Label>
                <Input
                  id="nome"
                  value={novaEmpresa.nome}
                  onChange={(e) => setNovaEmpresa({...novaEmpresa, nome: e.target.value})}
                  placeholder="Ex: Lava Rápido do João"
                />
                {novaEmpresa.nome && (
                  <p className="text-xs text-gray-500">
                    Subdomínio: {gerarSubdominio(novaEmpresa.nome)}
                  </p>
                )}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={novaEmpresa.email}
                  onChange={(e) => setNovaEmpresa({...novaEmpresa, email: e.target.value})}
                  placeholder="contato@empresa.com"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  value={novaEmpresa.telefone}
                  onChange={(e) => setNovaEmpresa({...novaEmpresa, telefone: e.target.value})}
                  placeholder="(11) 99999-9999"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  value={novaEmpresa.endereco}
                  onChange={(e) => setNovaEmpresa({...novaEmpresa, endereco: e.target.value})}
                  placeholder="Rua, número, bairro"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="plano">Plano *</Label>
                <Select value={novaEmpresa.plano} onValueChange={(value) => setNovaEmpresa({...novaEmpresa, plano: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o plano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Básico">Básico - R$ 99/mês</SelectItem>
                    <SelectItem value="Premium">Premium - R$ 199/mês</SelectItem>
                    <SelectItem value="Empresarial">Empresarial - R$ 299/mês</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setDialogAberto(false)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={cadastrarEmpresa} className="flex-1">
                Cadastrar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Empresas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-500" />
              <span className="text-2xl font-bold">{estatisticas.total}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Empresas Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-500" />
              <span className="text-2xl font-bold text-green-600">{estatisticas.ativas}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Empresas Suspensas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-red-500" />
              <span className="text-2xl font-bold text-red-600">{estatisticas.suspensas}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Receita Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-purple-500" />
              <span className="text-2xl font-bold text-purple-600">R$ 18.500</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Lista de Empresas</CardTitle>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as Empresas</SelectItem>
                <SelectItem value="ativo">Apenas Ativas</SelectItem>
                <SelectItem value="inativo">Apenas Inativas</SelectItem>
                <SelectItem value="suspenso">Apenas Suspensas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {/* Versão mobile - Cards */}
          <div className="block lg:hidden space-y-4 p-4">
            {empresasFiltradas.map((empresa) => (
              <Card key={empresa.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img 
                        src={empresa.logoUrl} 
                        alt={`Logo ${empresa.nome}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{empresa.nome}</h3>
                      <p className="text-sm text-gray-500">{empresa.email}</p>
                      <p className="text-sm text-gray-500">{empresa.telefone}</p>
                    </div>
                    <Badge variant={empresa.status === 'Ativo' ? 'default' : empresa.status === 'Suspenso' ? 'destructive' : 'secondary'}>
                      {empresa.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Plano:</span>
                      <span className="font-medium">{empresa.plano}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Vencimento:</span>
                      <span className="font-medium">{new Date(empresa.dataVencimento).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => abrirSubdominio(empresa.subdominio)}
                      className="w-full mt-3"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {empresa.subdominio}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Versão desktop - Tabela */}
          <div className="hidden lg:block">
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Subdomínio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {empresasFiltradas.map((empresa) => (
                    <TableRow key={empresa.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <img 
                              src={empresa.logoUrl} 
                              alt={`Logo ${empresa.nome}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{empresa.nome}</div>
                            <div className="text-sm text-gray-500">{empresa.endereco}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">{empresa.email}</div>
                          <div className="text-sm text-gray-500">{empresa.telefone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{empresa.plano}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={empresa.status === 'Ativo' ? 'default' : empresa.status === 'Suspenso' ? 'destructive' : 'secondary'}>
                          {empresa.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(empresa.dataVencimento).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => abrirSubdominio(empresa.subdominio)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          {empresa.subdominio}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Empresas;
