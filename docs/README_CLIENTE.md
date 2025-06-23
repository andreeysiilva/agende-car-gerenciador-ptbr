
# AgendiCar - Dashboard do Cliente

## Visão Geral

O Dashboard do Cliente é a interface principal para empresas de lavagem automotiva gerenciarem seus negócios através da plataforma AgendiCar. Cada empresa acessa seu dashboard através de um subdomínio personalizado (ex: robson.agendicar.com).

## Funcionalidades Principais

### 1. Autenticação
- **Login via Email**: Empresas fazem login com email cadastrado pelo admin
- **Senha Temporária**: Código de 6 dígitos enviado via Telegram API
- **Primeiro Acesso**: Obrigatório redefinir senha no primeiro login
- **Login Demo**: Usuário `demonstracao` com senha `demo1234` para demonstração

### 2. Dashboard Principal (`/cliente`)
- Visão geral dos agendamentos do dia
- Estatísticas de faturamento mensal
- Número de clientes atendidos
- Serviços mais populares
- Ações rápidas para principais funcionalidades

### 3. Agenda (`/cliente/agenda`) - **ATUALIZADA**
- **Visualização Semanal e Mensal**: Navegação entre semanas e meses
- **Integração com Horários**: Respeita horários de funcionamento configurados
- **Filtro de Serviços**: Seleção múltipla com filtros dinâmicos
- **Filtro de Equipes**: Dropdown para visualizar agendamentos por equipe
- **Agendamentos com Equipes**: Visualização da equipe responsável
- **Novo Agendamento**: Botão funcional para criar agendamentos
- **Formulário Completo**: 
  - Nome do cliente (obrigatório)
  - Telefone (obrigatório) 
  - Email (opcional)
  - Nome do carro (obrigatório) - Ex: "Fiat Uno", "Hilux"
  - Serviço selecionado (obrigatório)
  - Data e horário (obrigatórios)
  - Equipe responsável (opcional)
  - Observações (opcional)
- **Edição e Exclusão**: Interface completa para gerenciar agendamentos
- **Visualização Diária**: Clique em dia para ver todos os agendamentos
- **Status de Funcionamento**: Dias fechados são marcados visualmente
- **Navegação de Datas**: Anterior/próximo período
- **Resumo do Período**: Agendados, confirmados, pendentes

### 4. Serviços (`/cliente/servicos`)
- **Cadastro Completo**: Nome, duração, preço, descrição
- **Gestão de Status**: Ativar/desativar serviços
- **Estatísticas**: Preço médio, duração média
- **Edição e Exclusão**: Interface completa de CRUD

### 5. Estatísticas (`/cliente/estatisticas`)
- **Filtros Funcionais**:
  - Esta Semana
  - Este Mês  
  - Trimestre
  - Este Ano
- **Métricas Principais**:
  - Faturamento total com percentual de crescimento
  - Número de clientes atendidos
  - Ticket médio
  - Total de agendamentos
- **Gráficos Interativos**:
  - Faturamento por período (linha)
  - Serviços mais vendidos (pizza)
  - Agendamentos por dia da semana (barras)
- **Dados Dinâmicos**: Atualizados conforme filtro selecionado

### 6. Clientes (`/cliente/clientes`) - **FUNCIONAL**
- **Lista Completa**: Nome, telefone, email, endereço, histórico
- **Busca e Filtros**: Sistema de busca avançado
- **Estatísticas**: Total, ativos, agendamentos
- **Novo Cliente**: Botão funcional para adicionar clientes
- **Formulário Completo**:
  - Nome completo (obrigatório)
  - Telefone (obrigatório)
  - Email (opcional)
  - Endereço (opcional)
  - Observações (opcional)
- **Ver Detalhes**: Modal com informações completas
- **Editar Cliente**: Funcionalidade completa de edição
- **Novo Agendamento**: Criar agendamento com dados pré-preenchidos

### 7. Conta (`/cliente/conta`) - **IMPLEMENTADA**
Sistema completo de configurações da empresa organizado em abas:

#### 7.1 Horário de Funcionamento - **FUNCIONAL**
- **Configuração por Dia**: Define horários de abertura e fechamento
- **Dias Ativos**: Liga/desliga funcionamento por dia da semana
- **Integração com Agenda**: Limita horários disponíveis para agendamento
- **Validação**: Horários são respeitados na criação de agendamentos

#### 7.2 Agendas e Atendentes - **MULTI-EQUIPES**
- **Múltiplas Equipes**: Criação de equipes por especialidade
- **Nomes Personalizados**: Ex: "Equipe A - Lavagem Rápida", "Equipe B - Detalhamento"
- **Status Ativo/Inativo**: Controle de visibilidade na agenda
- **Filtro na Agenda**: Dropdown para selecionar equipe específica
- **Atribuição**: Agendamentos podem ser atribuídos a equipes específicas

#### 7.3 Dados da Empresa
- **Informações Básicas**:
  - Nome da empresa
  - Endereço físico completo
  - Telefone de contato
  - Link externo (WhatsApp, Instagram, etc.)
- **Upload de Logo**: Sistema de upload de logotipo (preparado)

#### 7.4 Notificações
- **Telegram**:
  - Alertas de novos agendamentos/cancelamentos
  - Resumo diário da agenda (08:00)
- **WhatsApp**: Preparado para integração futura (desabilitado)
- **Configurações Granulares**: Liga/desliga por tipo de notificação

#### 7.5 Segurança
- **Troca de Senha**: 
  - Validação de senha atual
  - Confirmação de nova senha
  - Integração com Supabase Auth

## Novos Recursos Implementados

### 🆕 Gestão Completa de Agendamentos
- **Criar**: Formulário completo com validação
- **Editar**: Modificar todos os dados do agendamento
- **Excluir**: Exclusão com confirmação
- **Status**: Gerenciamento de status (confirmado, pendente, concluído, cancelado)
- **Equipes**: Atribuição e visualização de equipes responsáveis

### 🆕 Gestão Completa de Clientes
- **Cadastro**: Formulário completo para novos clientes
- **Edição**: Modificação de dados existentes
- **Detalhes**: Visualização completa com histórico
- **Integração**: Criação de agendamentos com dados pré-preenchidos

### 🆕 Integração Horários x Agenda
- **Dias Fechados**: Não permite agendamentos em dias não funcionais
- **Horários Limitados**: Respeita horários de abertura e fechamento
- **Indicação Visual**: Dias fechados são claramente marcados
- **Validação**: Sistema impede agendamentos fora do horário

### 🆕 Sistema Multi-Equipes
- **Criação**: Adicionar múltiplas equipes/atendentes
- **Filtragem**: Visualizar agendamentos por equipe específica
- **Atribuição**: Definir equipe responsável por cada agendamento
- **Organização**: Melhor distribuição de trabalho

## Arquitetura Técnica

### Estrutura de Pastas Atualizada
```
src/
├── pages/
│   ├── ClienteDashboard.tsx    # Dashboard principal
│   ├── ClienteAgenda.tsx       # Gestão completa de agenda
│   ├── ClienteServicos.tsx     # Catálogo de serviços
│   ├── ClienteEstatisticas.tsx # Relatórios e gráficos
│   ├── ClienteClientes.tsx     # Gestão completa de clientes
│   └── ClienteConta.tsx        # Configurações da empresa
├── components/
│   ├── layout/
│   │   ├── ClientLayout.tsx    # Layout base do cliente
│   │   └── ClientSidebar.tsx   # Menu lateral responsivo
│   ├── agenda/
│   │   ├── WeekView.tsx        # Visualização semanal integrada
│   │   ├── MonthView.tsx       # Visualização mensal
│   │   └── ServiceFilter.tsx   # Filtro de serviços
│   └── forms/                  # **NOVOS COMPONENTES**
│       ├── NovoAgendamentoForm.tsx    # Formulário de agendamento
│       ├── EditarAgendamentoForm.tsx  # Edição de agendamento
│       └── ClienteForm.tsx            # Formulário de cliente
└── docs/
    └── README_CLIENTE.md       # Esta documentação
```

### Banco de Dados Multi-Tenant - **ATUALIZADO**

#### Tabelas Principais
- `empresas`: Dados das empresas clientes
- `usuarios`: Usuários por empresa
- `agendamentos`: Agendamentos com equipe_id e cliente_id
- `servicos`: Serviços oferecidos por empresa
- `horarios_funcionamento`: Horários por empresa e dia da semana
- `equipes`: **NOVA** - Equipes/atendentes por empresa
- `clientes`: **NOVA** - Base de clientes por empresa
- `transacoes`: Transações financeiras

#### Segurança RLS (Row Level Security)
- Políticas por `empresa_id` em todas as tabelas
- Isolamento completo entre empresas
- Acesso baseado em `auth.uid()`
- **Novas políticas** para equipes e clientes

### Rotas do Cliente
- `/cliente/login` - Tela de login
- `/cliente` - Dashboard principal  
- `/cliente/agenda` - **Agenda funcional completa**
- `/cliente/servicos` - Gestão de serviços
- `/cliente/estatisticas` - Relatórios e gráficos
- `/cliente/clientes` - **Gestão completa de clientes**
- `/cliente/conta` - **Configurações funcionais da empresa**

## Como Usar as Novas Funcionalidades

### 1. Configurar Horários de Funcionamento
1. Acesse `/cliente/conta`
2. Vá para aba "Horários de Funcionamento"
3. Para cada dia da semana:
   - Marque "Funcionando" para dias ativos
   - Defina horário de abertura (ex: 08:00)
   - Defina horário de fechamento (ex: 18:00)
4. Clique "Salvar Horários"
5. **A agenda automaticamente respeitará essas configurações**

### 2. Criar Equipes/Atendentes
1. Na aba "Agendas e Atendentes", digite o nome da nova equipe
2. Exemplos: "Equipe A - Lavagem", "João - Detalhamento", "Turno Manhã"
3. Clique "Adicionar Equipe"
4. Use o toggle para ativar/desativar equipes
5. **Na agenda, use o filtro para ver agendamentos por equipe**

### 3. Gerenciar Agendamentos
1. **Criar Novo**:
   - Clique "Novo Agendamento" na página de agenda
   - Preencha todos os dados obrigatórios
   - Selecione equipe responsável (opcional)
   - Salve o agendamento

2. **Editar Existente**:
   - Clique em qualquer agendamento na agenda
   - Modifique os dados necessários
   - Altere status se necessário
   - Salve as alterações

3. **Visualizar Dia**:
   - Clique em qualquer data na agenda
   - Veja todos os agendamentos do dia
   - Crie novos diretamente da visualização diária

### 4. Gerenciar Clientes
1. **Adicionar Cliente**:
   - Clique "Novo Cliente" na página de clientes
   - Preencha nome e telefone (obrigatórios)
   - Adicione informações extras (email, endereço, observações)

2. **Ver Detalhes**:
   - Clique "Ver Detalhes" em qualquer cliente
   - Visualize histórico completo
   - Use "Editar" para modificar dados
   - Use "Novo Agendamento" para agendar serviço

3. **Buscar Clientes**:
   - Use a barra de busca para encontrar por nome, telefone ou email
   - Visualize estatísticas na parte superior

## Integrações e APIs

### Supabase (Backend Funcional)
- **Autenticação**: Row Level Security (RLS) implementado
- **Database**: Estrutura multi-tenant com `empresa_id`
- **Políticas**: Isolamento completo por empresa
- **Real-time**: Preparado para atualizações em tempo real
- **Storage**: Upload de arquivos preparado

### Estrutura de Dados
```sql
-- Exemplo de estrutura dos agendamentos
agendamentos {
  id: UUID
  empresa_id: UUID (FK)
  cliente_id: UUID (FK) -- Referência ao cliente
  equipe_id: UUID (FK)  -- Referência à equipe
  nome_cliente: VARCHAR
  telefone: VARCHAR
  nome_carro: VARCHAR
  servico: VARCHAR
  data_agendamento: DATE
  horario: TIME
  status: VARCHAR
  observacoes: TEXT
}
```

## Próximos Passos

### Backend Integration (Preparado)
1. ✅ Tabelas criadas no Supabase
2. ✅ Políticas RLS implementadas
3. 🔄 Conectar formulários com Supabase
4. 🔄 Implementar real-time updates
5. 🔄 Configurar notificações Telegram

### Funcionalidades Avançadas
1. 🔄 Sistema de templates de mensagem
2. 🔄 Integração WhatsApp Business API
3. 🔄 Relatórios PDF exportáveis
4. 🔄 Sistema de backup automático
5. 🔄 Dashboard executivo com KPIs

## Credenciais de Teste

### Admin
- **URL**: `/login`
- **Email**: `admin@agendicar.com`
- **Senha**: `admin123`

### Cliente Demo
- **URL**: `/cliente/login`
- **Email**: `demonstracao`
- **Senha**: `demo1234`

## Status de Implementação

### ✅ Funcionalidades Completas
- [x] Estrutura de banco de dados
- [x] Layout responsivo com sidebar
- [x] Página de configurações (/cliente/conta)
- [x] Gestão completa de agendamentos
- [x] Gestão completa de clientes
- [x] Integração horários x agenda
- [x] Sistema multi-equipes
- [x] Formulários funcionais
- [x] Página inicial profissional

### 🔄 Em Desenvolvimento
- [ ] Integração com Supabase (dados reais)
- [ ] Upload de logo da empresa
- [ ] Notificações Telegram
- [ ] Validação avançada de horários

### 📋 Backlog
- [ ] Relatórios PDF
- [ ] WhatsApp integration
- [ ] API pública
- [ ] Mobile app

## Suporte Técnico

Para implementação e dúvidas:
- Documentação do Supabase: https://supabase.com/docs
- Tailwind CSS: https://tailwindcss.com/docs
- React Router: https://reactrouter.com/docs
- shadcn/ui: https://ui.shadcn.com/docs

---

**Nota**: O sistema está pronto para integração com Supabase. Todas as funcionalidades estão implementadas com dados mockados e podem ser facilmente conectadas ao backend.
