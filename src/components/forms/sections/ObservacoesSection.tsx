
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ObservacoesSectionProps {
  observacoes: string;
  onChange: (field: string, value: string) => void;
}

export function ObservacoesSection({
  observacoes,
  onChange
}: ObservacoesSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700">Observações</h3>
      
      <div>
        <Label>Observações Adicionais</Label>
        <Textarea
          value={observacoes}
          onChange={(e) => onChange('observacoes', e.target.value)}
          placeholder="Informações adicionais sobre o agendamento..."
          rows={3}
          className="mt-1"
        />
      </div>
    </div>
  );
}
