import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { Notification, NotificationType } from '../types';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

import { apiRequest } from '../services/api';
import { useUser } from './UserContext';

interface NotificationContextType {
  addNotification: (type: NotificationType, message: string) => void;
  removeNotification: (id: string) => void;
  history: any[];
  unreadCount: number;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const { user } = useUser();

  const fetchNotifications = useCallback(async () => {
    if (!user || !user.id) return;
    try {
        const data = await apiRequest(`/notifications/list.php?user_id=${user.id}`, 'GET');
        if (Array.isArray(data)) {
            setHistory(data);
        }
    } catch (e) {
        console.error("Failed to fetch notifications");
    }
  }, [user]);

  // Poll for notifications from backend
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

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

  const markAsRead = async (id: number) => {
      // Optimistic update
      setHistory(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
      // TODO: Call API to mark as read if backend supports it
  };

  const markAllAsRead = () => {
      setHistory(prev => prev.map(n => ({ ...n, is_read: 1 })));
  };

  const unreadCount = history.filter(n => !n.is_read || n.is_read == 0).length;

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification, history, unreadCount, markAsRead, markAllAsRead }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`pointer-events-auto flex items-center p-4 rounded-lg shadow-lg border max-w-sm w-full animate-fade-in-up transition-all transform duration-300 ${
              notification.type === 'success' ? 'bg-white border-green-200 text-green-800' :
              notification.type === 'error' ? 'bg-white border-red-200 text-red-800' :
              notification.type === 'warning' ? 'bg-white border-yellow-200 text-yellow-800' :
              'bg-white border-blue-200 text-blue-800'
            }`}
          >
            <div className="mr-3">
              {notification.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
              {notification.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
              {notification.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
              {notification.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
            </div>
            <div className="flex-1 text-sm font-medium">{notification.message}</div>
            <button 
              onClick={() => removeNotification(notification.id)}
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