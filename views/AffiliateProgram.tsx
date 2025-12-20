import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Users, Copy, CheckCircle, Award, TrendingUp, DollarSign } from 'lucide-react';
import { useUser } from '../context/UserContext';

const AffiliateProgram = () => {
  const { user } = useUser();
  const [copied, setCopied] = useState(false);

  // Mock Invite Link
  const inviteLink = `https://disccoach.com.br/?ref=${user.id}`;

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Mock Data
  const stats = {
    clicks: 124,
    signups: 15,
    conversions: 3,
    earnings: 293.70
  };

  const invites = [
    { id: 1, email: 'roberto@corp.com', status: 'converted', date: '2024-12-10', commission: 97.90 },
    { id: 2, email: 'julia.m@startup.io', status: 'signed_up', date: '2024-12-12', commission: 0 },
    { id: 3, email: 'marcos@sales.com', status: 'clicked', date: '2024-12-15', commission: 0 },
    { id: 4, email: 'ana.p@hr.com', status: 'converted', date: '2024-12-18', commission: 97.90 },
    { id: 5, email: 'lucas@tech.com', status: 'converted', date: '2024-12-19', commission: 97.90 },
  ];

  const achievements = [
    { id: 1, title: 'Primeira Indicação', desc: 'Indique seu primeiro usuário', icon: Users, completed: true },
    { id: 2, title: 'Venda Confirmada', desc: 'Realize sua primeira conversão', icon: DollarSign, completed: true },
    { id: 3, title: 'Influenciador', desc: 'Alcance 10 conversões', icon: TrendingUp, completed: false, progress: '30%' },
    { id: 4, title: 'Parceiro Elite', desc: 'Fature R$ 1.000 em comissões', icon: Award, completed: false, progress: '29%' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Programa de Afiliados</h1>
        <p className="text-slate-500">Convide amigos e ganhe comissões recorrentes.</p>
      </div>

      {/* Invite Link Card */}
      <Card>
        <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-slate-700 mb-2">Seu Link de Indicação</label>
                <div className="flex gap-2">
                    <code className="flex-1 p-3 bg-slate-100 rounded-lg border border-slate-200 text-slate-600 font-mono text-sm overflow-x-auto">
                        {inviteLink}
                    </code>
                    <Button 
                        label={copied ? "Copiado!" : "Copiar"} 
                        icon={copied ? CheckCircle : Copy} 
                        onClick={copyLink}
                        className={copied ? "bg-green-600 hover:bg-green-700 border-transparent" : ""}
                    />
                </div>
            </div>
            <div className="flex gap-8 text-center border-l border-slate-100 pl-8">
                <div>
                    <p className="text-2xl font-bold text-indigo-600">{stats.signups}</p>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Cadastros</p>
                </div>
                <div>
                    <p className="text-2xl font-bold text-green-600">R$ {stats.earnings.toFixed(2)}</p>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Ganhos</p>
                </div>
            </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invites List */}
        <div className="lg:col-span-2">
            <Card title="Últimas Indicações">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                            <tr>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Data</th>
                                <th className="px-4 py-3 text-right">Comissão</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invites.map((invite) => (
                                <tr key={invite.id} className="border-b border-slate-100 last:border-0">
                                    <td className="px-4 py-3 font-medium text-slate-900">{invite.email}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                            invite.status === 'converted' ? 'bg-green-100 text-green-700' :
                                            invite.status === 'signed_up' ? 'bg-blue-100 text-blue-700' :
                                            'bg-slate-100 text-slate-600'
                                        }`}>
                                            {invite.status === 'converted' ? 'Venda' : invite.status === 'signed_up' ? 'Cadastro' : 'Clique'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-500">{new Date(invite.date).toLocaleDateString()}</td>
                                    <td className="px-4 py-3 text-right font-medium text-slate-900">
                                        {invite.commission > 0 ? `R$ ${invite.commission.toFixed(2)}` : '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>

        {/* Achievements */}
        <div>
            <Card title="Conquistas">
                <div className="space-y-4">
                    {achievements.map((ach) => (
                        <div key={ach.id} className={`flex items-center gap-4 p-3 rounded-xl border ${ach.completed ? 'bg-indigo-50 border-indigo-100' : 'bg-white border-slate-100 opacity-60'}`}>
                            <div className={`p-2 rounded-full ${ach.completed ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                <ach.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <h4 className={`text-sm font-bold ${ach.completed ? 'text-indigo-900' : 'text-slate-900'}`}>{ach.title}</h4>
                                <p className="text-xs text-slate-500">{ach.desc}</p>
                                {!ach.completed && ach.progress && (
                                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                                        <div className="bg-indigo-500 h-full" style={{ width: ach.progress }}></div>
                                    </div>
                                )}
                            </div>
                            {ach.completed && <CheckCircle className="w-5 h-5 text-indigo-600" />}
                        </div>
                    ))}
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default AffiliateProgram;
