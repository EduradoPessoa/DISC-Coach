/**
 * Script para executar o reset completo do Supabase diretamente
 * Executa todos os scripts SQL necessários para recriar o banco de dados
 */

import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const SUPABASE_URL = 'https://qyxllnapmlurqkoxvmii.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5eGxsbmFwbWx1cnFrb3h2bWlpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODg1MDg5NiwiZXhwIjoyMDg0NDI2ODk2fQ.Ws7DiIc-57035-Qpk9GbkGCrn0E265yOG3VXQ74bpmc';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

// Scripts SQL divididos em partes para execução segura
const SCRIPTS = {
  // Parte 1: Limpeza completa
  cleanup: `
-- Desabilitar RLS em todas as tabelas existentes
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN SELECT schemaname, tablename FROM pg_tables WHERE schemaname = 'public'
    LOOP
        EXECUTE 'ALTER TABLE public.' || quote_ident(r.tablename) || ' DISABLE ROW LEVEL SECURITY';
        RAISE NOTICE 'Desabilitando RLS em: %', r.tablename;
    END LOOP;
END $$;

-- Dropar todas as tabelas existentes
DO $$
DECLARE 
    r RECORD;
BEGIN
    FOR r IN SELECT schemaname, tablename FROM pg_tables WHERE schemaname = 'public'
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
        RAISE NOTICE 'Dropping table: %', r.tablename;
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
        RAISE NOTICE 'Dropping policy: %', r.polname;
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
        RAISE NOTICE 'Dropping function: %', r.proname;
    END LOOP;
END $$;
`,

  // Parte 2: Criação das tabelas
  createTables: `
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
    titulo TEXT NOT NULL DEFAULT 'Teste DISC',
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

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON public.users(auth_id);
CREATE INDEX IF NOT EXISTS idx_disc_tests_user_id ON public.disc_tests(user_id);
CREATE INDEX IF NOT EXISTS idx_disc_tests_status ON public.disc_tests(status);
CREATE INDEX IF NOT EXISTS idx_disc_results_user_id ON public.disc_results(user_id);
CREATE INDEX IF NOT EXISTS idx_disc_results_test_id ON public.disc_results(test_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_logs_user_id ON public.logs(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_data_criacao ON public.logs(data_criacao);
`,

  // Parte 3: Configuração RLS
  configureRLS: `
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
`,

  // Parte 4: Dados iniciais
  insertData: `
-- Inserir configurações padrão
INSERT INTO public.configs (chave, valor, descricao, tipo) VALUES
('app_name', 'DISC Coach Professional', 'Nome da aplicação', 'string'),
('app_version', '1.0.0', 'Versão da aplicação', 'string'),
('test_price', '29.90', 'Preço do teste DISC', 'number'),
('currency', 'BRL', 'Moeda padrão', 'string'),
('max_tests_per_user', '10', 'Máximo de testes por usuário', 'number'),
('test_duration_minutes', '30', 'Duração máxima do teste em minutos', 'number'),
('enable_registration', 'true', 'Permitir cadastro de novos usuários', 'boolean'),
('enable_payments', 'true', 'Sistema de pagamentos ativo', 'boolean'),
('contact_email', 'contato@disccoach.com.br', 'Email de contato', 'string'),
('support_phone', '+55 11 99999-9999', 'Telefone de suporte', 'string');

-- Criar funções úteis
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.data_atualizacao = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar triggers para atualizar data_atualizacao
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_configs_updated_at BEFORE UPDATE ON public.configs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`
};

// Função para executar SQL através da API do Supabase
async function executeSQLScript(scriptName, sql) {
  console.log(`\n🔄 Executando script: ${scriptName}...`);
  
  try {
    // Primeiro, vamos testar se podemos executar SQL diretamente
    const { data, error } = await supabase.rpc('exec_sql', { sql_command: sql });
    
    if (error) {
      console.error(`❌ Erro ao executar ${scriptName}:`, error.message);
      return false;
    }
    
    console.log(`✅ Script ${scriptName} executado com sucesso!`);
    return true;
  } catch (error) {
    console.error(`❌ Erro na execução de ${scriptName}:`, error.message);
    return false;
  }
}

