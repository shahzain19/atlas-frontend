import React, { useState, useEffect } from 'react';
import { api } from '../../api';

interface APIKey {
    id: number;
    name: string;
    last_used_at: string | null;
    created_at: string;
}

export const APIKeyManager: React.FC = () => {
    const [keys, setKeys] = useState<APIKey[]>([]);
    const [loading, setLoading] = useState(true);
    const [newKeyName, setNewKeyName] = useState('');
    const [generatedKey, setGeneratedKey] = useState<{ key: string, message: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchKeys = async () => {
        try {
            const data = await api.keys.list();
            setKeys(data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load API keys');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKeys();
    }, []);

    const handleCreateKey = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newKeyName.trim()) return;

        try {
            const data = await api.keys.create(newKeyName);
            setGeneratedKey({ key: data.key, message: data.message });
            setNewKeyName('');
            fetchKeys();
        } catch (err) {
            setError('Failed to create API key');
        }
    };

    const handleDeleteKey = async (id: number) => {
        if (!confirm('Are you sure you want to revoke this API key? Apps using it will immediately lose access.')) return;

        try {
            await api.keys.delete(id);
            fetchKeys();
        } catch (err) {
            setError('Failed to revoke API key');
        }
    };

    return (
        <div className="bg-white border border-black/[0.03] rounded-3xl overflow-hidden">
            <div className="p-8 border-b border-black/[0.03]">
                <h2 className="text-xl font-serif font-black tracking-tight mb-2">Cryptographic Credentials</h2>
                <p className="text-[11px] text-neutral-400 uppercase tracking-widest leading-relaxed">Manage programmatic access tokens for secure intelligence indexing.</p>
            </div>

            <div className="p-8">
                {error && (
                    <div className="mb-8 p-4 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest rounded-xl border border-red-100">
                        Error: {error}
                    </div>
                )}

                {generatedKey && (
                    <div className="mb-8 p-6 bg-emerald-50 border border-emerald-100 rounded-2xl animate-in zoom-in-95 duration-500">
                        <h3 className="text-emerald-900 font-serif font-black mb-1">Authorization Token Generated</h3>
                        <p className="text-emerald-700 text-xs mb-4 opacity-80">{generatedKey.message}</p>
                        <div className="flex gap-3">
                            <code className="flex-1 p-3 bg-white border border-emerald-200 rounded-xl font-mono text-sm break-all select-all shadow-sm">
                                {generatedKey.key}
                            </code>
                            <button
                                onClick={() => setGeneratedKey(null)}
                                className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
                            >
                                Secure Content
                            </button>
                        </div>
                    </div>
                )}

                <form onSubmit={handleCreateKey} className="mb-10 flex gap-3">
                    <input
                        type="text"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        placeholder="Namespace / Application (e.g. CLI_BOT_01)"
                        className="flex-1 px-5 py-3 bg-neutral-50 border border-black/[0.03] rounded-2xl focus:outline-none focus:border-black/10 focus:bg-white transition-all text-sm placeholder:text-neutral-300 font-mono"
                        required
                    />
                    <button
                        type="submit"
                        className="px-8 py-3 bg-black text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all active:scale-95"
                    >
                        Issue Token
                    </button>
                </form>

                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-12 text-neutral-300 animate-pulse font-mono text-[9px] uppercase tracking-[0.3em]">
                            Decrypting credential store...
                        </div>
                    ) : keys.length === 0 ? (
                        <div className="text-center py-12 bg-neutral-50 rounded-2xl border border-dashed border-black/5 text-neutral-400 text-[10px] uppercase tracking-widest font-bold">
                            No active intelligence tokens found.
                        </div>
                    ) : (
                        <div className="overflow-hidden border border-black/[0.03] rounded-2xl">
                            <table className="w-full text-left">
                                <thead className="bg-black/[0.02]">
                                    <tr>
                                        <th className="py-4 px-6 text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-400">Identity</th>
                                        <th className="py-4 px-6 text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-400">Last Retrieval</th>
                                        <th className="py-4 px-6 text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-400 text-right">Control</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {keys.map((key) => (
                                        <tr key={key.id} className="border-b border-black/[0.03] hover:bg-neutral-50/50 transition-colors last:border-0 group">
                                            <td className="py-5 px-6 font-bold text-sm tracking-tight">{key.name}</td>
                                            <td className="py-5 px-6 text-[10px] text-neutral-400 font-mono">
                                                {key.last_used_at ? new Date(key.last_used_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'STALE'}
                                            </td>
                                            <td className="py-5 px-6 text-right">
                                                <button
                                                    onClick={() => handleDeleteKey(key.id)}
                                                    className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-300 hover:text-red-500 transition-colors"
                                                >
                                                    Revoke
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-8 bg-black/[0.02] border-t border-black/[0.03]">
                <h4 className="text-[9px] font-bold uppercase tracking-[0.3em] text-neutral-300 mb-6">Integration Protocol</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4 font-mono text-[10px] text-neutral-500">
                        <div className="flex justify-between border-b border-black/[0.05] pb-2">
                            <span className="text-neutral-300">HEADER</span>
                            <span className="text-neutral-900 font-bold">x-api-key</span>
                        </div>
                        <div className="flex justify-between border-b border-black/[0.05] pb-2">
                            <span className="text-neutral-300">METHOD</span>
                            <span className="text-neutral-900 font-bold uppercase">post</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-[9px] font-bold uppercase tracking-widest text-neutral-300 mb-2">Endpoint</div>
                        <code className="block p-3 bg-white border border-black/[0.03] rounded-xl text-[10px] font-mono text-neutral-800 break-all">
                            /api/content
                        </code>
                    </div>
                </div>
            </div>
        </div>
    );
};
