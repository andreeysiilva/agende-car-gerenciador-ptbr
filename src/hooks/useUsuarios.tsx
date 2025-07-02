
import { useState, useEffect } from 'react';
import { Usuario, NovoUsuarioData } from '@/types/usuario';
import {
  fetchUsuariosEmpresa,
  criarUsuarioEmpresa,
  atualizarUsuarioEmpresa,
  deletarUsuarioEmpresa,
  resetarSenhaUsuario
} from '@/services/usuarioService';

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsuarios = async () => {
    setIsLoading(true);
    const data = await fetchUsuariosEmpresa();
    if (data) {
      setUsuarios(data);
    }
    setIsLoading(false);
  };

  const criarUsuario = async (dadosUsuario: NovoUsuarioData) => {
    const result = await criarUsuarioEmpresa(dadosUsuario);
    if (result) {
      setUsuarios(prev => [result.usuario, ...prev]);
    }
    return result;
  };

  const atualizarUsuario = async (id: string, dadosAtualizados: Partial<Usuario>) => {
    const data = await atualizarUsuarioEmpresa(id, dadosAtualizados);
    if (data) {
      setUsuarios(prev => prev.map(user => user.id === id ? data : user));
    }
    return data;
  };

  const deletarUsuario = async (id: string) => {
    const success = await deletarUsuarioEmpresa(id);
    if (success) {
      setUsuarios(prev => prev.filter(user => user.id !== id));
    }
    return success;
  };

  const resetarSenha = async (email: string) => {
    return await resetarSenhaUsuario(email);
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return {
    usuarios,
    isLoading,
    criarUsuario,
    atualizarUsuario,
    deletarUsuario,
    resetarSenha,
    recarregarUsuarios: fetchUsuarios
  };
}
