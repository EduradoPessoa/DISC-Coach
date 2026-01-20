
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAssessment } from '../context/AssessmentContext';
import { useUser } from '../context/UserContextSupabase';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Clock, CheckCircle, FileText, ChevronRight, Award } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { history, latestResult } = useAssessment();

  // Prepara dados do gráfico radar baseado no último resultado
  const radarData = latestResult ? [
    { subject: 'Dominância', A: latestResult.scores.D, fullMark: 100 },
    { subject: 'Influência', A: latestResult.scores.I, fullMark: 100 },
    { subject: 'Estabilidade', A: latestResult.scores.S, fullMark: 100 },
    { subject: 'Conformidade', A: latestResult.scores.C, fullMark: 100 },
  ] : [
    { subject: 'D', A: 0, fullMark: 100 },
    { subject: 'I', A: 0, fullMark: 100 },
    { subject: 'S', A: 0, fullMark: 100 },
    { subject: 'C', A: 0, fullMark: 100 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Bem-vindo, {user.name.split(' ')[0]}</h1>
            <p className="text-slate-500 font-medium">Sua inteligência executiva está sendo monitorada.</p>
        </div>
        <div className="flex space-x-3">
            <Button label="Nova Avaliação" onClick={() => navigate('/assessment/start')} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Card */}
        <Card title="Status do Perfil" className="lg:col-span-1">
            <div className="flex items-center space-x-4 mb-6">
                <div className={`p-3 rounded-2xl ${history.length > 0 ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                    {history.length > 0 ? <CheckCircle className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                </div>
                <div>
                    <h4 className="font-bold text-slate-900">{history.length > 0 ? 'Perfil Ativo' : 'Avaliação Pendente'}</h4>
                    <p className="text-xs text-slate-500">
                        {history.length} avaliação(ões) realizada(s)
                    </p>
                </div>
            </div>
            
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl mb-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Próxima Etapa</p>
                <p className="text-sm text-slate-700 font-medium">
                    {history.length === 0 
                      ? "Realize o Assessment para liberar o Coach IA." 
                      : "Revise seu Plano de Desenvolvimento Estratégico."}
                </p>
            </div>

            <Button 
                label={history.length === 0 ? "Começar Agora" : "Ver Último Resultado"} 
                fullWidth 
                variant={history.length === 0 ? 'primary' : 'secondary'} 
                onClick={() => history.length === 0 ? navigate('/assessment/start') : navigate(`/results/summary/${latestResult?.id}`)} 
            />
        </Card>

        {/* Radar Snapshot */}
        <Card title="Snapshot Comportamental" className="lg:col-span-1 min-h-[320px]">
            {history.length > 0 ? (
                <div className="h-64 -mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                            <PolarGrid stroke="#e2e8f0" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
                            <Radar
                                name={user.name}
                                dataKey="A"
                                stroke="#4f46e5"
                                fill="#4f46e5"
                                fillOpacity={0.5}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-300 py-10">
                    <FileText className="w-12 h-12 mb-3 opacity-20" />
                    <p className="text-sm font-medium">Sem dados para exibir</p>
                </div>
            )}
        </Card>

        {/* Coach IA Quick Link */}
        <Card title="Inteligência de Liderança" className="lg:col-span-1">
            <div className="space-y-4">
                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-start gap-3">
                    <Award className="w-5 h-5 text-indigo-600 mt-1" />
                    <div>
                        <p className="text-sm font-bold text-indigo-900">Coach Nível C</p>
                        <p className="text-xs text-indigo-700 leading-relaxed mt-1">
                            A análise IA utiliza seus resultados para ajustar estratégias de governança.
                        </p>
                    </div>
                </div>
                
                <Button 
                    label="Plano de Desenvolvimento" 
                    fullWidth 
                    variant="ghost" 
                    className="border border-slate-200" 
                    onClick={() => navigate('/development/me')} 
                />
            </div>
        </Card>
      </div>

      {/* Histórico de Avaliações - PERSISTÊNCIA VISUAL */}
      <Card title="Histórico de Avaliações">
        {history.length > 0 ? (
            <div className="overflow-x-auto -mx-6">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-400 uppercase bg-slate-50/50 border-y border-slate-100">
                        <tr>
                            <th className="px-6 py-4 font-black tracking-widest">Data</th>
                            <th className="px-6 py-4 font-black tracking-widest">Resultado Principal</th>
                            <th className="px-6 py-4 font-black tracking-widest text-right">Ação</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {[...history].reverse().map((res) => {
                            const scores = res.scores;
                            // Fix: Cast values to number for arithmetic sorting
                            const dominant = Object.entries(scores).sort((a,b) => (b[1] as number) - (a[1] as number))[0][0];
                            const label = dominant === 'D' ? 'Dominante' : dominant === 'I' ? 'Influente' : dominant === 'S' ? 'Estável' : 'Analítico';
                            
                            return (
                                <tr key={res.id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-6 py-5 font-medium text-slate-900">
                                        {new Date(res.timestamp).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${dominant === 'D' ? 'bg-red-500' : dominant === 'I' ? 'bg-yellow-500' : dominant === 'S' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                                            <span className="font-bold text-slate-700">{label}</span>
                                            <span className="text-xs text-slate-400 font-mono">(D:{scores.D} I:{scores.I} S:{scores.S} C:{scores.C})</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button 
                                            onClick={() => navigate(`/results/summary/${res.id}`)}
                                            className="inline-flex items-center gap-1.5 text-indigo-600 font-bold hover:text-indigo-800 transition-colors"
                                        >
                                            Ver Detalhes <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        ) : (
            <div className="py-12 text-center text-slate-400">
                <p className="text-sm font-medium italic">Nenhuma avaliação registrada no histórico.</p>
            </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
