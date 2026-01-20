/**
 * Script para testar conexão com o novo projeto Supabase
 * Executa testes básicos de autenticação e conexão com o schema correto
 */

import { createClient } from '@supabase/supabase-js';

// Configuração do novo projeto
const SUPABASE_URL = 'https://tpancojploqdfddxvgre.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_73NI4K2_RwneSniHlB4cmw_WLzeUYh4';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testarConexao() {
  console.log('🧪 TESTANDO CONEXÃO COM O NOVO PROJETO SUPABASE');
  console.log('📅', new Date().toLocaleString('pt-BR'));
  console.log('🔗 URL:', SUPABASE_URL);
  console.log('');

  try {
    // Teste 1: Conexão básica
    console.log('1️⃣ Testando conexão básica...');
    const { data: session, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.log('❌ Erro na conexão:', sessionError.message);
      return false;
    }
    
    console.log('✅ Conexão estabelecida com sucesso!');
    console.log('');

    // Teste 2: Criar usuário de teste
    console.log('2️⃣ Testando criação de usuário...');
    const emailTeste = `teste_${Date.now()}@teste.com`;
    const senhaTeste = '12345678';
    
    const { data: novoUsuario, error: registroError } = await supabase.auth.signUp({
      email: emailTeste,
      password: senhaTeste,
      options: {
        data: {
          name: 'Usuário Teste',
          role: 'user'
        }
      }
    });
    
    if (registroError) {
      console.log('❌ Erro ao criar usuário:', registroError.message);
      return false;
    }
    
    console.log('✅ Usuário criado com sucesso!');
    console.log('📧 Email:', emailTeste);
    console.log('👤 ID:', novoUsuario.user?.id);

    // Tentar login explícito se não houver sessão
    if (!novoUsuario.session) {
        // console.log('⚠️ Nenhuma sessão retornada no cadastro (Confirmação de email pode estar ativa)');
        // console.log('🔄 Tentando login explícito...');
        
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email: emailTeste,
            password: senhaTeste
        });

        if (loginError) {
            console.log('❌ Erro no login:', loginError.message);
            if (loginError.message.includes('Email not confirmed')) {
                console.log('💡 IMPORTANTE: A confirmação de email está ativada no Supabase.');
                console.log('   Para testes locais funcionarem sem confirmar email, desative "Confirm email" em Authentication -> Providers -> Email no painel do Supabase.');
                console.log('   Ou confirme o email enviado para', emailTeste);
                return false;
            }
        }
    }
    
    console.log('');

    // Teste 3: Verificar tabela pública users
    console.log('3️⃣ Verificando tabela public.users...');
    
    // Aguardar um pouco para o trigger rodar
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Tenta buscar pelo ID direto (Schema Novo)
    let { data: userPublico, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', novoUsuario.user?.id)
      .maybeSingle(); 
    
    if (!userPublico) {
        // Tenta buscar pelo auth_id (Schema Antigo)
        const { data: userAntigo, error: errorAntigo } = await supabase
            .from('users')
            .select('*')
            .eq('auth_id', novoUsuario.user?.id)
            .maybeSingle();
            
        if (userAntigo) {
            console.log('❌ ERRO DE SCHEMA: O banco de dados está usando a estrutura antiga!');
            console.log('   Encontrado usuário via coluna "auth_id" em vez de "id".');
            console.log('⚠️ AÇÃO NECESSÁRIA: Você PRECISA executar o script "supabase-setup-final.sql" no Dashboard do Supabase.');
            return false;
        }
    }

    if (userError) {
      console.log('❌ Erro ao acessar public.users:', userError.message);
      if (userError.message.includes('recursion')) {
        console.log('❌ ERRO CRÍTICO: Recursão infinita detectada nas políticas RLS!');
      }
      return false;
    }

    if (!userPublico) {
        console.log('❌ Usuário não encontrado na tabela public.users');
        console.log('💡 CAUSAS PROVÁVEIS:');
        console.log('   1. O script SQL "supabase-setup-final.sql" AINDA NÃO FOI EXECUTADO.');
        console.log('   2. O trigger de criação falhou.');
        console.log('👉 Por favor, execute o script SQL no Supabase Dashboard agora.');
        return false;
    }
    
    console.log('✅ Usuário encontrado na tabela pública!');
    console.log('📊 Dados:', userPublico);
    
    console.log('');
    console.log('='.repeat(60));
    console.log('🎉 TESTES CONCLUÍDOS COM SUCESSO!');
    console.log('='.repeat(60));
    console.log('✅ O novo projeto Supabase está configurado corretamente!');
    
    return true;
    
  } catch (error) {
    console.error('❌ Erro crítico no script:', error.message);
    return false;
  }
}

// Executar teste
testarConexao().then((sucesso) => {
  if (sucesso) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});
