
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  empresa_id: string;
  role: string;
  role_empresa: 'admin_empresa' | 'gerente' | 'funcionario' | 'atendente' | 'visualizador';
  ativo: boolean;
  primeiro_acesso_concluido: boolean;
  auth_user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface NovoUsuarioData {
  nome: string;
  email: string;
  role_empresa: 'gerente' | 'funcionario' | 'atendente' | 'visualizador';
}

export interface CriarUsuarioResult {
  usuario: Usuario;
  senhaTemporaria: string;
}
