import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Gift, Users, Zap, Star, CreditCard, Tag, Info } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { t } = useLanguage();
  const [isAnnual, setIsAnnual] = useState(false);
  const [isGiftMode, setIsGiftMode] = useState(false);
  const [coupon, setCoupon] = useState('');

  // Helper to safely get translations for arrays/objects
  const getTrans = (key: string) => {
    const val = t(key);
    return val;
  };

  const plans = [
    {
      id: 'free',
      name: t('pricing.plans.free.name'),
      subtitle: t('pricing.plans.free.subtitle'),
      price: t('pricing.plans.free.price'),
      period: t('pricing.plans.free.period'),
      features: (t('pricing.plans.free.features') as unknown as string[]) || [],
      cta: t('pricing.plans.free.cta'),
      color: 'bg-white',
      textColor: 'text-slate-900',
      btnVariant: 'secondary' as const,
      highlight: false
    },
    {
      id: 'unit',
      name: t('pricing.plans.unit.name'),
      subtitle: t('pricing.plans.unit.subtitle'),
      price: isAnnual ? 'R$ 28,40' : t('pricing.plans.unit.price'), // Calculated 5% off approx
      period: t('pricing.plans.unit.period'),
      features: (t('pricing.plans.unit.features') as unknown as string[]) || [],
      cta: t('pricing.plans.unit.cta'),
      color: 'bg-white',
      textColor: 'text-slate-900',
      btnVariant: 'primary' as const,
      highlight: true,
      badge: 'POPULAR'
    },
    {
      id: 'clevel',
      name: t('pricing.plans.clevel.name'),
      subtitle: t('pricing.plans.clevel.subtitle'),
      price: isAnnual ? 'R$ 93,00' : t('pricing.plans.clevel.price'), // Calculated 5% off approx
      period: t('pricing.plans.clevel.period'),
      features: (t('pricing.plans.clevel.features') as unknown as string[]) || [],
      cta: t('pricing.plans.clevel.cta'),
      color: 'bg-slate-900',
      textColor: 'text-white',
      btnVariant: 'primary' as const,
      highlight: false,
      dark: true
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl sm:tracking-tight lg:text-6xl mb-6">
          {t('pricing.hero.title')}
        </h1>
        <p className="text-xl text-slate-500 mb-8">
          {t('pricing.hero.subtitle')}
        </p>
        
        {/* Toggle Monthly/Annual */}
        <div className="flex justify-center items-center space-x-4 mt-8">
          <span className={`text-sm font-medium ${!isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>
            {t('pricing.toggle.monthly')}
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              isAnnual ? 'bg-indigo-600' : 'bg-slate-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                isAnnual ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>
            {t('pricing.toggle.annual')}
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
              {t('pricing.toggle.save')}
            </span>
          </span>
        </div>

        {/* Gift Mode Toggle */}
        <div className="mt-6 flex justify-center items-center">
            <label className="flex items-center space-x-2 cursor-pointer bg-white px-4 py-2 rounded-full shadow-sm border border-indigo-100 hover:border-indigo-300 transition-colors">
                <input 
                    type="checkbox" 
                    checked={isGiftMode}
                    onChange={(e) => setIsGiftMode(e.target.checked)}
                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out rounded" 
                />
                <span className="text-sm text-indigo-700 font-medium flex items-center">
                    <Gift className="w-4 h-4 mr-2" />
                    {t('pricing.gift.title')}
                </span>
            </label>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto grid gap-8 lg:grid-cols-3 lg:gap-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative flex flex-col rounded-2xl shadow-xl overflow-hidden ${plan.color} ${
              plan.highlight ? 'ring-2 ring-indigo-500 scale-105 z-10' : 'border border-slate-200'
            }`}
          >
            {plan.badge && (
              <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                {plan.badge}
              </div>
            )}
            
            <div className="p-8 flex-1">
              <h3 className={`text-xl font-semibold ${plan.textColor}`}>
                {plan.name}
              </h3>
              <p className={`mt-2 text-sm ${plan.dark ? 'text-slate-400' : 'text-slate-500'}`}>
                {plan.subtitle}
              </p>
              <div className="mt-8 flex items-baseline">
                <span className={`text-4xl font-extrabold tracking-tight ${plan.textColor}`}>
                  {plan.price}
                </span>
                <span className={`ml-1 text-xl font-medium ${plan.dark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {plan.period}
                </span>
              </div>

              {/* Gift Input if active and not Free plan */}
              {isGiftMode && plan.id !== 'free' && (
                  <div className="mt-6 bg-indigo-50 p-3 rounded-lg border border-indigo-100 animate-in fade-in">
                      <label className="block text-xs font-medium text-indigo-900 mb-1">
                          {t('pricing.gift.label')}
                      </label>
                      <input 
                          type="email" 
                          placeholder="friend@company.com" 
                          className="w-full px-2 py-1 text-sm border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                      />
                  </div>
              )}

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className={`h-5 w-5 ${plan.dark ? 'text-indigo-400' : 'text-green-500'}`} />
                    </div>
                    <p className={`ml-3 text-sm ${plan.dark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {feature}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <div className={`p-8 ${plan.dark ? 'bg-slate-800' : 'bg-slate-50'}`}>
              <Button
                label={isGiftMode && plan.id !== 'free' ? t('pricing.gift.send') : plan.cta}
                variant={plan.btnVariant}
                fullWidth
                onClick={() => navigate('/checkout', { 
                  state: { 
                    planId: plan.id, 
                    price: isAnnual ? parseFloat(plan.price.replace('R$', '').replace(',', '.')) : parseFloat(plan.price.replace('R$', '').replace(',', '.')),
                    isAnnual,
                    isGift: isGiftMode
                  } 
                })}
                className={plan.dark ? 'bg-indigo-600 hover:bg-indigo-700 border-transparent' : ''}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Affiliates & Coupon Section */}
      <div className="max-w-4xl mx-auto mt-16 grid md:grid-cols-2 gap-8">
          {/* Affiliates */}
          <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-2xl border border-purple-100 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                      <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{t('pricing.affiliates.title')}</h3>
              </div>
              <p className="text-slate-600 mb-4 text-sm">
                  {t('pricing.affiliates.desc')}
              </p>
              <button className="text-purple-700 font-semibold text-sm hover:underline flex items-center">
                  {t('pricing.affiliates.cta')} <span className="ml-1">→</span>
              </button>
          </div>

          {/* Coupon */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                      <Tag className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Voucher / Cupom</h3>
              </div>
              <div className="flex gap-2">
                  <input 
                      type="text" 
                      placeholder={t('pricing.coupons.placeholder')}
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  />
                  <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
                      {t('pricing.coupons.apply')}
                  </button>
              </div>
              <p className="text-xs text-slate-400 mt-2 italic">
                  * Descontos aplicados no checkout.
              </p>
          </div>
      </div>

      {/* Trust Footer */}
      <div className="mt-16 text-center border-t border-slate-200 pt-8">
          <p className="text-slate-500 italic font-medium">
            "Preço não é custo. É investimento em consciência, liderança e evolução."
          </p>
          <div className="flex justify-center items-center gap-6 mt-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             {/* Placeholders for payment logos or trust badges */}
             <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <CreditCard className="w-5 h-5" />
                <span>Secured by AbacatePay</span>
             </div>
          </div>
      </div>
    </div>
  );
};

export default Pricing;
