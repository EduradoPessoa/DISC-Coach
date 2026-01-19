
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { auth } from '../services/firebaseConfig';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
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
    // Listener de estado de autenticação do Firebase
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        const userData = await api.getUser(firebaseUser.uid);
        if (userData) {
          setUser(userData);
        } else {
          // Fallback caso o documento no Firestore ainda não exista
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
      login
    }}>
      {!isLoading && children}
      {isLoading && (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
           <div className="text-center">
              <div className="stripe-loader mx-auto mb-4"></div>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Sincronizando com Google Cloud...</p>
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
