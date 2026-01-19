import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Ticket, Plus, Copy, Trash2 } from 'lucide-react';

const SaasAdminCoupons = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Cupons de Desconto</h1>
          <p className="text-slate-500 font-medium">Crie e gerencie campanhas promocionais.</p>
        </div>
        <Button label="Criar Novo Cupom" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { code: 'LEVELC100', discount: 100, status: 'Ativo', used: 45, type: 'Total' },
          { code: 'STRIPE20', discount: 20, status: 'Ativo', used: 128, type: 'Parcial' },
          { code: 'EXECUTIVE50', discount: 50, status: 'Expirado', used: 89, type: 'Parcial' },
        ].map((c, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className={`absolute top-0 right-0 px-4 py-1 text-[9px] font-black uppercase tracking-widest ${c.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {c.status}
            </div>
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                    <Ticket className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">{c.code}</h3>
                    <p className="text-xs text-slate-500 font-bold">{c.discount}% de Desconto</p>
                </div>
            </div>
            
            <div className="flex justify-between items-end">
                <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Utilizações</p>
                    <p className="text-xl font-black text-slate-700">{c.used}</p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200"><Copy className="w-4 h-4" /></button>
                    <button className="p-2 bg-red-50 rounded-xl text-red-400 hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SaasAdminCoupons;