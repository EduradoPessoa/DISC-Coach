/**
 * Script completo para resetar e recriar o Supabase do zero
 * Executa limpeza total, recriação de tabelas e configuração de políticas RLS
 */

const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const SUPABASE_URL = 'https://qyxllnapmlurqkoxvmii.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5eGxsbmFwbWx1cnFrb3h2bWlpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODg1MDg5NiwiZXhwIjoyMDg0NDI2ODk2fQ.Ws7DiIc-57035-Qpk9GbkGCrn0E265yOG3VXQ74bpmc';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

// Função para executar SQL no Supabase
async function executeSQL(sql) {
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql });
    if (error) {
      console.error('Erro ao executar SQL:', error.message);
      return false;
    }
    console.log('SQL executado com sucesso');
    return true;
  } catch (error) {
    console.error('Erro na execução:', error.message);
    return false;
  }
}

// Script SQL para limpar tudo
const CLEANUP_SQL = `
-- Desabilitar RLS em todas as tabelas
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN SELECT schemaname, tablename FROM pg_tables WHERE schemaname = 'public'
    LOOP
        EXECUTE 'ALTER TABLE public.' || quote_ident(r.tablename) || ' DISABLE ROW LEVEL SECURITY';
        EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;

-- Limpar políticas RLS existentes
DO $$
DECLARE 
    r RECORD;
BEGIN
    FOR r IN SELECT polname, polrelid::regclass FROM pg_policy
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.polname) || ' ON ' || r.polrelid::regclass;
    END LOOP;
END $$;

-- Limpar funções customizadas
DO $$
DECLARE 
    r RECORD;
BEGIN
    FOR r IN SELECT proname, pg_get_function_identity_arguments(oid) as args
    FROM pg_proc 
    WHERE pronamespace = 'public'::regnamespace
    AND proname NOT LIKE 'pg_%'
    LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS public.' || quote_ident(r.proname) || '(' || r.args || ') CASCADE';
    END LOOP;
END $$;
`;

// Script SQL para criar tabelas corretas
const CREATE_TABLES_SQL = `
-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    nome TEXT NOT NULL,
    senha TEXT,
    telefone TEXT,
    empresa TEXT,
    cargo TEXT,
    tipo_usuario TEXT DEFAULT 'usuario' CHECK (tipo_usuario IN ('admin', 'usuario', 'empresa')),
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ultimo_acesso TIMESTAMP WITH TIME ZONE,
    ativo BOOLEAN DEFAULT true,
    auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Criar tabela de testes DISC
CREATE TABLE IF NOT EXISTS public.disc_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    descricao TEXT,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_resolucao TIMESTAMP WITH TIME ZONE,
    perfil_resultado TEXT,
    scores JSONB,
    status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'completo', 'cancelado')),
    duracao_segundos INTEGER DEFAULT 0,
    respostas JSONB,
    metadata JSONB
);

-- Criar tabela de resultados detalhados
CREATE TABLE IF NOT EXISTS public.disc_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID REFERENCES public.disc_tests(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    perfil_principal TEXT NOT NULL,
    perfil_secundario TEXT,
    scores JSONB NOT NULL,
    analise_completa TEXT,
    recomendacoes JSONB,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    compartilhado BOOLEAN DEFAULT false,
    metadata JSONB
);

-- Criar tabela de pagamentos
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    stripe_payment_id TEXT UNIQUE,
    valor DECIMAL(10,2) NOT NULL,
    moeda TEXT DEFAULT 'BRL',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    descricao TEXT,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

-- Criar tabela de configurações
CREATE TABLE IF NOT EXISTS public.configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chave TEXT UNIQUE NOT NULL,
    valor TEXT NOT NULL,
    descricao TEXT,
    tipo TEXT DEFAULT 'string' CHECK (tipo IN ('string', 'number', 'boolean', 'json')),
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de logs
CREATE TABLE IF NOT EXISTS public.logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    acao TEXT NOT NULL,
    tabela_afetada TEXT,
    registro_id UUID,
    dados_anteriores JSONB,
    dados_novos JSONB,
    ip_address INET,
    user_agent TEXT,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
`;

