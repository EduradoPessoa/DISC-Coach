-- =============================================
-- CORREÇÃO DE PERMISSÃO RLS (Erro 403 / 42501)
-- =============================================
-- Este script corrige o erro "new row violates row-level security policy"
-- permitindo que o usuário insira seus próprios dados se o trigger falhar
-- ou se o front-end tentar fazer um UPSERT.

-- 1. Habilitar política de INSERT para a tabela users
-- (Permite que o usuário crie seu próprio perfil se ele não existir)
CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Reforçar política de UPDATE (para garantir que UPSERT funcione)
-- (Caso a política anterior não cubra todos os campos ou tenha sido removida)
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- 3. Mensagem de confirmação
SELECT '✅ Políticas RLS corrigidas com sucesso!' as status;
