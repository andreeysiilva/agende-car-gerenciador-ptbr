
# AgendCar - Dashboard do Cliente

## Visão Geral

O Dashboard do Cliente é a interface principal para empresas de lavagem automotiva gerenciarem seus negócios através da plataforma AgendCar. Cada empresa acessa seu dashboard através de um subdomínio personalizado (ex: robson.agendcar.com).

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
- **Visualização Diária**: Grade de horários com status (livre/ocupado)
- **Agendamentos**: Informações detalhadas de cada agendamento
- **Formulário de Agendamento**: 
  - Nome do cliente (obrigatório)
  - Telefone (obrigatório) 
  - Nome do carro (obrigatório) - Ex: "Fiat Uno", "Hilux"
  - Serviço selecionado (obrigatório)
  - Observações (opcional)
- **Navegação de Datas**: Anterior/próximo dia
- **Filtros**: Por tipo de serviço
- **Resumo do Dia**: Agendados, disponíveis, faturamento estimado

### 4. Serviços (`/cliente/servicos`)
- Cadastro de serviços oferecidos
- Campos: nome, duração, preço, descrição
- Edição e exclusão de serviços
- Gestão completa do catálogo

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
- Lista completa de clientes
- Informações: nome, telefone, email, histórico
- Busca e filtros
- Adição e edição de clientes

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
│   └── ClienteLogin.tsx        # Autenticação
├── components/
│   ├── ClienteNavigation.tsx   # Menu de navegação
│   └── AgendamentoForm.tsx     # Formulário de agendamento
└── docs/
    └── README_CLIENTE.md       # Esta documentação
```

### Rotas do Cliente
- `/cliente/login` - Tela de login
- `/cliente` - Dashboard principal  
- `/cliente/agenda` - Agenda e agendamentos
- `/cliente/servicos` - Gestão de serviços
- `/cliente/estatisticas` - Relatórios e gráficos
- `/cliente/clientes` - Base de clientes

### Design System

#### Cores Principais
```css
--primary: #2563eb        /* Azul principal */
--primary-hover: #1d4ed8  /* Azul hover */
--secondary: #10b981      /* Verde secundário */
--secondary-hover: #059669 /* Verde hover */
--background: #f8fafc     /* Fundo claro */
--text-primary: #1f2937   /* Texto escuro */
--text-secondary: #6b7280 /* Texto secundário */
```

#### Tipografia
- Fonte principal: "Inter", sans-serif
- Design responsivo mobile-first
- Interface em português brasileiro

## Características Mobile

### PWA (Progressive Web App)
- **Manifest**: Configurado para instalação na tela inicial
- **Ícones**: Diversos tamanhos para diferentes dispositivos
- **Botão de Instalação**: Funcional em mobile e desktop
- **Offline Ready**: Estrutura preparada para cache

### Responsividade
- **Mobile First**: Design otimizado para mobile
- **Breakpoints**: sm, md, lg, xl do Tailwind CSS
- **Menu Lateral**: Colapsível em mobile, fixo em desktop
- **Toque Amigável**: Botões e áreas de toque otimizadas

## Integrações Preparadas

### Supabase (Backend)
- **Autenticação**: Row Level Security (RLS)
- **Database**: Estrutura multi-tenant com `empresa_id`
- **Real-time**: Atualizações em tempo real
- **Storage**: Upload de arquivos

### APIs Externas
- **Telegram API**: Envio de senhas temporárias
- **WhatsApp API**: Estrutura preparada (desabilitada)

## Como Usar

### Desenvolvimento
1. Todas as páginas estão funcionais com dados mock
2. Navegação entre páginas implementada
3. Formulários validados e funcionais
4. Gráficos e filtros operacionais

### Personalização
1. **Cores**: Editar `tailwind.config.ts`
2. **Logo**: Componente Car com bolhas de sabão
3. **Dados**: Substituir mocks por integração Supabase
4. **Rotas**: Adicionar novas em `App.tsx`

### Instalação PWA
1. Acessar site no mobile
2. Clicar em "Instalar App" 
3. Ou usar menu do navegador > "Adicionar à tela inicial"

## Próximos Passos

### Integração Backend
1. Conectar com Supabase Auth
2. Implementar queries de dados reais
3. Configurar RLS policies
4. Integrar Telegram/WhatsApp APIs

### Funcionalidades Avançadas
1. Notificações push
2. Sincronização offline
3. Relatórios avançados
4. Sistema de pagamentos

### Performance
1. Lazy loading de componentes
2. Cache de dados
3. Otimização de imagens
4. Service Workers

## Suporte

Para dúvidas sobre implementação ou customização, consulte:
- Documentação do Supabase
- Tailwind CSS docs  
- React Router docs
- Recharts para gráficos
