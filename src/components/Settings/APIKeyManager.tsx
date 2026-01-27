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
        <div className="bg-white border border-black/5 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-black/5 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-black">API Keys</h2>
                    <p className="text-sm text-neutral-500">Manage programmatic access to your Atlas node.</p>
                </div>
            </div>

            <div className="p-6">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 italic">
                        {error}
                    </div>
                )}

                {generatedKey && (
                    <div className="mb-8 p-6 bg-emerald-50 border border-emerald-100 rounded-xl animate-in zoom-in-95 duration-300">
                        <h3 className="text-emerald-900 font-bold mb-2">New API Key Created!</h3>
                        <p className="text-emerald-700 text-sm mb-4">{generatedKey.message}</p>
                        <div className="flex gap-2">
                            <code className="flex-1 p-3 bg-white border border-emerald-200 rounded font-mono text-sm break-all select-all">
                                {generatedKey.key}
                            </code>
                            <button
                                onClick={() => setGeneratedKey(null)}
                                className="px-4 py-2 bg-emerald-600 text-white rounded font-bold text-xs uppercase tracking-widest hover:bg-emerald-700 transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                )}

                <form onSubmit={handleCreateKey} className="mb-8 flex gap-3">
                    <input
                        type="text"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        placeholder="Key Name (e.g. CLI Tool, CMS Script)"
                        className="flex-1 p-3 bg-neutral-50 border border-black/5 rounded-lg focus:outline-none focus:border-black transition-colors"
                        required
                    />
                    <button
                        type="submit"
                        className="px-6 py-3 bg-black text-white rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors"
                    >
                        Generate Key
                    </button>
                </form>

                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-10 text-neutral-400 animate-pulse uppercase text-xs tracking-widest">
                            Loading secure credentials...
                        </div>
                    ) : keys.length === 0 ? (
                        <div className="text-center py-10 bg-neutral-50 rounded-lg border border-dashed border-black/10 text-neutral-400 text-sm italic">
                            No API keys generated yet.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="border-b border-black/5">
                                    <tr>
                                        <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Name</th>
                                        <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Last Used</th>
                                        <th className="py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {keys.map((key) => (
                                        <tr key={key.id} className="border-b border-black/5 hover:bg-neutral-50 transition-colors group">
                                            <td className="py-4 px-4 font-bold text-sm">{key.name}</td>
                                            <td className="py-4 px-4 text-xs text-neutral-500 font-mono">
                                                {key.last_used_at ? new Date(key.last_used_at).toLocaleString() : 'Never used'}
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <button
                                                    onClick={() => handleDeleteKey(key.id)}
                                                    className="text-[10px] font-bold uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors"
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

            <div className="p-6 bg-neutral-50 border-t border-black/5">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">How to use</h4>
                <div className="text-[11px] text-neutral-600 space-y-2 leading-relaxed font-mono">
                    <p>Header: <span className="text-black font-bold">x-api-key: YOUR_KEY</span></p>
                    <p>Endpoint: <span className="text-black font-bold">POST /api/content</span></p>
                    <p>Body: <span className="text-black font-bold">{"{ \"title\": \"...\", \"body\": \"...\", \"category\": \"...\" }"}</span></p>
                </div>
            </div>
        </div>
    );
};
