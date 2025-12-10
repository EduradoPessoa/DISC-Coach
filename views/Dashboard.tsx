import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AIHelper } from '../components/ui/AIHelper';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Clock, CheckCircle } from 'lucide-react';

const mockData = [
  { subject: 'Dominance', A: 120, fullMark: 150 },
  { subject: 'Influence', A: 98, fullMark: 150 },
  { subject: 'Steadiness', A: 86, fullMark: 150 },
  { subject: 'Compliance', A: 140, fullMark: 150 },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome back, Eduardo</h1>
            <p className="text-slate-500">Here's your leadership overview for today.</p>
        </div>
        <div className="flex space-x-3">
            <Button label="View Team" variant="secondary" onClick={() => navigate('/admin/users')} />
            <Button label="Start Assessment" onClick={() => navigate('/assessment/start')} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Card */}
        <Card title="Assessment Status" className="lg:col-span-1">
            <div className="flex items-center space-x-4 mb-6">
                <div className="bg-amber-100 p-3 rounded-full text-amber-600">
                    <Clock className="w-6 h-6" />
                </div>
                <div>
                    <h4 className="font-semibold text-slate-900">Pending Review</h4>
                    <p className="text-sm text-slate-500">Last updated 2 days ago</p>
                </div>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                    <span>Profile Completeness</span>
                    <span>85%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
            </div>
            <div className="mt-6">
                 <Button label="Continue Assessment" fullWidth variant="secondary" onClick={() => navigate('/assessment/start')} />
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
                            name="Eduardo"
                            dataKey="A"
                            stroke="#4f46e5"
                            fill="#4f46e5"
                            fillOpacity={0.4}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </Card>

        {/* Quick Insights */}
        <Card title="Quick Insights" className="lg:col-span-1">
            <AIHelper 
                title="Governance Insights"
                promptTemplate="Generate 3 concise, actionable insights for a C-level executive, focusing on governance and compliance best practices, based on their DISC profile {disc_profile}."
                mode="audit"
                discProfile="High C, High D"
                contextData={{ role: "CCO", recent_activity: "Audit Preparation" }}
            />
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

      {/* Recent Activity / Table Stub */}
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
    </div>
  );
};

export default Dashboard;