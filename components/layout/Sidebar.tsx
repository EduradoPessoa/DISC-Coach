import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  BookOpen, 
  Crown, 
  DollarSign, 
  Ticket, 
  Share2, 
  LogOut,
  UserPlus
} from 'lucide-react';
import { useUser } from '../../context/UserContextSupabase';

interface SidebarProps {
  isOpen: boolean;
  closeMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeMobile }) => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Definição de links por Role
  const menuConfig = {
    'saas-admin': [
      { icon: LayoutDashboard, label: 'Painel SaaS', to: '/dashboard' },
      { icon: Users, label: 'Gestão de Usuários', to: '/admin/saas/users' },
      { icon: DollarSign, label: 'Gestão Financeira', to: '/admin/saas/finance' },
      { icon: Ticket, label: 'Cupons de Desconto', to: '/admin/saas/coupons' },
      { icon: Share2, label: 'Gestão de Afiliados', to: '/admin/saas/affiliates' },
      { icon: Settings, label: 'Configurações', to: '/settings' },
    ],
    'team-admin': [
      { icon: LayoutDashboard, label: 'Meu Dashboard', to: '/dashboard' },
      { icon: FileText, label: 'Meu Assessment', to: '/assessment/start' },
      { icon: BookOpen, label: 'Plano de Dev.', to: '/development/me' },
      { icon: UserPlus, label: 'Gerenciar Time', to: '/admin/team' },
      { icon: Settings, label: 'Configurações', to: '/settings' },
    ],
    'user': [
      { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
      { icon: FileText, label: 'Realizar Avaliação', to: '/assessment/start' },
      { icon: BookOpen, label: 'Meu Plano de Dev.', to: '/development/me' },
      { icon: Settings, label: 'Configurações', to: '/settings' },
    ]
  };

  const links = menuConfig[user.role] || menuConfig['user'];

  const baseClasses = "fixed inset-y-0 left-0 z-20 w-64 bg-slate-900 text-slate-300 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto";
  const mobileClasses = isOpen ? "translate-x-0" : "-translate-x-full";

  return (
    <aside className={`${baseClasses} ${mobileClasses} flex flex-col pt-16 lg:pt-0 border-r border-slate-800`}>
      <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={closeMobile}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
                : 'hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <link.icon className="w-5 h-5" />
            <span className="font-semibold text-sm">{link.label}</span>
          </NavLink>
        ))}
      </div>
      
      <div className="p-4 space-y-3">
        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
            <div className="flex items-center space-x-2 mb-1">
                <Crown className={`w-4 h-4 ${user.role === 'saas-admin' ? 'text-amber-400' : 'text-indigo-400'}`} />
                <h4 className="text-white text-xs font-black uppercase tracking-widest">
                    {user.role.replace('-', ' ')}
                </h4>
            </div>
            <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-950/20 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-semibold text-sm">Sair do Sistema</span>
        </button>
      </div>
    </aside>
  );
};