
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InviteRequest {
  email: string;
  nomeEmpresa: string;
  empresaId: string;
  senhaTemporaria: string;
  redirectTo?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    console.log('Iniciando envio de convite para empresa...');
    
    const { email, nomeEmpresa, empresaId, senhaTemporaria, redirectTo }: InviteRequest = await req.json();

    // Validar dados obrigatórios
    if (!email || !nomeEmpresa || !empresaId || !senhaTemporaria) {
      console.error('Dados obrigatórios faltando:', { email, nomeEmpresa, empresaId, senhaTemporaria });
      return new Response(
        JSON.stringify({ error: 'Dados obrigatórios faltando' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Criar cliente Supabase com service role key (admin)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    console.log(`Enviando convite para: ${email}, Empresa: ${nomeEmpresa}`);

    // Enviar convite usando admin privileges
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      email,
      {
        data: {
          nome_empresa: nomeEmpresa,
          empresa_id: empresaId,
          senha_temporaria: senhaTemporaria,
          primeiro_acesso: true
        },
        redirectTo: redirectTo || `${Deno.env.get('SITE_URL') || 'https://lztntncrgenyvkotfgig.supabase.co'}/cliente/login`
      }
    );

    if (authError) {
      console.error('Erro no Supabase Auth ao enviar convite:', authError);
      return new Response(
        JSON.stringify({ 
          error: 'Erro ao enviar convite', 
          details: authError.message 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Convite enviado com sucesso:', authData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Convite enviado com sucesso',
        user: authData.user 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Erro inesperado ao enviar convite:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Erro inesperado ao enviar convite', 
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
};

serve(handler);
