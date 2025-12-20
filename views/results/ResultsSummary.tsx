import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { AIHelper } from '../../components/ui/AIHelper';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useLanguage } from '../../context/LanguageContext';
import { generatePDF } from '../../utils/pdfGenerator';
import { useUser } from '../../context/UserContext';
import { useAssessment } from '../../context/AssessmentContext';

const ResultsSummary = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { t } = useLanguage();
  const { user } = useUser();
  const { scores, loadLatestResults, isComplete } = useAssessment();

  useEffect(() => {
    // If we don't have scores yet, try to load them
    if (!scores) {
        loadLatestResults();
    }
  }, [scores, loadLatestResults]);

  // Use calculated scores or fallback to mock if loading fails (or show loading)
  const currentScores = scores || { D: 0, I: 0, S: 0, C: 0 };

  // Calculate Primary Driver (Highest Score)
  const getPrimaryDriver = (s: typeof currentScores) => {
    const maxScore = Math.max(s.D, s.I, s.S, s.C);
    if (maxScore === s.D) return 'D';
    if (maxScore === s.I) return 'I';
    if (maxScore === s.S) return 'S';
    return 'C';
  };

  const primaryDriver = getPrimaryDriver(currentScores);
  const profileData = (t(`results.profiles.${primaryDriver}`) as any) || {};

  const data = [
    { name: 'Dominance', score: currentScores.D, color: '#ef4444' }, // Red
    { name: 'Influence', score: currentScores.I, color: '#eab308' }, // Yellow
    { name: 'Steadiness', score: currentScores.S, color: '#22c55e' }, // Green
    { name: 'Compliance', score: currentScores.C, color: '#3b82f6' }, // Blue
  ];

  const profileSummary = `D:${currentScores.D}, I:${currentScores.I}, S:${currentScores.S}, C:${currentScores.C}`;
  const roleContext = "C-Level Executive, Governance focus.";

  // Use dynamic data if available, otherwise fallback (though fallback logic is minimal now)
  const descriptors = (profileData.descriptors as string[]) || (t('results.descriptors') as string[]);
  const commStyleItems = (profileData.commStyle?.items as string[]) || (t('results.commStyle.items') as string[]);
  const valueOrgItems = (profileData.valueOrg?.items as string[]) || (t('results.valueOrg.items') as string[]);
  const blindspotsItems = (profileData.blindspots?.items as string[]) || (t('results.blindspots.items') as string[]);

  const handleExportPDF = () => {
    generatePDF({
        user: user,
        scores: currentScores,
        insight: `DISC Profile Analysis based on scores: D=${currentScores.D}, I=${currentScores.I}, S=${currentScores.S}, C=${currentScores.C}.`,
        developmentPlan: [] // Pass actual plan if available
    });
  };

  if (!scores && !isComplete) {
      return <div className="p-8 text-center">Loading results...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">{t('results.title')}</h1>
            <p className="text-slate-500">{t('results.profileType')}: <span className="font-semibold text-slate-900">The Architect (CD)</span></p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
            <Button label={t('results.exportPdf')} variant="secondary" onClick={handleExportPDF} />
            <Button label={t('results.devPlan')} onClick={() => navigate(`/development/${userId}`)} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <Card title={t('results.discDimensions')}>
            <div className="h-64">
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
            <div className="mt-4 text-sm text-slate-600 bg-slate-50 p-4 rounded-lg">
                <p><strong>{t('results.driverLabel')}:</strong> Accuracy & Results.</p>
                <p>{t('results.driverDesc')}</p>
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
            
            <div className="mt-6 border-t border-slate-100 pt-4">
                <h4 className="font-semibold text-slate-900 mb-2">{t('results.descriptorsTitle')}</h4>
                <div className="flex flex-wrap gap-2">
                    {descriptors.map((desc, i) => (
                      <span key={i} className={`px-3 py-1 rounded-full text-xs font-medium ${
                        i % 2 === 0 ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {desc}
                      </span>
                    ))}
                </div>
            </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title={t('results.commStyle.title')}>
              <ul className="space-y-2 text-sm text-slate-700">
                  {commStyleItems.map((item, i) => (
                    <li key={i} className="flex items-start"><span className="mr-2">•</span>{item}</li>
                  ))}
              </ul>
          </Card>
          <Card title={t('results.valueOrg.title')}>
              <ul className="space-y-2 text-sm text-slate-700">
                  {valueOrgItems.map((item, i) => (
                    <li key={i} className="flex items-start"><span className="mr-2">•</span>{item}</li>
                  ))}
              </ul>
          </Card>
          <Card title={t('results.blindspots.title')}>
              <ul className="space-y-2 text-sm text-slate-700">
                  {blindspotsItems.map((item, i) => (
                    <li key={i} className="flex items-start"><span className="mr-2">•</span>{item}</li>
                  ))}
              </ul>
          </Card>
      </div>
    </div>
  );
};

export default ResultsSummary;