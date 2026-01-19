import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Search, Filter, MoreVertical, Shield, UserX, UserCheck, Mail } from 'lucide-react';

const SaasAdminUsers = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Gestão de Usuários SaaS</h1>
          <p className="text-slate-500 font-medium">Controle de acessos, papéis e notificações globais.</p>
        </div>
        <div className="flex gap-2">
            <Button label="Convidar Admin de Time" className="flex items-center gap-2" />
            <Button label="Notificação Global" variant="secondary" />
        </div>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Buscar por nome, e-mail ou empresa..." 
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
            </div>
            <div className="flex gap-2">
                <Button label="Filtros" variant="ghost" className="border border-slate-200">
                    <Filter className="w-4 h-4" />
                </Button>
            </div>
        </div>

        <div className="overflow-x-auto -mx-6">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-y border-slate-100">
                    <tr>
                        <th className="px-6 py-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">Usuário</th>
                        <th className="px-6 py-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">Tipo / Role</th>
                        <th className="px-6 py-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">Plano</th>
                        <th className="px-6 py-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">Status</th>
                        <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {[
                        { name: 'Empresa XYZ', email: 'admin@xyz.com', role: 'team-admin', plan: 'PRO', status: 'Ativo' },
                        { name: 'Carlos Silva', email: 'carlos@xyz.com', role: 'user', plan: 'FREE', status: 'Ativo' },
                        { name: 'Consultoria ABC', email: 'ana@abc.com', role: 'team-admin', plan: 'PRO', status: 'Bloqueado' },
                    ].map((user, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="font-bold text-slate-900">{user.name}</div>
                                <div className="text-xs text-slate-400">{user.email}</div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg border ${
                                    user.role === 'team-admin' ? 'border-indigo-100 text-indigo-600 bg-indigo-50' : 'border-slate-100 text-slate-500 bg-slate-50'
                                }`}>
                                    {user.role}
                                </span>
                            </td>
                            <td className="px-6 py-4 font-bold text-slate-600">{user.plan}</td>
                            <td className="px-6 py-4">
                                <span className={`flex items-center gap-1.5 text-xs font-bold ${user.status === 'Ativo' ? 'text-green-600' : 'text-red-600'}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Ativo' ? 'bg-green-500' : 'bg-red-500'}`} />
                                    {user.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-1">
                                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors" title="Bloquear">
                                        <UserX className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors" title="Enviar Notificação">
                                        <Mail className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </Card>
    </div>
  );
};

export default SaasAdminUsers;