import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Download } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useUser } from '../context/UserContext';
import { useNotification } from '../context/NotificationContext';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { upgradeToPro, user } = useUser();
  const { addNotification } = useNotification();

  useEffect(() => {
    // In a real app, we would verify the session_id from the URL with the backend
    // before upgrading. For this frontend demo, visiting this page activates Pro.
    if (user.plan !== 'pro') {
      upgradeToPro();
      addNotification('success', 'Subscription activated successfully!');
    }
  }, [user.plan, upgradeToPro, addNotification]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-500">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Payment Confirmed!</h1>
          <p className="text-slate-500">Welcome to Level C Pro, {user.name.split(' ')[0]}.</p>
        </div>

        <Card className="mb-6 border-green-100 shadow-lg shadow-green-500/5">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <span className="text-sm text-slate-500">Amount Paid</span>
              <span className="font-bold text-slate-900">R$ 97.00</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <span className="text-sm text-slate-500">Plan</span>
              <span className="font-bold text-slate-900">Level C Pro (Monthly)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">Status</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">Active</span>
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          <Button 
            label="Go to Dashboard" 
            fullWidth 
            className="h-12 text-lg"
            onClick={() => navigate('/dashboard')} 
          />
          <Button 
            label="Download Receipt" 
            variant="ghost" 
            fullWidth 
            className="flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Receipt
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
