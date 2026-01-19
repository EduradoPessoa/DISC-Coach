import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useUser } from '../../context/UserContext';
import { useNotification } from '../../context/NotificationContext';
import { ShieldCheck } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const { addNotification } = useNotification();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Lógica especial para o Admin do SaaS Eduardo
    if (email === 'eduardo@phoenyx.com.br' && password === 'P3naBranc@') {
      setUser({
        id: 'saas_admin_eduardo',
        name: 'Eduardo Pessoa',
        email: 'eduardo@phoenyx.com.br',
        role: 'saas-admin',
        position: 'SaaS Founder',
        department: 'Diretoria',
        plan: 'pro'
      });
      addNotification('success', 'Bem-vindo Eduardo! Acesso SaaS Admin liberado.');
      navigate('/dashboard');
      return;
    }

    // Mock login para outros usuários
    setUser({
      id: `u_${Date.now()}`,
      name: email.split('@')[0],
      email: email,
      role: 'user',
      position: 'Executivo',
      department: 'Corporativo',
      plan: 'free'
    });
    
    navigate('/dashboard');
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
            placeholder="ex: eduardo@phoenyx.com.br" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
        />
        <Input 
            label="Senha" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
        />
        
        <div className="pt-2 space-y-3">
            <Button label="Acessar Sistema" fullWidth type="submit" className="h-12" />
            
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