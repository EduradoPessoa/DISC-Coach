import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Users, DollarSign, Tag, Settings, TrendingUp, AlertCircle, Bell, MessageSquare } from 'lucide-react';
import { useUser } from '../../context/UserContext';

const SaasDashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  if (user.role !== 'saas_admin') {
    return (
        <div className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900">Access Denied</h2>
            <p className="text-slate-500">You do not have permission to view this area.</p>
        </div>
    );
  }

  const stats = [
    { label: 'Total Revenue (MRR)', value: 'R$ 45.290', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Active Users', value: '1,234', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Conversion Rate', value: '3.2%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Active Coupons', value: '8', icon: Tag, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  const modules = [
    { title: 'User Management', desc: 'Manage prospects, active clients, and access.', icon: Users, to: '/saas-admin/users' },
    { title: 'Financials', desc: 'View transactions, invoices, and MRR reports.', icon: DollarSign, to: '/saas-admin/finance' },
    { title: 'Coupons & Discounts', desc: 'Create and manage promotional codes.', icon: Tag, to: '/saas-admin/coupons' },
    { title: 'Notifications', desc: 'Send alerts to users.', icon: Bell, to: '/saas-admin/notifications' },
    { title: 'NPS & Feedback', desc: 'Moderate user testimonials.', icon: MessageSquare, to: '/saas-admin/nps' },
    { title: 'SaaS Settings', desc: 'Configure pricing, plans, and system defaults.', icon: Settings, to: '/saas-admin/settings' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">SaaS Administration</h1>
        <p className="text-slate-500">Overview of system performance and management.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                    <h3 className="text-xl font-bold text-slate-900">{stat.value}</h3>
                </div>
            </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold text-slate-900 mt-8 mb-4">Management Modules</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((mod, i) => (
            <Card key={i} title={mod.title} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(mod.to)}>
                <div className="flex items-start space-x-4">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                        <mod.icon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-slate-600 mb-4">{mod.desc}</p>
                        <span className="text-indigo-600 font-medium text-sm hover:underline">Access Module →</span>
                    </div>
                </div>
            </Card>
        ))}
      </div>
    </div>
  );
};

export default SaasDashboard;
