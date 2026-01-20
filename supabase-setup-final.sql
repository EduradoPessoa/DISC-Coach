-- =============================================
-- CONFIGURAÇÃO FINAL E CORRIGIDA DO PROJETO SUPABASE
-- DISC COACH PROFESSIONAL
-- =============================================
-- Este script configura o banco de dados para corresponder exatamente
-- à aplicação React e corrige problemas de permissão (RLS).
--
-- INSTRUÇÕES:
-- 1. Copie todo o conteúdo deste arquivo
-- 2. Cole no SQL Editor do Supabase (https://supabase.com/dashboard/project/tpancojploqdfddxvgre/sql)
-- 3. Execute o script
-- =============================================

-- Desabilitar RLS temporariamente
ALTER TABLE IF EXISTS public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.assessments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.focus_areas DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.invitations DISABLE ROW LEVEL SECURITY;

-- Remover tabelas existentes (limpeza completa)
DROP TABLE IF EXISTS public.focus_areas CASCADE;
DROP TABLE IF EXISTS public.assessments CASCADE;
DROP TABLE IF EXISTS public.invitations CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Remover funções antigas
DROP FUNCTION IF EXISTS public.is_admin CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user CASCADE;

-- =============================================
-- PARTE 1: CRIAR TABELAS (Schema compatível com supabaseApi.ts)
-- =============================================

-- 1. Tabela users
CREATE TABLE public.users (
    id UUID PRIMARY KEY, -- Será o mesmo ID do Auth
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'user' CHECK (role IN ('saas-admin', 'team-admin', 'user')),
    position TEXT,
    department TEXT,
    plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
    subscription_status TEXT,
    invited_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela assessments (Testes DISC)
CREATE TABLE public.assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    scores JSONB NOT NULL,
    analysis JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela focus_areas (Áreas de foco)
CREATE TABLE public.focus_areas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabela invitations (Convites)
CREATE TABLE public.invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'user',
    invited_by TEXT,
    used BOOLEAN DEFAULT false,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_assessments_user_id ON public.assessments(user_id);
CREATE INDEX idx_focus_areas_user_id ON public.focus_areas(user_id);
CREATE INDEX idx_invitations_token ON public.invitations(token);

-- =============================================
-- PARTE 2: FUNÇÕES E TRIGGERS
-- =============================================

-- Função para verificar se usuário é admin (SECURITY DEFINER)
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

-- Função para criar usuário público automaticamente após signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para novos usuários
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- PARTE 3: RLS (ROW LEVEL SECURITY)
-- =============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Políticas USERS
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (public.is_admin());

-- Políticas ASSESSMENTS
CREATE POLICY "Users can view own assessments" ON public.assessments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own assessments" ON public.assessments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assessments" ON public.assessments
    FOR UPDATE USING (auth.uid() = user_id);

-- Políticas FOCUS_AREAS
CREATE POLICY "Users can view own focus areas" ON public.focus_areas
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own focus areas" ON public.focus_areas
    FOR ALL USING (auth.uid() = user_id);

-- Políticas INVITATIONS
CREATE POLICY "Admins can view invitations" ON public.invitations
    FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can create invitations" ON public.invitations
    FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Public can view invitation by token" ON public.invitations
    FOR SELECT USING (true); -- Necessário para validar token antes do login

-- =============================================
-- PARTE 4: MENSAGEM FINAL
-- =============================================

SELECT '✅ SUCESSO' as status, 'Banco de dados recriado e configurado para a aplicação' as message;
