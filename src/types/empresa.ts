
export interface Empresa {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco?: string;
  cnpj_cpf: string;
  subdominio: string;
  plano_id: string;
  status: 'Ativo' | 'Inativo' | 'Pendente';
  data_vencimento?: string;
  logo_url?: string;
  senha_temporaria?: string;
  telegram_chat_id?: string;
  primeiro_acesso_concluido?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface NovaEmpresaData {
  nome: string;
  email: string;
  telefone: string;
  endereco?: string;
  cnpj_cpf: string;
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
