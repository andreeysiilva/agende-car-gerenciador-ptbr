
// Utilitários para geração de links padronizados do sistema
export const BASE_DOMAIN = 'agendicar.com.br';

export const generateSubdomainUrl = (subdomain: string, path: string = '') => {
  const protocol = window.location.protocol;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${protocol}//${subdomain}.${BASE_DOMAIN}${cleanPath}`;
};

export const isProduction = () => {
  return window.location.hostname !== 'localhost' && !window.location.hostname.includes('lovable.app');
};

export const getClientLoginUrl = (subdomain?: string) => {
  if (subdomain && isProduction()) {
    return generateSubdomainUrl(subdomain, '/login');
  }
  return '/cliente/login';
};

export const getClientDashboardUrl = (subdomain?: string) => {
  if (subdomain && isProduction()) {
    return generateSubdomainUrl(subdomain, '/dashboard');
  }
  return '/app/dashboard';
};

export const getAdminLoginUrl = () => {
  return '/login';
};

export const getAdminDashboardUrl = () => {
  return '/admin/dashboard';
};
