
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useNotification } from '../../context/NotificationContext';
import { ShieldCheck, Lock } from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      addNotification('error', 'As senhas não coincidem.');
      return;
    }

    if (password.length < 8) {
        addNotification('error', 'A senha deve ter pelo menos 8 caracteres.');
        return;
    }

    setIsLoading(true);

    // Simulate API call for password update
    setTimeout(() => {
      setIsLoading(false);
      addNotification('success', 'Senha redefinida com sucesso! Agora você pode fazer login.');
      navigate('/auth/login');
    }, 1500);
  };

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center pb-2">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Nova Senha</h3>
            <p className="text-sm text-slate-500">Escolha uma senha forte para sua conta</p>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg mb-2">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Token de Segurança</p>
            <p className="text-[11px] font-mono text-slate-600 truncate">{token}</p>
        </div>
        
        <Input 
            label="Nova Senha" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
        />
        <Input 
            label="Confirmar Nova Senha" 
            type="password" 
            placeholder="••••••••" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required 
        />
        
        <div className="pt-2 space-y-3">
            <Button 
                label={isLoading ? "Atualizando..." : "Redefinir Senha"} 
                fullWidth 
                type="submit" 
                className="h-12 font-black" 
                disabled={isLoading}
            />
            
            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-2">
                <ShieldCheck className="w-3 h-3" />
                Criptografia de Ponta-a-Ponta
            </div>
        </div>
      </form>
    </Card>
  );
};

export default ResetPassword;
