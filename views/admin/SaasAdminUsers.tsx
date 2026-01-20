
import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useNotification } from '../../context/NotificationContext';
import { useUser } from '../../context/UserContextSupabase';
import { api } from '../../services/api';
import { supabaseApi } from '../../services/supabaseApi';
import { Search, Filter, MoreVertical, Shield, UserX, UserPlus, Mail, X, CheckCircle2, AlertTriangle, Copy, Loader2, Trash2, Edit2, Calendar } from 'lucide-react';

const SaasAdminUsers = () => {
  const { user: currentUser } = useUser();
  const { addNotification } = useNotification();
  
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteStep, setInviteStep] = useState(1);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteToken, setInviteToken] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Edit & Delete State
  const [editingUser, setEditingUser] = useState<any>(null);
  const [deletingUser, setDeletingUser] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await supabaseApi.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
      addNotification('error', 'Erro ao carregar lista de usuários.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    
    setIsProcessing(true);
    try {
      await supabaseApi.updateUser(editingUser.id, {
        plan: editingUser.plan,
        role: editingUser.role,
        subscriptionStatus: editingUser.subscriptionStatus
      });
      
      addNotification('success', 'Usuário atualizado com sucesso!');
      setEditingUser(null);
      loadUsers(); // Reload list
    } catch (error: any) {
      console.error('Erro ao atualizar:', error);
      const msg = error?.message || 'Erro desconhecido';
      addNotification('error', `Erro ao atualizar usuário: ${msg}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    
    setIsProcessing(true);
    try {
      await supabaseApi.deleteUser(deletingUser.id);
      
      addNotification('success', 'Usuário excluído com sucesso!');
      setDeletingUser(null);
      loadUsers(); // Reload list
    } catch (error: any) {
      console.error('Erro ao excluir:', error);
      const msg = error?.message || 'Erro desconhecido';
      addNotification('error', `Erro ao excluir usuário: ${msg}`);
    } finally {
      setIsProcessing(false);
    }
  };


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
        <div className="flex gap-2 relative">
            <Button 
                label="Notificações" 
                variant="secondary" 
                className="relative"
                onClick={() => setShowNotifications(!showNotifications)}
            >
                <Bell className="w-4 h-4 mr-2" />
                {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                )}
            </Button>
            
            {showNotifications && (
                <div className="absolute top-12 right-0 w-80 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Notificações</h3>
                        <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-6 text-center text-slate-400 text-sm">
                                Nenhuma notificação.
                            </div>
                        ) : (
                            notifications.map(n => (
                                <div key={n.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!n.read ? 'bg-indigo-50/30' : ''}`}>
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className={`text-sm font-bold ${!n.read ? 'text-indigo-700' : 'text-slate-700'}`}>{n.title}</h4>
                                        {!n.read && (
                                            <button 
                                                onClick={() => handleMarkAsRead(n.id)}
                                                className="text-[10px] text-indigo-500 hover:text-indigo-700 font-bold uppercase"
                                            >
                                                Ler
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 mb-2 leading-relaxed">{n.message}</p>
                                    <span className="text-[10px] text-slate-400">
                                        {new Date(n.created_at).toLocaleString('pt-BR')}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            <Button 
                label="Convidar Admin de Time" 
                className="flex items-center gap-2" 
                onClick={handleOpenInvite}
            >
                <UserPlus className="w-4 h-4" />
            </Button>
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
                        <th className="px-6 py-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">Cadastro</th>
                        <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {isLoading ? (
                        <tr>
                            <td colSpan={6} className="py-12 text-center text-slate-400">
                                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-indigo-500" />
                                Carregando usuários...
                            </td>
                        </tr>
                    ) : users.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="py-12 text-center text-slate-400">
                                Nenhum usuário encontrado.
                            </td>
                        </tr>
                    ) : (
                        users.map((user, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="font-bold text-slate-900">{user.name || 'Sem nome'}</div>
                                <div className="text-xs text-slate-400">{user.email}</div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg border ${
                                    user.role === 'saas-admin' ? 'border-purple-100 text-purple-600 bg-purple-50' :
                                    user.role === 'team-admin' ? 'border-indigo-100 text-indigo-600 bg-indigo-50' : 
                                    'border-slate-100 text-slate-500 bg-slate-50'
                                }`}>
                                    {user.role}
                                </span>
                            </td>
                            <td className="px-6 py-4 font-bold text-slate-600 uppercase">{user.plan || 'FREE'}</td>
                            <td className="px-6 py-4">
                                <span className={`flex items-center gap-1.5 text-xs font-bold ${user.subscriptionStatus === 'active' ? 'text-green-600' : 'text-slate-500'}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${user.subscriptionStatus === 'active' ? 'bg-green-500' : 'bg-slate-300'}`} />
                                    {user.subscriptionStatus === 'active' ? 'Ativo' : 'Inativo'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-xs font-medium text-slate-500">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3 h-3 text-slate-400" />
                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : '-'}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-1">
                                    <button 
                                        onClick={() => setEditingUser(user)}
                                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors" 
                                        title="Editar"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => setDeletingUser(user)}
                                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-red-600 transition-colors" 
                                        title="Excluir"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    )))}
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
      {/* MODAL DE EDIÇÃO */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden border border-slate-200">
                <div className="flex justify-between items-center px-8 py-6 border-b border-slate-100">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Editar Usuário</h3>
                    <button onClick={() => setEditingUser(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>
                
                <div className="p-8 space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nome</label>
                        <Input value={editingUser.name || ''} disabled className="bg-slate-50" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">E-mail</label>
                        <Input value={editingUser.email || ''} disabled className="bg-slate-50" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Função (Role)</label>
                        <select 
                            value={editingUser.role} 
                            onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 font-medium appearance-none"
                        >
                            <option value="user">User</option>
                            <option value="team-admin">Team Admin</option>
                            <option value="saas-admin">SaaS Admin</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Admin do Time (Gestor)</label>
                        <select 
                            value={editingUser.invitedBy || ''} 
                            onChange={(e) => setEditingUser({...editingUser, invitedBy: e.target.value || null})}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 font-medium appearance-none"
                        >
                            <option value="">Sem gestor</option>
                            {users.filter(u => u.role === 'team-admin' && u.id !== editingUser.id).map(admin => (
                                <option key={admin.id} value={admin.id}>
                                    {admin.name} ({admin.email})
                                </option>
                            ))}
                        </select>
                        <p className="text-[10px] text-slate-400 mt-1">
                            Usuários vinculados a um Admin de Time ganham acesso automático aos Planos de Desenvolvimento.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Plano</label>
                            <select 
                                value={editingUser.plan || 'free'} 
                                onChange={(e) => setEditingUser({...editingUser, plan: e.target.value})}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 font-medium appearance-none"
                            >
                                <option value="free">Free</option>
                                <option value="pro">Pro</option>
                                <option value="enterprise">Enterprise</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status</label>
                            <select 
                                value={editingUser.subscriptionStatus || 'inactive'} 
                                onChange={(e) => setEditingUser({...editingUser, subscriptionStatus: e.target.value})}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 font-medium appearance-none"
                            >
                                <option value="active">Ativo</option>
                                <option value="inactive">Inativo</option>
                                <option value="cancelled">Cancelado</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button 
                            label="Cancelar" 
                            variant="ghost" 
                            className="flex-1 border border-slate-200"
                            onClick={() => setEditingUser(null)}
                        />
                        <Button 
                            label={isProcessing ? "Salvando..." : "Salvar Alterações"} 
                            className="flex-1"
                            onClick={handleUpdateUser}
                            disabled={isProcessing}
                        />
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* MODAL DE DELEÇÃO */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden border border-slate-200">
                <div className="p-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600 mb-4">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Excluir Usuário?</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        Você está prestes a excluir o usuário <span className="font-bold text-slate-900">{deletingUser.name || deletingUser.email}</span>. 
                        Esta ação é irreversível e removerá todos os dados associados.
                    </p>
                    
                    <div className="pt-6 flex gap-3">
                        <Button 
                            label="Cancelar" 
                            variant="ghost" 
                            className="flex-1 border border-slate-200"
                            onClick={() => setDeletingUser(null)}
                        />
                        <Button 
                            label={isProcessing ? "Excluindo..." : "Sim, Excluir"} 
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white border-transparent"
                            onClick={handleDeleteUser}
                            disabled={isProcessing}
                        />
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default SaasAdminUsers;
