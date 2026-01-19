# DISC Coach - Deploy na Vercel

## 🚀 Configuração para Deploy

### 1. Variáveis de Ambiente

Configure as seguintes variáveis de ambiente no Vercel:

```bash
# Google AI API Key (obrigatório)
VITE_API_KEY=sua_chave_google_ai_aqui

# Supabase (já configurado)
VITE_SUPABASE_URL=https://qyxllnapmlurqkoxvmii.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_QAOIV51CXpm2F--s1ofghA_zEAj6d6x

# Stripe (opcional - modo mokado ativado)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_6p36nNoQG2mCWp6Z59DxSjWv
```

### 2. Deploy na Vercel

#### Opção 1: Deploy Automático
```bash
npm run deploy
```

#### Opção 2: Deploy Manual
1. Instale a CLI do Vercel:
```bash
npm i -g vercel
```

2. Faça login:
```bash
vercel login
```

3. Deploy:
```bash
vercel --prod
```

### 3. Configurações do Supabase

As tabelas já estão configuradas com os seguintes esquemas:

#### Tabela `users`
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('user', 'team-admin', 'saas-admin')) DEFAULT 'user',
  position TEXT NOT NULL,
  department TEXT NOT NULL,
  plan TEXT CHECK (plan IN ('free', 'pro')) DEFAULT 'free',
  subscription_status TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Tabela `assessments`
```sql
CREATE TABLE assessments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES users(id),
  answers INTEGER[],
  scores JSONB,
  analysis TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Tabela `focus_areas`
```sql
CREATE TABLE focus_areas (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT CHECK (category IN ('D', 'I', 'S', 'C')),
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed')) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Tabela `invitations`
```sql
CREATE TABLE invitations (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('user', 'team-admin')) DEFAULT 'user',
  invited_by TEXT REFERENCES users(id),
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  used_at TIMESTAMP
);
```

### 4. Funcionalidades Implementadas

✅ **Autenticação com Supabase**
- Login/Registro de usuários
- Sessões seguras
- Migração de dados do localStorage

✅ **Stripe Mokado**
- Simulação de pagamentos (90% taxa de sucesso)
- Cupons de desconto
- Upgrade para plano Pro

✅ **Google AI Integration**
- Análises DISC com Gemini 3 Pro
- Fallback para respostas mockadas quando API não configurada
- Suporte para 3 idiomas (PT, EN, ES)

✅ **Deploy Ready**
- Configuração otimizada para Vercel
- Variáveis de ambiente protegidas
- Build script automatizado

### 5. Comandos Disponíveis

```bash
npm run dev          # Desenvolvimento local
npm run build        # Build de produção
npm run preview      # Preview do build
npm run deploy       # Deploy para produção
```

### 6. Notas Importantes

- O app está configurado para usar **modo mokado** do Stripe por padrão
- A Google AI API é opcional - o app funcionará com respostas mockadas se não configurada
- Todas as credenciais do Supabase já estão configuradas
- O deploy na Vercel suporta SPA (Single Page Application) com roteamento client-side

### 7. Segurança

- **Nunca** commit credenciais reais
- Use variáveis de ambiente no Vercel
- O modo mokado do Stripe está ativado para desenvolvimento
- As chaves de API são armazenadas de forma segura nas variáveis de ambiente

## 🎯 Pronto para Deploy!

O aplicativo está totalmente configurado e pronto para deploy na Vercel. 
Basta configurar as variáveis de ambiente e executar o deploy!