import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { supabaseApi } from '../services/supabaseApi';
import { supabase } from '../services/supabase';

interface UserContextType {
  user: User;
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
  upgradeToPro: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, profile: Partial<User>) => Promise<void>;
}

const defaultUser: User = {
  id: 'u_guest',
  name: 'Convidado',
  email: '',
  role: 'user',
  position: '',
  department: '',
  plan: 'free'
};

const SESSION_KEY = 'dc_session_v1';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(defaultUser);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔍 Verificando autenticação...');
        
        // Primeiro tenta verificar se há sessão do Supabase
        if (supabase && supabase.auth) {
          try {
            const { data: { session } } = await supabase.auth.getSession()
            
            if (session?.user) {
              console.log('✅ Sessão do Supabase encontrada:', session.user.email);
              
              // Busca dados do usuário no nosso banco
              const userData = await supabaseApi.getUser(session.user.id)
              if (userData) {
                setUser(userData);
                setIsAuthenticated(true);
                console.log('✅ Usuário carregado do banco:', userData.name);
              } else {
                // Cria usuário no nosso banco se não existir
                console.log('📝 Criando novo usuário no banco...');
                const newUser: User = {
                  id: session.user.id,
                  email: session.user.email!,
                  name: session.user.user_metadata?.name || session.user.email!.split('@')[0],
                  role: session.user.email === 'eduardo@phoenyx.com.br' ? 'saas-admin' : 'user',
                  position: 'Executivo',
                  department: 'Corporativo',
                  plan: 'free'
                }
                await supabaseApi.saveUser(newUser);
                setUser(newUser);
                setIsAuthenticated(true);
                console.log('✅ Novo usuário criado:', newUser.name);
              }
            } else {
              console.log('ℹ️  Nenhuma sessão ativa encontrada');
              // Verifica sessão antiga do localStorage para migração
              const storedSession = localStorage.getItem(SESSION_KEY);
              if (storedSession) {
                console.log('🔄 Tentando migrar sessão antiga...');
                const userData = await supabaseApi.getUser(storedSession);
                if (userData) {
                  // Faz login no Supabase
                  console.log('🔄 Fazendo login no Supabase...');
                  const { error } = await supabase.auth.signInWithPassword({
                    email: userData.email,
                    password: 'temp123' // Senha temporária para migração
                  });
                  
                  if (!error) {
                    setUser(userData);
                    setIsAuthenticated(true);
                    console.log('✅ Migração concluída');
                  } else {
                    console.log('❌ Erro na migração:', error);
                  }
                }
                localStorage.removeItem(SESSION_KEY);
              }
            }
          } catch (authError) {
            console.log('⚠️  Erro ao verificar sessão do Supabase:', authError);
            // Fallback para sistema antigo
            fallbackToLocalStorage();
          }
        } else {
          console.log('⚠️  Supabase não configurado, usando fallback');
          fallbackToLocalStorage();
        }
      } catch (error) {
        console.error('❌ Erro ao carregar sessão:', error);
        fallbackToLocalStorage();
      } finally {
        setIsLoading(false);
        console.log('✅ Verificação de autenticação concluída');
      }
    };

    const fallbackToLocalStorage = () => {
      const storedSession = localStorage.getItem(SESSION_KEY);
      if (storedSession) {
        console.log('📁 Usando sessão do localStorage');
        // Usar API antiga como fallback
        const users = JSON.parse(localStorage.getItem('dc_users') || '{}');
        const userData = users[storedSession];
        if (userData) {
          setUser(userData as User);
          setIsAuthenticated(true);
          console.log('✅ Usuário carregado do localStorage:', userData.name);
        } else {
          localStorage.removeItem(SESSION_KEY);
          console.log('❌ Sessão inválida, removida');
        }
      } else {
        console.log('ℹ️  Nenhuma sessão encontrada, usuário convidado');
      }
    };

    checkAuth();

    // Listener para mudanças de auth (se Supabase estiver disponível)
    if (supabase && supabase.auth) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('🔄 Evento de auth:', event);
        if (event === 'SIGNED_IN' && session?.user) {
          const userData = await supabaseApi.getUser(session.user.id);
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
            console.log('✅ Login detectado:', userData.name);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(defaultUser);
          setIsAuthenticated(false);
          console.log('✅ Logout detectado');
        }
      });

      return () => {
        if (subscription) subscription.unsubscribe();
      };
    }
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      console.log('🔐 Tentando login com:', email);
      
      if (supabase && supabase.auth) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.toLowerCase().trim(),
          password: pass
        });
        
        if (error) {
          console.log('❌ Erro no login do Supabase:', error);
          throw error;
        }
        
        if (data.user) {
          const userData = await supabaseApi.getUser(data.user.id);
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
            console.log('✅ Login com Supabase bem-sucedido:', userData.name);
          } else {
            throw new Error("Usuário não encontrado no banco de dados");
          }
        }
      } else {
        // Fallback para sistema antigo
        console.log('📁 Usando login fallback (localStorage)');
        const normalizedEmail = email.toLowerCase().trim();
        const users = JSON.parse(localStorage.getItem('dc_users') || '{}');
        const userData = Object.values(users).find((u: any) => u.email.toLowerCase().trim() === normalizedEmail);
        
        if (userData) {
          if (pass.length > 0) { // Simulação: aceita qualquer senha não vazia
            setUser(userData as User);
            setIsAuthenticated(true);
            localStorage.setItem(SESSION_KEY, (userData as User).id);
            console.log('✅ Login fallback bem-sucedido:', (userData as User).name);
          } else {
            throw new Error("Senha obrigatória.");
          }
        } else {
          throw new Error("E-mail não encontrado. Você já criou sua conta?");
        }
      }
    } catch (error: any) {
      if (error.message === 'Invalid login credentials') {
        throw new Error("E-mail ou senha inválidos");
      }
      throw error;
    }
  };

  const register = async (email: string, pass: string, profile: Partial<User>) => {
    try {
      const normalizedEmail = email.toLowerCase().trim();
      console.log('📝 Registrando novo usuário:', normalizedEmail);
      
      if (supabase && supabase.auth) {
        // Cria usuário no Supabase
        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password: pass,
          options: {
            data: {
              name: profile.name || normalizedEmail.split('@')[0]
            }
          }
        });
        
        if (error) throw error;
        
        if (data.user) {
          // Cria usuário no nosso banco
          const newUser: User = {
            id: data.user.id,
            name: profile.name || normalizedEmail.split('@')[0],
            email: normalizedEmail,
            role: normalizedEmail === 'eduardo@phoenyx.com.br' ? 'saas-admin' : 'user',
            position: profile.position || 'Executivo',
            department: profile.department || 'Corporativo',
            plan: 'free'
          };
          
          await supabaseApi.saveUser(newUser);
          setUser(newUser);
          setIsAuthenticated(true);
          console.log('✅ Registro com Supabase bem-sucedido:', newUser.name);
        }
      } else {
        // Fallback para sistema antigo
        console.log('📁 Usando registro fallback (localStorage)');
        const users = JSON.parse(localStorage.getItem('dc_users') || '{}');
        const existing = Object.values(users).find((u: any) => u.email.toLowerCase().trim() === normalizedEmail);
        
        if (existing) {
          throw new Error("E-mail já cadastrado.");
        }
        
        const newUser: User = {
          id: `usr_${Date.now()}`,
          name: profile.name || normalizedEmail.split('@')[0],
          email: normalizedEmail,
          role: normalizedEmail === 'eduardo@phoenyx.com.br' ? 'saas-admin' : 'user',
          position: profile.position || 'Executivo',
          department: profile.department || 'Corporativo',
          plan: 'free'
        };
        
        users[newUser.id] = newUser;
        localStorage.setItem('dc_users', JSON.stringify(users));
        
        setUser(newUser);
        setIsAuthenticated(true);
        localStorage.setItem(SESSION_KEY, newUser.id);
        console.log('✅ Registro fallback bem-sucedido:', newUser.name);
      }
    } catch (error: any) {
      if (error.message.includes('already registered')) {
        throw new Error("E-mail já cadastrado");
      }
      throw error;
    }
  };

  const handleSetUser = (newUser: User) => {
    setUser(newUser);
    if (supabase && supabase.auth) {
      supabaseApi.saveUser(newUser);
    } else {
      // Fallback para localStorage
      const users = JSON.parse(localStorage.getItem('dc_users') || '{}');
      users[newUser.id] = newUser;
      localStorage.setItem('dc_users', JSON.stringify(users));
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    if (supabase && supabase.auth) {
      await supabaseApi.saveUser(updated);
    } else {
      // Fallback para localStorage
      const users = JSON.parse(localStorage.getItem('dc_users') || '{}');
      users[updated.id] = updated;
      localStorage.setItem('dc_users', JSON.stringify(users));
    }
  };

  const upgradeToPro = async () => {
    await updateUser({ plan: 'pro', subscriptionStatus: 'active', role: 'team-admin' });
  };

  const logout = async () => {
    if (supabase && supabase.auth) {
      await supabase.auth.signOut();
    }
    setUser(defaultUser);
    setIsAuthenticated(false);
    localStorage.removeItem(SESSION_KEY);
    console.log('✅ Logout realizado');
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser: handleSetUser, 
      updateUser, 
      upgradeToPro, 
      isAuthenticated, 
      isLoading,
      logout,
      login,
      register
    }}>
      {!isLoading && children}
      {isLoading && (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
           <div className="text-center">
              <div className="stripe-loader mx-auto mb-4"></div>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest font-sans">Carregando Ambiente...</p>
           </div>
        </div>
      )}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};