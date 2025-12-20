import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Bell, Send, User } from 'lucide-react';
import { apiRequest } from '../../services/api';

const SaasNotifications = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('info');
  const [targetUser, setTargetUser] = useState(''); // Empty = Global
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
        const data = await apiRequest('/notifications/admin.php', 'POST', { action: 'list' });
        if (Array.isArray(data)) setHistory(data);
    } catch (e) {
        console.error(e);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        await apiRequest('/notifications/admin.php', 'POST', {
            action: 'create',
            message,
            type,
            user_id: targetUser || null
        });
        setMessage('');
        setTargetUser('');
        loadHistory();
        alert('Notification sent!');
    } catch (e) {
        alert('Error sending notification');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Notifications Manager</h1>
        <p className="text-slate-500">Send alerts to all users or specific accounts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Send Notification">
            <form onSubmit={handleSend} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                    <textarea 
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-indigo-500 h-24"
                        placeholder="System maintenance at 22:00..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                        <select 
                            className="w-full px-3 py-2 border border-slate-300 rounded-md"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="info">Info</option>
                            <option value="success">Success</option>
                            <option value="warning">Warning</option>
                            <option value="error">Error</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Target User ID (Optional)</label>
                        <input 
                            type="number" 
                            className="w-full px-3 py-2 border border-slate-300 rounded-md"
                            placeholder="Leave empty for all"
                            value={targetUser}
                            onChange={(e) => setTargetUser(e.target.value)}
                        />
                    </div>
                </div>
                <Button label={loading ? 'Sending...' : 'Send Notification'} icon={Send} fullWidth type="submit" disabled={loading} />
            </form>
        </Card>

        <Card title="Recent History">
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {history.map((notif) => (
                    <div key={notif.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm">
                        <div className="flex justify-between items-start mb-1">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                                notif.type === 'error' ? 'bg-red-100 text-red-700' :
                                notif.type === 'success' ? 'bg-green-100 text-green-700' :
                                notif.type === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-blue-100 text-blue-700'
                            }`}>{notif.type}</span>
                            <span className="text-slate-400 text-xs">{new Date(notif.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-slate-700 font-medium">{notif.message}</p>
                        <p className="text-xs text-slate-400 mt-1 flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {notif.user_id ? `User ID: ${notif.user_id}` : 'Global Broadcast'}
                        </p>
                    </div>
                ))}
                {history.length === 0 && <p className="text-slate-500 text-center py-4">No notifications sent yet.</p>}
            </div>
        </Card>
      </div>
    </div>
  );
};

export default SaasNotifications;
