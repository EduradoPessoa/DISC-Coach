import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Save, CreditCard } from 'lucide-react';
import { apiRequest } from '../../services/api';

const SaasSettings = () => {
  const [plans, setPlans] = useState([
    { id: 'unit', name: 'Unit Plan', price: 29.90, annualDiscount: 5 },
    { id: 'clevel', name: 'C-Level Plan', price: 97.90, annualDiscount: 5 },
  ]);
  const [apiKey, setApiKey] = useState('');
  const [appUrl, setAppUrl] = useState(window.location.origin + window.location.pathname);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load settings from backend
    apiRequest('/admin/settings.php', 'GET').then(data => {
        if (data) {
            if (data.abacatepay_api_key) setApiKey(data.abacatepay_api_key);
            if (data.app_base_url) setAppUrl(data.app_base_url);
            // In a real app, map other settings to plans state
        }
    }).catch(console.error);
  }, []);

  const handleUpdate = (id: string, field: string, value: any) => {
    setPlans(plans.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
        const settings = {
            abacatepay_api_key: apiKey,
            app_base_url: appUrl,
            // Save plan prices too
            unit_plan_price: plans.find(p => p.id === 'unit')?.price,
            clevel_plan_price: plans.find(p => p.id === 'clevel')?.price,
            annual_discount: plans[0].annualDiscount // Assuming global discount for now
        };

        await apiRequest('/admin/settings.php', 'POST', { settings });
        alert('Settings saved successfully!');
    } catch (error) {
        alert('Failed to save settings.');
    } finally {
        setLoading(false);
    }
  };

  // Helper to construct full URLs
  const getFullUrl = (path: string) => {
      const base = appUrl.endsWith('/') ? appUrl.slice(0, -1) : appUrl;
      // Ensure we handle hash router if needed, usually appUrl includes /dist/
      // If the user puts 'http://localhost/disc/dist', we append '#/...'
      return `${base}/#${path}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">SaaS Settings</h1>
        <p className="text-slate-500">Configure global pricing and system preferences.</p>
      </div>

      <Card title="Payment Gateway (AbacatePay)">
        <div className="flex items-start space-x-4">
            <div className="p-3 bg-green-100 rounded-lg text-green-700">
                <CreditCard className="w-6 h-6" />
            </div>
            <div className="flex-1 space-y-6">
                <div>
                    <p className="text-sm text-slate-600 mb-4">
                        Configure your AbacatePay integration to accept payments. 
                        You can find this key in your AbacatePay Dashboard &gt; API Keys.
                    </p>
                    <div className="max-w-md">
                        <Input 
                            label="AbacatePay Secret API Key" 
                            type="password"
                            placeholder="sk_live_..."
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                        />
                    </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h4 className="text-sm font-semibold text-slate-900 mb-2">Integration URLs</h4>
                    <p className="text-xs text-slate-500 mb-4">
                        Copy these URLs to your AbacatePay Dashboard settings (Webhooks/Redirects).
                    </p>
                    
                    <div className="space-y-3">
                        <div>
                             <label className="block text-xs font-medium text-slate-700 mb-1">Base App URL</label>
                             <Input 
                                value={appUrl} 
                                onChange={(e) => setAppUrl(e.target.value)}
                                placeholder="https://your-app.com"
                            />
                             <p className="text-[10px] text-slate-400 mt-1">The root URL where the app is hosted (e.g. /dist)</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Return / Success URL</label>
                                <div className="flex">
                                    <code className="flex-1 bg-white border border-slate-300 rounded-l px-2 py-1.5 text-xs text-slate-600 overflow-x-auto whitespace-nowrap">
                                        {getFullUrl('/checkout/success')}
                                    </code>
                                    <button 
                                        onClick={() => navigator.clipboard.writeText(getFullUrl('/checkout/success'))}
                                        className="bg-slate-100 border border-l-0 border-slate-300 rounded-r px-2 text-xs text-slate-600 hover:bg-slate-200"
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Cancel URL</label>
                                <div className="flex">
                                    <code className="flex-1 bg-white border border-slate-300 rounded-l px-2 py-1.5 text-xs text-slate-600 overflow-x-auto whitespace-nowrap">
                                        {getFullUrl('/checkout/cancel')}
                                    </code>
                                    <button 
                                        onClick={() => navigator.clipboard.writeText(getFullUrl('/checkout/cancel'))}
                                        className="bg-slate-100 border border-l-0 border-slate-300 rounded-r px-2 text-xs text-slate-600 hover:bg-slate-200"
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </Card>

      <Card title="Pricing Configuration">
        <div className="space-y-6">
            {plans.map((plan) => (
                <div key={plan.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                    <h3 className="font-semibold text-slate-900 mb-4">{plan.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Price (R$)</label>
                            <input 
                                type="number" 
                                step="0.01"
                                value={plan.price}
                                onChange={(e) => handleUpdate(plan.id, 'price', parseFloat(e.target.value))}
                                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Annual Discount (%)</label>
                            <input 
                                type="number" 
                                value={plan.annualDiscount}
                                onChange={(e) => handleUpdate(plan.id, 'annualDiscount', parseFloat(e.target.value))}
                                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
        <div className="mt-6 flex justify-end">
            <Button label="Save Changes" icon={Save} onClick={handleSave} />
        </div>
      </Card>
    </div>
  );
};

export default SaasSettings;
