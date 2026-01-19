import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useUser } from '../../context/UserContext';
import { useAssessment } from '../../context/AssessmentContext';
import { UserPlus, BarChart2, FileText, Send, Users as UsersIcon, CheckCircle, ChevronRight } from 'lucide-react';

const TeamManagement = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { history } = useAssessment();

  // Simulação de membros (em um app real viria do backend)
  const teamMembers = [
    { id: 'm1', name: 'Ricardo Oliveira', email: 'ricardo@corp.com', status: 'Concluído', profile: 'Analítico (C)', resultId: 'res_mock_1' },
    { id: 'm2', name: 'Fernanda Lima', email: 'fernanda@corp.com', status: 'Em progresso', profile: '-', resultId: null },
    { id: 'm3', name: 'Tiago Souza', email: 'tiago@corp.com', status: 'Concluído', profile: 'Dominante (D)', resultId: 'res_mock_2' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Gerenciamento de Time</h1>
          <p className="text-slate-500 font-medium">Controle de assessmetns do departamento de {user.department}.</p>
        </div>
        <Button label="Convidar Novo Membro" className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-xl shadow-indigo-900/20">
            <UsersIcon className="w-6 h-6 mb-4 opacity-50" />
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Membros Ativos</p>
            <h3 className="text-3xl font-black">{teamMembers.length}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <CheckCircle className="w-6 h-6 mb-4 text-green-500" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Assessments Concluídos</p>
            <h3 className="text-3xl font-black text-slate-900">2 / {teamMembers.length}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <Send className="w-6 h-6 mb-4 text-amber-500" />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Convites Pendentes</p>
            <h3 className="text-3xl font-black text-slate-900">1</h3>
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
                    {teamMembers.map((member) => (
                        <tr key={member.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-6 py-4">
                                <div className="font-bold text-slate-900">{member.name}</div>
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
                                        onClick={() => navigate(`/results/summary/${member.resultId || 'me'}`)}
                                        className="p-2 hover:bg-indigo-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors disabled:opacity-20"
                                    >
                                        <FileText className="w-4 h-4" />
                                    </button>
                                    <button 
                                        disabled={!member.resultId}
                                        onClick={() => navigate(`/development/${member.id}`)}
                                        className="p-2 hover:bg-indigo-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors disabled:opacity-20"
                                    >
                                        <BarChart2 className="w-4 h-4" />
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

export default TeamManagement;