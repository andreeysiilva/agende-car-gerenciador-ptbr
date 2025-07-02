-- 1. Remover todas as políticas que dependem de is_global_admin()
-- Empresas
DROP POLICY IF EXISTS "Usuários podem ver sua própria empresa" ON public.empresas;
DROP POLICY IF EXISTS "Apenas admins podem criar empresas" ON public.empresas;
DROP POLICY IF EXISTS "Usuários podem atualizar sua própria empresa" ON public.empresas;
DROP POLICY IF EXISTS "Apenas admins podem deletar empresas" ON public.empresas;
DROP POLICY IF EXISTS "Global admins can manage all companies" ON public.empresas;

-- Agendamentos
DROP POLICY IF EXISTS "Usuários podem ver agendamentos da própria empresa" ON public.agendamentos;
DROP POLICY IF EXISTS "Usuários podem criar agendamentos da própria empresa" ON public.agendamentos;
DROP POLICY IF EXISTS "Usuários podem atualizar agendamentos da própria empresa" ON public.agendamentos;
DROP POLICY IF EXISTS "Usuários podem deletar agendamentos da própria empresa" ON public.agendamentos;
DROP POLICY IF EXISTS "Global admins can manage all appointments" ON public.agendamentos;

-- Clientes
DROP POLICY IF EXISTS "Usuários podem ver clientes da própria empresa" ON public.clientes;
DROP POLICY IF EXISTS "Usuários podem criar clientes da própria empresa" ON public.clientes;
DROP POLICY IF EXISTS "Usuários podem atualizar clientes da própria empresa" ON public.clientes;
DROP POLICY IF EXISTS "Usuários podem deletar clientes da própria empresa" ON public.clientes;

-- Equipes
DROP POLICY IF EXISTS "Usuários podem ver equipes da própria empresa" ON public.equipes;
DROP POLICY IF EXISTS "Usuários podem criar equipes da própria empresa" ON public.equipes;
DROP POLICY IF EXISTS "Usuários podem atualizar equipes da própria empresa" ON public.equipes;
DROP POLICY IF EXISTS "Usuários podem deletar equipes da própria empresa" ON public.equipes;

-- Horários funcionamento
DROP POLICY IF EXISTS "Usuários podem ver horários da própria empresa" ON public.horarios_funcionamento;
DROP POLICY IF EXISTS "Usuários podem criar horários da própria empresa" ON public.horarios_funcionamento;
DROP POLICY IF EXISTS "Usuários podem atualizar horários da própria empresa" ON public.horarios_funcionamento;
DROP POLICY IF EXISTS "Usuários podem deletar horários da própria empresa" ON public.horarios_funcionamento;

-- Serviços
DROP POLICY IF EXISTS "Usuários podem ver serviços da própria empresa" ON public.servicos;
DROP POLICY IF EXISTS "Usuários podem criar serviços da própria empresa" ON public.servicos;
DROP POLICY IF EXISTS "Usuários podem atualizar serviços da própria empresa" ON public.servicos;
DROP POLICY IF EXISTS "Usuários podem deletar serviços da própria empresa" ON public.servicos;

-- Transações
DROP POLICY IF EXISTS "Usuários podem ver transações da própria empresa" ON public.transacoes;
DROP POLICY IF EXISTS "Usuários podem criar transações da própria empresa" ON public.transacoes;
DROP POLICY IF EXISTS "Usuários podem atualizar transações da própria empresa" ON public.transacoes;
DROP POLICY IF EXISTS "Usuários podem deletar transações da própria empresa" ON public.transacoes;