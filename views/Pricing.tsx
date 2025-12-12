import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useUser } from '../context/UserContext';

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const isPro = user.plan === 'pro';

  const features = [
    { name: "Basic DISC Assessment", free: true, pro: true },
    { name: "Result Visualization", free: true, pro: true },
    { name: "AI Executive Coach", free: false, pro: true },
    { name: "Development Plan Generation", free: false, pro: true },
    { name: "Team Analytics (Admin)", free: false, pro: true },
    { name: "PDF Export", free: false, pro: true },
  ];

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Choose Your Level</h1>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Unlock the full potential of your leadership style with our AI-powered executive tools.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-slate-900">Starter</h3>
            <p className="text-slate-500">For self-discovery</p>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-bold text-slate-900">Free</span>
          </div>
          <Button 
            label={isPro ? "Downgrade" : "Current Plan"} 
            variant="secondary" 
            disabled={!isPro}
            className="mb-8"
          />
          <div className="flex-1 space-y-4">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center text-sm">
                {feature.free ? (
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                ) : (
                  <X className="w-5 h-5 text-slate-300 mr-3 flex-shrink-0" />
                )}
                <span className={feature.free ? "text-slate-700" : "text-slate-400"}>
                  {feature.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pro Plan */}
        <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-8 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
            RECOMMENDED
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-bold text-white">Level C Pro</h3>
            <p className="text-slate-400">For executive growth</p>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-bold text-white">R$ 97</span>
            <span className="text-slate-400">/mo</span>
          </div>
          <Button 
            label={isPro ? "Plan Active" : "Upgrade Now"} 
            variant={isPro ? "secondary" : "primary"}
            className={isPro ? "bg-slate-700 text-white border-transparent" : "bg-indigo-600 hover:bg-indigo-700 text-white border-transparent"}
            disabled={isPro}
            onClick={() => navigate('/checkout')}
          />
          <div className="flex-1 space-y-4 mt-8">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center text-sm">
                {feature.pro ? (
                  <Check className="w-5 h-5 text-indigo-400 mr-3 flex-shrink-0" />
                ) : (
                  <X className="w-5 h-5 text-slate-600 mr-3 flex-shrink-0" />
                )}
                <span className="text-slate-300">
                  {feature.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
