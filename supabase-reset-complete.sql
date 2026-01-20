-- Script para LIMPAR e RECRIAR tudo no Supabase do zero
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. DESATIVAR RLS temporariamente para permitir limpeza
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_areas DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations DISABLE ROW LEVEL SECURITY;

-- 2. APAGAR todas as políticas existentes
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "SaaS admins can view all users" ON public.users;

DROP POLICY IF EXISTS "Users can view own assessments" ON public.assessments;
DROP POLICY IF EXISTS "Users can create own assessments" ON public.assessments;

DROP POLICY IF EXISTS "Users can view own focus areas" ON public.focus_areas;
DROP POLICY IF EXISTS "Users can create own focus areas" ON public.focus_areas;
DROP POLICY IF EXISTS "Users can update own focus areas" ON public.focus_areas;
DROP POLICY IF EXISTS "Users can delete own focus areas" ON public.focus_areas;

DROP POLICY IF EXISTS "Authenticated users can create invitations" ON public.invitations;
DROP POLICY IF EXISTS "Users can view own invitations" ON public.invitations;

-- 3. APAGAR triggers existentes
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
DROP TRIGGER IF EXISTS update_assessments_updated_at ON public.assessments;
DROP TRIGGER IF EXISTS update_focus_areas_updated_at ON public.focus_areas;

-- 4. APAGAR funções existentes
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.update_updated_at_column();

-- 5. APAGAR índices existentes
DROP INDEX IF EXISTS idx_users_email;
DROP INDEX IF EXISTS idx_users_role;
DROP INDEX IF EXISTS idx_assessments_user_id;
DROP INDEX IF EXISTS idx_focus_areas_user_id;
DROP INDEX IF EXISTS idx_focus_areas_status;
DROP INDEX IF EXISTS idx_invitations_email;
DROP INDEX IF EXISTS idx_invitations_status;

-- 6. APAGAR tabelas existentes
DROP TABLE IF EXISTS public.invitations CASCADE;
DROP TABLE IF EXISTS public.focus_areas CASCADE;
DROP TABLE IF EXISTS public.assessments CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- 7. RECRIAR tabelas do zero
-- Criar tabela de usuários (estende a auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'team-admin', 'saas-admin')),
    position TEXT DEFAULT '',
    department TEXT DEFAULT '',
    plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
    subscription_status TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de assessments
CREATE TABLE public.assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    answers JSONB NOT NULL,
    scores JSONB NOT NULL,
    disc_profile TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de áreas de foco
CREATE TABLE public.focus_areas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    target_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de convites
CREATE TABLE public.invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'team-admin')),
    invited_by UUID REFERENCES auth.users(id),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '7 days'
);

-- 8. Criar índices para performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_assessments_user_id ON public.assessments(user_id);
CREATE INDEX idx_focus_areas_user_id ON public.focus_areas(user_id);
CREATE INDEX idx_focus_areas_status ON public.focus_areas(status);
CREATE INDEX idx_invitations_email ON public.invitations(email);
CREATE INDEX idx_invitations_status ON public.invitations(status);

-- 9. Função para atualizar timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 10. Triggers para updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assessments_updated_at
    BEFORE UPDATE ON public.assessments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_focus_areas_updated_at
    BEFORE UPDATE ON public.focus_areas
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 11. Função para criar usuário automaticamente após registro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, name, email, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        NEW.email,
        CASE 
            WHEN NEW.email = 'eduardo@phoenyx.com.br' THEN 'saas-admin'
            ELSE 'user'
        END
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Trigger para criar usuário automaticamente
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 13. ATIVAR RLS novamente
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- 14. Criar políticas de segurança RLS (Row Level Security)

-- Políticas para tabela users
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "SaaS admins can view all users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'saas-admin'
        )
    );

-- Políticas para tabela assessments
CREATE POLICY "Users can view own assessments" ON public.assessments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own assessments" ON public.assessments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para tabela focus_areas
CREATE POLICY "Users can view own focus areas" ON public.focus_areas
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own focus areas" ON public.focus_areas
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own focus areas" ON public.focus_areas
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own focus areas" ON public.focus_areas
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para tabela invitations
CREATE POLICY "Authenticated users can create invitations" ON public.invitations
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view own invitations" ON public.invitations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.invitations
            WHERE invited_by = auth.uid()
        )
    );

-- 15. Verificar se tudo foi criado corretamente
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 16. Verificar políticas RLS
SELECT schemaname, tablename, policyname, cmd FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;

-- 17. Mensagem de sucesso
SELECT '✅ SUPABASE COMPLETAMENTE RECRIADO COM SUCESSO!' as status;