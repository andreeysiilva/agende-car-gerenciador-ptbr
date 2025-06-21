
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Car, User, Phone, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface AgendamentoFormProps {
  isOpen: boolean;
  onClose: () => void;
  horarioSelecionado?: string;
}

// Componente para formulário de agendamento
const AgendamentoForm: React.FC<AgendamentoFormProps> = ({ 
  isOpen, 
  onClose, 
  horarioSelecionado 
}) => {
  const [formData, setFormData] = useState({
    nomeCliente: '',
    telefone: '',
    nomeCarro: '',
    servico: '',
    observacoes: ''
  });

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

    // Aqui seria integrado com o Supabase
    console.log('Novo agendamento:', {
      ...formData,
      horario: horarioSelecionado,
      data: new Date().toISOString()
    });

    toast.success('Agendamento realizado com sucesso!');
    
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Novo Agendamento
          </DialogTitle>
          <DialogDescription>
            {horarioSelecionado ? (
              `Criar agendamento para ${horarioSelecionado}`
            ) : (
              'Preencha os dados do agendamento'
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
            />
          </div>
          
          <div>
            <Label htmlFor="servico">Serviço *</Label>
            <Select 
              value={formData.servico} 
              onValueChange={(value) => setFormData({...formData, servico: value})}
            >
              <SelectTrigger>
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
            />
          </div>
        </div>
        
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
      </DialogContent>
    </Dialog>
  );
};

export default AgendamentoForm;
