
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Plus, ArrowLeft, ArrowRight, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AgendamentoForm from '@/components/AgendamentoForm';
import { toast } from 'sonner';

// Interface para agendamentos
interface Agendamento {
  id?: number;
  nomeCliente: string;
  telefone: string;
  nomeCarro: string;
  servico: string;
  observacoes: string;
  horario: string;
  data: string;
}

// Interface para horários da agenda
interface HorarioAgenda {
  hora: string;
  disponivel: boolean;
  agendamento?: Agendamento;
}

const ClienteAgenda = () => {
  const [dataAtual, setDataAtual] = useState(new Date());
  const [filtroServico, setFiltroServico] = useState('todos');
  const [visualizacao, setVisualizacao] = useState<'dia' | 'semana' | 'mes'>('dia');
  const [agendamentoFormAberto, setAgendamentoFormAberto] = useState(false);
  const [horarioSelecionado, setHorarioSelecionado] = useState<string>('');
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState<Agendamento | undefined>();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([
    {
      id: 1,
      nomeCliente: 'João Silva',
      telefone: '(11) 99999-1234',
      nomeCarro: 'Fiat Uno',
      servico: 'Lavagem Completa',
      observacoes: '',
      horario: '09:00',
      data: new Date().toISOString().split('T')[0]
    },
    {
      id: 2,
      nomeCliente: 'Maria Santos',
      telefone: '(11) 99999-5678',
      nomeCarro: 'Civic',
      servico: 'Enceramento',
      observacoes: '',
      horario: '11:30',
      data: new Date().toISOString().split('T')[0]
    },
    {
      id: 3,
      nomeCliente: 'Pedro Costa',
      telefone: '(11) 99999-9012',
      nomeCarro: 'Hilux',
      servico: 'Lavagem + Cera',
      observacoes: '',
      horario: '14:00',
      data: new Date().toISOString().split('T')[0]
    }
  ]);

  // Horários disponíveis
  const horariosDisponiveis = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00'
  ];

  // Criar array de horários para o dia atual
  const agendamentosDia: HorarioAgenda[] = horariosDisponiveis.map(hora => {
    const agendamentoDoHorario = agendamentos.find(
      a => a.horario === hora && a.data === dataAtual.toISOString().split('T')[0]
    );
    
    return {
      hora,
      disponivel: !agendamentoDoHorario,
      agendamento: agendamentoDoHorario
    };
  });

  // Navegação de data
  const navegarData = (direcao: 'anterior' | 'proximo') => {
    const novaData = new Date(dataAtual);
    if (visualizacao === 'dia') {
      novaData.setDate(novaData.getDate() + (direcao === 'proximo' ? 1 : -1));
    } else if (visualizacao === 'semana') {
      novaData.setDate(novaData.getDate() + (direcao === 'proximo' ? 7 : -7));
    } else {
      novaData.setMonth(novaData.getMonth() + (direcao === 'proximo' ? 1 : -1));
    }
    setDataAtual(novaData);
  };

  // Formatação de data
  const formatarData = (data: Date) => {
    return data.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Função para criar novo agendamento
  const criarAgendamento = (horario: string) => {
    setHorarioSelecionado(horario);
    setAgendamentoSelecionado(undefined);
    setAgendamentoFormAberto(true);
  };

  // Função para editar agendamento existente
  const editarAgendamento = (agendamento: Agendamento) => {
    setAgendamentoSelecionado(agendamento);
    setHorarioSelecionado('');
    setAgendamentoFormAberto(true);
  };

  // Função para salvar agendamento
  const salvarAgendamento = (novoAgendamento: Agendamento) => {
    if (novoAgendamento.id) {
      // Editar agendamento existente
      setAgendamentos(prev => 
        prev.map(a => a.id === novoAgendamento.id ? novoAgendamento : a)
      );
    } else {
      // Criar novo agendamento
      const id = Math.max(...agendamentos.map(a => a.id || 0), 0) + 1;
      setAgendamentos(prev => [...prev, { 
        ...novoAgendamento, 
        id,
        data: dataAtual.toISOString().split('T')[0]
      }]);
    }
  };

  // Função para excluir agendamento
  const excluirAgendamento = (id: number) => {
    setAgendamentos(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-text-primary">Agenda</h1>
            <Button 
              size="sm" 
              className="bg-primary hover:bg-primary-hover"
              onClick={() => {
                setHorarioSelecionado('');
                setAgendamentoSelecionado(undefined);
                setAgendamentoFormAberto(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Agendamento
            </Button>
          </div>
          
          {/* Controles de navegação e filtros */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 flex-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navegarData('anterior')}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex-1 text-center">
                <h2 className="text-sm font-medium text-text-primary">
                  {formatarData(dataAtual)}
                </h2>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => navegarData('proximo')}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Select value={visualizacao} onValueChange={(value: 'dia' | 'semana' | 'mes') => setVisualizacao(value)}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dia">Dia</SelectItem>
                  <SelectItem value="semana">Semana</SelectItem>
                  <SelectItem value="mes">Mês</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filtroServico} onValueChange={setFiltroServico}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="lavagem">Lavagem</SelectItem>
                  <SelectItem value="enceramento">Enceramento</SelectItem>
                  <SelectItem value="detalhamento">Detalhamento</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo principal - Visualização por dia */}
      <main className="p-4 max-w-4xl mx-auto">
        {visualizacao === 'dia' && (
          <div className="space-y-4">
            {/* Resumo do dia */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-text-primary">
                  Resumo do Dia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-secondary">
                      {agendamentosDia.filter(h => !h.disponivel).length}
                    </p>
                    <p className="text-sm text-text-secondary">Agendados</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      {agendamentosDia.filter(h => h.disponivel).length}
                    </p>
                    <p className="text-sm text-text-secondary">Disponíveis</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-warning">
                      R$ 850,00
                    </p>
                    <p className="text-sm text-text-secondary">Estimado</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Grade de horários */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-text-primary">
                  Horários
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {agendamentosDia.map((horario) => (
                    <div
                      key={horario.hora}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        horario.disponivel 
                          ? 'border-green-200 bg-green-50 hover:border-green-300 hover:bg-green-100' 
                          : 'border-red-200 bg-red-50 hover:border-red-300 hover:bg-red-100'
                      }`}
                      onClick={() => {
                        if (horario.disponivel) {
                          criarAgendamento(horario.hora);
                        } else if (horario.agendamento) {
                          editarAgendamento(horario.agendamento);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span className="font-medium">{horario.hora}</span>
                        </div>
                        {horario.disponivel ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            Livre
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="bg-red-100 text-red-700">
                            Ocupado
                          </Badge>
                        )}
                      </div>
                      
                      {!horario.disponivel && horario.agendamento && (
                        <div className="space-y-1">
                          <p className="font-medium text-sm text-text-primary">
                            {horario.agendamento.nomeCliente}
                          </p>
                          <p className="text-xs text-text-secondary">
                            {horario.agendamento.servico}
                          </p>
                          <p className="text-xs text-text-secondary">
                            {horario.agendamento.nomeCarro}
                          </p>
                          <p className="text-xs text-text-secondary">
                            {horario.agendamento.telefone}
                          </p>
                        </div>
                      )}
                      
                      {horario.disponivel && (
                        <div className="text-center">
                          <Plus className="h-5 w-5 mx-auto text-green-600" />
                          <p className="text-xs text-green-600 mt-1">
                            Clique para agendar
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Visualizações semana e mês - placeholder */}
        {visualizacao === 'semana' && (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-text-secondary" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Visualização Semanal
              </h3>
              <p className="text-text-secondary">
                Funcionalidade em desenvolvimento
              </p>
            </CardContent>
          </Card>
        )}

        {visualizacao === 'mes' && (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-text-secondary" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Visualização Mensal
              </h3>
              <p className="text-text-secondary">
                Funcionalidade em desenvolvimento
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Formulário de agendamento */}
      <AgendamentoForm
        isOpen={agendamentoFormAberto}
        onClose={() => setAgendamentoFormAberto(false)}
        horarioSelecionado={horarioSelecionado}
        agendamento={agendamentoSelecionado}
        onSave={salvarAgendamento}
        onDelete={excluirAgendamento}
      />
    </div>
  );
};

export default ClienteAgenda;
