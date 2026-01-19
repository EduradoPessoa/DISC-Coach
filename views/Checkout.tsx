import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useUser } from '../context/UserContext';
import { useNotification } from '../context/NotificationContext';
import { validatePromoCode, createStripeCheckoutSession } from '../services/stripeService';
import { ShieldCheck, CreditCard, Tag, Lock, ArrowRight } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { user, upgradeToPro } = useUser();
  const { addNotification } = useNotification();
  
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [validating, setValidating] = useState(false);
  const [processing, setProcessing] = useState(false);

  const basePrice = 97.00;
  const finalPrice = basePrice * ((100 - discount) / 100);

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

      const session = await createStripeCheckoutSession(finalPrice, user.email);
      if (session.success) {
        addNotification('info', 'Redirecionando para o ambiente seguro do Stripe...');
        setTimeout(() => {
            window.location.href = session.url;
        }, 1200);
      }
    } catch (e) {
      addNotification('error', 'Falha ao iniciar pagamento com Stripe.');
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Finalizar Assinatura</h1>
        <p className="text-slate-500 mt-2">Você está a um passo da Inteligência Executiva Nível C.</p>
      </div>

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

            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Possui um cupom?</label>
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <Tag className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                        <input 
                            type="text" 
                            className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700 uppercase"
                            placeholder="CÓDIGO"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                        />
                    </div>
                    <Button 
                        label={validating ? "..." : "Aplicar"} 
                        variant="secondary" 
                        className="px-8 h-auto"
                        onClick={handleApplyCoupon} 
                        disabled={validating || !couponCode}
                    />
                </div>
            </div>
        </div>

        <div className="md:col-span-2">
            <div className="sticky top-24">
                <Button 
                    label={processing ? "Processando..." : discount === 100 ? "Ativar Gratuitamente" : "Pagar com Stripe"}
                    fullWidth 
                    className={`h-16 text-lg font-black shadow-xl transition-all ${discount === 100 ? 'bg-green-600 hover:bg-green-700' : 'bg-[#635bff] hover:bg-[#534bb3]'} border-none`}
                    onClick={handlePayment}
                    disabled={processing}
                />
                
                <div className="mt-8 space-y-4">
                    <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                            <Lock className="w-4 h-4" />
                        </div>
                        <span>Pagamento 100% Seguro</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                            <CreditCard className="w-4 h-4" />
                        </div>
                        <span>Liberação Imediata via Stripe</span>
                    </div>
                </div>

                <div className="mt-10 p-6 bg-slate-900 rounded-3xl text-white">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Garantia Level C</p>
                    <p className="text-sm leading-relaxed opacity-80">
                        Sua satisfação é nossa prioridade. Se não encontrar valor estratégico nos primeiros 7 dias, devolvemos 100% do valor.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;