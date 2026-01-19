// Script para importação de dados e teste do sistema (JavaScript puro)

// Função para testar conexão com Supabase
export const testSupabaseConnection = async () => {
  console.log('� Testando conexão com Supabase...')
  
  try {
    const SUPABASE_URL = 'https://qyxllnapmlurqkoxvmii.supabase.co'
    const SUPABASE_KEY = 'sb_publishable_QAOIV51CXpm2F--s1ofghA_zEAj6d6x'
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/users?select=*&limit=1`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    })
    
    if (response.ok) {
      console.log('✅ Conexão com Supabase estabelecida com sucesso!')
      return true
    } else {
      console.log('❌ Erro na conexão com Supabase:', response.status)
      return false
    }
  } catch (error) {
    console.error('❌ Erro de conexão:', error)
    return false
  }
}

// Função para testar Stripe mokado
export const testStripeMock = async () => {
  console.log('💳 Testando sistema de pagamento mokado...')
  
  try {
    // Simular processamento de pagamento
    const success = Math.random() > 0.1 // 90% de sucesso
    
    if (success) {
      console.log('✅ Pagamento mokado processado com sucesso!')
      return true
    } else {
      console.log('❌ Pagamento mokado recusado (simulação de falha)')
      return false
    }
  } catch (error) {
    console.error('❌ Erro no teste Stripe:', error)
    return false
  }
}

// Função para testar Google AI
export const testGoogleAI = async () => {
  console.log('🤖 Testando Google AI (modo mock)...')
  
  try {
    // Simular resposta da API
    const mockResponse = {
      summary: 'Perfil DISC analisado com sucesso',
      communication: ['Comunicação direta e objetiva', 'Focado em resultados'],
      value: ['Excelente em análise de problemas', 'Muito confiável'],
      blindspots: ['Pode ser excessivamente crítico', 'Tendência ao perfeccionismo']
    }
    
    console.log('✅ Análise DISC mock gerada com sucesso!')
    console.log('📊 Resumo:', mockResponse.summary)
    return true
  } catch (error) {
    console.error('❌ Erro no teste Google AI:', error)
    return false
  }
}

// Função principal para executar todos os testes
export const runAllTests = async () => {
  console.log('🚀 Iniciando testes do sistema DISC Coach...\n')
  
  const results = {
    supabase: await testSupabaseConnection(),
    stripe: await testStripeMock(),
    googleAI: await testGoogleAI()
  }
  
  console.log('\n📋 Resumo dos Testes:')
  console.log('- Supabase:', results.supabase ? '✅' : '❌')
  console.log('- Stripe:', results.stripe ? '✅' : '❌')
  console.log('- Google AI:', results.googleAI ? '✅' : '❌')
  
  const allPassed = Object.values(results).every(result => result === true)
  
  if (allPassed) {
    console.log('\n🎉 Todos os testes concluídos com sucesso!')
  } else {
    console.log('\n⚠️  Alguns testes falharam. Verifique os logs acima.')
  }
  
  return results
}

// Teste simples de console
console.log('🧪 Sistema de Testes DISC Coach carregado!')
console.log('📊 Execute runAllTests() para testar todas as funcionalidades')
console.log('🔗 Ou teste individualmente:')
console.log('   - testSupabaseConnection()')
console.log('   - testStripeMock()')
console.log('   - testGoogleAI()')