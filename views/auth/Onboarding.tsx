
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useUser } from '../../context/UserContext';
import { useNotification } from '../../context/NotificationContext';
import { Loader2, ArrowLeft, AlertCircle } from 'lucide-react';

const Onboarding = () => {
  const navigate = useNavigate();
  const { register } = useUser();
  const { addNotification } = useNotification();

  const [isLoading, setIsLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    position: '',
    department: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorDetails(null);
    
    if (formData.password.length < 6) {
      addNotification('error', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setIsLoading(true);
    try {
      await register(formData.email, formData.password, {
        name: formData.name,
        position: formData.position,
        department: formData.department
      });
      addNotification('success', 'Conta criada com sucesso! Bem-vindo ao DISC Coach.');
      navigate('/dashboard');
    } catch (error: any) {
      console.error(error);
      let msg = 'Erro ao criar conta. Tente novamente.';
      
      if (error.code === 'auth/configuration-not-found') {
        msg = 'Erro de Configuração no Firebase.';
        setErrorDetails('O provedor de "E-mail/Senha" não está ativado no console do Firebase. Vá em Autenticação > Sign-in Method e ative-o.');
      } else if (error.code === 'auth/email-already-in-use') {
        msg = 'Este e-mail já está em uso.';
      } else if (error.code === 'auth/invalid-email') {
        msg = 'E-mail inválido.';
      } else if (error.code === 'auth/operation-not-allowed') {
        msg = 'Operação não permitida.';
        setErrorDetails('Verifique se o login com E-mail/Senha está habilitado no seu console Firebase.');
      }
      
      addNotification('error', msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center pb-2">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Criar Nova Conta</h3>
            <p className="text-sm text-slate-500">Inicie sua jornada de liderança hoje</p>
        </div>

        {errorDetails && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3 text-red-800 animate-in fade-in duration-300">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className="text-xs leading-relaxed">
              <p className="font-bold mb-1">Ação Necessária:</p>
              {errorDetails}
            </div>
          </div>
        )}

        <Input 
          label="Nome Completo" 
          name="name" 
          placeholder="ex: João Silva" 
          value={formData.name}
          onChange={handleChange}
          required 
        />

        <Input 
          label="E-mail Corporativo" 
          name="email" 
          type="email" 
          placeholder="ex: joao@empresa.com" 
          value={formData.email}
          onChange={handleChange}
          required 
        />

        <Input 
          label="Senha" 
          name="password" 
          type="password" 
          placeholder="••••••••" 
          value={formData.password}
          onChange={handleChange}
          required 
        />

        <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Cargo" 
              name="position" 
              placeholder="ex: Diretor" 
              value={formData.position}
              onChange={handleChange}
              required 
            />
            <div className="w-full mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Departamento</label>
                <select 
                    name="department"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-900"
                    value={formData.department}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>Selecione</option>
                    <option value="Compliance">Compliance</option>
                    <option value="Finance">Financeiro</option>
                    <option value="Legal">Jurídico</option>
                    <option value="Operations">Operações</option>
                    <option value="Technology">Tecnologia</option>
                    <option value="HR">Recursos Humanos</option>
                </select>
            </div>
        </div>

        <div className="pt-2 space-y-3">
            <Button 
                label={isLoading ? "Criando Conta..." : "Cadastrar e Começar"} 
                fullWidth 
                type="submit" 
                className="h-12 font-black"
                disabled={isLoading}
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            </Button>
            
            <Link 
                to="/auth/login" 
                className="flex items-center justify-center gap-2 text-sm text-slate-500 font-bold hover:text-slate-800 transition-colors pt-2"
            >
                <ArrowLeft className="w-4 h-4" />
                Já tenho uma conta
            </Link>
        </div>
      </form>
    </Card>
  );
};

export default Onboarding;
