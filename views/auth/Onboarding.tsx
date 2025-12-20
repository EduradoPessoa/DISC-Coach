import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '../../context/UserContext';
import { apiRequest } from '../../services/api';

const Onboarding = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { updateUser, user } = useUser();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    position: '',
    department: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
        // Save to DB
        await apiRequest('/auth/update_profile.php', 'POST', {
            name: formData.name,
            position: formData.position,
            department: formData.department
        });

        // Update local context
        updateUser({
            name: formData.name,
            position: formData.position,
            department: formData.department
        });

        navigate('/dashboard');
    } catch (error) {
        console.error("Failed to update profile", error);
        alert("Erro ao salvar perfil. Tente novamente.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <Card title={t('onboarding.title')} subtitle={t('onboarding.subtitle')}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
            label={t('onboarding.fullName')} 
            placeholder={t('onboarding.fullNamePlaceholder')} 
            required 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
        <Input 
            label={t('onboarding.position')} 
            placeholder={t('onboarding.positionPlaceholder')} 
            required 
            value={formData.position}
            onChange={(e) => setFormData({...formData, position: e.target.value})}
        />
        
        <div className="w-full mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('onboarding.department')}</label>
            <select 
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-900"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
            >
                <option value="" disabled>{t('onboarding.selectDepartment')}</option>
                <option value="Compliance">{t('onboarding.departments.compliance')}</option>
                <option value="Finance">{t('onboarding.departments.finance')}</option>
                <option value="Legal">{t('onboarding.departments.legal')}</option>
                <option value="Operations">{t('onboarding.departments.operations')}</option>
                <option value="Technology">{t('onboarding.departments.technology')}</option>
                <option value="Sales">{t('onboarding.departments.sales')}</option>
                <option value="HR">{t('onboarding.departments.hr')}</option>
            </select>
        </div>

        <div className="flex items-center space-x-2 py-2">
            <input type="checkbox" id="share" className="rounded text-indigo-600 focus:ring-indigo-500" defaultChecked />
            <label htmlFor="share" className="text-sm text-slate-700">{t('onboarding.shareResults')}</label>
        </div>

        <Button label={loading ? 'Salvando...' : t('onboarding.completeSetup')} fullWidth type="submit" disabled={loading} />
      </form>
    </Card>
  );
};

export default Onboarding;