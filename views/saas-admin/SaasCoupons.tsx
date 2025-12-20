import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Trash2, Plus, Tag } from 'lucide-react';

interface Coupon {
  id: number;
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  validUntil: string;
  uses: number;
  status: 'active' | 'expired';
}

const SaasCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([
    { id: 1, code: 'WELCOME20', discount: 20, type: 'percentage', validUntil: '2024-12-31', uses: 45, status: 'active' },
    { id: 2, code: 'BLACKFRIDAY', discount: 50, type: 'percentage', validUntil: '2023-11-30', uses: 120, status: 'expired' },
    { id: 3, code: 'SPECIAL10', discount: 10, type: 'fixed', validUntil: '2024-06-30', uses: 12, status: 'active' },
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [newCoupon, setNewCoupon] = useState({ code: '', discount: '', validUntil: '' });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const coupon: Coupon = {
        id: Date.now(),
        code: newCoupon.code.toUpperCase(),
        discount: Number(newCoupon.discount),
        type: 'percentage',
        validUntil: newCoupon.validUntil,
        uses: 0,
        status: 'active'
    };
    setCoupons([...coupons, coupon]);
    setIsCreating(false);
    setNewCoupon({ code: '', discount: '', validUntil: '' });
  };

  const handleDelete = (id: number) => {
    setCoupons(coupons.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Coupons & Discounts</h1>
            <p className="text-slate-500">Manage promotional codes and campaigns.</p>
        </div>
        <Button label="Create New Coupon" onClick={() => setIsCreating(!isCreating)} icon={Plus} />
      </div>

      {isCreating && (
        <Card title="New Coupon" className="mb-6 border-indigo-200 ring-4 ring-indigo-50">
            <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <Input 
                    label="Code" 
                    placeholder="e.g. SAVE20" 
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value})}
                    required
                />
                <Input 
                    label="Discount (%)" 
                    placeholder="20" 
                    type="number"
                    value={newCoupon.discount}
                    onChange={(e) => setNewCoupon({...newCoupon, discount: e.target.value})}
                    required
                />
                <Input 
                    label="Valid Until" 
                    type="date"
                    value={newCoupon.validUntil}
                    onChange={(e) => setNewCoupon({...newCoupon, validUntil: e.target.value})}
                    required
                />
                <Button label="Save Coupon" type="submit" fullWidth />
            </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
            <div key={coupon.id} className={`bg-white p-6 rounded-xl border ${coupon.status === 'active' ? 'border-slate-200' : 'border-slate-100 bg-slate-50 opacity-75'} shadow-sm relative group`}>
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-2">
                        <Tag className="w-5 h-5 text-indigo-500" />
                        <span className="font-mono font-bold text-lg text-slate-900">{coupon.code}</span>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        coupon.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                        {coupon.status.toUpperCase()}
                    </span>
                </div>
                
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Discount:</span>
                        <span className="font-semibold text-slate-900">
                            {coupon.type === 'percentage' ? `${coupon.discount}%` : `R$ ${coupon.discount}`}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Valid Until:</span>
                        <span className="text-slate-900">{coupon.validUntil}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Uses:</span>
                        <span className="text-slate-900">{coupon.uses}</span>
                    </div>
                </div>

                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={() => handleDelete(coupon.id)} className="p-1 text-slate-400 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                     </button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default SaasCoupons;