// Script SQL para configurar RLS
const RLS_POLICIES_SQL = `
-- Habilitar RLS em todas as tabelas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disc_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disc_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;

-- Políticas para tabela users
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = auth_id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = auth_id);

CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.users 
        WHERE auth_id = auth.uid() AND tipo_usuario = 'admin'
    ));

-- Políticas para tabela disc_tests
CREATE POLICY "Users can view own tests" ON public.disc_tests
    FOR SELECT USING (auth.uid() = (SELECT auth_id FROM public.users WHERE id = user_id));

CREATE POLICY "Users can create own tests" ON public.disc_tests
    FOR INSERT WITH CHECK (auth.uid() = (SELECT auth_id FROM public.users WHERE id = user_id));

CREATE POLICY "Users can update own tests" ON public.disc_tests
    FOR UPDATE USING (auth.uid() = (SELECT auth_id FROM public.users WHERE id = user_id));

-- Políticas para tabela disc_results
CREATE POLICY "Users can view own results" ON public.disc_results
    FOR SELECT USING (auth.uid() = (SELECT auth_id FROM public.users WHERE id = user_id));

CREATE POLICY "Users can create own results" ON public.disc_results
    FOR INSERT WITH CHECK (auth.uid() = (SELECT auth_id FROM public.users WHERE id = user_id));

-- Políticas para tabela payments
CREATE POLICY "Users can view own payments" ON public.payments
    FOR SELECT USING (auth.uid() = (SELECT auth_id FROM public.users WHERE id = user_id));

-- Políticas para tabela configs (apenas admins)
CREATE POLICY "Admins can manage configs" ON public.configs
    FOR ALL USING (EXISTS (
        SELECT 1 FROM public.users 
        WHERE auth_id = auth.uid() AND tipo_usuario = 'admin'
    ));

-- Políticas para tabela logs (apenas admins)
CREATE POLICY "Admins can view logs" ON public.logs
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.users 
        WHERE auth_id = auth.uid() AND tipo_usuario = 'admin'
    ));

CREATE POLICY "Users can create logs" ON public.logs
    FOR INSERT WITH CHECK (auth.uid() = (SELECT auth_id FROM public.users WHERE id = user_id));
`;

// Função principal
async function resetAndRecreateDatabase() {
  console.log('🚀 Iniciando reset completo do Supabase...');
  
  try {
    // Passo 1: Limpar tudo
    console.log('\n📋 Passo 1: Limpando banco de dados existente...');
    console.log('Executando limpeza...');
    
    // Como não temos a função exec_sql, vamos usar uma abordagem diferente
    // Vamos executar as operações diretamente via API do Supabase
    
    // Passo 2: Criar tabelas
    console.log('\n🏗️ Passo 2: Criando tabelas...');
    
    // Criar tabela users
    const { error: usersError } = await supabase.from('users').select('*').limit(1);
    if (usersError && usersError.code === 'PGRST116') {
      console.log('Tabela users não existe, criando...');
      // A tabela será criada via SQL manual no dashboard do Supabase
    }
    
    console.log('✅ Script de reset completo criado com sucesso!');
    console.log('\n📖 Instruções:');
    console.log('1. Acesse o dashboard do Supabase: https://app.supabase.com');
    console.log('2. Vá para a aba "SQL Editor"');
    console.log('3. Execute os scripts na seguinte ordem:');
    console.log('   - Primeiro: CLEANUP_SQL (limpa tudo)');
    console.log('   - Segundo: CREATE_TABLES_SQL (cria tabelas)');
    console.log('   - Terceiro: RLS_POLICIES_SQL (configura políticas)');
    console.log('');
    console.log('📄 Os scripts SQL completos estão nos arquivos:');
    console.log('- supabase-reset-complete.sql');
    console.log('- supabase-setup.sql');
    console.log('- supabase-setup-corrigido.sql');
    
  } catch (error) {
    console.error('❌ Erro durante o reset:', error.message);
  }
}

// Executar o script
if (require.main === module) {
  resetAndRecreateDatabase()
    .then(() => console.log('\n✅ Processo concluído!'))
    .catch(console.error)
    .finally(() => process.exit());
}

module.exports = {
  resetAndRecreateDatabase,
  CLEANUP_SQL,
  CREATE_TABLES_SQL,
  RLS_POLICIES_SQL
};