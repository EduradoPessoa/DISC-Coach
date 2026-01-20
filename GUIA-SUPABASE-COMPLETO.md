# 🔧 Guia Completo - Configuração do Supabase

## 🚨 Problema: Erros 404 e 403 no Supabase

Os erros que você está vendo indicam que:
- **404**: Tabelas não existem ou endpoint incorreto
- **403**: Falta de permissões (políticas RLS não configuradas)

## ✅ Solução Passo a Passo

### Passo 1: Acessar o Dashboard do Supabase

1. Vá para: https://app.supabase.com
2. Faça login com sua conta
3. Selecione o projeto: `qyxllnapmlurqkoxvmii`

### Passo 2: Criar as Tabelas

1. No dashboard, clique em **"SQL Editor"** no menu lateral
2. Copie e cole o script abaixo:

```sql
-- Script de criação das tabelas e configuração
-- Copie tudo e execute no SQL Editor do Supabase

-- 1. Criar tabela de usuários (estende a auth.users)
CREATE TABLE IF NOT EXISTS public.users (
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

-- 2. Criar tabela de assessments
CREATE TABLE IF NOT EXISTS public.assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    answers JSONB NOT NULL,
    scores JSONB NOT NULL,
    disc_profile TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Criar tabela de áreas de foco
CREATE TABLE IF NOT EXISTS public.focus_areas (
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

-- 4. Criar tabela de convites
CREATE TABLE IF NOT EXISTS public.invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'team-admin')),
    invited_by UUID REFERENCES auth.users(id),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '7 days'
);

-- 5. Ativar Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- 6. Criar políticas de segurança
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

-- 7. Função para criar usuário automaticamente
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

-- 8. Trigger para criar usuário automaticamente
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. Inserir usuários de teste
INSERT INTO public.users (id, name, email, role, position, department, plan) VALUES
('00000000-0000-0000-0000-000000000001', 'Admin Teste', 'eduardo@phoenyx.com.br', 'saas-admin', 'CEO', 'Executivo', 'pro'),
('00000000-0000-0000-0000-000000000002', 'Usuário Teste', 'teste@disccoach.com', 'user', 'Gerente', 'Vendas', 'free')
ON CONFLICT (id) DO NOTHING;
```

### Passo 3: Verificar a Configuração

Após executar o script, execute este comando para verificar:

```sql
-- Verificar se as tabelas foram criadas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Verificar se as políticas foram criadas
SELECT schemaname, tablename, policyname, cmd FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;
```

### Passo 4: Testar no Navegador

**Abra o arquivo**: `teste-supabase-auth.html` no navegador

**Ou acesse**: http://localhost:5173/teste-supabase-auth.html

**Clique em**: "Executar Teste Completo"

## 🧪 Testes Manuais no Console

Se preferir testar manualmente, abra o console (F12) e execute:

```javascript
// Testar conexão
await fetch('https://qyxllnapmlurqkoxvmii.supabase.co/rest/v1/users?select=*&limit=1', {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5eGxsbmFwbWx1cnFrb3h2bWlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4NTA4OTYsImV4cCI6MjA4NDQyNjg5Nn0.MtLllp_MzmHPd3YiGx8fjLK7JIZqQEP9LAUL4ASEgvk'
  }
}).then(r => console.log('Status:', r.status))

// Testar registro
const { data, error } = await supabase.auth.signUp({
  email: 'novo@usuario.com',
  password: 'senha123'
})
```

## 🎯 Verificação Final

### ✅ O que deve funcionar após a configuração:

1. **Login/Registro** com Supabase
2. **Persistência de dados** no banco
3. **Sistema de fallback** para offline
4. **Testes automatizados** no arquivo HTML
5. **Dashboard administrativo** com dados reais

### 📋 Checklist de Verificação:

- [ ] Tabelas criadas no Supabase
- [ ] Políticas RLS ativadas
- [ ] Triggers configurados
- [ ] Testes passando no navegador
- [ ] Dados sendo salvos corretamente

## 🚀 Próximos Passos

1. **Teste a aplicação** completa
2. **Crie um usuário** e faça login
3. **Complete um assessment** DISC
4. **Verifique os dados** no Supabase Dashboard
5. **Faça deploy** para produção

---

**Suporte**: Se encontrar problemas, verifique:
- As credenciais no arquivo `.env`
- As políticas RLS no dashboard do Supabase
- Os logs de erro no console do navegador

**Parabéns!** Seu DISC Coach Professional está pronto para usar com Supabase! 🎉