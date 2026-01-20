# GUIA COMPLETO: RESET DO SUPABASE E RECRIAÇÃO DAS TABELAS

## 📋 RESUMO
Este guia ensina como resetar completamente o Supabase e recriar todas as tabelas com as configurações corretas de autenticação e segurança.

## ⚠️ ATENÇÃO
- **ESTE PROCESSO APAGARÁ TODOS OS DADOS EXISTENTES**
- Faça backup dos dados importantes antes de executar
- Execute os passos na ordem exata apresentada

## 🚀 PASSO A PASSO COMPLETO

### PASSO 1: Acessar o Dashboard do Supabase

1. Acesse: https://app.supabase.com
2. Faça login com suas credenciais
3. Selecione o projeto: `qyxllnapmlurqkoxvmii` (ou seu projeto)
4. No menu lateral, clique em **"SQL Editor"**

### PASSO 2: Executar o Script de Limpeza

1. Abra um novo arquivo no SQL Editor
2. Copie e cole o script de limpeza abaixo:

```sql
-- =============================================
-- PARTE 1: LIMPEZA COMPLETA
-- =============================================

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
```

3. Clique em **"RUN"** (ou pressione Ctrl+Enter)
4. Aguarde a confirmação de sucesso

### PASSO 3: Criar as Tabelas

1. Crie um novo arquivo no SQL Editor
2. Copie e cole o script de criação das tabelas:

```sql
-- =============================================
-- PARTE 2: CRIAÇÃO DAS TABELAS
-- =============================================

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
```

3. Execute o script clicando em **"RUN"**

### PASSO 4: Configurar RLS (Row Level Security)

1. Crie um novo arquivo no SQL Editor
2. Copie e cole o script de configuração RLS:

```sql
-- =============================================
-- PARTE 3: CONFIGURAÇÃO RLS (ROW LEVEL SECURITY)
-- =============================================

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
```

3. Execute o script

### PASSO 5: Inserir Dados Iniciais

1. Crie um novo arquivo no SQL Editor
2. Copie e cole o script de dados iniciais:

```sql
-- =============================================
-- PARTE 4: DADOS INICIAIS
-- =============================================

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
```

3. Execute o script

## ✅ VERIFICAÇÃO FINAL

Após executar todos os passos, você deve ter:

1. ✅ **Tabelas criadas**: users, disc_tests, disc_results, payments, configs, logs
2. ✅ **RLS configurada**: Políticas de segurança aplicadas
3. ✅ **Índices criados**: Performance otimizada
4. ✅ **Dados iniciais**: Configurações padrão inseridas
5. ✅ **Funções e triggers**: Atualização automática de timestamps

## 🧪 TESTE DE AUTENTICAÇÃO

1. Abra o arquivo `teste-supabase-auth.html` no navegador
2. Teste a conexão com o Supabase
3. Crie um novo usuário de teste
4. Faça login com o novo usuário
5. Verifique se os dados estão sendo salvos corretamente

## 📋 ARQUIVOS IMPORTANTES

- `supabase-reset-completo.sql` - Script completo para reset
- `supabase-complete-reset.js` - Script Node.js auxiliar
- `teste-supabase-auth.html` - Interface de teste
- `fix-credentials.js` - Script para criar usuários de teste

## 🆘 SOLUÇÃO DE PROBLEMAS

### Erro: "permission denied"
- Verifique se está usando a **service role key** (não a anon key)
- Certifique-se de ter permissões de admin no projeto Supabase

### Erro: "table does not exist"
- Execute os scripts na ordem correta (primeiro limpeza, depois criação)
- Verifique se não há erros de sintaxe nos scripts SQL

### Erro: "policy already exists"
- Execute o script de limpeza completa antes de recriar as políticas
- Use `DROP POLICY IF EXISTS` para garantir que políticas antigas sejam removidas

## 📞 SUPORTE

Se ainda tiver problemas:
1. Verifique os logs no dashboard do Supabase
2. Use a interface de teste `teste-supabase-auth.html`
3. Execute o script `fix-credentials.js` para criar usuários de teste
4. Revise as configurações do arquivo `.env`

---

**✅ APÓS COMPLETAR ESTE PROCESSO, SEU SUPABASE ESTARÁ TOTALMENTE CONFIGURADO E FUNCIONAL!**