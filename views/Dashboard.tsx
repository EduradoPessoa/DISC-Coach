import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AIHelper } from '../components/ui/AIHelper';
import { PremiumGate } from '../components/ui/PremiumGate';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Clock, CheckCircle } from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext';
import { useUser } from '../context/UserContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { scores, isComplete, loadLatestResults } = useAssessment();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLatestResults().finally(() => setLoading(false));
  }, [loadLatestResults]);

  const mockData = scores ? [
    { subject: 'Dominance', A: scores.D, fullMark: 100 },
    { subject: 'Influence', A: scores.I, fullMark: 100 },
    { subject: 'Steadiness', A: scores.S, fullMark: 100 },
    { subject: 'Compliance', A: scores.C, fullMark: 100 },
  ] : [
    { subject: 'Dominance', A: 0, fullMark: 100 },
    { subject: 'Influence', A: 0, fullMark: 100 },
    { subject: 'Steadiness', A: 0, fullMark: 100 },
    { subject: 'Compliance', A: 0, fullMark: 100 },
  ];
  
  const showTeam = user.plan === 'clevel' || user.role === 'admin' || user.role === 'saas_admin';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user.name}</h1>
            <p className="text-slate-500">Here's your leadership overview for today.</p>
        </div>
        <div className="flex space-x-3">
            {showTeam && (
                <Button label="View Team" variant="secondary" onClick={() => navigate('/admin/users')} />
            )}
            {isComplete ? (
                <Button label="View My Report" onClick={() => navigate('/results/summary/me')} />
            ) : (
                <Button label="Start Assessment" onClick={() => navigate('/assessment/start')} />
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Card */}
        <Card title="Assessment Status" className="lg:col-span-1">
            <div className="flex items-center space-x-4 mb-6">
                <div className={`p-3 rounded-full ${isComplete ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                    {isComplete ? <CheckCircle className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                </div>
                <div>
                    <h4 className="font-semibold text-slate-900">{isComplete ? 'Completed' : 'Pending Review'}</h4>
                    <p className="text-sm text-slate-500">{isComplete ? 'Results Ready' : 'In Progress'}</p>
                </div>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                    <span>Profile Completeness</span>
                    <span>{isComplete ? '100%' : '0%'}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className={`h-2 rounded-full ${isComplete ? 'bg-green-600' : 'bg-indigo-600'}`} style={{ width: isComplete ? '100%' : '5%' }}></div>
                </div>
            </div>
            <div className="mt-6">
                 {isComplete ? (
                    <Button label="View Full Report" fullWidth variant="secondary" onClick={() => navigate('/results/summary/me')} />
                 ) : (
                    <Button label="Continue Assessment" fullWidth variant="secondary" onClick={() => navigate('/assessment/start')} />
                 )}
            </div>
        </Card>

        {/* Chart Snapshot */}
        <Card title="Profile Snapshot" className="lg:col-span-1 h-80">
            <div className="h-64 -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={mockData}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                        <Radar
                            name={user.name}
                            dataKey="A"
                            stroke="#4f46e5"
                            fill="#4f46e5"
                            fillOpacity={0.4}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </Card>

        {/* Quick Insights - GATED CONTENT */}
        <Card title="Quick Insights" className="lg:col-span-1">
            <PremiumGate title="AI Insights Locked" message="Upgrade to generate governance insights.">
                <AIHelper 
                    title="Governance Insights"
                    promptTemplate="Generate 3 concise, actionable insights for a C-level executive, focusing on governance and compliance best practices, based on their DISC profile {disc_profile}."
                    mode="audit"
                    discProfile="High C, High D"
                    contextData={{ role: "CCO", recent_activity: "Audit Preparation" }}
                />
            </PremiumGate>
            
            <div className="mt-4 space-y-3">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-slate-900">Complete Q3 Goals</p>
                        <p className="text-xs text-slate-500">Due in 5 days</p>
                    </div>
                </div>
            </div>
        </Card>
      </div>

      {/* Recent Activity / Table Stub - ONLY FOR TEAM */}
      {showTeam && (
        <Card title="Recent Team Activity">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                            <th className="px-6 py-3">Team Member</th>
                            <th className="px-6 py-3">Department</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="bg-white border-b hover:bg-slate-50">
                            <td className="px-6 py-4 font-medium text-slate-900">Sarah Jenkins</td>
                            <td className="px-6 py-4">Legal</td>
                            <td className="px-6 py-4"><span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Completed</span></td>
                            <td className="px-6 py-4"><a href="#/results/summary/user1" className="text-indigo-600 hover:underline">View Report</a></td>
                        </tr>
                        <tr className="bg-white border-b hover:bg-slate-50">
                            <td className="px-6 py-4 font-medium text-slate-900">Michael Chen</td>
                            <td className="px-6 py-4">Operations</td>
                            <td className="px-6 py-4"><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">In Progress</span></td>
                            <td className="px-6 py-4"><span className="text-slate-400">N/A</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
