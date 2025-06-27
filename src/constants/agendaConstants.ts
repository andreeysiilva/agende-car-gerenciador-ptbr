
export const servicosDisponiveis = [
  "Lavagem Completa",
  "Lavagem Simples", 
  "Enceramento",
  "Lavagem e Enceramento",
  "Detalhamento",
  "Lavagem Seca"
];

export const equipesDisponiveis = [
  { id: "all", nome: "Todas as Equipes" },
  { id: "1", nome: "Equipe Principal" },
  { id: "2", nome: "Equipe A - Lavagem Rápida" },
  { id: "3", nome: "Equipe B - Detalhamento" }
];

export const horariosFuncionamento = {
  0: { funcionando: false, abertura: "08:00", fechamento: "18:00" }, // Domingo
  1: { funcionando: true, abertura: "08:00", fechamento: "18:00" },  // Segunda
  2: { funcionando: true, abertura: "08:00", fechamento: "18:00" },  // Terça
  3: { funcionando: true, abertura: "08:00", fechamento: "18:00" },  // Quarta
  4: { funcionando: true, abertura: "08:00", fechamento: "18:00" },  // Quinta
  5: { funcionando: true, abertura: "08:00", fechamento: "18:00" },  // Sexta
  6: { funcionando: true, abertura: "08:00", fechamento: "16:00" }   // Sábado
};
