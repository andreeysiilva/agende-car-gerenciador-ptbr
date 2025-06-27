
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Building2, Calendar, DollarSign, Users, ExternalLink, Upload, Image, Copy, Eye, EyeOff, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { useEmpresas, NovaEmpresaData } from '@/hooks/useEmpresas';

const Empresas: React.FC = () => {
  const { empresas, isLoading, criarEmpresa } = useEmpresas();
  
  const [dialogAberto, setDialogAberto] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [credenciaisGeradas, setCredenciaisGeradas] = useState<{
    email: string;
    senha: string;
    subdominio: string;
  } | null>(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [criandoEmpresa, setCriandoEmpresa] = useState(false);

  // Formulário para nova empresa
  const [novaEmpresa, setNovaEmpresa] = useState<NovaEmpresaData>({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    plano: '',
    telegramChatId: ''
  });

  // Função para gerar subdomínio automaticamente
  const gerarSubdominio = (nome: string) => {
    return nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .trim()
      .split(' ')[0] + '.agendicar.com.br';
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
  const cadastrarEmpresa = async () => {
    if (!novaEmpresa.nome || !novaEmpresa.email || !novaEmpresa.telefone || !novaEmpresa.plano) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setCriandoEmpresa(true);

    try {
      const dadosEmpresa: NovaEmpresaData = {
        ...novaEmpresa,
        logoUrl: logoPreview || undefined
      };

      const resultado = await criarEmpresa(dadosEmpresa);

      if (resultado) {
        setCredenciaisGeradas(resultado.credenciais);
        
        // Reset formulário
        setNovaEmpresa({
          nome: '',
          email: '',
          telefone: '',
          endereco: '',
          plano: '',
          telegramChatId: ''
        });
        setLogoFile(null);
        setLogoPreview('');
      }
    } catch (error) {
      console.error('Erro ao cadastrar empresa:', error);
    } finally {
      setCriandoEmpresa(false);
    }
  };

  // Função para copiar credenciais
  const copiarCredenciais = (texto: string) => {
    navigator.clipboard.writeText(texto);
    toast.success('Copiado para a área de transferência!');
  };

  // Função para fechar dialog e limpar credenciais
  const fecharDialog = () => {
    setDialogAberto(false);
    setCredenciaisGeradas(null);
  };

  // Função para abrir link do subdomínio
  const abrirSubdominio = (subdominio: string) => {
    window.open(`https://${subdominio}.agendicar.com.br`, '_blank');
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
              <DialogTitle>
                {credenciaisGeradas ? 'Empresa Criada com Sucesso!' : 'Cadastrar Nova Empresa'}
              </DialogTitle>
              <DialogDescription>
                {credenciaisGeradas 
                  ? 'Anote as credenciais de acesso da empresa criada:'
                  : 'Preencha os dados da empresa. O subdomínio será gerado automaticamente.'
                }
              </DialogDescription>
            </DialogHeader>
            
            {credenciaisGeradas ? (
              // Exibir credenciais geradas
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-3">Credenciais de Acesso</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-green-700">Email de Login:</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input 
                          value={credenciaisGeradas.email} 
                          readOnly 
                          className="bg-white text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copiarCredenciais(credenciaisGeradas.email)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-green-700">Senha Temporária:</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input 
                          value={credenciaisGeradas.senha} 
                          type={mostrarSenha ? 'text' : 'password'}
                          readOnly 
                          className="bg-white text-sm font-mono"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setMostrarSenha(!mostrarSenha)}
                        >
                          {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copiarCredenciais(credenciaisGeradas.senha)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-green-700">Subdomínio:</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input 
                          value={credenciaisGeradas.subdominio} 
                          readOnly 
                          className="bg-white text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copiarCredenciais(credenciaisGeradas.subdominio)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-sm text-yellow-800">
                      <strong>Importante:</strong> A empresa deve alterar a senha temporária no primeiro acesso.
                    </p>
                  </div>
                </div>
                
                <Button onClick={fecharDialog} className="w-full">
                  Fechar
                </Button>
              </div>
            ) : (
              // Formulário de nova empresa
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
                    disabled={criandoEmpresa}
                  />
                  {novaEmpresa.nome && (
                    <p className="text-xs text-gray-500">
                      Subdomínio: {gerarSubdominio(novaEmpresa.nome)}
                    </p>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="email">E-mail (será o login da empresa) *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={novaEmpresa.email}
                    onChange={(e) => setNovaEmpresa({...novaEmpresa, email: e.target.value})}
                    placeholder="contato@empresa.com"
                    disabled={criandoEmpresa}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input
                    id="telefone"
                    value={novaEmpresa.telefone}
                    onChange={(e) => setNovaEmpresa({...novaEmpresa, telefone: e.target.value})}
                    placeholder="(11) 99999-9999"
                    disabled={criandoEmpresa}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Input
                    id="endereco"
                    value={novaEmpresa.endereco}
                    onChange={(e) => setNovaEmpresa({...novaEmpresa, endereco: e.target.value})}
                    placeholder="Rua, número, bairro"
                    disabled={criandoEmpresa}
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="telegramChatId">Chat ID do Telegram</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Chat ID para envio automático da senha via Telegram.
                            <br />
                            Para obter: envie /start para @userinfobot no Telegram
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input
                    id="telegramChatId"
                    value={novaEmpresa.telegramChatId}
                    onChange={(e) => setNovaEmpresa({...novaEmpresa, telegramChatId: e.target.value})}
                    placeholder="Ex: 123456789 (opcional)"
                    disabled={criandoEmpresa}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="plano">Plano *</Label>
                  <Select 
                    value={novaEmpresa.plano} 
                    onValueChange={(value) => setNovaEmpresa({...novaEmpresa, plano: value})}
                    disabled={criandoEmpresa}
                  >
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
                
                <div className="flex gap-3 mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setDialogAberto(false)} 
                    className="flex-1"
                    disabled={criandoEmpresa}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={cadastrarEmpresa} 
                    className="flex-1"
                    disabled={criandoEmpresa}
                  >
                    {criandoEmpresa ? 'Criando...' : 'Cadastrar'}
                  </Button>
                </div>
              </div>
            )}
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

      {/* Lista de Empresas */}
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
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Carregando empresas...</span>
            </div>
          ) : (
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
                  {empresasFiltradas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        Nenhuma empresa encontrada
                      </TableCell>
                    </TableRow>
                  ) : (
                    empresasFiltradas.map((empresa) => (
                      <TableRow key={empresa.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              <img 
                                src={empresa.logo_url || '/placeholder.svg'} 
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
                          <Badge variant="outline">Premium</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={empresa.status === 'Ativo' ? 'default' : empresa.status === 'Suspenso' ? 'destructive' : 'secondary'}>
                            {empresa.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {empresa.data_vencimento ? new Date(empresa.data_vencimento).toLocaleDateString('pt-BR') : '-'}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => abrirSubdominio(empresa.subdominio)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            {empresa.subdominio}.agendicar.com.br
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Empresas;
