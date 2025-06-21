
# Agende Car - Dashboard Administrativo

Um sistema administrativo completo para gerenciar a plataforma SaaS multi-tenant **Agende Car**, especializada em empresas de lavagem automotiva.

## 📋 Sobre o Projeto

O Agende Car é uma plataforma que permite a empresas de lavagem automotiva (lava-rápidos) gerenciar seus agendamentos de forma eficiente. Este dashboard administrativo oferece controle total sobre:

- **Empresas cadastradas** - Criação, edição e gerenciamento de empresas clientes
- **Planos de assinatura** - Configuração de planos com diferentes limitações e preços
- **Métricas e relatórios** - Visão geral do crescimento e performance da plataforma

## 🚀 Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Roteamento**: React Router DOM
- **Estado**: Context API + useState
- **Notificações**: Sonner (Toast)
- **Ícones**: Lucide React
- **Build**: Vite

## 🔐 Autenticação

O sistema possui autenticação administrativa com credenciais fixas:

- **E-mail**: `admin@agendecar.com`
- **Senha**: `admin123`

Todas as rotas são protegidas por middleware de autenticação.

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── auth/           # Componentes de autenticação
│   ├── layout/         # Componentes de layout (sidebar, header)
│   └── ui/             # Componentes da biblioteca shadcn/ui
├── contexts/           # Contextos React (AuthContext)
├── pages/              # Páginas da aplicação
│   ├── Dashboard.tsx   # Página principal com métricas
│   ├── Empresas.tsx    # Gerenciamento de empresas
│   ├── Planos.tsx      # Gerenciamento de planos
│   ├── Login.tsx       # Página de login
│   └── NotFound.tsx    # Página 404
├── hooks/              # Hooks customizados
├── lib/                # Utilitários e configurações
└── App.tsx             # Componente principal
```

## 🏢 Funcionalidades - Gestão de Empresas

### Criar Nova Empresa
- **Campos obrigatórios**: Nome, E-mail, Subdomínio, Telefone, Plano
- **Geração automática** de senha temporária (6 dígitos)
- **Envio via Telegram** (estrutura preparada)
- **Status inicial**: Pendente (até ativação da empresa)

### Gerenciar Empresas Existentes
- **Visualização em tabela** com todas as informações
- **Edição** de dados da empresa
- **Exclusão** de empresas
- **Reenvio de senha** via Telegram para empresas pendentes
- **Filtros por status** (Ativo, Inativo, Pendente)

### Informações Armazenadas
```typescript
interface Empresa {
  id: number;
  nome: string;
  email: string;
  subdominio: string;        // usado para [subdominio].agendecar.com
  telefone: string;          // WhatsApp/Telegram
  plano: string;
  status: 'Ativo' | 'Inativo' | 'Pendente';
  senhaTemporaria?: string;  // senha de 6 dígitos
  dataCriacao: string;
}
```

## 💳 Funcionalidades - Gestão de Planos

### Criar/Editar Planos
- **Informações básicas**: Nome, Descrição, Preço mensal
- **Limitações configuráveis**:
  - Número de agendamentos por mês
  - Quantidade de usuários simultâneos
  - Limite de armazenamento
  - Suporte prioritário (sim/não)
  - Integrações avançadas (sim/não)

### Controle de Status
- **Ativar/Desativar** planos
- **Visualização em cards** dos planos ativos
- **Tabela completa** com todos os planos

### Estrutura de Dados
```typescript
interface Plano {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  limitacoes: {
    agendamentosMes: number;
    usuarios: number;
    armazenamento: string;
    suportePrioridade: boolean;
    integrações: boolean;
  };
  ativo: boolean;
  dataCriacao: string;
}
```

## 📊 Dashboard e Métricas

### Métricas Principais
- **Total de empresas** cadastradas
- **Total de agendamentos** na plataforma
- **Registros recentes** (empresas do mês)
- **Crescimento mensal** em percentual

### Visões Disponíveis
- **Cards informativos** com números principais
- **Lista de empresas recentes** com status
- **Resumo do sistema** (conversão, satisfação, uptime)

## 🔌 Integração com APIs Externas

### Telegram API (Estrutura Preparada)
```typescript
// Função para enviar senha via Telegram
const enviarSenhaViaTelegram = async (telefone: string, senha: string) => {
  // TODO: Implementar integração com Telegram Bot API
  console.log(`Enviando senha ${senha} para ${telefone} via Telegram`);
  
  // Estrutura para implementação:
  // 1. Configurar bot do Telegram
  // 2. Obter chat_id do usuário pelo telefone
  // 3. Enviar mensagem com a senha temporária
};
```

### WhatsApp API (Preparado para implementação futura)
```typescript
// Estrutura preparada para WhatsApp Business API
const enviarSenhaViaWhatsApp = async (telefone: string, senha: string) => {
  // TODO: Implementar integração com WhatsApp Business API
  console.log(`Enviando senha ${senha} para ${telefone} via WhatsApp`);
};
```

## 🗄️ Estrutura de Banco de Dados (Supabase)

### Tabelas Principais
```sql
-- Tabela de empresas
CREATE TABLE empresas (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  subdominio VARCHAR(100) UNIQUE NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  plano_id INTEGER REFERENCES planos(id),
  status VARCHAR(20) DEFAULT 'Pendente',
  senha_temporaria VARCHAR(6),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de planos
CREATE TABLE planos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10,2) NOT NULL,
  limitacoes JSONB NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de usuários (para funcionários das empresas)
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  empresa_id INTEGER REFERENCES empresas(id),
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'funcionario',
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Row Level Security (RLS)
```sql
-- Habilitar RLS nas tabelas
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;

-- Política para empresas (cada empresa vê apenas seus dados)
CREATE POLICY "Empresas podem ver apenas seus dados" ON usuarios
  FOR ALL USING (empresa_id = current_setting('app.current_empresa_id')::INTEGER);
```

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js 16+ e npm/yarn instalados
- Conta no Supabase (para backend)

### Instalação
```bash
# Clonar o repositório
git clone <url-do-repositorio>

# Navegar para o diretório
cd agende-car-admin

# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev
```

### Configuração do Supabase
1. Criar projeto no [Supabase](https://supabase.com)
2. Executar as migrations do banco de dados
3. Configurar as variáveis de ambiente
4. Implementar as políticas de RLS

## 🔧 Próximas Implementações

### APIs Externas
- [ ] **Telegram Bot API** - Envio automático de senhas
- [ ] **WhatsApp Business API** - Alternativa ao Telegram
- [ ] **Integração com gateways de pagamento** (Stripe, PagSeguro)

### Funcionalidades Admin
- [ ] **Relatórios avançados** com gráficos
- [ ] **Sistema de notificações** em tempo real
- [ ] **Backup automático** de dados
- [ ] **Logs de auditoria** para ações administrativas

### Multi-tenancy
- [ ] **Implementação completa do RLS** no Supabase
- [ ] **Isolamento de dados** por empresa
- [ ] **Customização por tenant** (logos, cores, domínios)

## 📝 Licença

Este projeto está sob licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 💬 Suporte

Para dúvidas ou suporte técnico, entre em contato:
- **E-mail**: dev@agendecar.com
- **Telefone**: (11) 99999-9999

---

**Desenvolvido com ❤️ para revolucionar o setor de lavagem automotiva**
