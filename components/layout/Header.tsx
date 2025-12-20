import React, { useState, useRef, useEffect } from 'react';
import { Bell, User, Menu, Globe, ChevronDown, LogOut, TrendingUp } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { useUser } from '../../context/UserContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNotification } from '../../context/NotificationContext';
import { Language } from '../../types';

interface HeaderProps {
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const location = useLocation();
  const { user, logout } = useUser();
  const { language, setLanguage, t } = useLanguage();
  const { history, unreadCount, markAsRead } = useNotification();
  const isDashboard = location.pathname.includes('dashboard') || location.pathname.includes('results') || location.pathname.includes('admin');
  
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) {
        setNotifMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [langMenuRef, userMenuRef, notifMenuRef]);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    setLangMenuOpen(false);
  };

  const getLangLabel = (lang: Language) => {
    switch(lang) {
      case 'en': return 'English';
      case 'pt': return 'Português';
      case 'es': return 'Español';
      default: return 'English';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sticky top-0 z-30">
      <div className="flex items-center">
        {isDashboard && (
          <button onClick={toggleSidebar} className="mr-4 lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-md">
            <Menu className="w-5 h-5" />
          </button>
        )}
        <Link to="/dashboard" className="flex items-center space-x-2">
            <Logo className="w-8 h-8" />
            <span className="text-lg font-bold text-slate-900 tracking-tight">DISC Coach</span>
            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200 hidden sm:inline-block">{t('header.level')}</span>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        {/* Language Selector */}
        <div className="relative" ref={langMenuRef}>
          <button 
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            className="flex items-center space-x-1 p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span className="text-sm font-medium hidden md:inline-block">{getLangLabel(language)}</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          
          {langMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-slate-100 py-1 animate-in fade-in zoom-in-95 duration-100 z-50">
              <button onClick={() => changeLanguage('en')} className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${language === 'en' ? 'text-indigo-600 font-medium' : 'text-slate-700'}`}>
                English
              </button>
              <button onClick={() => changeLanguage('pt')} className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${language === 'pt' ? 'text-indigo-600 font-medium' : 'text-slate-700'}`}>
                Português (BR)
              </button>
              <button onClick={() => changeLanguage('es')} className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${language === 'es' ? 'text-indigo-600 font-medium' : 'text-slate-700'}`}>
                Español
              </button>
            </div>
          )}
        </div>

        <div className="relative" ref={notifMenuRef}>
          <button 
            onClick={() => setNotifMenuOpen(!notifMenuOpen)}
            className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            )}
          </button>

          {notifMenuOpen && (
             <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-slate-100 py-1 animate-in fade-in zoom-in-95 duration-100 z-50">
                <div className="px-4 py-2 border-b border-slate-50 flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
                    <span className="text-xs text-slate-500">{unreadCount} unread</span>
                </div>
                <div className="max-h-64 overflow-y-auto">
                    {history.length === 0 ? (
                        <div className="p-4 text-center text-sm text-slate-500">No notifications</div>
                    ) : (
                        history.map((n: any) => (
                            <div 
                                key={n.id} 
                                onClick={() => markAsRead(n.id)}
                                className={`px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-none ${!n.is_read || n.is_read == 0 ? 'bg-blue-50/50' : ''}`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                                        n.type === 'error' ? 'bg-red-500' :
                                        n.type === 'success' ? 'bg-green-500' :
                                        n.type === 'warning' ? 'bg-yellow-500' :
                                        'bg-blue-500'
                                    }`} />
                                    <div>
                                        <p className={`text-sm ${!n.is_read || n.is_read == 0 ? 'font-medium text-slate-900' : 'text-slate-600'}`}>
                                            {n.message}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            {new Date(n.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
             </div>
          )}
        </div>
        
        <div className="relative" ref={userMenuRef}>
            <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 border-l border-slate-200 pl-4 hover:bg-slate-50 py-1 pr-2 rounded-lg transition-colors group"
            >
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-slate-900 group-hover:text-indigo-700">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.position}</p>
                </div>
                <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 border border-slate-200 group-hover:border-indigo-200 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                </div>
            </button>

            {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-100 py-1 animate-in fade-in zoom-in-95 duration-100 z-50">
                    <Link to="/settings" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Profile Settings
                    </Link>
                    <Link to="/affiliates" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Afiliados
                    </Link>
                    <div className="border-t border-slate-100 my-1"></div>
                    <button 
                        onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                        }} 
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </button>
                </div>
            )}
        </div>
      </div>
    </header>
  );
};