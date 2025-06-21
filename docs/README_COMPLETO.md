
# AgendiCar - Sistema de Agendamento para Empresas de Lavagem de Carros

## 📋 Visão Geral

O **AgendiCar** é uma plataforma completa de agendamento online desenvolvida especialmente para empresas de lavagem de carros, estética automotiva e serviços relacionados. O sistema oferece tanto um **CRM Administrativo** para gerenciar múltiplas empresas quanto um **Dashboard do Cliente** para cada empresa gerenciar seus próprios agendamentos.

## 🚀 Funcionalidades Principais

### CRM Administrativo
- **Gestão de Empresas**: Cadastro, edição e controle de empresas clientes
- **Upload de Logo**: Possibilidade de fazer upload do logo da empresa
- **Subdomínios Automáticos**: Geração automática de subdomínios baseados no nome da empresa
- **Gestão de Planos**: Criação e edição de planos de assinatura
- **Financeiro Administrativo**: Controle de pagamentos, relatórios financeiros
- **Exportação de Relatórios**: CSV e PDF para análises financeiras

### Dashboard do Cliente (Empresas)
- **Agenda Completa**: Visualização e gestão de agendamentos
- **Formulário de Agendamento**: Criação de novos agendamentos com campo para nome do carro
- **Edição e Exclusão**: Modificação e remoção de agendamentos existentes
- **Filtros Dinâmicos**: Filtros por serviço e período
- **Configuração de Horários**: Definição de horários de funcionamento
- **Financeiro do Cliente**: Controle de assinatura e pagamentos
- **Interface Responsiva**: Design mobile-first para todos os dispositivos

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18, TypeScript, Vite
- **UI/UX**: Tailwind CSS, Shadcn/UI
- **Roteamento**: React Router DOM
- **Gerenciamento de Estado**: React Query (TanStack Query)
- **Ícones**: Lucide React
- **Notificações**: Sonner (Toast)
- **Formulários**: React Hook Form com Zod validation
- **Backend (Futuro)**: Supabase (PostgreSQL, Auth, Storage)

## 📱 Responsividade

O sistema foi desenvolvido com abordagem **mobile-first**, garantindo:
- Layout adaptativo para smartphones, tablets e desktops
- Navegação otimizada para touch
- Componentes que se ajustam automaticamente ao tamanho da tela
- Cards responsivos que se transformam em tabelas em telas maiores
- Menu lateral colapsável em dispositivos móveis

## 🔐 Sistema de Autenticação

### Login Administrativo (`/login`)
- Acesso para administradores do sistema
- Credenciais de teste: `admin@agendicar.com` / `admin123`
- Acesso completo ao CRM administrativo

### Login do Cliente (`/cliente/login`)
- Acesso para empresas clientes
- Login demo: `demonstracao` / `demo1234`
- Sistema de senha temporária via Telegram
- Redefinição obrigatória de senha no primeiro acesso

## 🎨 Design System

### Cores Principais
- **Primária**: Azul (`#2563eb`) - Representa confiança e profissionalismo
- **Secundária**: Verde (`#10b981`) - Simboliza limpeza e frescor
- **Texto Primário**: Cinza escuro (`#1f2937`)
- **Texto Secundário**: Cinza médio (`#6b7280`)

### Componentes Visuais
- Logo com carro e bolhas de sabão
- Cards com sombras suaves
- Botões com transições animadas
- Badges coloridos para status
- Gradientes sutis nos backgrounds

## 📊 Estrutura de Dados

### Empresas
```typescript
interface Empresa {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  subdominio: string;
  plano: string;
  status: 'Ativo' | 'Inativo' | 'Suspenso';
  dataVencimento: string;
  logoUrl?: string;
}
```

### Agendamentos
```typescript
interface Agendamento {
  id?: number;
  nomeCliente: string;
  telefone: string;
  nomeCarro: string;
  servico: string;
  observacoes: string;
  horario: string;
  data: string;
}
```

### Planos
```typescript
interface Plano {
  id: number;
  nome: string;
  preco: number;
  descricao: string;
  caracteristicas: string[];
  limite_agendamentos: number;
  limite_usuarios: number;
  suporte: string;
  ativo: boolean;
  popular?: boolean;
}
```

## 🗂️ Estrutura de Pastas

