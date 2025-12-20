import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { User as UserIcon, Shield, Lock, Upload } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useNotification } from '../context/NotificationContext';
import { useLanguage } from '../context/LanguageContext';

const Settings = () => {
  const { user, updateUser } = useUser();
  const { addNotification } = useNotification();
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    name: user.name,
    position: user.position,
    department: user.department,
    email: user.email
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatar || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData({
      name: user.name,
      position: user.position,
      department: user.department,
      email: user.email
    });
    setAvatarPreview(user.avatar || null);
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        addNotification('error', t('settings.uploadLimit'));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    // Reset form data to current user values
    setFormData({
      name: user.name,
      position: user.position,
      department: user.department,
      email: user.email
    });
    // Reset avatar preview
    setAvatarPreview(user.avatar || null);
    // Clear file input value to allow selecting the same file again if needed after cancel
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate API call
    setTimeout(() => {
      updateUser({
        ...formData,
        avatar: avatarPreview || undefined
      });
      addNotification('success', t('settings.successMessage'));
    }, 600);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t('settings.title')}</h1>
        <p className="text-slate-500">{t('settings.subtitle')}</p>
      </div>

      <Card title={t('settings.publicProfile')}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 border border-slate-200 overflow-hidden relative">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-8 h-8" />
              )}
            </div>
            <div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/png, image/jpeg, image/gif" 
                onChange={handleFileChange}
              />
              <Button 
                label={t('settings.changeAvatar')}
                variant="secondary" 
                type="button" 
                className="text-sm px-3 py-1 flex items-center gap-2" 
                onClick={handleAvatarClick}
              >
                <Upload className="w-3 h-3" /> {t('settings.changeAvatar')}
              </Button>
              <p className="text-xs text-slate-400 mt-1">{t('settings.imageHelp')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Input
              label={t('settings.fullName')}
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <Input
              label={t('settings.email')}
              name="email"
              value={formData.email}
              disabled
              className="bg-slate-50 text-slate-500 cursor-not-allowed"
            />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={t('settings.position')}
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                />
                <Input
                  label={t('settings.department')}
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end border-t border-slate-100 mt-4">
            <div className="flex space-x-3">
                 <Button 
                   label={t('common.cancel')} 
                   variant="ghost" 
                   type="button" 
                   onClick={handleCancel}
                 />
                 <Button label={t('common.save')} type="submit" />
            </div>
          </div>
        </form>
      </Card>
      
       <Card title={t('settings.security')}>
          <div className="space-y-4">
             <div className="flex items-center justify-between py-2">
                 <div className="flex items-start gap-3">
                     <div className="bg-slate-100 p-2 rounded text-slate-500">
                        <Lock className="w-4 h-4" />
                     </div>
                     <div>
                        <h4 className="text-sm font-medium text-slate-900">{t('settings.twoFactorTitle')}</h4>
                        <p className="text-xs text-slate-500">{t('settings.twoFactorDesc')}</p>
                     </div>
                 </div>
                 <Button label={t('settings.enable')} variant="secondary" className="text-sm px-3 py-1" />
             </div>
             <div className="border-t border-slate-100 my-2"></div>
              <div className="flex items-center justify-between py-2">
                 <div className="flex items-start gap-3">
                     <div className="bg-indigo-50 p-2 rounded text-indigo-500">
                        <Shield className="w-4 h-4" />
                     </div>
                     <div>
                        <h4 className="text-sm font-medium text-slate-900">{t('settings.visibilityTitle')}</h4>
                        <p className="text-xs text-slate-500">{t('settings.visibilityDesc')}</p>
                     </div>
                 </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="visibility" className="rounded text-indigo-600 focus:ring-indigo-500 w-5 h-5 border-gray-300" defaultChecked />
                </div>
             </div>
          </div>
       </Card>

       {/* Developer Options (For Demo/Testing) */}
       <div className="pt-8 border-t border-slate-200">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Developer Options</h3>
          <Card>
              <div className="flex items-center justify-between">
                  <div>
                      <h4 className="font-medium text-slate-900">Current Role: {user.role}</h4>
                      <p className="text-sm text-slate-500">Switch role to test SaaS Admin features.</p>
                  </div>
                  <div className="flex gap-2">
                      <Button 
                        label="Set as User" 
                        variant={user.role === 'user' ? 'primary' : 'secondary'}
                        onClick={() => {
                            updateUser({ role: 'user' });
                            addNotification('info', 'Role switched to User');
                        }}
                      />
                       <Button 
                        label="Set as SaaS Admin" 
                        variant={user.role === 'saas_admin' ? 'primary' : 'secondary'}
                        onClick={() => {
                            updateUser({ role: 'saas_admin' });
                            addNotification('success', 'Role switched to SaaS Admin');
                        }}
                      />
                  </div>
              </div>
          </Card>
       </div>
    </div>
  );
};

export default Settings;