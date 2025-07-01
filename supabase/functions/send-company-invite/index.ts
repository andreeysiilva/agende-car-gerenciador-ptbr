
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InviteRequest {
  email: string;
  nomeEmpresa: string;
  empresaId: string;
  subdominio: string;
  senhaTemporaria: string;
  redirectTo: string;
  isResend?: boolean;
}

interface EmailResponse {
  success: boolean;
  message: string;
  provider: string;
  messageId?: string;
  isResend: boolean;
  error?: string;
}

const generateEmailContent = (data: InviteRequest) => {
  const saudacao = data.isResend ? "Reenvio das suas credenciais" : "Bem-vindo ao AgendiCar";
  const textoInicial = data.isResend 
    ? "Conforme solicitado, estamos reenviando suas credenciais de acesso ao AgendiCar."
    : "Obrigado pela sua compra, seja muito bem-vindo(a) ao AgendiCar!";

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${saudacao}</title>
      <style>
          body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px; 
          }
          .header { 
              background-color: #2563eb; 
              color: white; 
              padding: 20px; 
              text-align: center; 
              border-radius: 8px 8px 0 0; 
          }
          .content { 
              background-color: #f8f9fa; 
              padding: 30px; 
              border-radius: 0 0 8px 8px; 
          }
          .credentials { 
              background-color: #e3f2fd; 
              padding: 20px; 
              border-radius: 8px; 
              margin: 20px 0; 
              border-left: 4px solid #2563eb; 
          }
          .button { 
              display: inline-block; 
              background-color: #2563eb; 
              color: white; 
              padding: 12px 30px; 
              text-decoration: none; 
              border-radius: 6px; 
              margin: 20px 0; 
              font-weight: bold; 
          }
          .footer { 
              margin-top: 30px; 
              padding-top: 20px; 
              border-top: 1px solid #ddd; 
              font-size: 14px; 
              color: #666; 
          }
          .warning {
              background-color: #fff3cd;
              border: 1px solid #ffeaa7;
              color: #856404;
              padding: 15px;
              border-radius: 6px;
              margin: 20px 0;
          }
      </style>
  </head>
  <body>
      <div class="header">
          <h1>${data.isResend ? '📧' : '🎉'} ${saudacao}!</h1>
      </div>
      
      <div class="content">
          <p><strong>Olá ${data.nomeEmpresa},</strong></p>
          
          <p>${textoInicial}</p>
          
          ${!data.isResend ? '<p>Sua plataforma de agendamentos está pronta para uso. Abaixo você encontra os seus dados de acesso para nossa área de membros, onde você encontrará todas as funcionalidades para gerenciar seus agendamentos.</p>' : ''}
          
          <div class="credentials">
              <h3>📋 Seus Dados de Acesso:</h3>
              <p><strong>URL de Acesso:</strong> <a href="https://${data.subdominio}.agendicar.com.br">https://${data.subdominio}.agendicar.com.br</a></p>
              <p><strong>E-mail:</strong> ${data.email}</p>
              <p><strong>Senha Provisória:</strong> <code style="background: #fff; padding: 2px 6px; border-radius: 4px; font-family: monospace;">${data.senhaTemporaria}</code></p>
          </div>
          
          <div class="warning">
              <strong>⚠️ Importante:</strong> Esta é uma senha provisória. Você será solicitado a criar uma nova senha no seu primeiro acesso por motivos de segurança.
          </div>
          
          <div style="text-align: center;">
              <a href="https://${data.subdominio}.agendicar.com.br" class="button">
                  🚀 Fazer Login Agora
              </a>
          </div>
          
          ${!data.isResend ? `
          <h3>🌟 O que você pode fazer na plataforma:</h3>
          <ul>
              <li>Gerenciar agendamentos de serviços automotivos</li>
              <li>Cadastrar clientes e veículos</li>
              <li>Organizar sua equipe de trabalho</li>
              <li>Acompanhar estatísticas e relatórios</li>
              <li>Configurar horários de funcionamento</li>
          </ul>
          ` : ''}
          
          <div class="footer">
              <p><strong>Precisa de ajuda?</strong></p>
              <p>Em caso de dúvidas, você pode entrar em contato através do e-mail: <a href="mailto:atechsolucoesweb@gmail.com">atechsolucoesweb@gmail.com</a></p>
              <p>Nossa equipe de suporte está pronta para ajudá-lo a aproveitar ao máximo sua nova plataforma.</p>
              <hr style="margin: 20px 0;">
              <p style="text-align: center; color: #999; font-size: 12px;">
                  © 2025 AgendiCar - Plataforma de Agendamentos Automotivos<br>
                  Este e-mail foi enviado para ${data.email}
              </p>
          </div>
      </div>
  </body>
  </html>
  `;

  const textContent = `
