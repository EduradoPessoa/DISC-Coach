import React from 'react';
import { Card } from '../../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SaasFinance = () => {
  const data = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 2000 },
    { name: 'Apr', revenue: 2780 },
    { name: 'May', revenue: 1890 },
    { name: 'Jun', revenue: 2390 },
    { name: 'Jul', revenue: 3490 },
    { name: 'Aug', revenue: 4500 },
    { name: 'Sep', revenue: 5600 },
    { name: 'Oct', revenue: 6200 },
    { name: 'Nov', revenue: 7800 },
    { name: 'Dec', revenue: 9000 },
  ];

  const transactions = [
    { id: 'TRX-9821', user: 'Eduardo M.', amount: 'R$ 97,90', date: '2023-12-20', status: 'Paid' },
    { id: 'TRX-9822', user: 'Ana Silva', amount: 'R$ 29,90', date: '2023-12-19', status: 'Paid' },
    { id: 'TRX-9823', user: 'Carlos R.', amount: 'R$ 29,90', date: '2023-12-19', status: 'Failed' },
    { id: 'TRX-9824', user: 'Tech Corp', amount: 'R$ 979,00', date: '2023-12-18', status: 'Paid' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Financial Overview</h1>
        <p className="text-slate-500">Track revenue, transactions, and churn.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-80 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Revenue Growth (MRR)</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `R$${value}`} />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
        <div className="space-y-4">
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <p className="text-sm text-slate-500">Current MRR</p>
                <h2 className="text-3xl font-bold text-slate-900">R$ 45.290</h2>
                <span className="text-xs text-green-600 font-medium">+12% vs last month</span>
             </div>
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <p className="text-sm text-slate-500">Total Subscribers</p>
                <h2 className="text-3xl font-bold text-slate-900">1,234</h2>
                <span className="text-xs text-green-600 font-medium">+58 this month</span>
             </div>
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <p className="text-sm text-slate-500">Avg. Revenue Per User</p>
                <h2 className="text-3xl font-bold text-slate-900">R$ 36,70</h2>
             </div>
        </div>
      </div>

      <Card title="Recent Transactions">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {transactions.map((t) => (
                        <tr key={t.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">{t.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{t.user}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{t.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{t.amount}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    t.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                    {t.status}
                                </span>
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

export default SaasFinance;
