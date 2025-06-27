
export interface Empresa {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco?: string;
  subdominio: string;
  plano_id?: string;
  status: string;
  data_vencimento?: string;
  logo_url?: string;
  senha_temporaria?: string;
  created_at?: string;
  updated_at?: string;
}

export interface NovaEmpresaData {
  nome: string;
  email: string;
  telefone: string;
  endereco?: string;
  plano: string;
  logoUrl?: string;
}

export interface CriarEmpresaResult {
  empresa: Empresa;
  credenciais: {
    email: string;
    senha: string;
    subdominio: string;
  };
}
