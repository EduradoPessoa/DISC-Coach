import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AIHelper } from '../components/ui/AIHelper';
import { Target, Calendar, CheckSquare, Plus, Trash2, Edit2, X, Check } from 'lucide-react';
import { Input } from '../components/ui/Input';

interface PlanItem {
  id: string;
  title: string;
  description: string;
  status: 'planned' | 'in_progress' | 'completed';
  dueDate: string;
}

const DevelopmentPlan = () => {
  const [items, setItems] = useState<PlanItem[]>([
    {
      id: '1',
      title: 'Delegation of Quality Control',
      description: 'Stop reviewing every minor report. Establish standards and trust direct reports to execute.',
      status: 'in_progress',
      dueDate: '2025-10-15'
    },
    {
      id: '2',
      title: 'Stakeholder Communication',
      description: 'Practice "Bottom Line Up Front" (BLUF) in verbal updates, but add personal connection time at start of meetings.',
      status: 'planned',
      dueDate: '2025-11-01'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PlanItem | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<PlanItem>>({
    title: '',
    description: '',
    status: 'planned',
    dueDate: ''
  });

  const handleOpenModal = (item?: PlanItem) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        description: '',
        status: 'planned',
        dueDate: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.description) return;

    if (editingItem) {
      // Update
      setItems(prev => prev.map(item => 
        item.id === editingItem.id ? { ...item, ...formData } as PlanItem : item
      ));
    } else {
      // Create
      const newItem: PlanItem = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        status: (formData.status as any) || 'planned',
        dueDate: formData.dueDate || ''
      };
      setItems(prev => [...prev, newItem]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Development Plan</h1>
          <p className="text-slate-500">Actionable steps to enhance executive impact.</p>
        </div>
        <Button 
          label="Add New Goal" 
          onClick={() => handleOpenModal()} 
          icon={Plus}
        />
      </div>

      {/* AI Generator Section */}
      <Card className="bg-gradient-to-r from-indigo-50 to-white border-indigo-100">
        <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
                <h3 className="text-lg font-bold text-indigo-900 mb-2">AI Coach Generation</h3>
                <p className="text-sm text-slate-600 mb-4">
                    Generate a personalized Individual Development Plan (IDP) based on your recent assessment results.
                </p>
                <AIHelper 
                    mode="coach" 
                    title="Generate New Plan"
                    discProfile="High Compliance, High Dominance"
                    contextData={{ goal: "Improve team empathy and agility", timeframe: "Q4" }}
                    promptTemplate="Create a 3-step development plan with specific metrics for this profile to improve agility and empathy."
                />
            </div>
        </div>
      </Card>

      {/* Current Active Plan */}
      <h3 className="text-lg font-bold text-slate-900 mt-8 mb-4">Current Focus Areas</h3>
      
      <div className="grid gap-4">
        {items.length === 0 && (
            <p className="text-slate-500 italic">No development goals yet. Add one or use AI to generate.</p>
        )}

        {items.map(item => (
            <Card key={item.id}>
                <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg mt-1 ${
                        item.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                        <Target className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h4 className="font-bold text-slate-900">{item.title}</h4>
                            <span className={`text-xs px-2 py-1 rounded capitalize ${getStatusColor(item.status)}`}>
                                {item.status.replace('_', ' ')}
                            </span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">
                            {item.description}
                        </p>
                        <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                            {item.dueDate && (
                                <div className="flex items-center gap-1"><Calendar className="w-3 h-3"/> Due: {item.dueDate}</div>
                            )}
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <button 
                            onClick={() => handleOpenModal(item)}
                            className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </Card>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-4 border-b border-slate-100">
                    <h3 className="font-bold text-lg text-slate-900">
                        {editingItem ? 'Edit Goal' : 'New Development Goal'}
                    </h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Goal Title</label>
                        <Input 
                            value={formData.title || ''} 
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            placeholder="e.g. Improve Public Speaking"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea 
                            className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            rows={3}
                            value={formData.description || ''}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Specific actions to achieve this goal..."
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                            <select 
                                className="w-full rounded-lg border border-slate-300 p-2.5 text-sm outline-none"
                                value={formData.status}
                                onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                            >
                                <option value="planned">Planned</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                            <Input 
                                type="date"
                                value={formData.dueDate || ''} 
                                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                            />
                        </div>
                    </div>
                </div>
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                    <Button 
                        label="Cancel" 
                        variant="ghost" 
                        onClick={() => setIsModalOpen(false)} 
                    />
                    <Button 
                        label="Save Goal" 
                        onClick={handleSave} 
                        icon={Check}
                    />
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default DevelopmentPlan;
