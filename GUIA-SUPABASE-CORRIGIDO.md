# 🔧 Guia Completo - Configuração do Supabase (CORRIGIDO)

## 🚨 Problema: Erros 404 e 403 no Supabase

Os erros que você está vendo indicam que:
- **404**: Tabelas não existem ou endpoint incorreto
- **403**: Falta de permissões (políticas RLS não configuradas)

## ✅ Solução Passo a Passo

### Passo 1: Acessar o Dashboard do Supabase

1. Vá para: https://app.supabase.com
2. Faça login com sua conta
3. Selecione o projeto: `qyxllnapmlurqkoxvmii`

### Passo 2: Criar as Tabelas (VERSÃO CORRIGIDA)

1. No dashboard, clique em **"SQL Editor"** no menu lateral
2. Copie e cole o script do arquivo: `supabase-setup-corrigido.sql`
3. **⚠️ IMPORTANTE**: Este script NÃO inclui dados de teste para evitar erros de chave estrangeira
4. Execute o script (clique em "Run" ou Ctrl+Enter)

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

### Passo 4: Criar Usuários de Teste (Método Correto)

**NÃO insira dados manualmente com IDs fixos!** Em vez disso:

1. **Use o sistema de registro normal** através da aplicação
2. **Ou crie usuários via API** do Supabase
3. **O trigger automático** criará os registros na tabela `users`

#### Método 1: Via Aplicação (Recomendado)
1. Acesse: http://localhost:5173
2. Clique em "Registrar"
3. Use um email real para teste
4. O sistema criará automaticamente o usuário nas tabelas `auth.users` e `public.users`

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

### Passo 5: Popular Dados de Teste (Opcional)

**APENAS após criar usuários reais**, use o script: `supabase-populate-test-data.sql`

1. Execute primeiro: `SELECT id, email FROM auth.users` para ver os IDs reais
2. Substitua os IDs no script pelos IDs reais
3. Execute os comandos de inserção

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
- [ ] **Nenhum erro de chave estrangeira** 🎯

## ⚠️ **ERROS COMUNS E SOLUÇÕES**

### **Erro: "violates foreign key constraint"**
**Causa**: Tentando inserir na tabela `users` com ID que não existe em `auth.users`
**Solução**: 
- Nunca insira manualmente na tabela `users`
- Sempre crie usuários via `auth.signUp()` ou dashboard
- O trigger automático fará o resto

### **Erro: "permission denied for relation users"**
**Causa**: Políticas RLS não configuradas
**Solução**: Execute o script de configuração novamente

### **Erro: "relation does not exist"**
**Causa**: Tabelas não criadas
**Solução**: Execute o script `supabase-setup-corrigido.sql`

### **Erro: "policy already exists"**
**Causa**: Políticas já existem no banco
**Solução**: O script corrigido já inclui `DROP POLICY IF EXISTS` para evitar este erro

## 🚀 Próximos Passos

1. **Execute o script SQL corrigido** no Supabase Dashboard
2. **Crie usuários de teste** via aplicação (não manualmente)
3. **Teste a aplicação** completa
4. **Complete um assessment** DISC
5. **Verifique os dados** no Supabase Dashboard
6. **Faça deploy** para produção

---

**Suporte**: Se encontrar problemas:
1. Verifique os logs no console do navegador
2. Confirme que está usando o script **corrigido**
3. **Nunca** insira dados manualmente na tabela `users`
4. Sempre crie usuários via sistema de autenticação

**Parabéns!** Seu DISC Coach Professional está pronto para usar com Supabase! 🎉