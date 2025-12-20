import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { Button } from './Button';
import { useUser } from '../../context/UserContext';

interface PremiumGateProps {
  children: React.ReactNode;
  title?: string;
  message?: string;
}

export const PremiumGate: React.FC<PremiumGateProps> = ({ 
  children, 
  title = "Premium Feature", 
  message = "Upgrade to Pro to access AI insights and detailed analytics."
}) => {
  const { user } = useUser();
  const navigate = useNavigate();

  // Free for all during Beta/Testing
  return <>{children}</>;

  // Original Logic (Commented out for open access)
  /*
  if (user.plan === 'pro') {
    return <>{children}</>;
  }

  return (
    <div className="relative overflow-hidden rounded-xl">
      <div className="filter blur-sm pointer-events-none select-none opacity-50">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-slate-50/60 z-10">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 max-w-sm text-center">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-sm text-slate-500 mb-6">{message}</p>
            <Button 
                label="Upgrade to Pro" 
                fullWidth 
                onClick={() => navigate('/pricing')} 
            />
        </div>
      </div>
    </div>
  );
  */
};
