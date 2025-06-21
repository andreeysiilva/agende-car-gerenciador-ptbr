
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, CreditCard, Edit, Trash, Check, X } from 'lucide-react';
import { toast } from 'sonner';

// Interface para definir a estrutura de um plano
interface Plano {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  limitacoes: {
    agendamentosMes: number;
    usuarios: number;
    armazenamento: string;
    suportePrioridade: boolean;
    integrações: boolean;
  };
  ativo: boolean;
  dataCriacao: string;
}

// Dados mockados de planos para demonstração
const planosMock: Plano[] = [
  {
    id: 1,
    nome: 'Básico',
    descricao: 'Plano ideal para pequenas empresas que estão começando',
    preco: 49.90,
    limitacoes: {
      agendamentosMes: 100,
      usuarios: 2,
      armazenamento: '5GB',
      suportePrioridade: false,
      integrações: false
    },
    ativo: true,
    dataCriacao: '2024-01-01'
  },
  {
    id: 2,
    nome: 'Premium',
    descricao: 'Plano completo para empresas em crescimento',
    preco: 99.90,
    limitacoes: {
      agendamentosMes: 500,
      usuarios: 10,
      armazenamento: '50GB',
      suportePrioridade: true,
      integrações: true
    },
    ativo: true,
    dataCriacao: '2024-01-01'
  },
  {
    id: 3,
    nome: 'Enterprise',
    descricao: 'Solução completa para grandes empresas',
    preco: 199.90,
    limitacoes: {
      agendamentosMes: 2000,
      usuarios: 50,
      armazenamento: 'Ilimitado',
      suportePrioridade: true,
      integrações: true
    },
    ativo: true,
    dataCriacao: '2024-01-01'
  }
];

