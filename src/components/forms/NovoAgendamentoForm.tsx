
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { X, Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { TimeSlotPicker } from "./TimeSlotPicker";
import { isPastDate, isValidFutureDate } from "@/utils/holidaysAndDates";

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

  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    dataPreSelecionada ? new Date(dataPreSelecionada + 'T00:00:00') : undefined
  );
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

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    if (isPastDate(date)) {
      setDateError("Não é possível agendar para datas anteriores ao dia de hoje.");
      return;
    }

    setDateError("");
    setSelectedDate(date);
    const dateStr = format(date, 'yyyy-MM-dd');
    setFormData(prev => ({ ...prev, data_agendamento: dateStr, horario: "" }));
    setDatePickerOpen(false);
  };

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
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Dados do Cliente */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cliente_nome">Nome do Cliente *</Label>
                <Input
                  id="cliente_nome"
                  value={formData.cliente_nome}
                  onChange={(e) => handleChange("cliente_nome", e.target.value)}
                  placeholder="Nome completo"
                  required
                />
              </div>
              <div>
                <Label htmlFor="cliente_telefone">Telefone *</Label>
                <Input
                  id="cliente_telefone"
                  value={formData.cliente_telefone}
                  onChange={(e) => handleChange("cliente_telefone", e.target.value)}
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="cliente_email">Email</Label>
              <Input
                id="cliente_email"
                type="email"
                value={formData.cliente_email}
                onChange={(e) => handleChange("cliente_email", e.target.value)}
                placeholder="cliente@email.com"
              />
            </div>

            {/* Dados do Veículo */}
            <div>
              <Label htmlFor="nome_carro">Veículo *</Label>
              <Input
                id="nome_carro"
                value={formData.nome_carro}
                onChange={(e) => handleChange("nome_carro", e.target.value)}
                placeholder="Ex: Honda Civic 2020"
                required
              />
            </div>

            {/* Serviço */}
            <div>
              <Label htmlFor="servico">Serviço *</Label>
              <Select value={formData.servico} onValueChange={(value) => handleChange("servico", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um serviço" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {servicos.map((servico) => (
                    <SelectItem key={servico} value={servico}>
                      {servico}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Data com Date Picker */}
            <div>
              <Label>Data do Agendamento *</Label>
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecione uma data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={(date) => isPastDate(date)}
                    locale={ptBR}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {dateError && (
                <div className="text-sm text-red-500 mt-1">{dateError}</div>
              )}
            </div>

            {/* Horário com Time Slot Picker */}
            <TimeSlotPicker
              selectedDate={formData.data_agendamento}
              selectedTime={formData.horario}
              onTimeChange={handleTimeChange}
              agendamentos={agendamentos}
              horariosFuncionamento={horariosFuncionamento}
            />

            {/* Equipe */}
            <div>
              <Label htmlFor="equipe">Equipe</Label>
              <Select value={formData.equipe_id} onValueChange={(value) => handleChange("equipe_id", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma equipe" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {equipes.map((equipe) => (
                    <SelectItem key={equipe.id} value={equipe.id}>
                      {equipe.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Observações */}
            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => handleChange("observacoes", e.target.value)}
                placeholder="Informações adicionais..."
                rows={3}
              />
            </div>

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
