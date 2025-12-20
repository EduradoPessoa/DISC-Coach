import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Search, Filter, MoreHorizontal } from 'lucide-react';

const AdminUsers = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Team Management</h1>
            <p className="text-slate-500">Manage assessments and view team analytics.</p>
        </div>
        <Button label="Invite User" />
      </div>

      <Card>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search employees..." 
                    className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>
            <div className="flex gap-2">
                <button className="flex items-center px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-600 text-sm hover:bg-slate-50">
                    <Filter className="w-4 h-4 mr-2" /> Filter
                </button>
                <button className="flex items-center px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-600 text-sm hover:bg-slate-50">
                    Export CSV
                </button>
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                    <tr>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Role</th>
                        <th className="px-6 py-3">Profile</th>
                        <th className="px-6 py-3">Last Active</th>
                        <th className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {[
                        { name: "Eduardo M.", email: "edu@corp.com", role: "CCO", profile: "High C / High D", date: "2 mins ago" },
                        { name: "Sarah Jenkins", email: "sarah@corp.com", role: "Legal Counsel", profile: "High C / High S", date: "4 hours ago" },
                        { name: "Mike Ross", email: "mike@corp.com", role: "VP Sales", profile: "High I / High D", date: "1 day ago" },
                    ].map((user, idx) => (
                        <tr key={idx} className="bg-white border-b hover:bg-slate-50">
                            <td className="px-6 py-4">
                                <div className="font-medium text-slate-900">{user.name}</div>
                                <div className="text-xs text-slate-400">{user.email}</div>
                            </td>
                            <td className="px-6 py-4">{user.role}</td>
                            <td className="px-6 py-4">
                                <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md text-xs font-semibold">
                                    {user.profile}
                                </span>
                            </td>
                            <td className="px-6 py-4">{user.date}</td>
                            <td className="px-6 py-4">
                                <button className="text-slate-400 hover:text-slate-600">
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminUsers;