import React, { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { AIHelper } from '../../components/ui/AIHelper';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useLanguage } from '../../context/LanguageContext';
import { useNotification } from '../../context/NotificationContext';
import { Download, Loader2, FileText } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const ResultsSummary = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { t } = useLanguage();
  const { addNotification } = useNotification();
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Mock Result Data (High C, High D)
  const data = [
    { name: 'Dominance', score: 75, color: '#ef4444' }, // Red
    { name: 'Influence', score: 30, color: '#eab308' }, // Yellow
    { name: 'Steadiness', score: 45, color: '#22c55e' }, // Green
    { name: 'Compliance', score: 85, color: '#3b82f6' }, // Blue
  ];

  const profileSummary = "High Compliance (C) and High Dominance (D).";
  const roleContext = "C-Level Executive, Governance focus.";

  const descriptors = t('results.descriptors') as string[];
  const commStyleItems = t('results.commStyle.items') as string[];
  const valueOrgItems = t('results.valueOrg.items') as string[];
  const blindspotsItems = t('results.blindspots.items') as string[];

  const handleExportPdf = async () => {
    if (!reportRef.current) {
      addNotification('error', 'Erro ao localizar o conteúdo do relatório.');
      return;
    }
    
    setIsExporting(true);
    addNotification('info', 'Processando seu relatório executivo...');
    
    try {
      // Pequeno delay para garantir que componentes Recharts renderizaram
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#f8fafc',
        windowWidth: 1200 // Força uma largura estável para captura
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      pdf.save(`Relatorio_DISC_LevelC_${userId || 'Executivo'}.pdf`);
      
      addNotification('success', 'Relatório exportado com sucesso!');
    } catch (error) {
      console.error('PDF Export Error:', error);
      addNotification('error', 'Ocorreu um erro ao gerar o PDF. Verifique se há bloqueadores de script ativos.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center no-print">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">{t('results.title')}</h1>
            <p className="text-slate-500">{t('results.profileType')}: <span className="font-semibold text-slate-900">The Architect (CD)</span></p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
            <Button 
                label={isExporting ? "Gerando..." : t('results.exportPdf')} 
                variant="secondary" 
                onClick={handleExportPdf}
                disabled={isExporting}
                className="flex items-center gap-2"
            >
                {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {!isExporting && t('results.exportPdf')}
            </Button>
            <Button label={t('results.devPlan')} onClick={() => navigate(`/development/${userId}`)} />
        </div>
      </div>

      {/* Capturable Area */}
      <div ref={reportRef} className="space-y-6 p-4 md:p-8 bg-slate-50 rounded-2xl border border-slate-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart */}
          <Card title={t('results.discDimensions')}>
              <div className="h-64 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                          <XAxis type="number" domain={[0, 100]} />
                          <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12}} />
                          <Tooltip cursor={{fill: 'transparent'}} />
                          <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={30}>
                               {data.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                          </Bar>
                      </BarChart>
                  </ResponsiveContainer>
              </div>
              <div className="mt-6 text-sm text-slate-600 bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
                  <p className="mb-1"><strong className="text-slate-900">{t('results.driverLabel')}:</strong> Accuracy & Results.</p>
                  <p className="leading-relaxed">{t('results.driverDesc')}</p>
              </div>
          </Card>

          {/* AI Analysis */}
          <Card title={t('results.execSummary')}>
              <AIHelper 
                  mode="audit"
                  discProfile={profileSummary}
                  contextData={{ role: roleContext }}
                  promptTemplate={t('results.aiPrompt')}
              />
              
              <div className="mt-8 border-t border-slate-100 pt-6">
                  <h4 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wider">{t('results.descriptorsTitle')}</h4>
                  <div className="flex flex-wrap gap-2">
                      {descriptors.map((desc, i) => (
                        <span key={i} className={`px-4 py-1.5 rounded-lg text-xs font-bold ${
                          i % 2 === 0 ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-600'
                        } border border-transparent hover:border-indigo-200 transition-colors`}>
                          {desc}
                        </span>
                      ))}
                  </div>
              </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card title={t('results.commStyle.title')}>
                <ul className="space-y-3 text-sm text-slate-600">
                    {commStyleItems.map((item, i) => (
                      <li key={i} className="flex items-start"><span className="mr-2 text-indigo-500 font-bold">•</span>{item}</li>
                    ))}
                </ul>
            </Card>
            <Card title={t('results.valueOrg.title')}>
                <ul className="space-y-3 text-sm text-slate-600">
                    {valueOrgItems.map((item, i) => (
                      <li key={i} className="flex items-start"><span className="mr-2 text-green-500 font-bold">•</span>{item}</li>
                    ))}
                </ul>
            </Card>
            <Card title={t('results.blindspots.title')}>
                <ul className="space-y-3 text-sm text-slate-600">
                    {blindspotsItems.map((item, i) => (
                      <li key={i} className="flex items-start"><span className="mr-2 text-red-500 font-bold">•</span>{item}</li>
                    ))}
                </ul>
            </Card>
        </div>

        {/* Brand Footer for PDF */}
        <div className="hidden print:flex items-center justify-between border-t border-slate-200 pt-8 mt-12 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
            <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-slate-900 rounded flex items-center justify-center">
                    <span className="text-white text-[8px]">DC</span>
                </div>
                <span>DISC Coach (Level C) - Relatório Executivo</span>
            </div>
            <span>Documento Confidencial &copy; 2024</span>
        </div>
      </div>
    </div>
  );
};

export default ResultsSummary;