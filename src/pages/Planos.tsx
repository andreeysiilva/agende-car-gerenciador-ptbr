
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash, Check, X, CreditCard, Users, Calendar, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

// Interface para planos
interface Plano {
  id: number;
  nome: string;
  preco: number;
  descricao: string;
  caracteristicas: string[];
  limite_agendamentos: number;
  limite_usuarios: number;
  suporte: string;
  ativo: boolean;
  popular?: boolean;
}

// Dados mock dos planos
const planosMock: Plano[] = [
  {
    id: 1,
    nome: 'Básico',
    preco: 99.90,
    descricao: 'Ideal para pequenos negócios que estão começando',
    caracteristicas: [
      'Até 100 agendamentos por mês',
      '1 usuário',
      'Agenda online',
      'Notificações SMS',
      'Relatórios básicos',
      'Suporte via email'
    ],
    limite_agendamentos: 100,
    limite_usuarios: 1,
    suporte: 'Email',
    ativo: true
  },
  {
    id: 2,
    nome: 'Premium',
    preco: 199.90,
    descricao: 'Para empresas em crescimento que precisam de mais recursos',
    caracteristicas: [
      'Até 500 agendamentos por mês',
      '3 usuários',
      'Agenda online personalizada',
      'Notificações SMS e WhatsApp',
      'Relatórios avançados',
      'Integração com redes sociais',
      'Suporte prioritário'
    ],
    limite_agendamentos: 500,
    limite_usuarios: 3,
    suporte: 'Telefone e Email',
    ativo: true,
    popular: true
  },
  {
    id: 3,
    nome: 'Empresarial',
    preco: 299.90,
    descricao: 'Solução completa para empresas estabelecidas',
    caracteristicas: [
      'Agendamentos ilimitados',
      'Usuários ilimitados',
      'Multi-localização',
      'API personalizada',
      'White-label disponível',
      'Relatórios personalizados',
      'Suporte 24/7',
      'Gerente de conta dedicado'
    ],
    limite_agendamentos: -1, // -1 = ilimitado
    limite_usuarios: -1,
    suporte: '24/7',
    ativo: true
  }
];

