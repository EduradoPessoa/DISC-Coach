import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { AppNotification, NotificationType } from '../types';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface NotificationContextType {
  addNotification: (type: NotificationType, message: string) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const addNotification = useCallback((type: NotificationType, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, type, message }]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`pointer-events-auto flex items-center p-4 rounded-lg shadow-lg border max-w-sm w-full animate-fade-in-up transition-all transform duration-300 ${
              n.type === 'success' ? 'bg-white border-green-200 text-green-800' :
              n.type === 'error' ? 'bg-white border-red-200 text-red-800' :
              n.type === 'warning' ? 'bg-white border-yellow-200 text-yellow-800' :
              'bg-white border-blue-200 text-blue-800'
            }`}
          >
            <div className="mr-3">
              {n.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
              {n.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
              {n.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
              {n.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
            </div>
            <div className="flex-1 text-sm font-medium">{n.message}</div>
            <button 
              onClick={() => removeNotification(n.id)}
              className="ml-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};