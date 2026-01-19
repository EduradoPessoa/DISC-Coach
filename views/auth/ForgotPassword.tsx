
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useNotification } from '../../context/NotificationContext';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
      addNotification('info', 'Se este e-mail estiver registrado, você receberá um link de redefinição em instantes.');
    }, 1200);
  };

  if (submitted) {
    return (
      <Card className="w-full text-center py-4">
        <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 text-green-600">
                <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">E-mail Enviado</h3>
            <p className="text-sm text-slate-500 mt-2 mb-8">
                Verifique sua caixa de entrada para o e-mail: <br/>
                <span className="font-bold text-slate-800">{email}</span>
            </p>
            <Button 
                label="Voltar ao Login" 
                variant="primary" 
                fullWidth 
                onClick={() => navigate('/auth/login')} 
            />
            <p className="text-xs text-slate-400 mt-6">
                Não recebeu o e-mail? <button onClick={() => setSubmitted(false)} className="text-indigo-600 font-bold hover:underline">Tente novamente</button>
            </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <form onSubmit={handleResetRequest} className="space-y-4">
        <div className="text-center pb-2">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Recuperar Senha</h3>
            <p className="text-sm text-slate-500">Enviaremos um link de acesso para o seu e-mail</p>
        </div>
        
        <Input 
            label="E-mail Corporativo" 
            placeholder="seu@email.com" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
        />
        
        <div className="pt-2 space-y-4">
            <Button 
                label={isLoading ? "Processando..." : "Enviar Link de Recuperação"} 
                fullWidth 
                type="submit" 
                className="h-12" 
                disabled={isLoading}
            />
            
            <Link 
                to="/auth/login" 
                className="flex items-center justify-center gap-2 text-sm text-slate-500 font-bold hover:text-slate-800 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Voltar para o Login
            </Link>
        </div>
      </form>
    </Card>
  );
};

export default ForgotPassword;
