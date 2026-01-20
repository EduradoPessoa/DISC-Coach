# 🚨 CONFIGURAÇÃO DO NOVO PROJETO SUPABASE

## 📋 INFORMAÇÕES DO NOVO PROJETO

**Projeto:** DISC Coach Professional  
**ProjectId:** `tpancojploqdfddxvgre`  
**URL:** `https://tpancojploqdfddxvgre.supabase.co`  
**Publishable key:** `sb_publishable_73NI4K2_RwneSniHlB4cmw_WLzeUYh4`  
**Secret key:** `sb_secret_ujoFn1XbaCyQPc5OUujQXA_WNRV3p0q`  

## 🎯 PASSO A PASSO PARA CONFIGURAR O NOVO PROJETO

### 1️⃣ ACESSAR O SUPABASE
1. Abra: https://app.supabase.com
2. Faça login com sua conta
3. Selecione o projeto: `tpancojploqdfddxvgre`
4. No menu lateral, clique em **"SQL Editor"**

### 2️⃣ EXECUTAR OS SCRIPTS NA ORDEM

**⚠️ IMPORTANTE:** Execute os scripts na ordem exata apresentada!

---

#### 🔥 SCRIPT 1: LIMPAR TUDO (execute primeiro)
```sql
-- APAGA TODAS AS TABELAS E POLÍTICAS EXISTENTES
DO $$
DECLARE 
    r RECORD;
BEGIN
    -- Dropar todas as tabelas
    FOR r IN SELECT schemaname, tablename FROM pg_tables WHERE schemaname = 'public'
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;
```

---

#### 🏗️ SCRIPT 2: CRIAR TABELAS
```sql
-- CRIAR TABELA DE USUÁRIOS
CREATE TABLE public.users (
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

-- CRIAR TABELA DE TESTES DISC
CREATE TABLE public.disc_tests (
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

-- CRIAR TABELA DE RESULTADOS
CREATE TABLE public.disc_results (
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

-- CRIAR TABELA DE PAGAMENTOS
CREATE TABLE public.payments (
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

-- CRIAR TABELA DE CONFIGURAÇÕES
CREATE TABLE public.configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chave TEXT UNIQUE NOT NULL,
    valor TEXT NOT NULL,
    descricao TEXT,
    tipo TEXT DEFAULT 'string' CHECK (tipo IN ('string', 'number', 'boolean', 'json')),
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CRIAR TABELA DE LOGS
CREATE TABLE public.logs (
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
```

---

#### 🔑 SCRIPT 3: HABILITAR SEGURANÇA (RLS)
```sql
-- HABILITAR ROW LEVEL SECURITY EM TODAS AS TABELAS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disc_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disc_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;
```

---

#### 🛡️ SCRIPT 4: CRIAR POLÍTICAS DE ACESSO
```sql
-- POLÍTICAS DE SEGURANÇA PARA USERS
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = auth_id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = auth_id);

-- POLÍTICAS PARA TESTES DISC
CREATE POLICY "Users can view own tests" ON public.disc_tests
    FOR SELECT USING (auth.uid() = (SELECT auth_id FROM public.users WHERE id = user_id));

CREATE POLICY "Users can create own tests" ON public.disc_tests
    FOR INSERT WITH CHECK (auth.uid() = (SELECT auth_id FROM public.users WHERE id = user_id));

-- POLÍTICAS PARA RESULTADOS
CREATE POLICY "Users can view own results" ON public.disc_results
    FOR SELECT USING (auth.uid() = (SELECT auth_id FROM public.users WHERE id = user_id));

CREATE POLICY "Users can create own results" ON public.disc_results
    FOR INSERT WITH CHECK (auth.uid() = (SELECT auth_id FROM public.users WHERE id = user_id));

-- POLÍTICAS PARA PAGAMENTOS
CREATE POLICY "Users can view own payments" ON public.payments
    FOR SELECT USING (auth.uid() = (SELECT auth_id FROM public.users WHERE id = user_id));

-- POLÍTICAS PARA CONFIGS (APENAS ADMINS)
CREATE POLICY "Admins can manage configs" ON public.configs
    FOR ALL USING (EXISTS (
        SELECT 1 FROM public.users 
        WHERE auth_id = auth.uid() AND tipo_usuario = 'admin'
    ));
```

---

#### 💾 SCRIPT 5: INSERIR CONFIGURAÇÕES PADRÃO
```sql
-- CONFIGURAÇÕES INICIAIS DO SISTEMA
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
```

---

### 3️⃣ TESTAR O SISTEMA

1. **Abra o arquivo**: `teste-supabase-auth.html` no navegador
2. **Clique em "Testar Conexão"** para verificar se conecta ao novo projeto
3. **Use o formulário de registro** para criar um novo usuário
4. **Faça login** para testar a autenticação
5. **Verifique os dados** sendo salvos no Supabase

## ✅ CONFIRMAÇÃO DE SUCESSO

Após executar todos os scripts, você terá:

- ✅ **6 tabelas criadas** com estrutura completa
- ✅ **RLS habilitada** em todas as tabelas
- ✅ **Políticas de segurança** configuradas
- ✅ **Configurações padrão** inseridas
- ✅ **Sistema de autenticação** funcionando

## 🆘 SE TIVER PROBLEMAS

1. **"Permission denied"** → Verifique se está usando a **secret key** correta
2. **"Table already exists"** → Execute o script 1 (limpeza) novamente
3. **"Syntax error"** → Copie o script exatamente como está (sem modificar)
4. **Conexão falha** → Verifique as credenciais no arquivo `.env`

## 📞 SUPORTE IMEDIATO

Se precisar de ajuda:
1. Verifique os logs no dashboard do Supabase
2. Teste com `teste-supabase-auth.html` primeiro
3. Crie um usuário de teste manualmente
4. Confirme que as credenciais estão corretas no `.env`

---

**🎯 APÓS EXECUTAR ESTES 5 SCRIPTS, SEU NOVO SUPABASE ESTARÁ 100% FUNCIONAL!**