
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700">Serviço</h3>
      
      <div>
        <Label>Serviço *</Label>
        <Select 
          value={servicoSelecionado} 
          onValueChange={(value) => onChange('servico', value)}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Selecione o serviço" />
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
    </div>
  );
}
