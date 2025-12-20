import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Search, Filter, MoreHorizontal, UserCheck, UserX, X, Edit, Check } from 'lucide-react';
import { apiRequest } from '../../services/api';

interface User {
    id: number;
    name: string;
    email: string;
    plan: string;
    status: string;
    joined: string;
    role: string;
}

const SaasUsers = () => {
  const [filter, setFilter] = useState('all');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Action Menu State
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Edit Modal State
  const [editUser, setEditUser] = useState<User | null>(null);
  const [newPlan, setNewPlan] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
          // Add timestamp to prevent caching
          const timestamp = new Date().getTime();
          const data = await apiRequest(`/admin/users.php?filter=${filter}&search=${searchTerm}&t=${timestamp}`, 'GET');
          if (Array.isArray(data)) {
              setUsers(data);
          } else {
              setUsers([]);
          }
      } catch (e: any) {
          console.error(e);
          setError(e.message || 'Failed to load users');
      } finally {
          setLoading(false);
      }
  };

  const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      fetchUsers();
  };

  const handleEditClick = (user: User) => {
      setEditUser(user);
      setNewPlan(user.plan || 'free');
      setNewStatus(user.status || 'active');
      setOpenMenuId(null);
  };

  const handleSave = async () => {
      if (!editUser) return;
      setSaving(true);
      try {
          await apiRequest('/admin/users.php', 'POST', {
              id: editUser.id,
              plan: newPlan,
              status: newStatus
          });
          setEditUser(null);
          fetchUsers();
      } catch (e) {
          alert('Error updating user');
      } finally {
          setSaving(false);
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
            <p className="text-slate-500">Manage access, plans, and user status.</p>
        </div>
        <Button label="Export CSV" variant="secondary" />
      </div>

      <Card title="">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <form onSubmit={handleSearch} className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                    type="text" 
                    placeholder="Search users..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
            </form>
            <div className="flex gap-2">
                <select 
                    className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-indigo-500"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="all">All Users</option>
                    <option value="active">Active</option>
                    <option value="prospect">Prospects</option>
                    <option value="past_due">Past Due</option>
                </select>
                <Button label="Refresh" variant="secondary" onClick={fetchUsers} />
            </div>
        </div>

        <div className="overflow-x-visible">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Plan</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Joined</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {loading ? (
                        <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-500">Loading users...</td></tr>
                    ) : error ? (
                        <tr><td colSpan={5} className="px-6 py-10 text-center text-red-500">Error: {error}</td></tr>
                    ) : users.length === 0 ? (
                        <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-500">No users found.</td></tr>
                    ) : users.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50 relative">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold uppercase">
                                        {u.name ? u.name.charAt(0) : '?'}
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-slate-900">{u.name}</div>
                                        <div className="text-sm text-slate-500">{u.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    u.plan === 'pro' || u.plan === 'clevel' ? 'bg-indigo-100 text-indigo-800' : 
                                    u.plan === 'free' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                                }`}>
                                    {u.plan ? u.plan.toUpperCase() : 'NONE'}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    u.status === 'active' ? 'bg-green-100 text-green-800' : 
                                    u.status === 'past_due' ? 'bg-red-100 text-red-800' : 
                                    'bg-amber-100 text-amber-800'
                                }`}>
                                    {u.status || 'Unknown'}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                {new Date(u.joined).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenMenuId(openMenuId === u.id ? null : u.id);
                                    }}
                                    className="text-slate-400 hover:text-indigo-600"
                                >
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                                
                                {openMenuId === u.id && (
                                    <div ref={menuRef} className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-slate-100">
                                        <div className="py-1">
                                            <button
                                                onClick={() => handleEditClick(u)}
                                                className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                                            >
                                                <Edit className="w-4 h-4 mr-2" /> Edit Plan
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </Card>

      {/* Edit User Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-900">Edit User</h3>
                    <button onClick={() => setEditUser(null)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="mb-4">
                    <p className="text-sm text-slate-500 mb-1">User</p>
                    <p className="font-medium text-slate-900">{editUser.name} ({editUser.email})</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Plan</label>
                        <select 
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-indigo-500"
                            value={newPlan}
                            onChange={(e) => setNewPlan(e.target.value)}
                        >
                            <option value="free">Free</option>
                            <option value="unit">Unit (Single)</option>
                            <option value="pro">Pro</option>
                            <option value="clevel">C-Level</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                        <select 
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-indigo-500"
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                        >
                            <option value="active">Active</option>
                            <option value="past_due">Past Due</option>
                            <option value="canceled">Canceled</option>
                            <option value="trial">Trial</option>
                        </select>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <Button label="Cancel" variant="ghost" onClick={() => setEditUser(null)} />
                    <Button label={saving ? "Saving..." : "Save Changes"} onClick={handleSave} disabled={saving} />
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default SaasUsers;
