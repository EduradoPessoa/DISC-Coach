// UserContextFallback.tsx - Fallback robusto para quando UserProvider não está disponível
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

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

const UserContextFallback = createContext<UserContextType | undefined>(undefined);

export const UserProviderFallback: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(defaultUser);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Carrega sessão do localStorage
    const storedSession = localStorage.getItem(SESSION_KEY);
    if (storedSession) {
      const users = JSON.parse(localStorage.getItem('dc_users') || '{}');
      const userData = users[storedSession] as User;
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
      }
    }
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const normalizedEmail = email.toLowerCase().trim();
      const users = JSON.parse(localStorage.getItem('dc_users') || '{}');
      const userData = Object.values(users).find((u: any) => u.email.toLowerCase().trim() === normalizedEmail) as User;
      
      if (userData && pass.length > 0) {
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem(SESSION_KEY, userData.id);
        console.log('✅ Login fallback bem-sucedido:', userData.name);
      } else {
        throw new Error("E-mail ou senha inválidos");
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, pass: string, profile: Partial<User>) => {
    setIsLoading(true);
    try {
      const normalizedEmail = email.toLowerCase().trim();
      const users = JSON.parse(localStorage.getItem('dc_users') || '{}');
      const existing = Object.values(users).find((u: any) => u.email.toLowerCase().trim() === normalizedEmail);
      
      if (existing) {
        throw new Error("E-mail já cadastrado");
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
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetUser = (newUser: User) => {
    setUser(newUser);
    const users = JSON.parse(localStorage.getItem('dc_users') || '{}');
    users[newUser.id] = newUser;
    localStorage.setItem('dc_users', JSON.stringify(users));
  };

  const updateUser = async (updates: Partial<User>) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    const users = JSON.parse(localStorage.getItem('dc_users') || '{}');
    users[updated.id] = updated;
    localStorage.setItem('dc_users', JSON.stringify(users));
  };

  const upgradeToPro = async () => {
    await updateUser({ plan: 'pro', subscriptionStatus: 'active', role: 'team-admin' });
  };

  const logout = async () => {
    setUser(defaultUser);
    setIsAuthenticated(false);
    localStorage.removeItem(SESSION_KEY);
    console.log('✅ Logout realizado');
  };

  return (
    <UserContextFallback.Provider value={{ 
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
      {children}
    </UserContextFallback.Provider>
  );
};

export const useUserFallback = () => {
  const context = useContext(UserContextFallback);
  if (context === undefined) {
    throw new Error('useUserFallback must be used within a UserProviderFallback');
  }
  return context;
};