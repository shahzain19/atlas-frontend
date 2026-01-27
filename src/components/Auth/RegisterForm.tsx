import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../api';
import { useAuthStore } from '../../store/authStore';

export const RegisterForm: React.FC = () => {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const response = await api.auth.register(username, email, password);
            login(response.token, response.user);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrength = () => {
        if (password.length === 0) return '';
        if (password.length < 6) return 'weak';
        if (password.length < 10) return 'medium';
        return 'strong';
    };

    const strength = getPasswordStrength();
    const strengthColors = {
        weak: 'bg-red-500',
        medium: 'bg-yellow-500',
        strong: 'bg-green-500',
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-serif font-black mb-2">Join Atlas</h1>
                    <p className="text-neutral-500 font-mono text-sm">BUILD_SOVEREIGN_MIND</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-black/5 shadow-lg">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-neutral-700 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="w-full p-3 border border-black/10 rounded-lg focus:outline-none focus:border-black transition-colors"
                                placeholder="sovereignmind"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-neutral-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                            {password && (
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="flex-1 h-1 bg-neutral-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all ${strength ? strengthColors[strength as keyof typeof strengthColors] : ''}`}
                                            style={{ width: strength === 'weak' ? '33%' : strength === 'medium' ? '66%' : '100%' }}
                                        />
                                    </div>
                                    <span className="text-xs font-mono uppercase text-neutral-500">{strength}</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-neutral-700 mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
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
                            {loading ? 'Creating Account...' : 'Register'}
                        </button>
                    </div>
                </form>

                <p className="text-center mt-6 text-sm text-neutral-500">
                    Already have an account?{' '}
                    <Link to="/login" className="text-black font-bold hover:underline">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};
