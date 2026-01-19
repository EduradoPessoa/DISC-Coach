
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useUser } from '../../context/UserContext';
import { useNotification } from '../../context/NotificationContext';
import { api } from '../../services/api';
import { Loader2, ArrowLeft, AlertCircle, Ticket } from 'lucide-react';

const Onboarding = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register } = useUser();
  const { addNotification } = useNotification();

  const [isLoading, setIsLoading] = useState(false);
  const [inviteData, setInviteData] = useState<any>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    position: '',
    department: ''
  });

  const inviteToken = searchParams.get('token');

  useEffect(() => {
    if (inviteToken) {
      const validateInvite = async () => {
        try {
          const data = await api.getInvitationByToken(inviteToken);
          if (data) {
            setInviteData(data);
            setFormData(prev => ({ ...prev, email: data.email }));
            addNotification('info', `Convite VIP detectado: Acesso 100% Gratuito.`);
          } else {
            addNotification('warning', 'Convite inválido ou já utilizado.');
          }
        } catch (e) {
          console.error("Erro ao validar convite", e);
        }
      };
      validateInvite();
    }
  }, [inviteToken]);

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
      // Registra o usuário
      await register(formData.email, formData.password, {
        name: formData.name,
        position: formData.position,
        department: formData.department
      });

      // Se houver convite, aplicamos as permissões especiais no banco
      if (inviteData && inviteToken) {
        const currentUser = await api.getUserByEmail(formData.email);
        if (currentUser) {
          await api.saveUser({
            ...currentUser,
            plan: 'pro',
            role: 'team-admin',
            subscriptionStatus: 'active',
            invitedBy: inviteData.invitedBy
          });
          await api.markInvitationAsUsed(inviteToken);
          addNotification('success', 'Acesso Pro ativado via convite!');
        }
      }

      addNotification('success', 'Conta criada com sucesso! Bem-vindo ao DISC Coach.');
      navigate('/dashboard');
    } catch (error: any) {
      console.error(error);
      const msg = error.message || 'Erro ao criar conta. Verifique sua conexão ou tente novamente.';
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

        {inviteData && (
          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-center gap-3 text-indigo-800 animate-in slide-in-from-top-2 duration-500">
            <div className="bg-white p-2 rounded-xl shadow-sm">
                <Ticket className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-[10px] leading-relaxed font-black uppercase tracking-widest">
                Benefício Ativado: 100% de desconto <br/>
                <span className="text-indigo-600">Acesso Administrativo VIP</span>
            </div>
          </div>
        )}

        {errorDetails && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3 text-red-800">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className="text-xs leading-relaxed">
              <p className="font-bold mb-1">Status do Servidor:</p>
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
          disabled={!!inviteData} // Bloqueia e-mail se vier do convite
          className={inviteData ? "bg-slate-50 cursor-not-allowed text-slate-400" : ""}
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-900 text-sm"
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
