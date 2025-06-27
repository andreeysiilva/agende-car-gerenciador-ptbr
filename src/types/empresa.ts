
export interface Empresa {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco?: string;
  subdominio: string;
  status: 'Ativo' | 'Inativo' | 'Suspenso';
  data_vencimento?: string;
  created_at: string;
  updated_at: string;
  logo_url?: string;
  senha_temporaria?: string;
  plano_id?: string;
  telegram_chat_id?: string;
}

export interface NovaEmpresaData {
  nome: string;
  email: string;
  telefone: string;
  endereco?: string;
  plano: string;
  logoUrl?: string;
  telegramChatId?: string;
}

export interface CriarEmpresaResult {
  empresa: Empresa;
  credenciais: {
    email: string;
    senha: string;
    subdominio: string;
  };
}
