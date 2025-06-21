
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Car, User, Phone, Clock, Edit, Trash } from 'lucide-react';
import { toast } from 'sonner';

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

interface AgendamentoFormProps {
  isOpen: boolean;
  onClose: () => void;
  horarioSelecionado?: string;
  agendamento?: Agendamento; // Para edição
  onSave: (agendamento: Agendamento) => void;
  onDelete?: (id: number) => void;
}

// Componente para formulário de agendamento
const AgendamentoForm: React.FC<AgendamentoFormProps> = ({ 
  isOpen, 
  onClose, 
  horarioSelecionado,
  agendamento,
  onSave,
  onDelete
}) => {
  const [formData, setFormData] = useState({
    nomeCliente: agendamento?.nomeCliente || '',
    telefone: agendamento?.telefone || '',
    nomeCarro: agendamento?.nomeCarro || '',
    servico: agendamento?.servico || '',
    observacoes: agendamento?.observacoes || ''
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Lista de serviços disponíveis
  const servicosDisponiveis = [
    'Lavagem Simples',
    'Lavagem Completa', 
    'Enceramento',
    'Lavagem + Cera',
    'Detalhamento Completo',
    'Lavagem a Seco'
  ];

  // Função para salvar agendamento
  const salvarAgendamento = () => {
    if (!formData.nomeCliente || !formData.telefone || !formData.nomeCarro || !formData.servico) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const agendamentoData: Agendamento = {
      id: agendamento?.id,
      ...formData,
      horario: horarioSelecionado || agendamento?.horario || '',
      data: agendamento?.data || new Date().toISOString().split('T')[0]
    };

    onSave(agendamentoData);

    if (agendamento) {
      toast.success('Agendamento atualizado com sucesso!');
    } else {
      toast.success('Agendamento realizado com sucesso!');
    }
    
    // Resetar formulário
    setFormData({
      nomeCliente: '',
      telefone: '',
      nomeCarro: '',
      servico: '',
      observacoes: ''
    });
    
    onClose();
  };

  // Função para confirmar exclusão
  const confirmarExclusao = () => {
    if (agendamento?.id && onDelete) {
      onDelete(agendamento.id);
      toast.success('Agendamento excluído com sucesso!');
      onClose();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[95vw] max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {agendamento ? <Edit className="h-5 w-5 text-primary" /> : <Clock className="h-5 w-5 text-primary" />}
              {agendamento ? 'Editar Agendamento' : 'Novo Agendamento'}
            </DialogTitle>
            <DialogDescription>
              {horarioSelecionado ? (
                `${agendamento ? 'Editar agendamento' : 'Criar agendamento'} para ${horarioSelecionado}`
              ) : (
                agendamento ? 'Edite os dados do agendamento' : 'Preencha os dados do agendamento'
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="nomeCliente" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Nome do Cliente *
              </Label>
              <Input
                id="nomeCliente"
                value={formData.nomeCliente}
                onChange={(e) => setFormData({...formData, nomeCliente: e.target.value})}
                placeholder="Ex: João Silva"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="telefone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Telefone *
              </Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                placeholder="(11) 99999-9999"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="nomeCarro" className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                Nome do Carro *
              </Label>
              <Input
                id="nomeCarro"
                value={formData.nomeCarro}
                onChange={(e) => setFormData({...formData, nomeCarro: e.target.value})}
                placeholder="Ex: Fiat Uno, Hilux, Civic"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="servico">Serviço *</Label>
              <Select 
                value={formData.servico} 
                onValueChange={(value) => setFormData({...formData, servico: value})}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione o serviço" />
                </SelectTrigger>
                <SelectContent>
                  {servicosDisponiveis.map((servico) => (
                    <SelectItem key={servico} value={servico}>
                      {servico}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="observacoes">Observações (opcional)</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                placeholder="Informações adicionais sobre o serviço..."
                rows={3}
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            {/* Botões de ação para novo agendamento */}
            {!agendamento && (
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={salvarAgendamento}
                  className="flex-1 bg-primary hover:bg-primary-hover"
                >
                  Confirmar Agendamento
                </Button>
              </div>
            )}

            {/* Botões de ação para edição */}
            {agendamento && (
              <>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={onClose}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={salvarAgendamento}
                    className="flex-1 bg-primary hover:bg-primary-hover"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </Button>
                </div>
                
                <Button 
                  variant="destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Excluir Agendamento
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmação de exclusão */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="w-[95vw] max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash className="h-5 w-5" />
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive"
              onClick={confirmarExclusao}
              className="flex-1"
            >
              Sim, Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AgendamentoForm;
