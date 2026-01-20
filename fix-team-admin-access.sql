-- Script para permitir que Admins de Time vejam seus membros e dados relacionados
-- Executar no SQL Editor do Supabase

-- 1. Política para visualizar usuários (Membros do time)
-- Permite ver usuários que foram convidados pelo usuário atual
DROP POLICY IF EXISTS "Team Admins can view their team members" ON public.users;
CREATE POLICY "Team Admins can view their team members" ON public.users
    FOR SELECT USING (invited_by = auth.uid()::text OR id = auth.uid());

-- 2. Política para visualizar assessments (Testes DISC) dos membros do time
DROP POLICY IF EXISTS "Team Admins can view team assessments" ON public.assessments;
CREATE POLICY "Team Admins can view team assessments" ON public.assessments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = assessments.user_id
            AND invited_by = auth.uid()::text
        )
    );

-- 3. Política para visualizar planos de desenvolvimento (Focus Areas) dos membros do time
DROP POLICY IF EXISTS "Team Admins can view team focus areas" ON public.focus_areas;
CREATE POLICY "Team Admins can view team focus areas" ON public.focus_areas
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = focus_areas.user_id
            AND invited_by = auth.uid()::text
        )
    );
