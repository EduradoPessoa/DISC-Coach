
import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useNotification } from '../../context/NotificationContext';
import { useUser } from '../../context/UserContext';
import { api } from '../../services/api';
import { Search, Filter, MoreVertical, Shield, UserX, UserPlus, Mail, X, CheckCircle2, AlertTriangle, Copy } from 'lucide-react';

const SaasAdminUsers = () => {
  const { user: currentUser } = useUser();
  const { addNotification } = useNotification();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteStep, setInviteStep] = useState(1); // 1: Email, 2: Pergunta, 3: Sucesso
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteToken, setInviteToken] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleOpenInvite = () => {
    setInviteStep(1);
    setInviteEmail('');
    setShowInviteModal(true);
  };

  const generateInvite = async () => {
    setIsSending(true);
    try {
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const newInvite = {
        id: `inv_${Date.now()}`,
        email: inviteEmail,
        role: 'team-admin' as const,
        discount: 100,
        token,
        used: false,
        invitedBy: currentUser.id,
        createdAt: Date.now()
      };
      
      await api.saveInvitation(newInvite);
      setInviteToken(token);
      setInviteStep(3);
      addNotification('success', 'Convite gerado com sucesso!');
    } catch (e) {
      addNotification('error', 'Falha ao gerar convite.');
    } finally {
      setIsSending(false);
    }
  };

  const copyInviteLink = () => {
    const link = `${window.location.origin}/#/auth/onboarding?token=${inviteToken}`;
    navigator.clipboard.writeText(link);
    addNotification('success', 'Link copiado para a área de transferência!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Gestão de Usuários SaaS</h1>
          <p className="text-slate-500 font-medium">Controle de acessos, papéis e notificações globais.</p>
        </div>
        <div className="flex gap-2">
            <Button 
                label="Convidar Admin de Time" 
                className="flex items-center gap-2" 
                onClick={handleOpenInvite}
            >
                <UserPlus className="w-4 h-4" />
            </Button>
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
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
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

      {/* MODAL DE CONVITE */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden border border-slate-200">
                <div className="flex justify-between items-center px-8 py-6 border-b border-slate-100">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Convite Executivo</h3>
                    <button onClick={() => setShowInviteModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <div className="p-8">
                    {inviteStep === 1 && (
                        <div className="space-y-6">
                            <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                Envie um convite de <span className="text-indigo-600 font-bold">Admin de Time</span> com acesso 100% gratuito ao sistema.
                            </p>
                            <Input 
                                label="E-mail do Executivo" 
                                placeholder="ex: diretor@empresa.com" 
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                            />
                            <Button 
                                label="Prosseguir" 
                                fullWidth 
                                disabled={!inviteEmail.includes('@')}
                                onClick={() => setInviteStep(2)}
                            />
                        </div>
                    )}

                    {inviteStep === 2 && (
                        <div className="space-y-6">
                            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                <div className="text-xs text-amber-800 leading-relaxed font-bold">
                                    Atenção: Este convite concederá acesso vitalício e ilimitado às ferramentas Pro (Coach IA e Relatórios).
                                </div>
                            </div>
                            
                            <div className="pt-2">
                                <p className="text-sm font-black text-slate-900 mb-4 leading-tight">
                                    Pergunta de Governança:<br/>
                                    <span className="text-indigo-600">Este executivo possui autoridade corporativa para gerenciar dados de terceiros dentro da plataforma?</span>
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button 
                                        label="Não, cancelar" 
                                        variant="ghost" 
                                        className="border border-slate-200"
                                        onClick={() => setShowInviteModal(false)}
                                    />
                                    <Button 
                                        label={isSending ? "Gerando..." : "Sim, Confirmar"} 
                                        onClick={generateInvite}
                                        disabled={isSending}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {inviteStep === 3 && (
                        <div className="text-center space-y-6 py-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 animate-in zoom-in duration-500">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <div>
                                <h4 className="text-lg font-black text-slate-900">Convite Gerado!</h4>
                                <p className="text-sm text-slate-500 mt-1">Copie o link abaixo e envie para o executivo.</p>
                            </div>
                            
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between gap-3">
                                <span className="text-[10px] font-mono text-slate-400 truncate flex-1 text-left">
                                    {`${window.location.origin}/#/auth/onboarding?token=${inviteToken}`}
                                </span>
                                <button onClick={copyInviteLink} className="p-2 bg-white rounded-lg border border-slate-200 text-indigo-600 hover:bg-indigo-50 transition-colors">
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>

                            <Button 
                                label="Concluir" 
                                fullWidth 
                                variant="secondary" 
                                onClick={() => setShowInviteModal(false)}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default SaasAdminUsers;
