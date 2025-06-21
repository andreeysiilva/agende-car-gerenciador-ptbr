
# AgendCar - Dashboard do Cliente

## 📱 Visão Geral

O dashboard do cliente do AgendCar é uma aplicação **mobile-first** e **totalmente responsiva** desenvolvida para empresas de lavagem e detalhamento automotivo gerenciarem seus agendamentos, serviços e clientes.

## 🎨 Tema de Cores

O sistema utiliza um tema de cores profissional e consistente:

- **Primária**: #2563eb (azul) - botões principais, navegação
- **Secundária**: #10b981 (verde esmeralda) - valores positivos, sucessos
- **Background**: #f8fafc (cinza claro) - fundo da aplicação
- **Texto Primário**: #1f2937 (cinza escuro) - textos principais
- **Texto Secundário**: #6b7280 (cinza médio) - textos auxiliares
- **Borda**: #e5e7eb (cinza claro) - bordas e divisões
- **Sucesso**: #22c55e (verde) - feedback positivo
- **Erro**: #ef4444 (vermelho) - feedback de erro
- **Aviso**: #facc15 (amarelo) - alertas e avisos

## 🏗️ Estrutura do Projeto

```
src/
├── pages/
│   ├── ClienteDashboard.tsx    # Painel principal
│   ├── ClienteAgenda.tsx       # Gestão de agendamentos
│   ├── ClienteServicos.tsx     # Gestão de serviços
│   ├── ClienteEstatisticas.tsx # Relatórios e métricas
│   └── ClienteClientes.tsx     # Base de clientes
├── components/
│   └── ui/                     # Componentes reutilizáveis
├── contexts/                   # Contextos React
└── App.tsx                     # Roteamento principal
```

## 📋 Funcionalidades Implementadas

### 1. Dashboard Principal (`/cliente/`)
- **Visão geral** dos agendamentos do dia
- **Métricas importantes**: faturamento, clientes atendidos, etc.
- **Ações rápidas** para principais funcionalidades
- **PWA Ready**: botão "Instalar App" para adicionar à tela inicial
- **Logo personalizado**: AgendCar com ícone de carro e bolhas de sabão

### 2. Agenda Dinâmica (`/cliente/agenda`)
- **Visualização por dia** com grade de horários
- **Sistema de bloqueio** baseado na duração dos serviços
- **Prevenção de conflitos** de agendamentos
- **Interface mobile-first** otimizada para dispositivos móveis
- **Navegação intuitiva** entre datas
- **Status visual** dos horários (livre/ocupado)

### 3. Gestão de Serviços (`/cliente/servicos`)
- **CRUD completo** de serviços (criar, ler, atualizar, deletar)
- **Campos obrigatórios**: nome, duração, preço
- **Descrição opcional** para detalhes do serviço
- **Busca e filtros** para localizar serviços
- **Ativação/desativação** de serviços
- **Estatísticas básicas**: total, ticket médio, tempo médio

### 4. Relatórios e Estatísticas (`/cliente/estatisticas`)
- **Métricas principais** com indicadores de crescimento
- **Gráficos interativos**:
  - Faturamento mensal (linha)
  - Serviços mais vendidos (pizza)
  - Agendamentos por dia da semana (barras)
- **Filtros por período**: semana, mês, trimestre, ano
- **Análise de performance** dos serviços

### 5. Base de Clientes (`/cliente/clientes`)
- **Cadastro de clientes** com nome, telefone e email
- **Classificação automática** por frequência (Novo, Esporádico, Regular, VIP)
- **Histórico de serviços** e total gasto
- **Busca avançada** por nome, telefone ou email
- **Filtros por categoria** de cliente

## 🔐 Autenticação

### Sistema de Login Temporário
1. **Administrador registra** a empresa no painel administrativo
2. **Senha temporária** de 6 dígitos é gerada automaticamente
3. **Envio via Telegram** (implementação futura)
4. **Primeiro login** força redefinição de senha
5. **Estrutura preparada** para WhatsApp como alternativa

### Segurança Multi-tenant
- **Isolamento por empresa** usando `empresa_id`
- **Row Level Security (RLS)** no Supabase
- **Políticas de acesso** por tenant

## 📱 PWA (Progressive Web App)

### Características PWA
- **Instalável** na tela inicial do dispositivo
- **Funciona offline** (cache básico)
- **Ícones customizados** para Android e iOS
- **Splash screen** personalizada
- **Atalhos rápidos** para principais funcionalidades

### Configuração PWA
```json
{
  "name": "AgendCar - Gestão Automotiva",
  "short_name": "AgendCar",
  "start_url": "/cliente",
  "display": "standalone",
  "theme_color": "#2563eb"
}
```

## 🎯 Design Mobile-First

### Estratégia Responsiva
1. **Desenvolvimento mobile primeiro** - layouts otimizados para smartphones
2. **Breakpoints progressivos** - adaptação para tablets e desktops
3. **Touch-friendly** - botões e áreas de toque adequadas
4. **Navegação simplificada** - menus colapsáveis em mobile

### Componentes Responsivos
- **Cards adaptativos** que se reorganizam em diferentes telas
- **Tabelas responsivas** que se transformam em listas em mobile
- **Formulários otimizados** com inputs apropriados para mobile
- **Navegação bottom-sheet** style em dispositivos pequenos

## 🗄️ Estrutura de Banco de Dados

