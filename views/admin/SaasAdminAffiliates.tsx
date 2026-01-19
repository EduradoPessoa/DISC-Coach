import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Share2, Users, DollarSign, ExternalLink } from 'lucide-react';

const SaasAdminAffiliates = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Gestão de Afiliados</h1>
          <p className="text-slate-500 font-medium">Monitore parceiros e comissões geradas.</p>
        </div>
        <Button label="Novo Link de Afiliado" className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total de Afiliados</p>
            <h3 className="text-2xl font-black text-slate-900">24</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Vendas Totais</p>
            <h3 className="text-2xl font-black text-slate-900">412</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Comissões Pagas</p>
            <h3 className="text-2xl font-black text-slate-900">R$ 8.940,00</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">A pagar (Payout)</p>
            <h3 className="text-2xl font-black text-slate-900 text-indigo-600">R$ 1.200,00</h3>
        </div>
      </div>

      <Card title="Ranking de Parceiros">
        <div className="overflow-x-auto -mx-6">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-y border-slate-100">
                    <tr>
                        <th className="px-6 py-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">Afiliado</th>
                        <th className="px-6 py-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">Vendas</th>
                        <th className="px-6 py-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">Ganhos</th>
                        <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {[
                        { name: 'Portal RH Brasil', sales: 156, earnings: 3450.00, status: 'VIP' },
                        { name: 'Executivo Coaching', sales: 92, earnings: 1840.00, status: 'Ativo' },
                        { name: 'Doutor Compliance', sales: 45, earnings: 900.00, status: 'Ativo' },
                    ].map((af, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-900">{af.name}</td>
                            <td className="px-6 py-4 font-bold text-slate-600">{af.sales}</td>
                            <td className="px-6 py-4 font-black text-slate-900">R$ {af.earnings.toFixed(2)}</td>
                            <td className="px-6 py-4 text-right">
                                <Button label="Detalhes" variant="ghost" className="text-xs h-8 px-3" />
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

export default SaasAdminAffiliates;