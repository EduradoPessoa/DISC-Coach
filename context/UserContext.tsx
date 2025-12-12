import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface UserContextType {
  user: User;
  updateUser: (updates: Partial<User>) => void;
  upgradeToPro: () => void;
}

const defaultUser: User = {
  id: 'u1',
  name: 'Eduardo M.',
  email: 'edu.compliance@corp.com',
  role: 'user',
  position: 'Chief Compliance Officer',
  department: 'Compliance',
  avatar: undefined,
  plan: 'free', // Default to free for demonstration
  subscriptionStatus: null
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(defaultUser);

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const upgradeToPro = () => {
    setUser((prev) => ({
      ...prev,
      plan: 'pro',
      subscriptionStatus: 'active'
    }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser, upgradeToPro }}>
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
