
# Sistema de Agendamento - Lava Jato

Sistema completo de agendamento para lava-jatos com interface moderna e intuitiva.

## 🚀 Funcionalidades Principais

### ✅ Gestão de Agendamentos
- Calendário mensal e semanal
- Seleção inteligente de datas e horários
- Validação automática de conflitos
- Suporte a timezone brasileiro
- Filtros por serviço e equipe

### ✅ Cadastro de Clientes
- Autocompletar de veículos brasileiros
- Histórico de agendamentos
- Dados de contato organizados

### ✅ Gestão de Equipes
- Atribuição automática por serviço
- Controle de disponibilidade
- Relatórios de performance

### ✅ Sistema Financeiro
- Controle de receitas e despesas
- Relatórios detalhados
- Múltiplas formas de pagamento

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + Shadcn/UI
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Datas**: date-fns com suporte a timezone brasileiro
- **Estado**: React Query para cache inteligente
- **Roteamento**: React Router DOM

## 📅 Sistema de Timezone e Datas

### Principais Utilitários (`src/utils/dateTimeUtils.ts`)

```typescript
// Formatação para padrão brasileiro
formatDateBR(date, "dd/MM/yyyy") // 25/12/2024

// Conversão segura para UTC (banco de dados)
dateToUTCString(date) // "2024-12-25"

// Conversão de string para Date local
stringToLocalDate("2024-12-25") // Date object

// Validação de datas para agendamento
validateAppointmentDate(date) // { isValid: boolean, error?: string }
```

### Tratamento de Erros (`src/hooks/useErrorHandler.tsx`)

```typescript
const { handleError, executeWithErrorHandling } = useErrorHandler();

// Execução segura com tratamento automático
const result = await executeWithErrorHandling(
  () => apiCall(),
  'contexto da operação'
);
```

## 🗃️ Estrutura do Banco de Dados

### Tabelas Principais

- **agendamentos**: Dados dos agendamentos
- **clientes**: Informações dos clientes
- **equipes**: Equipes de trabalho
- **servicos**: Serviços oferecidos
- **common_vehicles**: Veículos brasileiros para autocompletar
- **horarios_funcionamento**: Horários por dia da semana

### Políticas de Segurança (RLS)

Todas as tabelas implementam Row Level Security para garantir isolamento de dados por empresa.

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- Conta no Supabase
- Git

### Instalação

```bash
# Clonar repositório
git clone [url-do-repositorio]
cd sistema-agendamento

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Editar .env.local com dados do Supabase

# Executar migrações do banco
npm run db:reset

# Iniciar servidor de desenvolvimento
npm run dev
```

### Variáveis de Ambiente

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── agenda/         # Componentes da agenda
│   ├── forms/          # Formulários e inputs
│   ├── layout/         # Layouts e navegação
│   └── ui/             # Componentes base (Shadcn)
├── hooks/              # Hooks customizados
├── pages/              # Páginas da aplicação
├── utils/              # Utilitários e helpers
├── integrations/       # Configurações do Supabase
└── types/              # Definições de tipos TypeScript
```

## 🔧 Principais Componentes

### Agenda (`src/components/agenda/`)
- `MonthView.tsx`: Visualização mensal do calendário
- `WeekView.tsx`: Visualização semanal
- `AgendaHeader.tsx`: Cabeçalho com controles
- `ServiceFilter.tsx`: Filtros de serviços

### Formulários (`src/components/forms/`)
- `NovoAgendamentoForm.tsx`: Criação de agendamentos
- `VehicleAutocomplete.tsx`: Autocompletar de veículos
- `TimeSlotPicker.tsx`: Seleção de horários

## 🔍 Debugging e Logs

### Console Logs Estruturados

O sistema implementa logs detalhados para facilitar o debugging:

```typescript
console.log('Data selecionada:', {
  original: date,
  formatted: formatDateBR(date),
  utcString: dateToUTCString(date)
});
```

### Error Handling

Todos os erros são capturados e tratados de forma consistente:

```typescript
// Logs automáticos de erro
console.error('Erro capturado:', {
  message: errorMessage,
  context,
  stack: error.stack,
  timestamp: new Date()
});
```

## 📊 Performance

### Cache Inteligente

- Cache de operações de data frequentes
- React Query para cache de dados da API
- Lazy loading de componentes pesados

### Otimizações

- Debounce em campos de busca
- Paginação automática em listas grandes
- Compressão de imagens uploaded

## 🧪 Testes

```bash
# Executar testes unitários
npm run test

# Executar testes com coverage
npm run test:coverage

# Executar testes e2e
npm run test:e2e
```

## 📝 Contribuição

1. Fork do projeto
2. Criar branch para feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit das mudanças (`git commit -m 'Adicionar nova funcionalidade'`)
4. Push para branch (`git push origin feature/nova-funcionalidade`)
5. Abrir Pull Request

### Padrões de Código

- TypeScript strict mode
- ESLint + Prettier
- Commit messages em português
- Documentação JSDoc em funções públicas

## 🐛 Problemas Conhecidos

### Timezone
- Todas as datas são armazenadas em UTC no banco
- Conversão automática para timezone brasileiro na interface
- Cache de operações de data para melhor performance

### Compatibilidade
- Testado no Chrome, Firefox e Safari
- Responsivo para mobile e desktop
- Suporte a telas de alta resolução

## 📞 Suporte

- Documentação: [Link da documentação]
- Issues: [Link do repositório]/issues
- Email: suporte@exemplo.com

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 🔄 Changelog

### v1.2.0 (Atual)
- ✅ Sistema de timezone brasileiro
- ✅ Validações de data em tempo real
- ✅ Cache inteligente de datas
- ✅ Tratamento de erros padronizado
- ✅ Documentação completa
- ✅ Autocompletar de veículos brasileiros

### v1.1.0
- ✅ Visualização semanal da agenda
- ✅ Sistema de equipes
- ✅ Filtros avançados

### v1.0.0
- ✅ Sistema básico de agendamentos
- ✅ Cadastro de clientes
- ✅ Integração com Supabase
