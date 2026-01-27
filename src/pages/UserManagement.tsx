import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { api } from '../api';

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    created_at: string;
}

export const UserManagement: React.FC = () => {
    const { user: currentUser } = useAuthStore();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<number | null>(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await api.users.getAll();
            setUsers(data);
        } catch (error) {
            console.error('Failed to load users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId: number, newRole: string) => {
        setUpdating(userId);
        try {
            await api.users.updateRole(userId, newRole);
            await loadUsers();
        } catch (error: any) {
            alert(error.response?.data?.error || 'Failed to update role');
        } finally {
            setUpdating(null);
        }
    };

    const handleDeleteUser = async (userId: number, username: string) => {
        if (!confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
            return;
        }

        try {
            await api.users.delete(userId);
            await loadUsers();
        } catch (error: any) {
            alert(error.response?.data?.error || 'Failed to delete user');
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin':
                return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'contributor':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'viewer':
                return 'bg-neutral-100 text-neutral-700 border-neutral-200';
            default:
                return 'bg-neutral-100 text-neutral-700 border-neutral-200';
        }
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto p-10">
                <div className="text-center py-20 text-neutral-400 font-mono text-sm">
                    Loading users...
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-10 min-h-screen">
            <header className="mb-12">
                <div className="flex items-baseline justify-between mb-4">
                    <h1 className="text-4xl font-serif font-black">User Management</h1>
                    <span className="text-xs font-mono text-neutral-400">ADMIN_PANEL</span>
                </div>
                <p className="text-neutral-600">
                    Manage user roles and permissions across the Atlas platform.
                </p>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="p-6 bg-white border border-black/5 rounded-xl">
                    <div className="text-3xl font-bold mb-2">{users.length}</div>
                    <div className="text-sm text-neutral-500 uppercase tracking-wide font-mono">Total Users</div>
                </div>
                <div className="p-6 bg-white border border-black/5 rounded-xl">
                    <div className="text-3xl font-bold mb-2">{users.filter(u => u.role === 'contributor').length}</div>
                    <div className="text-sm text-neutral-500 uppercase tracking-wide font-mono">Contributors</div>
                </div>
                <div className="p-6 bg-white border border-black/5 rounded-xl">
                    <div className="text-3xl font-bold mb-2">{users.filter(u => u.role === 'admin').length}</div>
                    <div className="text-sm text-neutral-500 uppercase tracking-wide font-mono">Admins</div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white border border-black/5 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-neutral-50 border-b border-black/5">
                        <tr>
                            <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-neutral-700">
                                User
                            </th>
                            <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-neutral-700">
                                Email
                            </th>
                            <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-neutral-700">
                                Role
                            </th>
                            <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-neutral-700">
                                Joined
                            </th>
                            <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-widest text-neutral-700">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-b border-black/5 last:border-0 hover:bg-neutral-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                                            {user.username[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-medium">{user.username}</div>
                                            {user.id === currentUser?.id && (
                                                <span className="text-xs text-neutral-500">(You)</span>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-neutral-600">{user.email}</td>
                                <td className="px-6 py-4">
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        disabled={updating === user.id || user.id === currentUser?.id}
                                        className={`px-3 py-1 rounded-full text-xs font-bold border ${getRoleBadgeColor(
                                            user.role
                                        )} disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        <option value="viewer">Viewer</option>
                                        <option value="contributor">Contributor</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 text-sm text-neutral-600 font-mono">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {user.id !== currentUser?.id && (
                                        <button
                                            onClick={() => handleDeleteUser(user.id, user.username)}
                                            className="text-xs font-bold uppercase tracking-widest text-red-600 hover:text-red-800 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Info */}
            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                    <span className="font-bold">Role Hierarchy:</span> Admins have full platform control, Contributors can create content, and Viewers can only browse.
                </p>
            </div>
        </div>
    );
};
