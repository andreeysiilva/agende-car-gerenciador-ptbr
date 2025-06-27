
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmado': return 'bg-green-100 text-green-800';
    case 'pendente': return 'bg-yellow-100 text-yellow-800';
    case 'concluido': return 'bg-blue-100 text-blue-800';
    case 'cancelado': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusText = (status: string) => {
  switch (status) {
    case 'confirmado': return 'Confirmado';
    case 'pendente': return 'Pendente';
    case 'concluido': return 'Concluído';
    case 'cancelado': return 'Cancelado';
    default: return status;
  }
};

export const formatarData = (data: string) => {
  return new Date(data).toLocaleDateString('pt-BR');
};

export const isDiaFuncionando = (data: string, horariosFuncionamento: Record<number, any>) => {
  const dayOfWeek = new Date(data).getDay();
  return horariosFuncionamento[dayOfWeek]?.funcionando || false;
};
