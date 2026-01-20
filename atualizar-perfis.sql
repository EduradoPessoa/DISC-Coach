-- =============================================
-- SCRIPT PARA DEFINIR PERFIS DE USUÁRIO (ROLES)
-- =============================================
-- Instruções:
-- 1. Cadastre os usuários na aplicação (Sign Up)
-- 2. Copie este script para o SQL Editor do Supabase
-- 3. Substitua os e-mails abaixo pelos e-mails reais cadastrados
-- 4. Execute o script
-- =============================================

-- 1. Definir Admin SaaS (Acesso Total)
-- Substitua 'admin@saas.com' pelo e-mail do seu administrador
UPDATE public.users 
SET role = 'saas-admin' 
WHERE email = 'admin@saas.com'; 

-- 2. Definir Admin de Time (Gestor)
-- Substitua 'gestor@time.com' pelo e-mail do seu gestor
UPDATE public.users 
SET role = 'team-admin' 
WHERE email = 'gestor@time.com';

-- 3. Garantir que o User Comum tenha o role correto
-- Substitua 'usuario@empresa.com' pelo e-mail do usuário comum
UPDATE public.users 
SET role = 'user' 
WHERE email = 'usuario@empresa.com';

-- =============================================
-- VERIFICAR RESULTADOS
-- =============================================
SELECT email, role, created_at FROM public.users ORDER BY created_at DESC;
