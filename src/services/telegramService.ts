
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
    this.botToken = '7627455181:AAFmI6mgKoSMdR8-4RO-HedzurNpZNt2GuE';
    this.apiUrl = 'https://api.telegram.org/bot';
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
  async enviarSenhaTemporaria(chatId: string, empresa: string, senha: string, subdominio: string): Promise<boolean> {
    const mensagem = `
🔑 <b>Agende Car - Senha Temporária</b>

Olá! Sua empresa <b>${empresa}</b> foi cadastrada com sucesso na plataforma AgendiCar.

<b>Sua senha temporária é: ${senha}</b>

Acesse: https://${subdominio}.agendicar.com.br

⚠️ <i>Esta é uma senha temporária. Altere-a após o primeiro acesso.</i>

Precisando de ajuda? Entre em contato conosco!
    `;

    return this.sendMessage(chatId, mensagem);
  }
}

export const telegramService = new TelegramService();
