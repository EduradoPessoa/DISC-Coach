import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useUser } from '../context/UserContextSupabase';
import { useNotification } from '../context/NotificationContext';
import { validatePromoCode, createStripeCheckoutSession, STRIPE_CONFIG } from '../services/stripeService';
import { ShieldCheck, CreditCard, Tag, Lock, AlertCircle } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { user, upgradeToPro } = useUser();
  const { addNotification } = useNotification();
  
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [validating, setValidating] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [sdkError, setSdkError] = useState<string | null>(null);

  const basePrice = 97.00;
  const finalPrice = basePrice * ((100 - discount) / 100);

  useEffect(() => {
    // Verifica se o Stripe foi carregado corretamente no window (apenas se não for Mock)
    if (!STRIPE_CONFIG.isMock && !(window as any).Stripe) {
        setSdkError("O módulo de pagamento Stripe não pôde ser carregado. Por favor, desative bloqueadores de anúncios e recarregue a página.");
    }
  }, []);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setValidating(true);
    try {
      const result = await validatePromoCode(couponCode);
      if (result.valid) {
        setDiscount(result.discount);
        addNotification('success', `Cupom aplicado! ${result.discount}% de desconto.`);
      } else {
        setDiscount(0);
        addNotification('error', 'Cupom inválido ou expirado.');
      }
    } catch (e) {
      addNotification('error', 'Erro ao validar cupom.');
    } finally {
      setValidating(false);
    }
  };

  const handlePayment = async () => {
    if (sdkError) {
        addNotification('error', sdkError);
        return;
    }

    setProcessing(true);
    try {
      if (discount === 100) {
        setTimeout(() => {
            upgradeToPro();
            addNotification('success', 'Plano Pro ativado com sucesso!');
            navigate('/checkout/success');
        }, 1500);
        return;
      }

      const result = await createStripeCheckoutSession(finalPrice, user.email);
      
      if (result.success && result.url) {
        addNotification('info', 'Redirecionando para o ambiente seguro do Stripe...');
        // Em um app real, o redirecionamento pode ser para uma URL externa do Stripe
        if (result.url.startsWith('#')) {
            setTimeout(() => navigate(result.url!.replace('#', '')), 1000);
        } else {
            window.location.href = result.url;
        }
      } else {
        throw new Error(result.error || "Erro desconhecido no checkout");
      }
    } catch (e: any) {
      addNotification('error', e.message || 'Falha ao iniciar pagamento.');
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Finalizar Assinatura</h1>
        <p className="text-slate-500 mt-2">Você está a um passo da Inteligência Executiva Nível C.</p>
      </div>

      {sdkError && (
        <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-800 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm font-medium">{sdkError}</p>
        </div>
      )}

      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-3 space-y-6">
            <Card title="Resumo do Pedido">
                <div className="flex items-center gap-5 mb-8">
                    <div className="bg-indigo-600 p-4 rounded-2xl text-white shadow-lg shadow-indigo-200">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Level C Pro</h3>
                        <p className="text-slate-500 text-sm">Acesso vitalício aos relatórios e Coach IA</p>
                    </div>
                </div>

                <div className="space-y-4 border-t border-slate-100 pt-6">
                    <div className="flex justify-between text-slate-600">
                        <span>Preço Base</span>
                        <span className="font-medium text-slate-900">R$ {basePrice.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                        <div className="flex justify-between text-green-600 font-bold bg-green-50 px-3 py-2 rounded-lg">
                            <span>Desconto Aplicado ({discount}%)</span>
                            <span>- R$ {(basePrice - finalPrice).toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-2xl font-black text-slate-900 pt-4 border-t border-slate-100">
                        <span>Total</span>
                        <span className="text-indigo-600">R$ {finalPrice.toFixed(2)}</span>
                    </div>
                </div>
            </Card>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <label className="block text-xs font-black text-slate-400 mb-3 uppercase tracking-widest">Possui um cupom?</label>
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <Tag className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                        <input 
                            type="text" 
                            className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700 uppercase placeholder:text-slate-300"
                            placeholder="EX: LEVELC100"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                        />
                    </div>
                    <Button 
                        label={validating ? "..." : "Aplicar"} 
                        variant="secondary" 
                        className="px-8 h-auto font-bold"
                        onClick={handleApplyCoupon} 
                        disabled={validating || !couponCode}
                    />
                </div>
            </div>
        </div>

        <div className="md:col-span-2">
            <div className="sticky top-24 space-y-6">
                <div className="bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50">
                    <Button 
                        label={processing ? "" : discount === 100 ? "Ativar Gratuitamente" : "Pagar com Stripe"}
                        fullWidth 
                        className={`h-16 text-lg font-black transition-all ${discount === 100 ? 'bg-green-600 hover:bg-green-700' : 'bg-[#635bff] hover:bg-[#534bb3]'} border-none rounded-xl flex items-center justify-center gap-3`}
                        onClick={handlePayment}
                        disabled={processing || !!sdkError}
                    >
                        {processing && <div className="stripe-loader border-t-white"></div>}
                        {!processing && (discount === 100 ? "Ativar Gratuitamente" : "Pagar com Stripe")}
                    </Button>
                </div>
                
                <div className="space-y-4 px-2">
                    <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                            <Lock className="w-4 h-4 text-slate-400" />
                        </div>
                        <span>Pagamento 100% Seguro</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                            <CreditCard className="w-4 h-4 text-slate-400" />
                        </div>
                        <span>Liberação Imediata via Stripe</span>
                    </div>
                </div>

                <div className="p-6 bg-slate-900 rounded-3xl text-white shadow-2xl shadow-indigo-900/20">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">Garantia Level C</p>
                    <p className="text-sm leading-relaxed opacity-80 font-medium">
                        Sua satisfação é nossa prioridade. Se não encontrar valor estratégico nos primeiros 7 dias, devolvemos 100% do valor via Stripe.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;