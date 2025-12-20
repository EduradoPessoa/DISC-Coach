import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Star, Check, X, MessageSquare } from 'lucide-react';
import { apiRequest } from '../../services/api';

const SaasNPS = () => {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    try {
        const data = await apiRequest('/nps/admin.php', 'GET');
        if (Array.isArray(data)) setFeedbacks(data);
    } catch (e) {
        console.error(e);
    }
  };

  const handleModerate = async (id: number, status: 'approved' | 'rejected', isPublic: boolean) => {
    try {
        await apiRequest('/nps/admin.php', 'POST', { id, status, is_public: isPublic ? 1 : 0 });
        loadFeedbacks();
    } catch (e) {
        alert('Error updating status');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">NPS & Testimonials</h1>
        <p className="text-slate-500">Moderate user feedback and select testimonials for the landing page.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {feedbacks.map((item) => (
            <Card key={item.id} className="border-l-4 border-l-indigo-500">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                            <div className="bg-slate-100 px-2 py-1 rounded text-xs font-bold text-slate-600">
                                ID: {item.id}
                            </div>
                            <div className="flex items-center text-yellow-500">
                                <span className="font-bold text-lg mr-1">{item.score}</span>
                                <Star className="w-4 h-4 fill-current" />
                            </div>
                            <span className="text-slate-400 text-sm">by {item.user_name}</span>
                        </div>
                        <p className="text-slate-800 italic mb-2">"{item.comment}"</p>
                        <div className="flex items-center space-x-4 text-xs">
                            <span className={`px-2 py-0.5 rounded-full ${
                                item.status === 'approved' ? 'bg-green-100 text-green-700' :
                                item.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                'bg-slate-100 text-slate-600'
                            }`}>
                                {item.status.toUpperCase()}
                            </span>
                            {item.is_public == 1 && (
                                <span className="text-indigo-600 font-bold flex items-center">
                                    <GlobeIcon className="w-3 h-3 mr-1" /> Public on Landing Page
                                </span>
                            )}
                            <span className="text-slate-400">{new Date(item.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                    
                    <div className="flex flex-row md:flex-col gap-2 min-w-[140px]">
                        <Button 
                            label="Approve & Publish" 
                            variant="secondary" 
                            className="text-xs bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                            icon={Check}
                            onClick={() => handleModerate(item.id, 'approved', true)}
                        />
                        <Button 
                            label="Approve (Private)" 
                            variant="secondary" 
                            className="text-xs"
                            onClick={() => handleModerate(item.id, 'approved', false)}
                        />
                        <Button 
                            label="Reject" 
                            variant="secondary" 
                            className="text-xs bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                            icon={X}
                            onClick={() => handleModerate(item.id, 'rejected', false)}
                        />
                    </div>
                </div>
            </Card>
        ))}
        {feedbacks.length === 0 && (
            <div className="text-center py-12 text-slate-500 bg-white rounded-xl border border-slate-200">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                No feedback received yet.
            </div>
        )}
      </div>
    </div>
  );
};

const GlobeIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
);

export default SaasNPS;
