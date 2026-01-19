import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useLanguage } from '../../context/LanguageContext';
import { useNotification } from '../../context/NotificationContext';
import { useAssessment } from '../../context/AssessmentContext';
import { useUser } from '../../context/UserContext';
import { generateFullDiscReport } from '../../services/geminiService';
import { Download, Loader2, Sparkles, AlertCircle, History } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { marked } from 'marked';

const ResultsSummary = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { language, t } = useLanguage();
  const { user } = useUser();
  const { addNotification } = useNotification();
  const { history, saveAnalysisToResult } = useAssessment();
  
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Seleciona o resultado: se userId for um ID específico, busca no histórico, senão pega o mais recente
  const currentResult = history.find(r => r.id === userId) || (history.length > 0 ? history[history.length - 1] : null);
  
  const scores = currentResult?.scores || { D: 0, I: 0, S: 0, C: 0 };
  
  const chartData = [
    { name: 'Dominância (D)', score: scores.D, color: '#ef4444' },
    { name: 'Influência (I)', score: scores.I, color: '#eab308' },
    { name: 'Estabilidade (S)', score: scores.S, color: '#22c55e' },
    { name: 'Conformidade (C)', score: scores.C, color: '#3b82f6' },
  ];

  const handleGenerateAIReport = async () => {
    if (!currentResult) return;
    
    setIsAnalyzing(true);
    addNotification('info', 'O Coach IA está analisando seu perfil comportamental...');
    
    try {
      const report = await generateFullDiscReport(
        scores, 
        `Cargo: ${user.position}, Departamento: ${user.department}. Foco em nível executivo C-Level.`,
        language
      );
      
      saveAnalysisToResult(currentResult.id, report);
      addNotification('success', 'Análise estratégica gravada com sucesso!');
    } catch (error) {
      console.error("AI Report Error:", error);
      addNotification('error', 'Falha ao gerar análise de IA. Verifique sua conexão.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    // Se temos um resultado mas ele não tem análise, gera automaticamente
    if (currentResult && !currentResult.analysis && !isAnalyzing) {
       handleGenerateAIReport();
    }
  }, [currentResult?.id]);

  const handleExportPdf = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(reportRef.current, { 
        scale: 2, 
        useCORS: true, 
        backgroundColor: '#f8fafc',
        logging: false 
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
      pdf.save(`Relatorio_DISC_${user.name.replace(/\s/g, '_')}_${new Date().toLocaleDateString()}.pdf`);
      addNotification('success', 'Relatório PDF exportado!');
    } catch (e) {
      addNotification('error', 'Erro ao exportar PDF.');
    } finally {
      setIsExporting(false);
    }
  };

  const renderMarkdown = (text: string) => {
    try {
      return { __html: marked.parse(text) };
    } catch (e) {
      return { __html: text };
    }
  };

  if (!currentResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertCircle className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-900">Nenhum resultado encontrado</h2>
        <p className="text-slate-500 mb-6">Você ainda não realizou uma avaliação completa.</p>
        <Button label="Começar Avaliação" onClick={() => navigate('/assessment/start')} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com Ações */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center no-print">
        <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('results.title')}</h1>
            <p className="text-slate-500 text-sm">
                Executivo: <span className="font-bold text-indigo-600">{user.name}</span> • 
                Data: {new Date(currentResult.timestamp).toLocaleDateString()}
            </p>
        </div>
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            <Button 
                label="Re-analisar IA" 
                variant="ghost" 
                onClick={handleGenerateAIReport}
                disabled={isAnalyzing}
                className="flex items-center gap-2 border border-indigo-100 text-indigo-600 bg-white hover:bg-indigo-50"
            >
                <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            </Button>
            <Button 
                label={isExporting ? "Gerando..." : "Exportar PDF"} 
                variant="secondary" 
                onClick={handleExportPdf}
                disabled={isExporting}
                className="flex items-center gap-2"
            >
                <Download className="w-4 h-4" />
            </Button>
            <Button 
                label="Histórico" 
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2"
            >
                <History className="w-4 h-4" />
            </Button>
        </div>
      </div>

      {/* Conteúdo Capturável do Relatório */}
      <div ref={reportRef} className="space-y-8 bg-slate-50 rounded-3xl p-4 md:p-8 border border-slate-200/60 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Gráfico de Barras DISC */}
          <Card title="Gráfico de Perfil Comportamental" subtitle="Pontuação normalizada (0-100)">
              <div className="h-72 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 30 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                          <XAxis type="number" domain={[0, 100]} tick={{fontSize: 10}} />
                          <YAxis dataKey="name" type="category" width={110} tick={{fontSize: 11, fontWeight: 700, fill: '#475569'}} />
                          <Tooltip 
                            cursor={{fill: 'rgba(79, 70, 229, 0.05)'}}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                          />
                          <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={32}>
                               {chartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                          </Bar>
                      </BarChart>
                  </ResponsiveContainer>
              </div>
          </Card>

          {/* Sumário Executivo Renderizado via IA */}
          <Card title="Sumário Executivo Estratégico" className="relative overflow-hidden">
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4 py-20">
                    <div className="relative">
                        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                        <Sparkles className="w-6 h-6 text-indigo-400 absolute -top-2 -right-2 animate-bounce" />
                    </div>
                    <p className="text-sm text-slate-500 font-bold animate-pulse">Sintetizando inteligência executiva...</p>
                </div>
              ) : currentResult.analysis ? (
                <div 
                    className="prose prose-slate prose-sm max-w-none text-slate-600 leading-relaxed overflow-y-auto max-h-[300px] pr-2 custom-scrollbar" 
                    dangerouslySetInnerHTML={renderMarkdown(currentResult.analysis.summary)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-20 text-slate-300 text-center">
                    <Sparkles className="w-12 h-12 mb-3 opacity-20" />
                    <p className="text-sm font-medium">Aguardando análise da IA...</p>
                </div>
              )}
          </Card>
        </div>

        {/* Cards Gerados Dinamicamente pela IA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-t-4 border-t-indigo-500 transition-transform hover:-translate-y-1">
                <h4 className="text-sm font-black text-indigo-900 uppercase tracking-tighter mb-4 flex items-center gap-2">
                    Estilo de Comunicação
                </h4>
                <ul className="space-y-3">
                    {currentResult.analysis?.communication.map((item, i) => (
                      <li key={i} className="flex items-start text-sm text-slate-600 leading-snug">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 mr-3 flex-shrink-0"></span>
                        {item}
                      </li>
                    )) || [...Array(3)].map((_, i) => <div key={i} className="h-4 bg-slate-100 rounded animate-pulse mb-2"></div>)}
                </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-t-4 border-t-green-500 transition-transform hover:-translate-y-1">
                <h4 className="text-sm font-black text-green-900 uppercase tracking-tighter mb-4">
                    Valor para Organização
                </h4>
                <ul className="space-y-3">
                    {currentResult.analysis?.value.map((item, i) => (
                      <li key={i} className="flex items-start text-sm text-slate-600 leading-snug">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 mr-3 flex-shrink-0"></span>
                        {item}
                      </li>
                    )) || [...Array(3)].map((_, i) => <div key={i} className="h-4 bg-slate-100 rounded animate-pulse mb-2"></div>)}
                </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-t-4 border-t-red-500 transition-transform hover:-translate-y-1">
                <h4 className="text-sm font-black text-red-900 uppercase tracking-tighter mb-4">
                    Riscos e Pontos Cegos
                </h4>
                <ul className="space-y-3">
                    {currentResult.analysis?.blindspots.map((item, i) => (
                      <li key={i} className="flex items-start text-sm text-slate-600 leading-snug">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 mr-3 flex-shrink-0"></span>
                        {item}
                      </li>
                    )) || [...Array(3)].map((_, i) => <div key={i} className="h-4 bg-slate-100 rounded animate-pulse mb-2"></div>)}
                </ul>
            </div>
        </div>

        {/* Rodapé do Relatório */}
        <div className="flex items-center justify-between border-t border-slate-200 pt-8 mt-12 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">
            <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-slate-900 rounded-lg flex items-center justify-center">
                    <span className="text-white text-[9px]">DC</span>
                </div>
                <span>DISC Coach (Level C) Professional Report</span>
            </div>
            <div className="flex gap-4">
                <span>Ref ID: {currentResult.id}</span>
                <span>Confidencial</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsSummary;