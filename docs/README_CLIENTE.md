
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

### 3. Agenda (`/cliente/agenda`)
- **Visualização Semanal e Mensal**: Navegação entre semanas e meses
- **Filtro de Serviços**: Seleção múltipla com filtros dinâmicos
- **Agendamentos**: Informações detalhadas com modal de edição/exclusão
- **Formulário de Agendamento**: 
  - Nome do cliente (obrigatório)
  - Telefone (obrigatório) 
  - Nome do carro (obrigatório) - Ex: "Fiat Uno", "Hilux"
  - Serviço selecionado (obrigatório)
  - Observações (opcional)
- **Navegação de Datas**: Anterior/próximo período
- **Resumo do Período**: Agendados, disponíveis, faturamento estimado

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

### 6. Clientes (`/cliente/clientes`)
- **Lista Completa**: Nome, telefone, email, histórico
- **Busca e Filtros**: Sistema de busca avançado
- **Estatísticas**: Total, ativos, agendamentos
- **Modal de Detalhes**: Informações completas do cliente

### 7. Conta (`/cliente/conta`) - **NOVO**
Sistema completo de configurações da empresa organizado em abas:

#### 7.1 Horário de Funcionamento
- **Configuração por Dia**: Define horários de abertura e fechamento
- **Dias Ativos**: Liga/desliga funcionamento por dia da semana
- **Integração com Agenda**: Limita horários disponíveis para agendamento

#### 7.2 Agendas e Atendentes
- **Múltiplas Agendas**: Criação de agendas por equipe/atendente
- **Nomes Personalizados**: Ex: "Equipe A - Lavagem Rápida"
- **Status Ativo/Inativo**: Controle de visibilidade na agenda
- **Filtro na Agenda**: Dropdown para selecionar agenda específica

#### 7.3 Dados da Empresa
- **Informações Básicas**:
  - Nome da empresa
  - Endereço físico completo
  - Telefone de contato
  - Link externo (WhatsApp, Instagram, etc.)
- **Upload de Logo**: Sistema de upload de logotipo

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

## Arquitetura Técnica

### Estrutura de Pastas
```
src/
├── pages/
│   ├── ClienteDashboard.tsx    # Dashboard principal
│   ├── ClienteAgenda.tsx       # Gestão de agenda
│   ├── ClienteServicos.tsx     # Catálogo de serviços
│   ├── ClienteEstatisticas.tsx # Relatórios e gráficos
│   ├── ClienteClientes.tsx     # Base de clientes
│   └── ClienteConta.tsx        # Configurações da empresa - NOVO
├── components/
│   ├── layout/
│   │   ├── ClientLayout.tsx    # Layout base do cliente
│   │   └── ClientSidebar.tsx   # Menu lateral responsivo
│   └── agenda/
│       ├── WeekView.tsx        # Visualização semanal
│       ├── MonthView.tsx       # Visualização mensal
│       └── ServiceFilter.tsx   # Filtro de serviços
└── docs/
    └── README_CLIENTE.md       # Esta documentação
```

### Banco de Dados Multi-Tenant

#### Tabelas Principais
- `empresas`: Dados das empresas clientes
- `usuarios`: Usuários por empresa
- `agendamentos`: Agendamentos por empresa
- `servicos`: Serviços oferecidos por empresa
- `horarios_funcionamento`: Horários por empresa
- `transacoes`: Transações financeiras

#### Segurança RLS (Row Level Security)
- Políticas por `empresa_id` em todas as tabelas
- Isolamento completo entre empresas
- Acesso baseado em `auth.uid()`

### Rotas do Cliente
- `/cliente/login` - Tela de login
- `/cliente` - Dashboard principal  
- `/cliente/agenda` - Agenda e agendamentos
- `/cliente/servicos` - Gestão de serviços
- `/cliente/estatisticas` - Relatórios e gráficos
- `/cliente/clientes` - Base de clientes
- `/cliente/conta` - Configurações da empresa - **NOVO**

### Sidebar Responsiva

#### Comportamento
- **Desktop**: Sidebar fixa visível
- **Mobile**: Sidebar colapsível com toggle
- **Navegação**: Destaque da página ativa
- **Ícones**: Lucide React com labels descritivos

#### Itens de Menu
- 🏠 Dashboard (Painel)
- 📅 Agenda
- 🔧 Serviços  
- 📊 Estatísticas
- 👥 Clientes
- ⚙️ Conta

## Design System

### Layout Responsivo
- **Mobile First**: Design otimizado para dispositivos móveis
- **Sidebar Unificada**: Mesmo comportamento em todas as páginas
- **Breakpoints**: Tailwind CSS (sm, md, lg, xl)
- **Componentes**: shadcn/ui com customizações

### Componentes Principais
- `ClientLayout`: Layout base com sidebar
- `ClientSidebar`: Menu lateral responsivo
- Cards estatísticos padronizados
- Modais de criação/edição
- Filtros e dropdowns

## Como Configurar a Empresa

### 1. Horários de Funcionamento
1. Acesse `/cliente/conta`
2. Vá para aba "Horários"
3. Configure cada dia da semana:
   - Marque "Funcionando" para dias ativos
   - Defina horário de abertura e fechamento
4. Clique "Salvar Horários"

### 2. Agendas por Atendente
1. Na aba "Agendas", digite o nome da nova agenda
2. Clique "Adicionar" (ex: "Equipe A - Lavagem Rápida")
3. Use o toggle para ativar/desativar agendas
4. Na página de Agenda, use o filtro para visualizar agenda específica

### 3. Configurar Notificações
1. Aba "Notificações"
2. Configure Telegram:
   - Novos agendamentos: Liga/desliga alertas instantâneos
   - Resumo diário: Resumo às 08:00
3. WhatsApp: Preparado para integração futura

### 4. Alterar Senha
1. Aba "Segurança"
2. Digite senha atual
3. Digite nova senha duas vezes
4. Clique "Alterar Senha"

## Integrações Preparadas

### Supabase (Backend)
- **Autenticação**: Row Level Security (RLS)
- **Database**: Estrutura multi-tenant com `empresa_id`
- **Real-time**: Atualizações em tempo real
- **Storage**: Upload de arquivos (logos)

### APIs Externas
- **Telegram API**: Envio de notificações
- **WhatsApp API**: Estrutura preparada (desabilitada)

## Próximos Passos

### Integração Backend
1. Conectar formulários com Supabase
2. Implementar upload de logos
3. Configurar notificações Telegram
4. Integrar filtros de agenda com banco

### Funcionalidades Avançadas
1. Sistema de templates de mensagem
2. Integração WhatsApp Business API
3. Relatórios PDF exportáveis
4. Sistema de backup automático

## Credenciais de Teste

### Admin
- **Email**: `admin@agendicar.com`
- **Senha**: `admin123`

### Cliente Demo
- **Email**: `demonstracao`
- **Senha**: `demo1234`

## Suporte Técnico

Para dúvidas sobre implementação:
- Documentação do Supabase
- Tailwind CSS docs  
- React Router docs
- Recharts para gráficos
- shadcn/ui components
