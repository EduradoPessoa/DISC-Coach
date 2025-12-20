import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useUser } from '../context/UserContext';
import { useNotification } from '../context/NotificationContext';
import { validateCoupon, createAbacatePaySession } from '../services/abacatePayService';
import { ShieldCheck, CreditCard, Tag } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, upgradeToPro } = useUser();
  const { addNotification } = useNotification();
  
  const state = location.state as { planId: string; price: number; isAnnual: boolean; isGift: boolean } | undefined;
  
  // Defaults if accessed directly
  const planId = state?.planId || 'clevel';
  const basePrice = state?.price || 97.90;
  const isAnnual = state?.isAnnual || false;
  
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [validating, setValidating] = useState(false);
  const [processing, setProcessing] = useState(false);

  const finalPrice = basePrice * ((100 - discount) / 100);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setValidating(true);
    try {
      const result = await validateCoupon(couponCode);
      if (result.valid) {
        setDiscount(result.discount);
        addNotification('success', `Coupon applied! ${result.discount}% off.`);
      } else {
        setDiscount(0);
        addNotification('error', result.message || 'Invalid coupon.');
      }
    } catch (e) {
      addNotification('error', 'Error validating coupon.');
    } finally {
      setValidating(false);
    }
  };

  const handlePayment = async () => {
    setProcessing(true);
    try {
      // Edge case: 100% discount - skip payment provider
      if (discount === 100) {
        setTimeout(() => {
            upgradeToPro();
            addNotification('success', 'Plan upgraded successfully!');
            navigate('/checkout/success');
        }, 1500);
        return;
      }

      // Normal flow: AbacatePay
      // Pass the planId to backend
      const session = await createAbacatePaySession(finalPrice, user.email, planId);
      
      if (session.success) {
        addNotification('success', 'Redirecting to payment provider...');
        
        // In a real app with external gateway: window.location.href = session.url;
        // Since we are simulating internal routing for the demo or fallback:
        if (session.url.startsWith('http')) {
             window.location.href = session.url;
        } else {
             setTimeout(() => {
                navigate(session.url);
             }, 1000);
        }
      } else {
         addNotification('error', 'Failed to create payment session.');
         setProcessing(false);
      }
    } catch (e) {
      addNotification('error', 'Payment failed to initialize.');
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Checkout</h1>
        <p className="text-slate-500">
            {state?.isGift ? `Gift Subscription: ` : 'Complete your upgrade: '}
            <span className="font-semibold text-indigo-600 uppercase">{planId.replace('clevel', 'Level C Pro')}</span>
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
            <div className="flex items-start gap-4 mb-6">
                <div className="bg-indigo-100 p-3 rounded-lg text-indigo-600">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 capitalize">
                        {planId === 'clevel' ? 'Level C Pro' : planId} Plan
                    </h3>
                    <p className="text-sm text-slate-500">
                        {isAnnual ? 'Annual Subscription' : 'Monthly Subscription'}
                    </p>
                </div>
                <div className="ml-auto text-right">
                    <p className="font-bold text-slate-900">R$ {basePrice.toFixed(2)}</p>
                    <p className="text-xs text-slate-400">/{isAnnual ? 'year' : 'mo'}</p>
                </div>
            </div>

            <div className="border-t border-slate-100 py-4 space-y-2">
                <div className="flex justify-between text-sm text-slate-600">
                    <span>Subtotal</span>
                    <span>R$ {basePrice.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                     <div className="flex justify-between text-sm text-green-600 font-medium">
                        <span>Discount ({discount}%)</span>
                        <span>- R$ {(basePrice - finalPrice).toFixed(2)}</span>
                    </div>
                )}
                <div className="flex justify-between text-lg font-bold text-slate-900 pt-2">
                    <span>Total</span>
                    <span>R$ {finalPrice.toFixed(2)}</span>
                </div>
            </div>

            {/* Coupon Section */}
            <div className="mt-6 pt-6 border-t border-slate-100">
                <label className="block text-sm font-medium text-slate-700 mb-2">Discount Coupon</label>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Tag className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input 
                            type="text" 
                            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
                            placeholder="CODE"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                        />
                    </div>
                    <Button 
                        label={validating ? "..." : "Apply"} 
                        variant="secondary" 
                        onClick={handleApplyCoupon} 
                        disabled={validating || !couponCode}
                    />
                </div>
                {discount > 0 && (
                     <p className="text-xs text-green-600 mt-2">Coupon applied successfully!</p>
                )}
            </div>
        </Card>

        <Button 
            label={processing ? "Processing..." : discount === 100 ? "Complete Upgrade" : "Pay with AbacatePay"}
            fullWidth 
            className="h-12 text-lg"
            onClick={handlePayment}
            disabled={processing}
        />
        
        <div className="flex justify-center items-center gap-2 text-xs text-slate-400 mt-2">
            <CreditCard className="w-3 h-3" />
            <span>Secure payment encrypted by AbacatePay</span>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
