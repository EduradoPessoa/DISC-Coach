import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface UserContextType {
  user: User;
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  upgradeToPro: () => void;
  isAuthenticated: boolean;
  logout: () => void;
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
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('disc_auth_user');
    return saved ? JSON.parse(saved) : defaultUser;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('disc_auth_user'));

  const handleSetUser = (newUser: User) => {
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('disc_auth_user', JSON.stringify(newUser));
  };

  const updateUser = (updates: Partial<User>) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('disc_auth_user', JSON.stringify(updated));
  };

  const upgradeToPro = () => {
    updateUser({ plan: 'pro', subscriptionStatus: 'active', role: 'team-admin' });
  };

  const logout = () => {
    setUser(defaultUser);
    setIsAuthenticated(false);
    localStorage.removeItem('disc_auth_user');
  };

  return (
    <UserContext.Provider value={{ user, setUser: handleSetUser, updateUser, upgradeToPro, isAuthenticated, logout }}>
      {children}
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