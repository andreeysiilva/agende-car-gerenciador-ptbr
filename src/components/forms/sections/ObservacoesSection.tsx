
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ObservacoesSectionProps {
  observacoes: string;
  onChange: (field: string, value: string) => void;
}

export function ObservacoesSection({ observacoes, onChange }: ObservacoesSectionProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700">Observações</h3>
      <div>
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          value={observacoes}
          onChange={(e) => onChange("observacoes", e.target.value)}
          placeholder="Informações adicionais..."
          rows={3}
        />
      </div>
    </div>
  );
}
