import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useUser } from '../../context/UserContextSupabase';
import { useAssessment } from '../../context/AssessmentContext';
import { useNotification } from '../../context/NotificationContext';
import { supabaseApi } from '../../services/supabaseApi';
import { api } from '../../services/api';
import { 
    UserPlus, 
    BarChart2, 
    FileText, 
    Send, 
    Users as UsersIcon, 
    CheckCircle, 
    ChevronRight,
    Loader2,
    X,
    Copy,
    CheckCircle2
} from 'lucide-react';

const TeamManagement = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { addNotification } = useNotification();

  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Invite State
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteStep, setInviteStep] = useState(1);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteToken, setInviteToken] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (user?.id) {
        loadMembers();
    }
  }, [user?.id]);

  const loadMembers = async () => {
    try {
        setIsLoading(true);
        const data = await supabaseApi.getTeamMembers(user.id);
        setMembers(data);
    } catch (error) {
        console.error('Erro ao carregar time:', error);
        addNotification('error', 'Erro ao carregar membros do time.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleOpenInvite = () => {
    setInviteStep(1);
    setInviteEmail('');
    setShowInviteModal(true);
  };

  const generateInvite = async () => {
    if (!inviteEmail || !inviteEmail.includes('@')) {
        addNotification('error', 'E-mail inválido');
        return;
    }

    setIsSending(true);
    try {
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const newInvite = {
        id: `inv_${Date.now()}`,
        email: inviteEmail,
        role: 'user' as const, // Membro do time é sempre user
        discount: 100, // Gratuito para o membro (pago pelo time/empresa)
        token,
        used: false,
        invitedBy: user.id,
        createdAt: Date.now()
      };
      
      await supabaseApi.saveInvitation(newInvite);
      setInviteToken(token);
      setInviteStep(3); // Pula direto para o sucesso (passo 2 era confirmação de admin)
      addNotification('success', 'Convite gerado com sucesso!');
    } catch (e) {
      console.error(e);
      addNotification('error', 'Falha ao gerar convite.');
    } finally {
      setIsSending(false);
    }
  };

  const copyInviteLink = () => {
    const link = `${window.location.origin}/#/auth/onboarding?token=${inviteToken}`;
    navigator.clipboard.writeText(link);
    addNotification('success', 'Link copiado!');
  };

  const stats = {
      active: members.length,
      completed: members.filter(m => m.status === 'Concluído').length,
      pending: members.filter(m => m.status === 'Pendente').length
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Gerenciamento de Time</h1>
          <p className="text-slate-500 font-medium">Controle de assessments do departamento de {user.department || 'Geral'}.</p>
        </div>
        <Button 
            label="Convidar Novo Membro" 
            className="flex items-center gap-2"
            onClick={handleOpenInvite}
        >
            <UserPlus className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-xl shadow-indigo-900/20">
            <UsersIcon className="w-6 h-6 mb-4 opacity-50" />
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Membros Totais</p>
            <h3 className="text-3xl font-black">{stats.active}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <CheckCircle className="w-6 h-6 mb-4 text-green-500" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Assessments Concluídos</p>
            <h3 className="text-3xl font-black text-slate-900">{stats.completed} <span className="text-slate-400 text-lg">/ {stats.active}</span></h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <Send className="w-6 h-6 mb-4 text-amber-500" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Pendentes</p>
            <h3 className="text-3xl font-black text-slate-900">{stats.pending}</h3>
        </div>
      </div>

      <Card title="Membros do Time & Relatórios">
        <div className="overflow-x-auto -mx-6">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-y border-slate-100">
                    <tr>
                        <th className="px-6 py-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">Membro</th>
                        <th className="px-6 py-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">Status</th>
                        <th className="px-6 py-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">Perfil Dominante</th>
                        <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {isLoading ? (
                        <tr>
                            <td colSpan={4} className="py-12 text-center text-slate-400">
                                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-indigo-500" />
                                Carregando membros...
                            </td>
                        </tr>
                    ) : members.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="py-12 text-center text-slate-400">
                                Nenhum membro encontrado. Convide alguém para começar.
                            </td>
                        </tr>
                    ) : (
                        members.map((member) => (
                        <tr key={member.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-6 py-4">
                                <div className="font-bold text-slate-900">{member.name || 'Sem nome'}</div>
                                <div className="text-xs text-slate-400">{member.email}</div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${member.status === 'Concluído' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                                    {member.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 font-bold text-slate-600">{member.profile}</td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button 
                                        disabled={!member.resultId}
                                        onClick={() => navigate(`/results/summary/${member.resultId}`)}
                                        className="p-2 hover:bg-indigo-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors disabled:opacity-20"
                                        title="Ver Relatório"
                                    >
                                        <FileText className="w-4 h-4" />
                                    </button>
                                    <button 
                                        disabled={!member.resultId}
                                        onClick={() => navigate(`/development/${member.id}`)}
                                        className="p-2 hover:bg-indigo-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors disabled:opacity-20"
                                        title="Plano de Desenvolvimento"
                                    >
                                        <BarChart2 className="w-4 h-4" />
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
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Novo Membro</h3>
                    <button onClick={() => setShowInviteModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <div className="p-8">
                    {inviteStep === 1 && (
                        <div className="space-y-6">
                            <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                Envie um convite para um membro do seu time realizar o assessment DISC gratuitamente.
                            </p>
                            <Input 
                                label="E-mail do Colaborador" 
                                placeholder="ex: joao.silva@empresa.com" 
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                            />
                            <Button 
                                label={isSending ? "Gerando..." : "Gerar Link de Convite"} 
                                fullWidth 
                                disabled={!inviteEmail.includes('@') || isSending}
                                onClick={generateInvite}
                            />
                        </div>
                    )}

                    {inviteStep === 3 && (
                        <div className="text-center space-y-6 py-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 animate-in zoom-in duration-500">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <div>
                                <h4 className="text-lg font-black text-slate-900">Convite Criado!</h4>
                                <p className="text-sm text-slate-500 mt-1">Envie o link abaixo para o colaborador.</p>
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
                                onClick={() => {
                                    setShowInviteModal(false);
                                    loadMembers(); // Atualiza a lista para mostrar o pendente se implementarmos lógica de convites pendentes
                                }}
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

export default TeamManagement;
