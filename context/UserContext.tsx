import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { apiRequest } from '../services/api';

interface UserContextType {
  user: User;
  login: (credentials: any) => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  upgradeToPro: () => void;
  logout: () => void;
}

const defaultUser: User = {
  id: '1', // Must match database ID (int 1)
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
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('disc_user');
    return saved ? JSON.parse(saved) : defaultUser;
  });

  useEffect(() => {
    localStorage.setItem('disc_user', JSON.stringify(user));
  }, [user]);

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const login = async (credentials: any) => {
    try {
        const data = await apiRequest('/auth/login.php', 'POST', credentials);
        if (data.accessToken) {
            localStorage.setItem('token', data.accessToken);
        }
        if (data.refreshToken) {
            localStorage.setItem('refreshToken', data.refreshToken);
        }
        if (data.user) {
            const userData = data.user;
            // Ensure fields exist
            if (!userData.position) userData.position = '';
            if (!userData.department) userData.department = '';
            
            setUser(userData);
        }
    } catch (error) {
        console.error("Login error in context:", error);
        throw error;
    }
  };

  const upgradeToPro = () => {
    setUser((prev) => ({
      ...prev,
      plan: 'pro',
      subscriptionStatus: 'active'
    }));
  };

  const logout = () => {
    localStorage.removeItem('disc_user');
    // We can't really "redirect" here easily without hook issues or circular deps, 
    // but clearing the user state will likely trigger a re-render in App.tsx 
    // if we had protected routes checking for user presence. 
    // For now, we set to a guest state or empty.
    // However, the app seems to use a default user for demo purposes. 
    // Let's reload the page to simulate a real logout or clear the state.
    setUser(defaultUser); 
    window.location.href = '#/auth/login';
  };

  const value = React.useMemo(() => ({
    user,
    login,
    updateUser,
    upgradeToPro,
    logout
  }), [user]);

  return (
    <UserContext.Provider value={value}>
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
