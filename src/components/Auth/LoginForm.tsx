import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../api';
import { useAuthStore } from '../../store/authStore';

export const LoginForm: React.FC = () => {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.auth.login(identifier, password);
            login(response.token, response.user);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-serif font-black mb-2">Welcome Back</h1>
                    <p className="text-neutral-500 font-mono text-sm">AUTHENTICATION_REQUIRED</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-black/5 shadow-lg">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-neutral-700 mb-2">
                                Email or Username
                            </label>
                            <input
                                type="text"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                required
                                className="w-full p-3 border border-black/10 rounded-lg focus:outline-none focus:border-black transition-colors"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-neutral-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full p-3 border border-black/10 rounded-lg focus:outline-none focus:border-black transition-colors"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600 font-medium">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-black text-white rounded-lg font-bold uppercase tracking-widest text-sm hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Authenticating...' : 'Login'}
                        </button>
                    </div>
                </form>

                <p className="text-center mt-6 text-sm text-neutral-500">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-black font-bold hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};
