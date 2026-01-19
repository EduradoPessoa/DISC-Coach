import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  DollarSign, 
  CreditCard,
  RefreshCw,
  Clock,
  Calculator
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

const SaasAdminFinance = () => {
  const [churnRate, setChurnRate] = useState(5);
  const [activeSubscribers, setActiveSubscribers] = useState(242);
  const monthlyPrice = 97;

  const calculateForecast = () => {
    const gross = activeSubscribers * monthlyPrice;
    const withChurn = gross * (1 - (churnRate / 100));
    return withChurn;
  };

  const revenueData = [
    { name: 'Jan', stripe: 4500, forecast: 5000 },
    { name: 'Fev', stripe: 5200, forecast: 5500 },
    { name: 'Mar', stripe: 6100, forecast: 6500 },
    { name: 'Abr', stripe: 7500, forecast: 8000 },
    { name: 'Mai (Prev)', stripe: null, forecast: calculateForecast() },
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Gestão Financeira SaaS</h1>
          <p className="text-slate-500 font-medium">Relatórios Stripe e Previsões Estratégicas (Exclusivo Eduardo)</p>
        </div>
        <div className="flex gap-2">
            <Button label="Sincronizar Stripe" variant="secondary" className="bg-white border-slate-200" />
            <Button label="Exportar Relatório" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm border-t-4 border-t-green-500">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Recebido no Stripe</p>
            <h3 className="text-2xl font-black text-slate-900">R$ 23.450,00</h3>
            <span className="text-[10px] text-green-600 font-bold flex items-center mt-2">
                <ArrowUpRight className="w-3 h-3 mr-1" /> +12% vs mês anterior
            </span>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm border-t-4 border-t-indigo-500">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Payout para Eduardo</p>
            <h3 className="text-2xl font-black text-slate-900">R$ 21.800,00</h3>
            <span className="text-[10px] text-slate-400 font-bold flex items-center mt-2">
                <CreditCard className="w-3 h-3 mr-1" /> Último repasse: 02/05
            </span>
        </div>
        <div className="bg-indigo-900 p-6 rounded-3xl text-white shadow-xl shadow-indigo-900/20">
            <p className="text-xs font-black text-indigo-300 uppercase tracking-widest mb-1">Previsão Próximo Mês</p>
            <h3 className="text-2xl font-black text-white">R$ {calculateForecast().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
            <span className="text-[10px] text-indigo-400 font-bold flex items-center mt-2">
                <Calculator className="w-3 h-3 mr-1" /> Baseado em {activeSubscribers} assinantes
            </span>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Pendente Payout</p>
            <h3 className="text-2xl font-black text-amber-600">R$ 1.650,00</h3>
            <span className="text-[10px] text-slate-400 font-bold flex items-center mt-2">
                <Clock className="w-3 h-3 mr-1" /> Disponível em 3 dias
            </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Curva de Receita & Forecast" className="lg:col-span-2">
            <div className="h-80 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                        <defs>
                            <linearGradient id="colorStripe" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#635bff" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#635bff" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                        <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                        <Area type="monotone" dataKey="stripe" stroke="#635bff" fillOpacity={1} fill="url(#colorStripe)" strokeWidth={4} />
                        <Area type="monotone" dataKey="forecast" stroke="#94a3b8" fill="none" strokeWidth={2} strokeDasharray="5 5" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>

        <Card title="Simulador de Previsão" subtitle="Ajuste os parâmetros do SaaS">
            <div className="space-y-6">
                <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block">Taxa de Churn Estimada (%)</label>
                    <input 
                        type="range" min="0" max="20" step="0.5" 
                        value={churnRate} 
                        onChange={(e) => setChurnRate(parseFloat(e.target.value))}
                        className="w-full accent-indigo-600"
                    />
                    <div className="flex justify-between text-sm font-bold mt-1 text-slate-600">
                        <span>0%</span>
                        <span className="text-indigo-600">{churnRate}%</span>
                        <span>20%</span>
                    </div>
                </div>

                <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block">Novos Assinantes / Mês</label>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setActiveSubscribers(s => Math.max(0, s-10))} className="p-2 bg-slate-100 rounded-lg">-10</button>
                        <span className="flex-1 text-center text-xl font-black text-slate-900">{activeSubscribers}</span>
                        <button onClick={() => setActiveSubscribers(s => s+10)} className="p-2 bg-slate-100 rounded-lg">+10</button>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Impacto em Previsão Anual</p>
                    <h4 className="text-2xl font-black text-slate-900">R$ {(calculateForecast() * 12).toLocaleString('pt-BR')}</h4>
                </div>
            </div>
        </Card>
      </div>
    </div>
  );
};

export default SaasAdminFinance;