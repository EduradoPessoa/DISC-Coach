import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, Settings, BookOpen, Crown, ChevronLeft, ChevronRight, Shield, HelpCircle, Heart } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { NPSModal } from '../ui/NPSModal';
import { useState } from 'react';

interface SidebarProps {
  isOpen: boolean;
  closeMobile: () => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeMobile, isCollapsed, toggleCollapse }) => {
  const { user } = useUser();
  const [showNPS, setShowNPS] = useState(false);
  const navigate = useNavigate();
  const isPro = user.plan === 'pro';

  const links = [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
    { icon: FileText, label: 'My Assessment', to: '/assessment/start' },
    { icon: BookOpen, label: 'Development Plan', to: '/development/me' },
  ];

  if (user.plan === 'clevel' || user.role === 'admin') {
    links.push({ icon: Users, label: 'Team (Admin)', to: '/admin/users' });
  }

  links.push({ icon: Settings, label: 'Settings', to: '/settings' });

  if (user.role === 'saas_admin') {
      links.push({ icon: Shield, label: 'SaaS Admin', to: '/saas-admin' });
  }

  // Adjusted width based on collapsed state
  const widthClass = isCollapsed ? 'lg:w-20' : 'lg:w-64';

  return (
    <>
    {showNPS && <NPSModal onClose={() => setShowNPS(false)} />}
    
    <aside 
      className={`fixed lg:static top-0 left-0 z-40 h-screen lg:h-auto bg-slate-900 text-white transition-all duration-300 ease-in-out border-r border-slate-800 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 ${widthClass} pt-16 lg:pt-0 flex flex-col`}
    >
        {/* Desktop Collapse Toggle */}
        <button 
            onClick={toggleCollapse}
            className="hidden lg:flex absolute -right-3 top-6 bg-slate-800 text-slate-400 p-1 rounded-full border border-slate-700 hover:text-white transition-colors z-30"
        >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

      {user.role === 'saas_admin' && !isCollapsed && (
        <div className="px-4 pt-6 pb-2">
            <div className="bg-indigo-900/50 border border-indigo-500/30 rounded-lg p-2 flex items-center justify-center text-xs font-bold text-indigo-200 tracking-wider uppercase">
                <Shield className="w-3 h-3 mr-1.5" />
                SaaS Admin Mode
            </div>
        </div>
      )}

      <div className="flex-1 px-3 py-6 space-y-1 overflow-x-hidden">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={closeMobile}
            title={isCollapsed ? link.label : ''}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors whitespace-nowrap ${
                isActive 
                ? 'bg-slate-800 text-white shadow-sm' 
                : 'hover:bg-slate-800 hover:text-white'
              } ${isCollapsed ? 'justify-center px-0' : ''}`
            }
          >
            <link.icon className={`w-5 h-5 min-w-[1.25rem]`} />
            {!isCollapsed && <span className="font-medium transition-opacity duration-200">{link.label}</span>}
          </NavLink>
        ))}
      </div>
      
      {/* Footer / Support */}
      <div className="p-4 border-t border-slate-800">
          <a 
            href="http://connect.phoenyx.com.br" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`flex items-center text-slate-400 hover:text-white transition-colors mb-3 ${isCollapsed ? 'justify-center' : ''}`}
            title="Support"
          >
            <HelpCircle className="w-5 h-5 min-w-[20px]" />
            {!isCollapsed && <span className="ml-3 text-sm font-medium">Suporte & Tickets</span>}
          </a>
          
          <button 
            onClick={() => setShowNPS(true)}
            className={`flex items-center w-full text-slate-400 hover:text-white transition-colors ${isCollapsed ? 'justify-center' : ''}`}
            title="Feedback"
          >
            <Heart className="w-5 h-5 min-w-[20px] text-pink-500" />
            {!isCollapsed && <span className="ml-3 text-sm font-medium">Avaliar App</span>}
          </button>
      </div>
    </aside>
    </>
  );
};
