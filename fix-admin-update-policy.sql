-- Script para corrigir permissão de update para admins
-- Executar no SQL Editor do Supabase

-- 1. Verificar se a função is_admin existe (para segurança)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.users
    WHERE id = auth.uid()
    AND role IN ('saas-admin', 'team-admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Adicionar política para permitir que admins atualizem qualquer usuário
-- Primeiro removemos se já existir para evitar erro
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;
DROP POLICY IF EXISTS "SaaS admins can update all users" ON public.users;

-- Cria a política usando a função is_admin (ou verificação direta de role)
CREATE POLICY "Admins can update all users" ON public.users
    FOR UPDATE USING (public.is_admin());

-- 3. Opcional: Permitir que admins excluam usuários (caso necessário para o botão de exclusão)
DROP POLICY IF EXISTS "Admins can delete users" ON public.users;

CREATE POLICY "Admins can delete users" ON public.users
    FOR DELETE USING (public.is_admin());
