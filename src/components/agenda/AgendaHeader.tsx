
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AgendaHeaderProps {
  onNovoAgendamento: () => void;
}

export function AgendaHeader({ onNovoAgendamento }: AgendaHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Agenda</h1>
        <p className="text-gray-600">Gerencie seus agendamentos</p>
      </div>
      
      <div className="flex items-center gap-2">
        <Button onClick={onNovoAgendamento}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Agendamento
        </Button>
      </div>
    </div>
  );
}
