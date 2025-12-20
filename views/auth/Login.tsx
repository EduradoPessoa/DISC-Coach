import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useUser } from '../../context/UserContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: 'edu.compliance@corp.com',
    password: 'password123'
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
        await login({
            email: formData.email,
            password: formData.password
        });
        
        // Check updated user state logic would ideally be here or in useEffect
        // But login() is async and sets state. We might need to check the result from login()
        // For simplicity, we assume login() throws if failed, and we check user state in context
        // But context update might be async.
        
        // Let's rely on the fact that login() fetches fresh data.
        // We can check local storage or assume if no error, we are good.
        // To verify profile completion, we need to inspect the data returned or the updated state.
        
        // Ideally login returns the user object. 
        // Let's modify context to return user. 
        // But for now, let's fetch from storage or wait a tick? 
        // Actually, we can check the localStorage which we just set in context.
        const savedUser = JSON.parse(localStorage.getItem('disc_user') || '{}');
        
        const isProfileComplete = savedUser.position && savedUser.department;

        if (!isProfileComplete) {
            navigate('/auth/onboarding');
        } else {
            navigate('/dashboard');
        }

    } catch (e: any) {
        setError(e.message || 'Login failed');
    } finally {
        setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="text-center pb-2">
            <h3 className="text-lg font-semibold text-slate-900">Sign In</h3>
            <p className="text-sm text-slate-500">Access your executive dashboard</p>
        </div>
        
        {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
                {error}
            </div>
        )}

        <Input 
            label="Corporate Email" 
            placeholder="name@company.com" 
            type="email" 
            required 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
            required 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
        <div className="pt-2 space-y-3">
            <Button label={loading ? 'Signing in...' : 'Sign In'} fullWidth type="submit" disabled={loading} />
            <Button 
                label="Create Account" 
                variant="ghost" 
                fullWidth 
                type="button" 
                onClick={() => navigate('/auth/register')}
            />
        </div>
      </form>
    </Card>
  );
};

export default Login;