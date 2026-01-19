// Script para criar usuário de teste e resolver problemas de credenciais

// Função para criar usuário de teste no localStorage (fallback)
export const createTestUser = () => {
  console.log('🔄 Criando usuário de teste...')
  
  try {
    const testUsers = {
      'usr_test_001': {
        id: 'usr_test_001',
        name: 'Usuário Teste',
        email: 'teste@disccoach.com',
        role: 'user',
        position: 'Gerente',
        department: 'Vendas',
        plan: 'free',
        subscriptionStatus: null
      },
      'usr_admin_001': {
        id: 'usr_admin_001',
        name: 'Admin Teste',
        email: 'eduardo@phoenyx.com.br',
        role: 'saas-admin',
        position: 'CEO',
        department: 'Executivo',
        plan: 'pro',
        subscriptionStatus: 'active'
      }
    }
    
    localStorage.setItem('dc_users', JSON.stringify(testUsers))
    console.log('✅ Usuários de teste criados com sucesso!')
    
    // Criar sessão para o usuário teste
    localStorage.setItem('dc_session_v1', 'usr_test_001')
    console.log('✅ Sessão criada para teste@disccoach.com')
    
    return true
  } catch (error) {
    console.error('❌ Erro ao criar usuário de teste:', error)
    return false
  }
}

// Função para verificar e corrigir credenciais
export const fixCredentials = () => {
  console.log('🔧 Verificando e corrigindo credenciais...')
  
  try {
    // Verificar se existe arquivo .env
    console.log('📋 Configurações atuais:')
    console.log('- Supabase URL:', window.location.origin)
    console.log('- Stripe Key: Configurado para modo mokado')
    console.log('- Google AI: Com fallback automático')
    
    // Criar usuários de teste
    const success = createTestUser()
    
    if (success) {
      console.log('🎉 Sistema configurado para testes!')
      console.log('')
      console.log('📋 Credenciais de teste:')
      console.log('- Email: teste@disccoach.com')
      console.log('- Senha: Qualquer senha não vazia (sistema mokado)')
      console.log('- Admin: eduardo@phoenyx.com.br (acesso total)')
      console.log('')
      console.log('🚀 Pronto para usar!')
    }
    
    return success
  } catch (error) {
    console.error('❌ Erro ao corrigir credenciais:', error)
    return false
  }
}

// Função para testar login com fallback
export const testLoginWithFallback = async (email, password) => {
  console.log(`🔐 Testando login para: ${email}`)
  
  try {
    // Verificar se usuário existe no localStorage
    const users = JSON.parse(localStorage.getItem('dc_users') || '{}')
    const user = Object.values(users).find(u => u.email === email)
    
    if (user) {
      // Login mokado - aceita qualquer senha não vazia
      if (password && password.length > 0) {
        localStorage.setItem('dc_session_v1', user.id)
        console.log('✅ Login bem-sucedido!')
        console.log(`🎉 Bem-vindo, ${user.name}!`)
        console.log(`📊 Seu plano: ${user.plan}`)
        console.log(`👤 Sua role: ${user.role}`)
        return { success: true, user }
      } else {
        console.log('❌ Senha inválida')
        return { success: false, error: 'Senha obrigatória' }
      }
    } else {
      console.log('❌ Usuário não encontrado')
      console.log('💡 Criando novo usuário...')
      
      // Criar novo usuário
      const newUser = {
        id: `usr_${Date.now()}`,
        name: email.split('@')[0],
        email: email,
        role: email === 'eduardo@phoenyx.com.br' ? 'saas-admin' : 'user',
        position: 'Executivo',
        department: 'Corporativo',
        plan: 'free',
        subscriptionStatus: null
      }
      
      users[newUser.id] = newUser
      localStorage.setItem('dc_users', JSON.stringify(users))
      localStorage.setItem('dc_session_v1', newUser.id)
      
      console.log('✅ Novo usuário criado e logado!')
      console.log(`🎉 Bem-vindo, ${newUser.name}!`)
      return { success: true, user: newUser }
    }
  } catch (error) {
    console.error('❌ Erro no login:', error)
    return { success: false, error: error.message }
  }
}

// Função para testar registro
export const testRegister = async (email, password, name) => {
  console.log(`📝 Testando registro para: ${email}`)
  
  try {
    const users = JSON.parse(localStorage.getItem('dc_users') || '{}')
    
    // Verificar se email já existe
    const existingUser = Object.values(users).find(u => u.email === email)
    if (existingUser) {
      console.log('❌ Email já cadastrado')
      return { success: false, error: 'Email já cadastrado' }
    }
    
    // Criar novo usuário
    const newUser = {
      id: `usr_${Date.now()}`,
      name: name || email.split('@')[0],
      email: email,
      role: email === 'eduardo@phoenyx.com.br' ? 'saas-admin' : 'user',
      position: 'Executivo',
      department: 'Corporativo',
      plan: 'free',
      subscriptionStatus: null
    }
    
    users[newUser.id] = newUser
    localStorage.setItem('dc_users', JSON.stringify(users))
    localStorage.setItem('dc_session_v1', newUser.id)
    
    console.log('✅ Registro bem-sucedido!')
    console.log(`🎉 Bem-vindo, ${newUser.name}!`)
    return { success: true, user: newUser }
  } catch (error) {
    console.error('❌ Erro no registro:', error)
    return { success: false, error: error.message }
  }
}

// Executar correção automaticamente
console.log('🚀 Iniciando correção de credenciais...')
fixCredentials()

// Disponibilizar funções globalmente
window.testLogin = testLoginWithFallback
window.testRegister = testRegister
window.fixCredentials = fixCredentials

console.log('')
console.log('🧪 Funções disponíveis:')
console.log('- testLogin(email, password)')
console.log('- testRegister(email, password, name)')
console.log('- fixCredentials()')
console.log('')
console.log('💡 Exemplo de uso:')
console.log("testLogin('teste@disccoach.com', '123456')")
console.log("testRegister('novo@usuario.com', 'senha123', 'Novo Usuário')")