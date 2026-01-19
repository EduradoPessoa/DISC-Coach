
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { auth } from '../services/firebaseConfig';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
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

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(defaultUser);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userData = await api.getUser(firebaseUser.uid);
          if (userData) {
            setUser(userData);
          } else {
            const newUser: User = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              email: firebaseUser.email || '',
              role: firebaseUser.email === 'eduardo@phoenyx.com.br' ? 'saas-admin' : 'user',
              position: 'Executivo',
              department: 'Corporativo',
              plan: 'free'
            };
            await api.saveUser(newUser);
            setUser(newUser);
          }
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Erro ao carregar dados do usuário:", error);
        }
      } else {
        setUser(defaultUser);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const register = async (email: string, pass: string, profile: Partial<User>) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    
    const newUser: User = {
      id: cred.user.uid,
      name: profile.name || email.split('@')[0],
      email: email,
      role: email === 'eduardo@phoenyx.com.br' ? 'saas-admin' : 'user',
      position: profile.position || 'Executivo',
      department: profile.department || 'Corporativo',
      plan: 'free'
    };

    await api.saveUser(newUser);
    setUser(newUser);
    setIsAuthenticated(true);
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
    await signOut(auth);
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
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Sincronizando com Cloud...</p>
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