Olá ${data.nomeEmpresa},

${textoInicial}

DADOS DE ACESSO:
URL: https://${data.subdominio}.agendicar.com.br
E-mail: ${data.email}
Senha Provisória: ${data.senhaTemporaria}

IMPORTANTE: Esta é uma senha provisória. Você será solicitado a criar uma nova senha no seu primeiro acesso.

Faça login agora acessando: https://${data.subdominio}.agendicar.com.br

Em caso de dúvidas você pode entrar em contato através do email: atechsolucoesweb@gmail.com

Equipe AgendiCar
  `;

  return { htmlContent, textContent };
};

const sendEmailViaResend = async (data: InviteRequest): Promise<EmailResponse> => {
  try {
    console.log(`${data.isResend ? 'Reenviando' : 'Enviando'} e-mail via Resend para:`, data.email);
    
    const { htmlContent, textContent } = generateEmailContent(data);
    
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "AgendiCar <noreply@agendicar.com.br>",
        to: [data.email],
        subject: `${data.isResend ? '📧 Reenvio' : '🎉 Bem-vindo ao AgendiCar'} - ${data.nomeEmpresa}! Seus dados de acesso`,
        html: htmlContent,
        text: textContent,
      }),
    });

    if (resendResponse.ok) {
      const result = await resendResponse.json();
      console.log(`E-mail ${data.isResend ? 'reenviado' : 'enviado'} com sucesso via Resend:`, result);
      
      return {
        success: true,
        message: `E-mail ${data.isResend ? 'reenviado' : 'enviado'} com sucesso`,
        provider: "resend",
        messageId: result.id,
        isResend: data.isResend || false
      };
    } else {
      const errorData = await resendResponse.text();
      console.error("Erro ao enviar via Resend:", errorData);
      
      return {
        success: false,
        message: "Erro ao enviar e-mail via Resend",
        provider: "resend",
        error: errorData,
        isResend: data.isResend || false
      };
    }
  } catch (error) {
    console.error("Erro inesperado no Resend:", error);
    return {
      success: false,
      message: "Erro inesperado no envio via Resend",
      provider: "resend",
      error: error.message,
      isResend: data.isResend || false
    };
  }
};

const handleFallback = (data: InviteRequest): EmailResponse => {
  const { htmlContent, textContent } = generateEmailContent(data);
  
  console.log("RESEND_API_KEY não configurada. Simulando envio de e-mail:");
  console.log("Para:", data.email);
  console.log("Assunto:", `${data.isResend ? '📧 Reenvio' : '🎉 Bem-vindo ao AgendiCar'} - ${data.nomeEmpresa}! Seus dados de acesso`);
  console.log("Conteúdo do e-mail preparado com sucesso");
  
  return {
    success: true,
    message: "E-mail preparado (configurar RESEND_API_KEY para envio real)",
    provider: "fallback",
    isResend: data.isResend || false
  };
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: InviteRequest = await req.json();
    
    console.log("Dados recebidos para envio de e-mail:", {
      email: requestData.email,
      nomeEmpresa: requestData.nomeEmpresa,
      empresaId: requestData.empresaId,
      subdominio: requestData.subdominio,
      isResend: requestData.isResend || false
    });

    // Validação de dados obrigatórios
    if (!requestData.email || !requestData.nomeEmpresa || !requestData.senhaTemporaria || !requestData.subdominio) {
      console.error("Dados obrigatórios não fornecidos");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Dados obrigatórios não fornecidos: email, nomeEmpresa, senhaTemporaria, subdominio",
          isResend: requestData.isResend || false
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    let result: EmailResponse;

    // Tentar envio via Resend se configurado
    if (RESEND_API_KEY) {
      result = await sendEmailViaResend(requestData);
    } else {
      result = handleFallback(requestData);
    }

    const statusCode = result.success ? 200 : 500;

    return new Response(
      JSON.stringify(result),
      { 
        status: statusCode, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("Erro ao processar solicitação de envio de e-mail:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Erro interno do servidor",
        message: error.message,
        provider: "error",
        isResend: false
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
