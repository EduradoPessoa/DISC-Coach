import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Payment Cancelled</h1>
        <p className="text-slate-500 mb-8">
          The transaction was not completed. No charges were made to your account.
        </p>

        <Card className="mb-6 text-left">
           <p className="text-sm text-slate-600 mb-4">
             Common reasons for cancellation:
           </p>
           <ul className="list-disc list-inside text-sm text-slate-500 space-y-1">
             <li>Insufficient funds</li>
             <li>Incorrect card details</li>
             <li>Bank security verification failed</li>
             <li>User cancelled the process</li>
           </ul>
        </Card>

        <div className="space-y-3">
          <Button 
            label="Try Again" 
            fullWidth 
            onClick={() => navigate('/checkout')} 
          />
          <Button 
            label="Return to Dashboard" 
            variant="ghost" 
            fullWidth 
            onClick={() => navigate('/dashboard')} 
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