### Tabelas Principais
```sql
-- Empresas (tenants)
CREATE TABLE empresas (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  subdominio VARCHAR(100) UNIQUE NOT NULL,
  logo_url VARCHAR(255),
  ativo BOOLEAN DEFAULT true
);

-- Usuários das empresas
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  empresa_id INTEGER REFERENCES empresas(id),
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  senha_temporaria VARCHAR(6),
  primeiro_login BOOLEAN DEFAULT true
);

-- Serviços oferecidos
CREATE TABLE servicos (
  id SERIAL PRIMARY KEY,
  empresa_id INTEGER REFERENCES empresas(id),
  nome VARCHAR(255) NOT NULL,
  duracao INTEGER NOT NULL, -- em minutos
  preco DECIMAL(10,2) NOT NULL,
  descricao TEXT,
  ativo BOOLEAN DEFAULT true
);

-- Clientes finais
CREATE TABLE clientes_finais (
  id SERIAL PRIMARY KEY,
  empresa_id INTEGER REFERENCES empresas(id),
  nome VARCHAR(255) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  frequencia VARCHAR(20) DEFAULT 'Novo'
);

-- Agendamentos
CREATE TABLE agendamentos (
  id SERIAL PRIMARY KEY,
  empresa_id INTEGER REFERENCES empresas(id),
  cliente_id INTEGER REFERENCES clientes_finais(id),
  servico_id INTEGER REFERENCES servicos(id),
  data_agendamento DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  status VARCHAR(20) DEFAULT 'confirmado',
  observacoes TEXT
);
```

### Políticas RLS (Row Level Security)
```sql
-- Política para empresas verem apenas seus dados
CREATE POLICY "empresa_isolation" ON servicos
  FOR ALL USING (empresa_id = current_setting('app.current_empresa_id')::INTEGER);

CREATE POLICY "empresa_isolation" ON clientes_finais  
  FOR ALL USING (empresa_id = current_setting('app.current_empresa_id')::INTEGER);

CREATE POLICY "empresa_isolation" ON agendamentos
  FOR ALL USING (empresa_id = current_setting('app.current_empresa_id')::INTEGER);
```

## 🔌 Integrações Futuras

### Telegram API
```typescript
// Estrutura preparada para envio de senhas
const enviarSenhaViaTelegram = async (telefone: string, senha: string) => {
  // TODO: Implementar bot do Telegram
  // 1. Configurar webhook do bot
  // 2. Mapear telefone para chat_id
  // 3. Enviar mensagem formatada
  console.log(`Enviando senha ${senha} para ${telefone}`);
};
```

### WhatsApp Business API
```typescript
// Estrutura preparada para alternativa ao Telegram
const enviarSenhaViaWhatsApp = async (telefone: string, senha: string) => {
  // TODO: Implementar WhatsApp Business API
  // 1. Configurar webhook
  // 2. Validar número
  // 3. Enviar template de mensagem
  console.log(`Enviando senha ${senha} para ${telefone} via WhatsApp`);
};
```

## 🚀 Como Executar

### Desenvolvimento Local
```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Acessar dashboard cliente
http://localhost:8080/cliente
```

### Build para Produção
```bash
# Build otimizado
npm run build

# Preview da build
npm run preview
```

## 🎨 Customização de Tema

### Modificar Cores
Edite o arquivo `tailwind.config.ts` para personalizar as cores:

```typescript
colors: {
  primary: {
    DEFAULT: '#2563eb', // Azul principal
    hover: '#1d4ed8',   // Azul hover
  },
  secondary: {
    DEFAULT: '#10b981', // Verde secundário
    hover: '#059669',   // Verde hover
  }
}
```

### Fonts Personalizadas
O sistema usa a fonte Inter por padrão. Para alterar:

```css
/* src/index.css */
@layer base {
  body {
    @apply font-['Nova-Font'] text-foreground;
  }
}
```

## 📈 Próximas Implementações

### Funcionalidades Planejadas
- [ ] **Notificações push** para agendamentos
- [ ] **Integração com calendário** (Google Calendar, Outlook)
- [ ] **Sistema de avaliações** de clientes
- [ ] **Gestão de estoque** de produtos
- [ ] **Relatórios avançados** com PDF export
- [ ] **Chat interno** entre funcionários
- [ ] **Integração com pagamentos** (PIX, cartão)

### Melhorias Técnicas
- [ ] **Cache inteligente** com Service Workers
- [ ] **Sincronização offline** de dados
- [ ] **Otimização de performance** com lazy loading
- [ ] **Testes automatizados** (Jest + Testing Library)
- [ ] **Monitoramento de erros** (Sentry)

## 💡 Dicas de Uso

### Para Desenvolvedores
1. **Sempre teste em mobile** primeiro ao desenvolver novas funcionalidades
2. **Use os breakpoints** definidos no Tailwind para responsividade
3. **Mantenha a consistência** do tema de cores em todos os componentes
4. **Implemente loading states** para melhor UX

### Para Usuários Finais
1. **Instale o app** na tela inicial para melhor experiência
2. **Use o modo paisagem** para visualizar melhor os relatórios
3. **Sincronize dados** regularmente quando online
4. **Configure notificações** para não perder agendamentos

## 📞 Suporte

Para dúvidas sobre implementação ou uso:
- **Email**: dev@agendcar.com
- **Documentação**: `/docs` dentro do projeto
- **Issues**: GitHub do projeto

---

**Desenvolvido com ❤️ para revolucionar a gestão de empresas automotivas**
