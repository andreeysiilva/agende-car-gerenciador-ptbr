
export const formatarEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

export const validarEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const gerarEmailCredenciais = (
  nomeEmpresa: string,
  email: string,
  senhaTemporaria: string,
  subdominio: string
): string => {
  return `
    Empresa: ${nomeEmpresa}
    E-mail: ${email}
    Senha Temporária: ${senhaTemporaria}
    URL de Acesso: https://${subdominio}.agendicar.com.br
  `.trim();
};

export interface EnviarEmailParams {
  email: string;
  nomeEmpresa: string;
  empresaId: string;
  subdominio: string;
  senhaTemporaria: string;
  isResend?: boolean;
}

export interface EnviarEmailResult {
  success: boolean;
  error?: string;
}
