import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, Settings, BookOpen } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  closeMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeMobile }) => {
  const links = [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
    { icon: FileText, label: 'My Assessment', to: '/assessment/start' },
    { icon: BookOpen, label: 'Development Plan', to: '/development/me' },
    { icon: Users, label: 'Team (Admin)', to: '/admin/users' },
    { icon: Settings, label: 'Settings', to: '/settings' },
  ];

  const baseClasses = "fixed inset-y-0 left-0 z-20 w-64 bg-slate-900 text-slate-300 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto";
  const mobileClasses = isOpen ? "translate-x-0" : "-translate-x-full";

  return (
    <aside className={`${baseClasses} ${mobileClasses} flex flex-col pt-16 lg:pt-0`}>
      <div className="flex-1 px-4 py-6 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={closeMobile}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive 
                ? 'bg-slate-800 text-white shadow-sm' 
                : 'hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <link.icon className="w-5 h-5" />
            <span className="font-medium">{link.label}</span>
          </NavLink>
        ))}
      </div>
      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800 rounded-lg p-4">
            <h4 className="text-white text-sm font-medium mb-1">Level C Pro</h4>
            <p className="text-xs text-slate-400 mb-3">Enterprise Plan Active</p>
            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-3/4"></div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">75% Usage Limits</p>
        </div>
      </div>
    </aside>
  );
};