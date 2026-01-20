# 🚀 CONFIGURAÇÃO RÁPIDA DO NOVO PROJETO SUPABASE

## 📋 DADOS DO NOVO PROJETO
- **URL:** https://tpancojploqdfddxvgre.supabase.co
- **Project ID:** tpancojploqdfddxvgre
- **Publishable Key:** sb_publishable_73NI4K2_RwneSniHlB4cmw_WLzeUYh4
- **Secret Key:** sb_secret_ujoFn1XbaCyQPc5OUujQXA_WNRV3p0q

## ✅ CONFIGURAÇÃO JÁ ATUALIZADA
✅ Arquivo `.env` atualizado com novas credenciais  
✅ Serviço Supabase configurado com novo projeto  
✅ Sistema de autenticação pronto para usar  

## 🎯 PASSO A PASSO PARA CONFIGURAR O BANCO DE DADOS

### 1️⃣ ACESSAR O SUPABASE
1. Vá para: https://app.supabase.com
2. Faça login
3. Selecione o projeto: `tpancojploqdfddxvgre`
4. Clique em **"SQL Editor"** no menu lateral

### 2️⃣ EXECUTAR SCRIPTS DE CONFIGURAÇÃO

**Execute cada script abaixo na ordem:**

#### 📊 SCRIPT 1: Criar Tabelas
```sql
-- Criar tabela de usuários
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

-- Criar tabela de testes DISC
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

-- Criar tabela de resultados
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

-- Criar tabela de pagamentos
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

-- Criar tabela de configurações
CREATE TABLE public.configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chave TEXT UNIQUE NOT NULL,
    valor TEXT NOT NULL,
    descricao TEXT,
    tipo TEXT DEFAULT 'string' CHECK (tipo IN ('string', 'number', 'boolean', 'json')),
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de logs
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

#### 🔒 SCRIPT 2: Configurar Segurança (RLS)
```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disc_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disc_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
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

CREATE POLICY "Admins can manage configs" ON public.configs
    FOR ALL USING (EXISTS (
        SELECT 1 FROM public.users 
        WHERE auth_id = auth.uid() AND tipo_usuario = 'admin'
    ));
```

#### 💾 SCRIPT 3: Inserir Configurações Padrão
```sql
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

## 🧪 TESTAR O SISTEMA

1. **Abra o arquivo**: `teste-supabase-auth.html` no navegador
2. **Clique em "Testar Conexão"** para verificar se conecta ao novo projeto
3. **Use o formulário de registro** para criar um novo usuário
4. **Faça login** para testar a autenticação
5. **Verifique se os dados** estão sendo salvos corretamente

## ✅ O QUE VOCÊ TERÁ APÓS A CONFIGURAÇÃO

- ✅ **6 tabelas criadas**: users, disc_tests, disc_results, payments, configs, logs
- ✅ **RLS habilitada**: Segurança implementada em todas as tabelas
- ✅ **Políticas de acesso**: Usuários só acessam seus próprios dados
- ✅ **Configurações padrão**: Sistema pronto para uso
- ✅ **Autenticação funcionando**: Login e registro de usuários

## 🆘 SE TIVER PROBLEMAS

1. **"Permission denied"** → Verifique se está usando a **secret key** correta
2. **"Syntax error"** → Copie o script exatamente como está
3. **Conexão falha** → Verifique as credenciais no arquivo `.env`
4. **Erro ao criar tabela** → Verifique se não há conflitos com tabelas existentes

---

**🎯 APÓS EXECUTAR ESTES 3 SCRIPTS, SEU SISTEMA ESTARÁ 100% FUNCIONAL!**