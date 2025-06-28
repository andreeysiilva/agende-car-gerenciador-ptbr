
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
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, nomeEmpresa, empresaId, subdominio, senhaTemporaria, redirectTo }: InviteRequest = await req.json();

    console.log("Dados recebidos:", { email, nomeEmpresa, empresaId, subdominio, redirectTo });

    if (!email || !nomeEmpresa || !senhaTemporaria || !subdominio) {
      console.error("Dados obrigatórios não fornecidos");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Dados obrigatórios não fornecidos: email, nomeEmpresa, senhaTemporaria, subdominio" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // HTML personalizado para o e-mail de boas-vindas
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bem-vindo ao AgendiCar</title>
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
            <h1>🎉 Bem-vindo ao AgendiCar!</h1>
        </div>
        
        <div class="content">
            <p><strong>Olá ${nomeEmpresa},</strong></p>
            
            <p>Obrigado pela sua compra, seja muito bem-vindo(a) ao AgendiCar!</p>
            
            <p>Sua plataforma de agendamentos está pronta para uso. Abaixo você encontra os seus dados de acesso para nossa área de membros, onde você encontrará todas as funcionalidades para gerenciar seus agendamentos.</p>
            
            <div class="credentials">
                <h3>📋 Seus Dados de Acesso:</h3>
                <p><strong>URL de Acesso:</strong> <a href="https://${subdominio}.agendicar.com.br">https://${subdominio}.agendicar.com.br</a></p>
                <p><strong>E-mail:</strong> ${email}</p>
                <p><strong>Senha Provisória:</strong> <code style="background: #fff; padding: 2px 6px; border-radius: 4px; font-family: monospace;">${senhaTemporaria}</code></p>
            </div>
            
            <div class="warning">
                <strong>⚠️ Importante:</strong> Esta é uma senha provisória. Você será solicitado a criar uma nova senha no seu primeiro acesso por motivos de segurança.
            </div>
            
            <div style="text-align: center;">
                <a href="https://${subdominio}.agendicar.com.br" class="button">
                    🚀 Fazer Login Agora
                </a>
            </div>
            
            <h3>🌟 O que você pode fazer na plataforma:</h3>
            <ul>
                <li>Gerenciar agendamentos de serviços automotivos</li>
                <li>Cadastrar clientes e veículos</li>
                <li>Organizar sua equipe de trabalho</li>
                <li>Acompanhar estatísticas e relatórios</li>
                <li>Configurar horários de funcionamento</li>
            </ul>
            
            <div class="footer">
                <p><strong>Precisa de ajuda?</strong></p>
                <p>Em caso de dúvidas, você pode entrar em contato através do e-mail: <a href="mailto:atechsolucoesweb@gmail.com">atechsolucoesweb@gmail.com</a></p>
                <p>Nossa equipe de suporte está pronta para ajudá-lo a aproveitar ao máximo sua nova plataforma.</p>
                <hr style="margin: 20px 0;">
                <p style="text-align: center; color: #999; font-size: 12px;">
                    © 2025 AgendiCar - Plataforma de Agendamentos Automotivos<br>
                    Este e-mail foi enviado para ${email}
                </p>
            </div>
        </div>
    </body>
    </html>
    `;

    const textContent = `
Olá ${nomeEmpresa},

Obrigado pela sua compra, seja muito bem-vindo(a) ao AgendiCar!

Abaixo você encontra os seus dados de acesso para nossa área de membros, onde você encontrará o conteúdo que acabou de adquirir.

DADOS DE ACESSO:
URL: https://${subdominio}.agendicar.com.br
E-mail: ${email}
Senha Provisória: ${senhaTemporaria}

IMPORTANTE: Esta é uma senha provisória. Você será solicitado a criar uma nova senha no seu primeiro acesso.

Faça login agora acessando: https://${subdominio}.agendicar.com.br

Em caso de dúvidas você pode entrar em contato através do email: atechsolucoesweb@gmail.com

Equipe AgendiCar
    `;

    // Enviar via Resend se a chave API estiver disponível
    if (RESEND_API_KEY) {
      console.log("Enviando e-mail via Resend...");
      
      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "AgendiCar <noreply@agendicar.com.br>",
          to: [email],
          subject: `🎉 Bem-vindo ao AgendiCar, ${nomeEmpresa}! Seus dados de acesso`,
          html: htmlContent,
          text: textContent,
        }),
      });

      if (resendResponse.ok) {
        const result = await resendResponse.json();
        console.log("E-mail enviado com sucesso via Resend:", result);
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "E-mail de boas-vindas enviado com sucesso",
            provider: "resend",
            messageId: result.id
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      } else {
        const errorData = await resendResponse.text();
        console.error("Erro ao enviar via Resend:", errorData);
      }
    }

    // Fallback: log do conteúdo do e-mail
    console.log("RESEND_API_KEY não configurada. Conteúdo do e-mail:");
    console.log("Para:", email);
    console.log("Assunto: 🎉 Bem-vindo ao AgendiCar! Seus dados de acesso");
    console.log("Conteúdo HTML:", htmlContent);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "E-mail preparado (configurar RESEND_API_KEY para envio real)",
        provider: "fallback",
        content: {
          to: email,
          subject: `🎉 Bem-vindo ao AgendiCar, ${nomeEmpresa}! Seus dados de acesso`,
          html: htmlContent,
          text: textContent
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("Erro ao processar envio de e-mail:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Erro interno do servidor",
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