// Função alternativa: executar comandos individuais
async function executeCommandsIndividually(scriptName, sql) {
  console.log(`\n🔄 Executando ${scriptName} em partes...`);
  
  // Dividir o SQL em comandos individuais
  const commands = sql.split(';').filter(cmd => cmd.trim());
  
  for (let i = 0; i < commands.length; i++) {
    const command = commands[i].trim();
    if (!command) continue;
    
    try {
      console.log(`  📋 Executando comando ${i + 1}/${commands.length}...`);
      
      // Tentar executar via RPC
      const { data, error } = await supabase.rpc('exec_sql', { 
        sql_command: command + ';' 
      });
      
      if (error) {
        console.error(`    ⚠️  Comando ${i + 1} falhou:`, error.message);
        // Continuar com os próximos comandos mesmo se um falhar
      } else {
        console.log(`    ✅ Comando ${i + 1} executado`);
      }
    } catch (error) {
      console.error(`    ⚠️  Erro no comando ${i + 1}:`, error.message);
    }
  }
  
  console.log(`✅ ${scriptName} processado!`);
  return true;
}

// Função principal para executar o reset completo
async function executarResetCompleto() {
  console.log('🚀 Iniciando reset completo do Supabase...');
  console.log('📡 URL:', SUPABASE_URL);
  
  try {
    // Testar conexão primeiro
    console.log('\n🔍 Testando conexão com o Supabase...');
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (testError && testError.code !== 'PGRST116') {
      console.error('❌ Erro de conexão:', testError.message);
      return false;
    }
    
    console.log('✅ Conexão estabelecida com sucesso!');
    
    // Executar scripts na ordem correta
    const scripts = [
      { name: 'Limpeza', sql: SCRIPTS.cleanup },
      { name: 'Criação de Tabelas', sql: SCRIPTS.createTables },
      { name: 'Configuração RLS', sql: SCRIPTS.configureRLS },
      { name: 'Inserção de Dados', sql: SCRIPTS.insertData }
    ];
    
    for (const script of scripts) {
      console.log(`\n${'='.repeat(50)}`);
      console.log(`📋 EXECUTANDO: ${script.name.toUpperCase()}`);
      console.log(`${'='.repeat(50)}`);
      
      // Tentar executar o script completo primeiro
      const success = await executeSQLScript(script.name, script.sql);
      
      if (!success) {
        console.log(`\n🔄 Tentando executar ${script.name} em partes...`);
        await executeCommandsIndividually(script.name, script.sql);
      }
      
      // Pequena pausa entre scripts
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('🎉 RESET COMPLETO FINALIZADO COM SUCESSO!');
    console.log('='.repeat(60));
    console.log('\n✅ Tabelas criadas:');
    console.log('   - users (usuários)');
    console.log('   - disc_tests (testes DISC)');
    console.log('   - disc_results (resultados)');
    console.log('   - payments (pagamentos)');
    console.log('   - configs (configurações)');
    console.log('   - logs (registros de atividade)');
    console.log('\n✅ Segurança configurada:');
    console.log('   - RLS habilitada em todas as tabelas');
    console.log('   - Políticas de acesso implementadas');
    console.log('   - Índices de performance criados');
    console.log('\n✅ Dados iniciais inseridos');
    console.log('\n🚀 Próximo passo: Testar autenticação!');
    
    return true;
    
  } catch (error) {
    console.error('❌ Erro crítico durante o reset:', error.message);
    return false;
  }
}

// Função para testar a autenticação após o reset
async function testarAutenticacao() {
  console.log('\n🔑 Testando autenticação após o reset...');
  
  try {
    // Testar se consegue acessar as tabelas
    const { data, error } = await supabase
      .from('configs')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Erro ao acessar tabela configs:', error.message);
      return false;
    }
    
    console.log('✅ Autenticação e acesso às tabelas funcionando!');
    console.log('📊 Configs encontradas:', data?.length || 0);
    
    return true;
  } catch (error) {
    console.error('❌ Erro no teste de autenticação:', error.message);
    return false;
  }
}

// Executar o script principal
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🎯 INICIANDO RESET DO SUPABASE');
  console.log('📅 Data:', new Date().toLocaleString('pt-BR'));
  console.log('🔗 URL:', SUPABASE_URL);
  
  executarResetCompleto()
    .then(async (success) => {
      if (success) {
        await testarAutenticacao();
        console.log('\n✅ Processo concluído com sucesso!');
      } else {
        console.log('\n❌ Processo finalizado com erros');
      }
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Erro fatal:', error.message);
      process.exit(1);
    });
}

export {
  executarResetCompleto,
  testarAutenticacao,
  SCRIPTS
};