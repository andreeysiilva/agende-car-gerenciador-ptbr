
# AgendiCar - Sistema de Agendamento para Lava-Jatos

Sistema completo de agendamento online para empresas de lava-jatos e estética automotiva.

## 🚗 Sobre o AgendiCar

O AgendiCar é uma plataforma SaaS multi-tenant que permite que empresas de lava-jatos gerenciem seus agendamentos de forma eficiente e profissional. O sistema oferece tanto um painel administrativo para os donos de empresa quanto uma interface cliente-friendly para visualização e gestão de agendamentos.

## 🌟 Principais Funcionalidades

### Painel Administrativo (CRM)
- **Dashboard completo** com métricas e estatísticas
- **Gestão de empresas** cadastradas na plataforma
- **Controle de planos** de assinatura (Básico, Premium, Empresarial)
- **Financeiro** com controle de pagamentos e transações
- **Autenticação segura** para administradores

### Portal do Cliente
- **Dashboard personalizado** com métricas da empresa
- **Agenda avançada** com visualizações de semana e mês
- **Filtros inteligentes** por tipo de serviço
- **Gestão de serviços** oferecidos
- **Estatísticas detalhadas** de desempenho
- **Controle de clientes** e histórico
- **Configurações de conta**

### Funcionalidades da Agenda
- 📅 **Visualização dupla**: Semana e Mês
- 🔍 **Filtros por serviço** com seleção múltipla
- ✏️ **Edição e cancelamento** de agendamentos
- 📱 **Design responsivo** para mobile
- 🎨 **Códigos de cores** por status do agendamento

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** com TypeScript
- **Tailwind CSS** para estilização
- **Shadcn/ui** para componentes
- **React Router DOM** para navegação
- **Lucide React** para ícones
- **Date-fns** para manipulação de datas

### Backend
- **Supabase** como Backend-as-a-Service
- **PostgreSQL** como banco de dados
- **Row Level Security (RLS)** para segurança multi-tenant
- **Supabase Auth** para autenticação

### Deploy e Hospedagem
- **Vercel** para hospedagem do frontend
- **Supabase** para infraestrutura backend

## 🔧 Configuração e Instalação

### Pré-requisitos
- Node.js 18+
- NPM ou Yarn
- Conta no Supabase

### Passo a Passo

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/agendicar.git
cd agendicar
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
Crie um arquivo `.env.local` na raiz do projeto:
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

4. **Execute as migrações do banco de dados**
Execute os comandos SQL fornecidos no arquivo de migração no painel do Supabase.

5. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

6. **Acesse a aplicação**
- Painel Admin: `http://localhost:5173/`
- Portal Cliente: `http://localhost:5173/cliente/`

## 🔐 Credenciais de Teste

### Administrador
- **Email:** `admin@agendicar.com`
- **Senha:** `admin123`

*Use essas credenciais para acessar o painel administrativo e testar todas as funcionalidades.*

## 📊 Estrutura do Banco de Dados

### Tabelas Principais
- **empresas**: Dados das empresas cadastradas
- **usuarios**: Usuários vinculados às empresas
- **agendamentos**: Agendamentos dos clientes
- **servicos**: Serviços oferecidos por cada empresa
- **planos**: Planos de assinatura disponíveis
- **transacoes**: Transações financeiras
- **horarios_funcionamento**: Horários de funcionamento

### Segurança
- **RLS (Row Level Security)** ativado em todas as tabelas
- **Políticas de acesso** baseadas em empresa_id
- **Autenticação JWT** via Supabase Auth

## 🎨 Design e UX

### Características do Design
- **Mobile-first**: Otimizado para dispositivos móveis
- **Sidebar responsiva**: Colapsável em telas pequenas
- **Interface intuitiva**: Fácil navegação e uso
- **Cores consistentes**: Paleta harmoniosa em todo o sistema
- **Tipografia**: Font Inter para melhor legibilidade

### Paleta de Cores
- **Primary**: Azul (#3B82F6)
- **Secondary**: Verde (#10B981)
- **Success**: Verde (#22C55E)
- **Warning**: Amarelo (#F59E0B)
- **Error**: Vermelho (#EF4444)

## 📱 Responsividade

O sistema é totalmente responsivo e otimizado para:
- **Desktop** (1024px+)
- **Tablet** (768px - 1023px)
- **Mobile** (até 767px)

### Funcionalidades Mobile
- Sidebar colapsável com botão toggle
- Cards adaptáveis ao tamanho da tela
- Navegação por gestos
- Filtros otimizados para touch

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório GitHub ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Netlify
1. Conecte o repositório
2. Configure build command: `npm run build`
3. Configure publish directory: `dist`

## 📈 Roadmap

### Próximas Funcionalidades
- [ ] Sistema de notificações por SMS/WhatsApp
- [ ] Integração com sistemas de pagamento
- [ ] API pública para integrações
- [ ] App mobile nativo
- [ ] Sistema de avaliações de clientes
- [ ] Relatórios avançados em PDF
- [ ] Multi-idioma (inglês, espanhol)

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte técnico ou dúvidas:
- **Email**: admin@agendicar.com
- **GitHub Issues**: [Criar Issue](https://github.com/seu-usuario/agendicar/issues)

## 👥 Autores

- **Equipe AgendiCar** - *Desenvolvimento inicial* - [GitHub](https://github.com/seu-usuario)

---

**AgendiCar** - Transformando a gestão de lava-jatos com tecnologia moderna e design intuitivo.
