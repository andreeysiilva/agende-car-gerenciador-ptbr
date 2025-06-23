
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";

interface AgendaControlsProps {
  visualizacao: 'semana' | 'mes';
  onVisualizacaoChange: (view: 'semana' | 'mes') => void;
  equipeSelecionada: string;
  onEquipeChange: (equipe: string) => void;
  equipesDisponiveis: Array<{ id: string; nome: string }>;
}

export function AgendaControls({
  visualizacao,
  onVisualizacaoChange,
  equipeSelecionada,
  onEquipeChange,
  equipesDisponiveis
}: AgendaControlsProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Button
          variant={visualizacao === 'semana' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onVisualizacaoChange('semana')}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Semana
        </Button>
        <Button
          variant={visualizacao === 'mes' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onVisualizacaoChange('mes')}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Mês
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Equipe:</label>
        <Select value={equipeSelecionada} onValueChange={onEquipeChange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {equipesDisponiveis.map((equipe) => (
              <SelectItem key={equipe.id} value={equipe.id}>
                {equipe.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
