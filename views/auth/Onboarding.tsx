import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const Onboarding = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <Card title="Setup Profile" subtitle="Help us tailor the experience">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Full Name" placeholder="e.g. John Doe" required />
        <Input label="Position / Title" placeholder="e.g. VP of Operations" required />
        
        <div className="w-full mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
            <select 
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-900"
                defaultValue=""
            >
                <option value="" disabled>Select Department</option>
                <option>Compliance</option>
                <option>Finance</option>
                <option>Legal</option>
                <option>Operations</option>
                <option>Technology</option>
            </select>
        </div>

        <div className="flex items-center space-x-2 py-2">
            <input type="checkbox" id="share" className="rounded text-indigo-600 focus:ring-indigo-500" defaultChecked />
            <label htmlFor="share" className="text-sm text-slate-700">Share results with manager</label>
        </div>

        <Button label="Complete Setup" fullWidth type="submit" />
      </form>
    </Card>
  );
};

export default Onboarding;