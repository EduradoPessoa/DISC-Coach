import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { apiRequest } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

const Register = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
    }

    if (!formData.termsAccepted) {
        setError('You must accept the terms');
        return;
    }

    setLoading(true);
    try {
        await apiRequest('/auth/register.php', 'POST', {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            terms_accepted: true
        });
        
        // Success - Redirect to Login
        navigate('/auth/login', { state: { message: 'Account created! Please log in.' } });
    } catch (e: any) {
        setError(e.message || 'Registration failed');
    } finally {
        setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center pb-2">
            <h3 className="text-lg font-semibold text-slate-900">Create Account</h3>
            <p className="text-sm text-slate-500">Start your leadership journey</p>
        </div>
        
        {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
                {error}
            </div>
        )}

        <Input 
            label="Full Name" 
            placeholder="John Doe" 
            required 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
        />

        <Input 
            label="Email" 
            type="email" 
            placeholder="name@company.com" 
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

        <Input 
            label="Confirm Password" 
            type="password" 
            placeholder="••••••••" 
            required 
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
        />

        <div className="flex items-center space-x-2 py-2">
            <input 
                type="checkbox" 
                id="terms" 
                className="rounded text-indigo-600 focus:ring-indigo-500" 
                checked={formData.termsAccepted}
                onChange={(e) => setFormData({...formData, termsAccepted: e.target.checked})}
            />
            <label htmlFor="terms" className="text-sm text-slate-700">
                I accept the <a href="#/legal/terms" className="text-indigo-600 hover:underline">Terms of Use</a> and <a href="#/legal/privacy" className="text-indigo-600 hover:underline">Privacy Policy</a>
            </label>
        </div>

        <div className="pt-2 space-y-3">
            <Button label={loading ? 'Creating Account...' : 'Sign Up'} fullWidth type="submit" disabled={loading} />
            <Button 
                label="Already have an account? Sign In" 
                variant="ghost" 
                fullWidth 
                type="button" 
                onClick={() => navigate('/auth/login')}
            />
        </div>
      </form>
    </Card>
  );
};

export default Register;
