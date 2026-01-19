
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useUser } from '../../context/UserContextSupabase';
import { useNotification } from '../../context/NotificationContext';
import { ShieldCheck, Loader2 } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const { addNotification } = useNotification();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      addNotification('success', 'Acesso autorizado.');
      navigate('/dashboard');
    } catch (error: any) {
      console.error(error);
      addNotification('error', 'Falha na autenticação. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="text-center pb-2">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Login Profissional</h3>
            <p className="text-sm text-slate-500">Acesse sua inteligência comportamental</p>
        </div>
        
        <Input 
            label="E-mail Corporativo" 
            placeholder="ex: seu@email.com" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
        />
        <div className="space-y-1">
            <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-slate-700">Senha</label>
                {/* Fixed: Removed non-existent 'size' prop from Link component which was causing a TypeScript error */}
                <Link to="/auth/forgot-password" className="text-xs text-indigo-600 font-bold hover:underline">
                    Esqueceu a senha?
                </Link>
            </div>
            <Input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
            />
        </div>
        
        <div className="pt-2 space-y-3">
            <Button 
              label={isLoading ? "Autenticando..." : "Acessar Sistema"} 
              fullWidth 
              type="submit" 
              className="h-12 font-black"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            </Button>
            
            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-2">
                <ShieldCheck className="w-3 h-3" />
                Conexão Segura SSL/PCI-DSS
            </div>

            <div className="pt-4 border-t border-slate-100">
                <Button 
                    label="Criar Nova Conta" 
                    variant="ghost" 
                    fullWidth 
                    type="button" 
                    onClick={() => navigate('/auth/onboarding')}
                />
            </div>
        </div>
      </form>
    </Card>
  );
};

export default Login;
