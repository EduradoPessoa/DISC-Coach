
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { api } from '../services/api';

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
      // Pequeno delay para garantir que o seed do api.ts ocorra na primeira leitura
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const storedSession = localStorage.getItem(SESSION_KEY);
      if (storedSession) {
        try {
          const userId = storedSession;
          const userData = await api.getUser(userId);
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem(SESSION_KEY);
          }
        } catch (error) {
          console.error("Erro ao carregar sessão:", error);
          localStorage.removeItem(SESSION_KEY);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    const normalizedEmail = email.toLowerCase().trim();
    // Busca o usuário pelo e-mail normalizado
    const existingUser = await api.getUserByEmail(normalizedEmail);
    
    if (existingUser) {
      // Simulação: Aceita qualquer senha que não seja vazia no mock
      if (pass.length > 0) {
        setUser(existingUser);
        setIsAuthenticated(true);
        localStorage.setItem(SESSION_KEY, existingUser.id);
      } else {
        throw new Error("Senha obrigatória.");
      }
    } else {
      throw new Error("E-mail não encontrado. Você já criou sua conta?");
    }
  };

  const register = async (email: string, pass: string, profile: Partial<User>) => {
    const normalizedEmail = email.toLowerCase().trim();
    const existing = await api.getUserByEmail(normalizedEmail);
    if (existing) throw new Error("E-mail já cadastrado.");

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: profile.name || normalizedEmail.split('@')[0],
      email: normalizedEmail,
      role: normalizedEmail === 'eduardo@phoenyx.com.br' ? 'saas-admin' : 'user',
      position: profile.position || 'Executivo',
      department: profile.department || 'Corporativo',
      plan: 'free'
    };

    await api.saveUser(newUser);
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem(SESSION_KEY, newUser.id);
  };

  const handleSetUser = (newUser: User) => {
    setUser(newUser);
    api.saveUser(newUser);
  };

  const updateUser = async (updates: Partial<User>) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    await api.saveUser(updated);
  };

  const upgradeToPro = async () => {
    await updateUser({ plan: 'pro', subscriptionStatus: 'active', role: 'team-admin' });
  };

  const logout = async () => {
    setUser(defaultUser);
    setIsAuthenticated(false);
    localStorage.removeItem(SESSION_KEY);
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