// Página para gerenciamento de planos de assinatura
const Planos: React.FC = () => {
  const [planos, setPlanos] = useState<Plano[]>(planosMock);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [planoEditando, setPlanoEditando] = useState<Plano | null>(null);
  
  // Estados do formulário
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    agendamentosMes: '',
    usuarios: '',
    armazenamento: '',
    suportePrioridade: false,
    integrações: false
  });

  // Função para resetar o formulário
  const resetarFormulario = () => {
    setFormData({
      nome: '',
      descricao: '',
      preco: '',
      agendamentosMes: '',
      usuarios: '',
      armazenamento: '',
      suportePrioridade: false,
      integrações: false
    });
    setPlanoEditando(null);
  };

  // Função para preparar edição de plano
  const iniciarEdicao = (plano: Plano) => {
    setPlanoEditando(plano);
    setFormData({
      nome: plano.nome,
      descricao: plano.descricao,
      preco: plano.preco.toString(),
      agendamentosMes: plano.limitacoes.agendamentosMes.toString(),
      usuarios: plano.limitacoes.usuarios.toString(),
      armazenamento: plano.limitacoes.armazenamento,
      suportePrioridade: plano.limitacoes.suportePrioridade,
      integrações: plano.limitacoes.integrações
    });
    setIsDialogOpen(true);
  };

  // Função para salvar plano (criar ou atualizar)
  const salvarPlano = () => {
    if (!formData.nome || !formData.descricao || !formData.preco || !formData.agendamentosMes || !formData.usuarios || !formData.armazenamento) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const dadosPlano = {
      nome: formData.nome,
      descricao: formData.descricao,
      preco: parseFloat(formData.preco),
      limitacoes: {
        agendamentosMes: parseInt(formData.agendamentosMes),
        usuarios: parseInt(formData.usuarios),
        armazenamento: formData.armazenamento,
        suportePrioridade: formData.suportePrioridade,
        integrações: formData.integrações
      }
    };

    if (planoEditando) {
      // Atualizar plano existente
      setPlanos(prev => prev.map(plano => 
        plano.id === planoEditando.id 
          ? { ...plano, ...dadosPlano }
          : plano
      ));
      toast.success('Plano atualizado com sucesso!');
    } else {
      // Criar novo plano
      const novoPlano: Plano = {
        id: planos.length + 1,
        ...dadosPlano,
        ativo: true,
        dataCriacao: new Date().toISOString().split('T')[0]
      };
      
      setPlanos(prev => [...prev, novoPlano]);
      toast.success('Plano criado com sucesso!');
    }

    setIsDialogOpen(false);
    resetarFormulario();
  };

  // Função para excluir plano
  const excluirPlano = (id: number) => {
    setPlanos(prev => prev.filter(plano => plano.id !== id));
    toast.success('Plano excluído com sucesso!');
  };

  // Função para alternar status do plano
  const alternarStatusPlano = (id: number) => {
    setPlanos(prev => prev.map(plano => 
      plano.id === id 
        ? { ...plano, ativo: !plano.ativo }
        : plano
    ));
    
    const plano = planos.find(p => p.id === id);
    toast.success(`Plano ${plano?.ativo ? 'desativado' : 'ativado'} com sucesso!`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cabeçalho da página */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Planos</h1>
          <p className="text-gray-600">
            Configure os planos de assinatura disponíveis na plataforma
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetarFormulario();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Novo Plano
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {planoEditando ? 'Editar Plano' : 'Criar Novo Plano'}
              </DialogTitle>
              <DialogDescription>
                {planoEditando 
                  ? 'Atualize as informações do plano de assinatura.'
                  : 'Configure um novo plano de assinatura.'
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
              <div>
                <Label htmlFor="nome">Nome do Plano *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  placeholder="Ex: Premium"
                />
              </div>
              
              <div>
                <Label htmlFor="descricao">Descrição *</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  placeholder="Descrição detalhada do plano"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="preco">Preço Mensal (R$) *</Label>
                <Input
                  id="preco"
                  type="number"
                  step="0.01"
                  value={formData.preco}
                  onChange={(e) => setFormData({...formData, preco: e.target.value})}
                  placeholder="99.90"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="agendamentos">Agendamentos/Mês *</Label>
                  <Input
                    id="agendamentos"
                    type="number"
                    value={formData.agendamentosMes}
                    onChange={(e) => setFormData({...formData, agendamentosMes: e.target.value})}
                    placeholder="500"
                  />
                </div>
                
                <div>
                  <Label htmlFor="usuarios">Usuários Simultâneos *</Label>
                  <Input
                    id="usuarios"
                    type="number"
                    value={formData.usuarios}
                    onChange={(e) => setFormData({...formData, usuarios: e.target.value})}
                    placeholder="10"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="armazenamento">Armazenamento *</Label>
                <Input
                  id="armazenamento"
                  value={formData.armazenamento}
                  onChange={(e) => setFormData({...formData, armazenamento: e.target.value})}
                  placeholder="50GB ou Ilimitado"
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="suportePrioridade"
                    checked={formData.suportePrioridade}
                    onChange={(e) => setFormData({...formData, suportePrioridade: e.target.checked})}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <Label htmlFor="suportePrioridade" className="text-sm">
                    Suporte Prioritário
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="integrações"
                    checked={formData.integrações}
                    onChange={(e) => setFormData({...formData, integrações: e.target.checked})}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <Label htmlFor="integrações" className="text-sm">
                    Integrações Avançadas
                  </Label>
                </div>
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
                onClick={salvarPlano}
                className="flex-1 bg-primary hover:bg-primary-600"
              >
                {planoEditando ? 'Atualizar' : 'Criar Plano'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cards com visão geral dos planos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {planos.filter(p => p.ativo).map((plano) => (
          <Card key={plano.id} className="dashboard-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  {plano.nome}
                </span>
                <Badge variant={plano.ativo ? 'default' : 'secondary'}>
                  {plano.ativo ? 'Ativo' : 'Inativo'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    R$ {plano.preco.toFixed(2)}
                    <span className="text-sm font-normal text-gray-500">/mês</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{plano.descricao}</p>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Agendamentos/mês:</span>
                    <span className="font-medium">{plano.limitacoes.agendamentosMes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Usuários:</span>
                    <span className="font-medium">{plano.limitacoes.usuarios}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Armazenamento:</span>
                    <span className="font-medium">{plano.limitacoes.armazenamento}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Suporte prioritário:</span>
                    {plano.limitacoes.suportePrioridade ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span>Integrações:</span>
                    {plano.limitacoes.integrações ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabela de todos os planos */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>Todos os Planos Configurados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plano</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Limitações</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data de Criação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {planos.map((plano) => (
                  <TableRow key={plano.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{plano.nome}</div>
                        <div className="text-sm text-gray-500">{plano.descricao}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">R$ {plano.preco.toFixed(2)}</div>
                      <div className="text-sm text-gray-500">por mês</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <div>{plano.limitacoes.agendamentosMes} agendamentos/mês</div>
                        <div>{plano.limitacoes.usuarios} usuários</div>
                        <div>{plano.limitacoes.armazenamento} storage</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={plano.ativo ? 'default' : 'secondary'}
                        className="cursor-pointer"
                        onClick={() => alternarStatusPlano(plano.id)}
                      >
                        {plano.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(plano.dataCriacao).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => iniciarEdicao(plano)}
                          className="h-8"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => excluirPlano(plano.id)}
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

export default Planos;