```
src/
├── components/           # Componentes reutilizáveis
│   ├── ui/              # Componentes básicos do Shadcn/UI
│   ├── layout/          # Componentes de layout (Sidebar, Header)
│   ├── auth/            # Componentes de autenticação
│   └── AgendamentoForm.tsx
├── pages/               # Páginas da aplicação
│   ├── Login.tsx        # Login administrativo
│   ├── ClienteLogin.tsx # Login do cliente
│   ├── Empresas.tsx     # Gestão de empresas
│   ├── Planos.tsx       # Gestão de planos
│   ├── AdminFinanceiro.tsx
│   ├── ClienteAgenda.tsx
│   ├── ClienteDashboard.tsx
│   └── ClienteFinanceiro.tsx
├── contexts/            # Contextos React (Auth, etc.)
├── hooks/               # Hooks customizados
├── lib/                 # Utilitários e configurações
└── docs/                # Documentação
```

## 🔧 Configuração e Instalação

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação
```bash
# Clonar o repositório
git clone https://github.com/andreeysiilva/agende-car-gerenciador-ptbr

# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 🌐 URLs e Rotas

### Administrativo
- `/login` - Login administrativo
- `/` - Dashboard admin
- `/empresas` - Gestão de empresas
- `/planos` - Gestão de planos
- `/financeiro` - Gestão financeira

### Cliente
- `/cliente/login` - Login do cliente
- `/cliente` - Dashboard do cliente
- `/cliente/agenda` - Agenda de agendamentos
- `/cliente/servicos` - Gestão de serviços
- `/cliente/estatisticas` - Relatórios e estatísticas
- `/cliente/clientes` - Base de clientes
- `/cliente/financeiro` - Gestão financeira do cliente

## 💳 Sistema Financeiro

### Administrativo
- Visualização de todas as transações
- Confirmação manual de pagamentos
- Alertas de pagamentos atrasados
- Exportação de relatórios financeiros
- Filtros por status, empresa e período

### Cliente
- Visualização do status da assinatura
- Histórico de pagamentos
- Próximas datas de vencimento
- Botão "Pagar Agora" (integração futura com Stripe/Mercado Pago)

## 📅 Sistema de Agenda

### Funcionalidades
- **Visualização Diária**: Grid de horários com status (livre/ocupado)
- **Agendamento Rápido**: Clique em horário livre para agendar
- **Edição de Agendamentos**: Clique em agendamento existente para editar
- **Filtros Dinâmicos**: Por tipo de serviço e período
- **Configuração de Horários**: Horários de funcionamento personalizáveis
- **Campo Nome do Carro**: Obrigatório para identificação do veículo

### Estados de Agendamento
- **Livre**: Horário disponível para agendamento
- **Ocupado**: Já possui agendamento confirmado
- **Indisponível**: Fora do horário de funcionamento

## 🔮 Integrações Futuras

### Supabase Backend
- **Autenticação**: Sistema completo de auth com RLS
- **Banco de Dados**: PostgreSQL para armazenar dados
- **Storage**: Upload de logos e arquivos
- **Edge Functions**: APIs personalizadas

### Pagamentos
- **Stripe**: Para cartões de crédito internacionais
- **Mercado Pago**: Para PIX, boleto e cartões nacionais
- **Webhook**: Confirmação automática de pagamentos

### Comunicação
- **Telegram Bot**: Envio de senhas temporárias
- **WhatsApp Business**: Notificações de agendamento
- **SMS**: Lembretes e confirmações

## 🎯 Público Alvo

- **Lava Rápidos**
- **Estética Automotiva**
- **Enceramento de Carros**
- **Detalhamento Automotivo**
- **Car Wash**
- **Lavagem Ecológica**

## 📈 Planos de Assinatura

### Básico - R$ 99,90/mês
- Até 100 agendamentos/mês
- 1 usuário
- Agenda online
- Suporte via email

### Premium - R$ 199,90/mês (Mais Popular)
- Até 500 agendamentos/mês
- 3 usuários
- Agenda personalizada
- Notificações SMS e WhatsApp
- Suporte prioritário

### Empresarial - R$ 299,90/mês
- Agendamentos ilimitados
- Usuários ilimitados
- Multi-localização
- API personalizada
- Suporte 24/7

## 🚀 Próximos Passos

1. **Integração com Supabase** para backend completo
2. **Sistema de Pagamentos** com Stripe/Mercado Pago
3. **App Mobile** nativo para iOS e Android
4. **Sistema de Notificações** via WhatsApp e SMS
5. **Relatórios Avançados** com gráficos e métricas
6. **Multi-localização** para redes de empresas
7. **API Pública** para integrações externas

## 📞 Suporte

Para dúvidas, sugestões ou problemas:
- **Email**: suporte@agendicar.com
- **GitHub**: https://github.com/andreeysiilva/agende-car-gerenciador-ptbr
- **Documentação**: [Link para docs]

---

**AgendiCar** - Revolucionando a gestão de agendamentos para o setor automotivo! 🚗✨
