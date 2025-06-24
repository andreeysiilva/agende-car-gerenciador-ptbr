
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ServicoSelectionSectionProps {
  servicoSelecionado: string;
  servicos: string[];
  onChange: (field: string, value: string) => void;
}

export function ServicoSelectionSection({ 
  servicoSelecionado, 
  servicos, 
  onChange 
}: ServicoSelectionSectionProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="servico">Serviço *</Label>
      <Select value={servicoSelecionado} onValueChange={(value) => onChange("servico", value)}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione o serviço" />
        </SelectTrigger>
        <SelectContent>
          {servicos.map((servico) => (
            <SelectItem key={servico} value={servico}>
              {servico}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
