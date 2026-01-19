# 🧪 Teste DISC Coach - Guia de Testes

## 🚀 Como testar o sistema em desenvolvimento

### 1. Servidor de Desenvolvimento
O servidor está rodando em: **http://localhost:5173**

### 2. Arquivo de Configuração (.env)
O arquivo `.env` foi criado com as seguintes configurações:

```env
# Google AI API Key (opcional - sistema funciona com respostas mockadas)
VITE_API_KEY=

# Supabase (configurado com suas credenciais)
VITE_SUPABASE_URL=https://qyxllnapmlurqkoxvmii.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_QAOIV51CXpm2F--s1ofghA_zEAj6d6x

# Stripe (modo mokado ativado)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_6p36nNoQG2mCWp6Z59DxSjWv
```

### 3. Console de Testes
Abra o arquivo `test-console.html` no navegador para testar as funcionalidades:
- **Testar Supabase**: Verifica conexão e tabelas
- **Testar Stripe Mokado**: Simula pagamentos
- **Testar Google AI**: Testa análises DISC
- **Executar Todos**: Roda todos os testes

### 4. Funcionalidades Testadas

#### ✅ Supabase
- Conexão com banco de dados
- Tabelas: users, assessments, focus_areas, invitations
- Autenticação (login/registro)

#### ✅ Stripe Mokado
- Processamento de pagamentos (90% taxa de sucesso)
- Cupons de desconto
- Simulação de falhas

#### ✅ Google AI
- Análises DISC com Gemini 3 Pro
- Fallback para respostas mockadas
- Suporte multi-idioma (PT/EN/ES)

### 5. Credenciais de Teste

#### Usuário Admin Padrão
- **Email**: eduardo@phoenyx.com.br
- **Role**: saas-admin
- **Plano**: pro

#### Usuário de Teste
- **Email**: teste@disccoach.com  
- **Senha**: teste123
- **Role**: user
- **Plano**: free

### 6. Testes no Console do Navegador

Abra o console do navegador (F12) e use:

```javascript
// Testar login
await supabase.auth.signInWithPassword({
  email: 'teste@disccoach.com',
  password: 'teste123'
})

// Testar criação de usuário
await supabase.auth.signUp({
  email: 'novo@usuario.com',
  password: 'senha123'
})

// Testar pagamento mokado
const { createStripeCheckoutSession } = await import('./services/stripeService.js')
const result = await createStripeCheckoutSession(297, 'teste@email.com')
```

### 7. Rotas Principais

- `/` - Landing Page
- `/auth/login` - Login
- `/dashboard` - Dashboard (requere auth)
- `/assessment/start` - Iniciar Assessment
- `/pricing` - Planos e Preços
- `/checkout` - Checkout de Pagamento
- `/admin/saas/users` - Admin SaaS (requere saas-admin)

### 8. Verificação do Build

O build foi testado e está funcionando:
```bash
npm run build  # ✅ Sucesso
```

### 9. Próximos Passos

1. **Testar no navegador**: http://localhost:5173
2. **Abrir console de testes**: `test-console.html`
3. **Criar conta de teste**: Use o formulário de registro
4. **Fazer assessment**: Complete o questionário DISC
5. **Testar upgrade**: Simule pagamento para plano Pro

### 10. Notas Importantes

- ⚠️ **Modo mokado**: Stripe está em modo mokado (90% sucesso)
- 🔒 **Segurança**: Nunca commit credenciais reais
- 📱 **Responsivo**: Teste em dispositivos móveis
- 🌍 **Multi-idioma**: Mude o idioma nas configurações

---

## 🎯 Status do Sistema

✅ **Servidor DEV**: Rodando na porta 5173  
✅ **Build**: Compilação bem-sucedida  
✅ **Supabase**: Conectado e configurado  
✅ **Stripe**: Mokado e funcional  
✅ **Google AI**: Integrado com fallback  
✅ **Autenticação**: Login/registro funcionando  

**Sistema pronto para testes!** 🚀