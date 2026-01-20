# GUIA RÁPIDO: RESET DO SUPABASE PELO DASHBOARD

## 🚀 PASSO A PASSO IMEDIATO

### 1. ACESSAR O SUPABASE
- Vá para: https://app.supabase.com
- Faça login
- Selecione o projeto: `qyxllnapmlurqkoxvmii`

### 2. EXECUTAR SCRIPTS NO SQL EDITOR

**Copie e cole cada script abaixo na aba SQL Editor e execute (clique em "RUN"):**

#### 📋 SCRIPT 1: LIMPEZA COMPLETA
```sql
-- LIMPAR TUDO (execute primeiro)
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN SELECT schemaname, tablename FROM pg_tables WHERE schemaname = 'public'
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;
```

#### 🏗️ SCRIPT 2: CRIAR TABELAS
```sql
-- CRIAR TABELAS
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

CREATE TABLE IF NOT EXISTS public.configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chave TEXT UNIQUE NOT NULL,
    valor TEXT NOT NULL,
    descricao TEXT,
    tipo TEXT DEFAULT 'string' CHECK (tipo IN ('string', 'number', 'boolean', 'json')),
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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
```

#### 🛡️ SCRIPT 3: CONFIGURAR SEGURANÇA (RLS)
```sql
-- HABILITAR RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disc_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disc_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS DE SEGURANÇA
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = auth_id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = auth_id);

CREATE POLICY "Users can view own tests" ON public.disc_tests
    FOR SELECT USING (auth.uid() = (SELECT auth_id FROM public.users WHERE id = user_id));

CREATE POLICY "Users can create own tests" ON public.disc_tests
    FOR INSERT WITH CHECK (auth.uid() = (SELECT auth_id FROM public.users WHERE id = user_id));

CREATE POLICY "Users can view own results" ON public.disc_results
    FOR SELECT USING (auth.uid() = (SELECT auth_id FROM public.users WHERE id = user_id));

CREATE POLICY "Users can view own payments" ON public.payments
    FOR SELECT USING (auth.uid() = (SELECT auth_id FROM public.users WHERE id = user_id));
```

#### 💾 SCRIPT 4: DADOS INICIAIS
```sql
-- INSERIR CONFIGURAÇÕES PADRÃO
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

### 3. TESTAR O SISTEMA

1. **Abra o arquivo**: `teste-supabase-auth.html` no navegador
2. **Teste a conexão** com o botão "Testar Conexão"
3. **Crie um usuário de teste** com o formulário de registro
4. **Faça login** para verificar se a autenticação está funcionando

## ✅ VERIFICAÇÃO RÁPIDA

Após executar os scripts, você deve ter:

- ✅ **6 tabelas criadas**: users, disc_tests, disc_results, payments, configs, logs
- ✅ **RLS configurada**: Cada usuário só acessa seus próprios dados
- ✅ **Índices criados**: Performance otimizada
- ✅ **Dados iniciais**: Configurações padrão inseridas

## 🆘 SE TIVER PROBLEMAS

1. **Erro de permissão**: Verifique se está usando a service role key
2. **Erro de sintaxe**: Copie os scripts exatamente como estão
3. **Tabela já existe**: Execute o script de limpeza primeiro
4. **Conexão falha**: Verifique as credenciais no arquivo `.env`

## 📋 ARQUIVOS IMPORTANTES

- `supabase-reset-completo.sql` - Script completo
- `teste-supabase-auth.html` - Interface de teste
- `fix-credentials.js` - Criar usuários de teste
- `GUIA-SUPABASE-RESET-COMPLETO.md` - Guia detalhado

---

**✅ APÓS EXECUTAR ESTES 4 SCRIPTS, SEU SUPABASE ESTARÁ TOTALMENTE CONFIGURADO!**