import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login logic
    navigate('/dashboard');
  };

  return (
    <Card className="w-full">
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="text-center pb-2">
            <h3 className="text-lg font-semibold text-slate-900">Sign In</h3>
            <p className="text-sm text-slate-500">Access your executive dashboard</p>
        </div>
        <Input 
            label="Corporate Email" 
            placeholder="name@company.com" 
            type="email" 
            required 
            defaultValue="edu.compliance@corp.com"
        />
        <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
            required 
            defaultValue="password123"
        />
        <div className="pt-2 space-y-3">
            <Button label="Sign In" fullWidth type="submit" />
            <Button 
                label="Create Account" 
                variant="ghost" 
                fullWidth 
                type="button" 
                onClick={() => navigate('/auth/onboarding')}
            />
        </div>
      </form>
    </Card>
  );
};

export default Login;