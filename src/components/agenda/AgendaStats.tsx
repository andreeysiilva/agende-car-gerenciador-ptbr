
import { Card, CardContent } from "@/components/ui/card";

interface AgendaStatsProps {
  totalAgendamentos: number;
  agendamentosConfirmados: number;
  agendamentosPendentes: number;
}

export function AgendaStats({
  totalAgendamentos,
  agendamentosConfirmados,
  agendamentosPendentes
}: AgendaStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-primary">
            {totalAgendamentos}
          </div>
          <div className="text-sm text-gray-600">Total de Agendamentos</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-green-600">
            {agendamentosConfirmados}
          </div>
          <div className="text-sm text-gray-600">Confirmados</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {agendamentosPendentes}
          </div>
          <div className="text-sm text-gray-600">Pendentes</div>
        </CardContent>
      </Card>
    </div>
  );
}