const Planos: React.FC = () => {
  const [planos, setPlanos] = useState<Plano[]>(planosMock);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [planoEditando, setPlanoEditando] = useState<Plano | null>(null);

  // Formulário para novo/editar plano
  const [formPlano, setFormPlano] = useState({
    nome: '',
    preco: '',
    descricao: '',
    caracteristicas: '',
    limite_agendamentos: '',
    limite_usuarios: '',
    suporte: ''
  });

  // Função para abrir dialog de edição
  const editarPlano = (plano: Plano) => {
    setPlanoEditando(plano);
    setFormPlano({
      nome: plano.nome,
      preco: plano.preco.toString(),
      descricao: plano.descricao,
      caracteristicas: plano.caracteristicas.join('\n'),
      limite_agendamentos: plano.limite_agendamentos.toString(),
      limite_usuarios: plano.limite_usuarios.toString(),
      suporte: plano.suporte
    });
    setDialogAberto(true);
  };

  // Função para criar novo plano
  const novoPlano = () => {
    setPlanoEditando(null);
    setFormPlano({
      nome: '',
      preco: '',
      descricao: '',
      caracteristicas: '',
      limite_agendamentos: '',
      limite_usuarios: '',
      suporte: ''
    });
    setDialogAberto(true);
  };

  // Função para salvar plano
  const salvarPlano = () => {
    if (!formPlano.nome || !formPlano.preco || !formPlano.descricao) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const caracteristicasArray = formPlano.caracteristicas
      .split('\n')
      .filter(item => item.trim() !== '');

    const planoData: Plano = {
      id: planoEditando ? planoEditando.id : planos.length + 1,
      nome: formPlano.nome,
      preco: parseFloat(formPlano.preco),
      descricao: formPlano.descricao,
      caracteristicas: caracteristicasArray,
      limite_agendamentos: parseInt(formPlano.limite_agendamentos),
      limite_usuarios: parseInt(formPlano.limite_usuarios),
      suporte: formPlano.suporte,
      ativo: true
    };

    if (planoEditando) {
      setPlanos(planos.map(p => p.id === planoEditando.id ? planoData : p));
      toast.success('Plano atualizado com sucesso!');
    } else {
      setPlanos([...planos, planoData]);
      toast.success('Novo plano criado com sucesso!');
    }

    setDialogAberto(false);
  };

  // Função para alternar status do plano
  const alternarStatusPlano = (id: number) => {
    setPlanos(planos.map(p => 
      p.id === id ? { ...p, ativo: !p.ativo } : p
    ));
    const plano = planos.find(p => p.id === id);
    toast.success(`Plano ${plano?.ativo ? 'desativado' : 'ativado'} com sucesso!`);
  };

  // Função para excluir plano
  const excluirPlano = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este plano?')) {
      setPlanos(planos.filter(p => p.id !== id));
      toast.success('Plano excluído com sucesso!');
    }
  };

  // Estatísticas dos planos
  const estatisticas = {
    total: planos.length,
    ativos: planos.filter(p => p.ativo).length,
    receita: planos.filter(p => p.ativo).reduce((acc, p) => acc + p.preco, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Planos</h1>
          <p className="text-gray-600">Configure os planos de assinatura disponíveis</p>
        </div>
        
        <Button onClick={novoPlano} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Novo Plano
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Planos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-blue-500" />
              <span className="text-2xl font-bold">{estatisticas.total}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Planos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-2xl font-bold text-green-600">{estatisticas.ativos}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Receita Potencial</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-purple-500" />
              <span className="text-2xl font-bold text-purple-600">
                R$ {estatisticas.receita.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Planos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {planos.map((plano) => (
          <Card key={plano.id} className={`relative ${plano.popular ? 'ring-2 ring-blue-500' : ''} ${!plano.ativo ? 'opacity-60' : ''}`}>
            {plano.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500 text-white">Mais Popular</Badge>
              </div>
            )}
            
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{plano.nome}</CardTitle>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-bold">R$ {plano.preco.toFixed(2).replace('.', ',')}</span>
                    <span className="text-gray-500">/mês</span>
                  </div>
                </div>
                <Badge variant={plano.ativo ? 'default' : 'secondary'}>
                  {plano.ativo ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mt-2">{plano.descricao}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Características */}
              <div className="space-y-2">
                {plano.caracteristicas.map((caracteristica, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{caracteristica}</span>
                  </div>
                ))}
              </div>

              {/* Limites */}
              <div className="pt-4 border-t space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">
                    {plano.limite_agendamentos === -1 ? 'Agendamentos ilimitados' : `${plano.limite_agendamentos} agendamentos/mês`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">
                    {plano.limite_usuarios === -1 ? 'Usuários ilimitados' : `${plano.limite_usuarios} usuário(s)`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Smartphone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Suporte: {plano.suporte}</span>
                </div>
              </div>

              {/* Ações */}
              <div className="pt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => editarPlano(plano)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant={plano.ativo ? "secondary" : "default"}
                  size="sm"
                  onClick={() => alternarStatusPlano(plano.id)}
                  className="flex-1"
                >
                  {plano.ativo ? <X className="h-4 w-4 mr-1" /> : <Check className="h-4 w-4 mr-1" />}
                  {plano.ativo ? 'Desativar' : 'Ativar'}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => excluirPlano(plano.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog para criar/editar plano */}
      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent className="w-[95vw] max-w-md mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{planoEditando ? 'Editar Plano' : 'Novo Plano'}</DialogTitle>
            <DialogDescription>
              {planoEditando ? 'Atualize as informações do plano' : 'Crie um novo plano de assinatura'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome do Plano *</Label>
              <Input
                id="nome"
                value={formPlano.nome}
                onChange={(e) => setFormPlano({...formPlano, nome: e.target.value})}
                placeholder="Ex: Básico, Premium"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="preco">Preço Mensal (R$) *</Label>
              <Input
                id="preco"
                type="number"
                step="0.01"
                value={formPlano.preco}
                onChange={(e) => setFormPlano({...formPlano, preco: e.target.value})}
                placeholder="99.90"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Textarea
                id="descricao"
                value={formPlano.descricao}
                onChange={(e) => setFormPlano({...formPlano, descricao: e.target.value})}
                placeholder="Descrição do plano"
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="caracteristicas">Características (uma por linha)</Label>
              <Textarea
                id="caracteristicas"
                value={formPlano.caracteristicas}
                onChange={(e) => setFormPlano({...formPlano, caracteristicas: e.target.value})}
                placeholder="Agenda online&#10;Notificações SMS&#10;Relatórios básicos"
                rows={5}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="limite_agendamentos">Limite de Agendamentos (-1 = ilimitado)</Label>
                <Input
                  id="limite_agendamentos"
                  type="number"
                  value={formPlano.limite_agendamentos}
                  onChange={(e) => setFormPlano({...formPlano, limite_agendamentos: e.target.value})}
                  placeholder="100"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="limite_usuarios">Limite de Usuários (-1 = ilimitado)</Label>
                <Input
                  id="limite_usuarios"
                  type="number"
                  value={formPlano.limite_usuarios}
                  onChange={(e) => setFormPlano({...formPlano, limite_usuarios: e.target.value})}
                  placeholder="1"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="suporte">Tipo de Suporte</Label>
              <Input
                id="suporte"
                value={formPlano.suporte}
                onChange={(e) => setFormPlano({...formPlano, suporte: e.target.value})}
                placeholder="Email, Telefone, 24/7"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setDialogAberto(false)} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={salvarPlano} className="flex-1">
              {planoEditando ? 'Atualizar' : 'Criar'} Plano
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Planos;
