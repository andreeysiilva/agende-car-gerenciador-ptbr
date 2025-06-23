
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { isPastDate } from "@/utils/holidaysAndDates";
import { ClienteInfoSection } from "./sections/ClienteInfoSection";
import { VeiculoInfoSection } from "./sections/VeiculoInfoSection";
import { ServicoSelectionSection } from "./sections/ServicoSelectionSection";
import { DataHorarioSection } from "./sections/DataHorarioSection";
import { EquipeSelectionSection } from "./sections/EquipeSelectionSection";
import { ObservacoesSection } from "./sections/ObservacoesSection";

interface NovoAgendamentoFormProps {
  onClose: () => void;
  onSave: (agendamento: any) => void;
  clientePreSelecionado?: any;
  dataPreSelecionada?: string;
  horarioPreSelecionado?: string;
  agendamentos?: any[];
  horariosFuncionamento?: {
    [key: number]: {
      funcionando: boolean;
      abertura: string;
      fechamento: string;
    };
  };
}

export function NovoAgendamentoForm({ 
  onClose, 
  onSave, 
  clientePreSelecionado,
  dataPreSelecionada,
  horarioPreSelecionado,
  agendamentos = [],
  horariosFuncionamento
}: NovoAgendamentoFormProps) {
  const [formData, setFormData] = useState({
    cliente_nome: clientePreSelecionado?.nome || "",
    cliente_telefone: clientePreSelecionado?.telefone || "",
    cliente_email: clientePreSelecionado?.email || "",
    nome_carro: "",
    servico: "",
    data_agendamento: dataPreSelecionada || "",
    horario: horarioPreSelecionado || "",
    equipe_id: "",
    observacoes: ""
  });

  const [dateError, setDateError] = useState("");

  // Dados mockados - serão substituídos por dados do Supabase
  const servicos = [
    "Lavagem Completa",
    "Lavagem Simples",
    "Enceramento",
    "Lavagem e Enceramento",
    "Detalhamento",
    "Lavagem Seca"
  ];

  const equipes = [
    { id: "1", nome: "Equipe Principal" },
    { id: "2", nome: "Equipe A - Lavagem Rápida" },
    { id: "3", nome: "Equipe B - Detalhamento" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação de data
    if (formData.data_agendamento && isPastDate(new Date(formData.data_agendamento + 'T00:00:00'))) {
      setDateError("Não é possível agendar para datas anteriores ao dia de hoje.");
      return;
    }

    // Validação básica
    if (!formData.cliente_nome || !formData.cliente_telefone || !formData.nome_carro || 
        !formData.servico || !formData.data_agendamento || !formData.horario) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Criar objeto do agendamento
    const novoAgendamento = {
      id: Date.now().toString(), // ID temporário
      nome_cliente: formData.cliente_nome,
      telefone: formData.cliente_telefone,
      email: formData.cliente_email,
      nome_carro: formData.nome_carro,
      servico: formData.servico,
      data_agendamento: formData.data_agendamento,
      horario: formData.horario,
      equipe_id: formData.equipe_id,
      observacoes: formData.observacoes,
      status: "confirmado"
    };

    onSave(novoAgendamento);
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (date: string) => {
    setFormData(prev => ({ ...prev, data_agendamento: date, horario: "" }));
  };

  const handleTimeChange = (time: string) => {
    setFormData(prev => ({ ...prev, horario: time }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Novo Agendamento</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <ClienteInfoSection
              formData={{
                cliente_nome: formData.cliente_nome,
                cliente_telefone: formData.cliente_telefone,
                cliente_email: formData.cliente_email
              }}
              onChange={handleChange}
            />

            <VeiculoInfoSection
              nomeCarro={formData.nome_carro}
              onChange={handleChange}
            />

            <ServicoSelectionSection
              servicoSelecionado={formData.servico}
              servicos={servicos}
              onChange={handleChange}
            />

            <DataHorarioSection
              selectedDate={formData.data_agendamento}
              selectedTime={formData.horario}
              agendamentos={agendamentos}
              horariosFuncionamento={horariosFuncionamento}
              onDateChange={handleDateChange}
              onTimeChange={handleTimeChange}
              dateError={dateError}
              setDateError={setDateError}
            />

            <EquipeSelectionSection
              equipeSelecionada={formData.equipe_id}
              equipes={equipes}
              onChange={handleChange}
            />

            <ObservacoesSection
              observacoes={formData.observacoes}
              onChange={handleChange}
            />

            {/* Botões */}
            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                Salvar Agendamento
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
