
export interface Administrator {
  id: string;
  nome: string;
  email: string;
  role: string;
  nivel_acesso: string;
  ativo: boolean;
  ultimo_acesso: string | null;
  created_at: string;
}

export interface AdministratorFormData {
  nome: string;
  email: string;
  password: string;
  nivel_acesso: string;
  ativo: boolean;
}
