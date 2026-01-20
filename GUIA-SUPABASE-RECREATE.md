# 🔧 Guia Completo - RECRIAR Supabase do Zero

## 🚨 Problema: Erros de recursão infinita e políticas conflitantes

Os erros que você está vendo indicam que as políticas RLS estão com recursão infinita. Vamos apagar tudo e recriar do zero.

## ✅ Solução Passo a Passo - RECRIAÇÃO COMPLETA

### Passo 1: Acessar o Dashboard do Supabase

1. Vá para: https://app.supabase.com
2. Faça login com sua conta
3. Selecione o projeto: `qyxllnapmlurqkoxvmii`

### Passo 2: APAGAR TUDO e RECRIAR do ZERO

1. No dashboard, clique em **"SQL Editor"** no menu lateral
2. **PRIMEIRO** execute o script de limpeza: `supabase-reset-complete.sql`
3. **DEPOIS** execute o script simplificado: `supabase-simple-setup.sql`

### Passo 3: Executar Scripts na Ordem Correta

#### **Script 1 - Limpeza Completa (Execute primeiro):**
```sql
-- Copie e cole o conteúdo do arquivo: supabase-reset-complete.sql
-- Este script apaga TUDO: tabelas, políticas, triggers, funções
```

#### **Script 2 - Configuração Simplificada (Execute depois):**
```sql
-- Copie e cole o conteúdo do arquivo: supabase-simple-setup.sql
-- Este script recria tudo com políticas simples (sem recursão)
```

### Passo 4: Verificar a Recriação

Após executar ambos scripts, execute este comando para verificar:

```sql
-- Verificar se as tabelas foram criadas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Verificar se as políticas foram criadas
SELECT schemaname, tablename, policyname, cmd FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;

-- Testar conexão simples
SELECT '✅ SUPABASE RECRIADO COM SUCESSO!' as status;
```

### Passo 5: Criar Usuários de Teste

#### Método 1: Via Aplicação (Recomendado)
1. Acesse: http://localhost:5173
2. Clique em "Registrar"
3. Use um email real para teste
4. O sistema criará automaticamente o usuário

#### Método 2: Via Console do Navegador
```javascript
// Criar usuário de teste
const { data, error } = await supabase.auth.signUp({
  email: 'teste@seuemail.com',
  password: 'senha123',
  options: {
    data: {
      name: 'Usuário Teste',
      role: 'user'
    }
  }
});
```

### Passo 6: Testar no Navegador

**Abra o arquivo**: `teste-supabase-auth-final.html` no navegador

**Ou acesse**: http://localhost:5173/teste-supabase-auth-final.html

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

### ✅ O que deve funcionar após a recriação:

1. **Login/Registro** com Supabase
2. **Persistência de dados** no banco
3. **Sistema de fallback** para offline
4. **Testes automatizados** no arquivo HTML
5. **Dashboard administrativo** com dados reais
6. **SEM erros de recursão infinita** 🎯

### 📋 Checklist de Verificação:

- [ ] Executar script de limpeza primeiro
- [ ] Executar script de configuração depois
- [ ] Verificar tabelas criadas
- [ ] Verificar políticas RLS simples
- [ ] Testar registro de usuário
- [ ] Testar login
- [ ] Verificar dados salvos

## ⚠️ **ERROS RESOLVIDOS:**

### **Erro: "infinite recursion detected in policy"**
**Causa**: Políticas RLS com recursão infinita
**Solução**: Scripts simplificados sem recursão

### **Erro: "policy already exists"**
**Causa**: Políticas duplicadas
**Solução**: Apagar tudo antes de recriar

### **Erro: "violates foreign key constraint"**
**Causa**: Dados de teste com IDs inválidos
**Solução**: Criar usuários apenas via auth.signUp()

## 🚀 Próximos Passos

1. **Execute o script de LIMPEZA** no Supabase Dashboard
2. **Execute o script de CONFIGURAÇÃO** simplificada
3. **Teste a aplicação** completa
4. **Crie usuários** via registro normal
5. **Complete um assessment** DISC
6. **Faça deploy** para produção

---

**⚠️ IMPORTANTE**: Sempre execute os scripts NA ORDEM:
1. **PRIMEIRO**: `supabase-reset-complete.sql` (limpa tudo)
2. **DEPOIS**: `supabase-simple-setup.sql` (recria tudo)

**Parabéns!** Seu DISC Coach Professional está pronto para usar com Supabase! 🎉