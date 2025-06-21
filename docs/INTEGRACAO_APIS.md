
# Guia de Integração - APIs Externas

Este documento detalha como implementar as integrações com Telegram e WhatsApp para envio automático de senhas temporárias.

## 🤖 Integração com Telegram Bot API

### 1. Configuração Inicial

#### Criar um Bot no Telegram
1. Converse com [@BotFather](https://t.me/botfather) no Telegram
2. Use o comando `/newbot` e siga as instruções
3. Anote o **Token do Bot** fornecido
4. Configure o webhook ou use polling

#### Variáveis de Ambiente Necessárias
```env
VITE_TELEGRAM_BOT_TOKEN=seu_token_aqui
VITE_TELEGRAM_API_URL=https://api.telegram.org/bot
```

### 2. Implementação do Serviço

Criar arquivo `src/services/telegramService.ts`:

```typescript
interface TelegramResponse {
  ok: boolean;
  result?: any;
  error_code?: number;
  description?: string;
}

class TelegramService {
  private readonly botToken: string;
  private readonly apiUrl: string;

  constructor() {
    this.botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    this.apiUrl = import.meta.env.VITE_TELEGRAM_API_URL;
  }

  // Buscar chat_id pelo número de telefone (funcionalidade limitada)
  private async getChatIdByPhone(phone: string): Promise<string | null> {
    // NOTA: Telegram não oferece busca direta por telefone
    // Implementar sistema de registro prévio ou usar username
    return null;
  }

  // Enviar mensagem para um chat específico
  async sendMessage(chatId: string, message: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}${this.botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML'
        }),
      });

      const data: TelegramResponse = await response.json();
      return data.ok;
    } catch (error) {
      console.error('Erro ao enviar mensagem Telegram:', error);
      return false;
    }
  }

  // Enviar senha temporária formatada
  async enviarSenhaTemporaria(chatId: string, empresa: string, senha: string): Promise<boolean> {
    const mensagem = `
🔑 <b>Agende Car - Senha Temporária</b>

Olá! Sua empresa <b>${empresa}</b> foi cadastrada com sucesso na plataforma Agende Car.

<b>Sua senha temporária é: ${senha}</b>

Acesse: https://${empresa.toLowerCase().replace(/\s+/g, '')}.agendecar.com

⚠️ <i>Esta é uma senha temporária. Altere-a após o primeiro acesso.</i>

Precisando de ajuda? Entre em contato conosco!
    `;

    return this.sendMessage(chatId, mensagem);
  }
}

export const telegramService = new TelegramService();
```

### 3. Integração no Componente

Atualizar `src/pages/Empresas.tsx`:

```typescript
import { telegramService } from '@/services/telegramService';

// Na função de criação de empresa
const salvarEmpresa = async () => {
  // ... validações existentes

  if (!empresaEditando) {
    const senhaTemporaria = gerarSenhaTemporaria();
    const novaEmpresa: Empresa = {
      // ... dados da empresa
      senhaTemporaria,
    };

    // Tentar enviar via Telegram
    try {
      // NOTA: chatId deve ser obtido previamente (limitação do Telegram)
      const chatId = await obterChatIdEmpresa(formData.telefone);
      
      if (chatId) {
        const enviado = await telegramService.enviarSenhaTemporaria(
          chatId,
          formData.nome,
          senhaTemporaria
        );

        if (enviado) {
          toast.success('Empresa criada e senha enviada via Telegram!');
        } else {
          toast.warning('Empresa criada, mas falha no envio via Telegram');
        }
      } else {
        toast.warning('Empresa criada. Registre o Telegram para receber senhas automáticas.');
      }
    } catch (error) {
      console.error('Erro na integração Telegram:', error);
      toast.error('Empresa criada, mas falha na comunicação com Telegram');
    }

    setEmpresas(prev => [...prev, novaEmpresa]);
  }

  // ... resto da função
};
```

## 📱 Integração com WhatsApp Business API

### 1. Configuração Inicial

#### Pré-requisitos
- Conta WhatsApp Business verificada
- Acesso à [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)
- Token de acesso e Webhook configurado

#### Variáveis de Ambiente
```env
VITE_WHATSAPP_ACCESS_TOKEN=seu_access_token
VITE_WHATSAPP_PHONE_NUMBER_ID=seu_phone_number_id
VITE_WHATSAPP_API_URL=https://graph.facebook.com/v18.0
```

### 2. Implementação do Serviço

Criar arquivo `src/services/whatsappService.ts`:

```typescript
interface WhatsAppMessage {
  messaging_product: "whatsapp";
  to: string;
  type: "text";
  text: {
    body: string;
  };
}

class WhatsAppService {
  private readonly accessToken: string;
  private readonly phoneNumberId: string;
  private readonly apiUrl: string;

  constructor() {
    this.accessToken = import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN;
    this.phoneNumberId = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID;
    this.apiUrl = import.meta.env.VITE_WHATSAPP_API_URL;
  }

  // Formatar número de telefone para padrão internacional
  private formatPhoneNumber(phone: string): string {
    // Remover caracteres não numéricos
    const numbersOnly = phone.replace(/\D/g, '');
    
    // Adicionar código do país se necessário (Brasil = 55)
    if (numbersOnly.length === 11 && numbersOnly.startsWith('11')) {
      return `55${numbersOnly}`;
    }
    
    return numbersOnly;
  }

  // Enviar mensagem via WhatsApp
  async sendMessage(to: string, message: string): Promise<boolean> {
    try {
      const formattedPhone = this.formatPhoneNumber(to);
      
      const messageData: WhatsAppMessage = {
        messaging_product: "whatsapp",
        to: formattedPhone,
        type: "text",
        text: {
          body: message
        }
      };

      const response = await fetch(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(messageData),
        }
      );

      const data = await response.json();
      return response.ok && !data.error;
    } catch (error) {
      console.error('Erro ao enviar WhatsApp:', error);
      return false;
    }
  }

  // Enviar senha temporária formatada
  async enviarSenhaTemporaria(telefone: string, empresa: string, senha: string): Promise<boolean> {
    const mensagem = `🔑 *Agende Car - Senha Temporária*

Olá! Sua empresa *${empresa}* foi cadastrada com sucesso na plataforma Agende Car.

*Sua senha temporária é: ${senha}*

Acesse: https://${empresa.toLowerCase().replace(/\s+/g, '')}.agendecar.com

⚠️ _Esta é uma senha temporária. Altere-a após o primeiro acesso._

Precisando de ajuda? Entre em contato conosco!`;

    return this.sendMessage(telefone, mensagem);
  }
}

export const whatsappService = new WhatsAppService();
```

### 3. Sistema Híbrido (Telegram + WhatsApp)

Criar arquivo `src/services/notificationService.ts`:

```typescript
import { telegramService } from './telegramService';
import { whatsappService } from './whatsappService';

export enum NotificationType {
  TELEGRAM = 'telegram',
  WHATSAPP = 'whatsapp',
  BOTH = 'both'
}

class NotificationService {
  async enviarSenhaTemporaria(
    empresa: string,
    telefone: string,
    senha: string,
    tipo: NotificationType = NotificationType.BOTH
  ): Promise<{ telegram: boolean; whatsapp: boolean }> {
    
    const results = {
      telegram: false,
      whatsapp: false
    };

    // Tentar Telegram se solicitado
    if (tipo === NotificationType.TELEGRAM || tipo === NotificationType.BOTH) {
      try {
        // Obter chatId da empresa (implementar sistema de registro)
        const chatId = await this.obterChatIdEmpresa(telefone);
        if (chatId) {
          results.telegram = await telegramService.enviarSenhaTemporaria(
            chatId, empresa, senha
          );
        }
      } catch (error) {
        console.error('Erro Telegram:', error);
      }
    }

    // Tentar WhatsApp se solicitado
    if (tipo === NotificationType.WHATSAPP || tipo === NotificationType.BOTH) {
      try {
        results.whatsapp = await whatsappService.enviarSenhaTemporaria(
          telefone, empresa, senha
        );
      } catch (error) {
        console.error('Erro WhatsApp:', error);
      }
    }

    return results;
  }

  private async obterChatIdEmpresa(telefone: string): Promise<string | null> {
    // TODO: Implementar sistema de registro de chat_ids
    // Opções:
    // 1. Banco de dados com mapeamento telefone -> chat_id
    // 2. Sistema de opt-in via bot
    // 3. Integração com sistema de cadastro
    return null;
  }
}

export const notificationService = new NotificationService();
```

## 🔧 Configuração no Dashboard

### 1. Adicionar Configurações de Notificação

Criar página `src/pages/Configuracoes.tsx`:

```typescript
const Configuracoes = () => {
  const [configs, setConfigs] = useState({
    notificacaoTipo: NotificationType.BOTH,
    telegramAtivo: true,
    whatsappAtivo: true,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações de Notificação</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>Método de Envio de Senhas</Label>
            <Select 
              value={configs.notificacaoTipo} 
              onValueChange={(value) => setConfigs({...configs, notificacaoTipo: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NotificationType.TELEGRAM}>Apenas Telegram</SelectItem>
                <SelectItem value={NotificationType.WHATSAPP}>Apenas WhatsApp</SelectItem>
                <SelectItem value={NotificationType.BOTH}>Ambos (Telegram + WhatsApp)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Outras configurações... */}
        </div>
      </CardContent>
    </Card>
  );
};
```

### 2. Logs de Envio

Implementar sistema de logs para acompanhar entregas:

```typescript
interface LogNotificacao {
  id: number;
  empresaId: number;
  tipo: 'telegram' | 'whatsapp';
  telefone: string;
  status: 'enviado' | 'falhou' | 'pendente';
  tentativas: number;
  erro?: string;
  criadoEm: Date;
}

// Salvar logs no banco de dados para auditoria
const salvarLogNotificacao = async (log: Omit<LogNotificacao, 'id'>) => {
  // Implementar salvamento no Supabase
};
```

## 🚨 Considerações Importantes

### Limitações do Telegram
- **Não é possível buscar usuários por telefone** diretamente
- Necessário sistema de **opt-in** onde empresas registram seu chat_id
- Implementar bot com comando `/registrar` para obter chat_id

### Limitações do WhatsApp Business
- **Verificação obrigatória** da conta business
- **Modelo de mensagem** pode precisar de aprovação prévia
- **Custos por mensagem** após limite gratuito

### Recomendações
1. **Implementar fallbacks** - se Telegram falhar, tentar WhatsApp
2. **Sistema de retry** - tentar reenviar em caso de falha
3. **Logs detalhados** - para debugging e auditoria
4. **Interface de configuração** - permitir admin escolher método preferido

## 📊 Monitoramento

Implementar métricas de entrega:
- Taxa de sucesso por canal (Telegram vs WhatsApp)
- Tempo médio de entrega
- Número de tentativas por envio
- Empresas que não receberam notificações

---

**Próximos passos**: Implementar uma dessas integrações por vez, testando thoroughly antes de partir para a próxima.
