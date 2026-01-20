-- Script para popular dados de teste no Supabase
-- Execute este script APÓS criar as tabelas e ter usuários cadastrados

-- 1. Verificar usuários existentes na tabela auth.users
SELECT id, email, raw_user_meta_data FROM auth.users ORDER BY created_at DESC;

-- 2. Inserir dados de teste para usuários existentes
-- ⚠️ IMPORTANTE: Substitua os IDs pelos IDs reais dos usuários cadastrados

-- Exemplo de inserção para um usuário específico:
-- (Execute este comando após verificar os IDs reais)
/*
INSERT INTO public.users (id, name, email, role, position, department, plan) VALUES
('ID_DO_USUARIO_AQUI', 'Nome do Usuário', 'email@exemplo.com', 'user', 'Cargo', 'Departamento', 'free')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    position = EXCLUDED.position,
    department = EXCLUDED.department,
    plan = EXCLUDED.plan,
    updated_at = NOW();
*/

-- 3. Inserir dados de teste para assessments
-- Execute este comando após ter usuários cadastrados
/*
INSERT INTO public.assessments (user_id, answers, scores, disc_profile) VALUES
('ID_DO_USUARIO_1', 
 '{"q1": "a", "q2": "b", "q3": "c", "q4": "d"}', 
 '{"D": 85, "I": 70, "S": 45, "C": 30}', 
 'Dominante'),
('ID_DO_USUARIO_2', 
 '{"q1": "b", "q2": "a", "q3": "d", "q4": "c"}', 
 '{"D": 40, "I": 90, "S": 60, "C": 25}', 
 'Influente')
ON CONFLICT DO NOTHING;
*/

-- 4. Inserir dados de teste para focus areas
-- Execute este comando após ter usuários cadastrados
/*
INSERT INTO public.focus_areas (user_id, title, description, category, priority, status, target_date) VALUES
('ID_DO_USUARIO_1', 'Melhorar Comunicação', 'Desenvolver habilidades de comunicação assertiva', 'Comunicação', 'high', 'pending', CURRENT_DATE + INTERVAL '30 days'),
('ID_DO_USUARIO_1', 'Liderança de Equipe', 'Aprimorar liderança e gestão de equipes', 'Liderança', 'medium', 'in_progress', CURRENT_DATE + INTERVAL '60 days'),
('ID_DO_USUARIO_2', 'Gestão do Tempo', 'Melhorar organização e produtividade', 'Produtividade', 'high', 'pending', CURRENT_DATE + INTERVAL '15 days');
*/

-- 5. Inserir dados de teste para invitations
-- Execute este comando após ter usuários cadastrados
/*
INSERT INTO public.invitations (email, role, invited_by, status) VALUES
('novo1@exemplo.com', 'user', 'ID_DO_USUARIO_ADMIN', 'pending'),
('novo2@exemplo.com', 'team-admin', 'ID_DO_USUARIO_ADMIN', 'pending');
*/

-- 6. Comandos úteis para verificar os dados

-- Ver todos os usuários
SELECT u.*, au.email as auth_email, au.created_at as auth_created_at
FROM public.users u
JOIN auth.users au ON u.id = au.id
ORDER BY u.created_at DESC;

-- Ver todos os assessments com informações do usuário
SELECT a.*, u.name as user_name, u.email as user_email
FROM public.assessments a
JOIN public.users u ON a.user_id = u.id
ORDER BY a.created_at DESC;

-- Ver todas as focus areas com informações do usuário
SELECT fa.*, u.name as user_name
FROM public.focus_areas fa
JOIN public.users u ON fa.user_id = u.id
ORDER BY fa.priority, fa.created_at DESC;

-- Ver todos os convites com informações do usuário que convidou
SELECT i.*, u.name as invited_by_name
FROM public.invitations i
LEFT JOIN public.users u ON i.invited_by = u.id
ORDER BY i.created_at DESC;

-- 7. Limpar dados de teste (se necessário)
/*
-- Apagar focus areas
DELETE FROM public.focus_areas WHERE user_id IN (SELECT id FROM public.users WHERE email LIKE '%@exemplo.com');

-- Apagar assessments
DELETE FROM public.assessments WHERE user_id IN (SELECT id FROM public.users WHERE email LIKE '%@exemplo.com');

-- Apagar invitations
DELETE FROM public.invitations WHERE email LIKE '%@exemplo.com';

-- Apagar users (apenas os que não são do auth.users)
DELETE FROM public.users WHERE email LIKE '%@exemplo.com';
*/