import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: 'admin' | 'contributor' | 'viewer';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Check role if required
    if (requiredRole && user) {
        const roleHierarchy = { viewer: 0, contributor: 1, admin: 2 };
        const userLevel = roleHierarchy[user.role];
        const requiredLevel = roleHierarchy[requiredRole];

        if (userLevel < requiredLevel) {
            return (
                <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6">
                    <div className="text-center">
                        <h1 className="text-3xl font-serif font-black mb-4">Access Denied</h1>
                        <p className="text-neutral-500 mb-6">
                            You need <span className="font-bold">{requiredRole}</span> role to access this page.
                        </p>
                        <p className="text-sm text-neutral-400 font-mono">
                            Current role: <span className="text-black font-bold">{user.role}</span>
                        </p>
                    </div>
                </div>
            );
        }
    }

    return <>{children}</>;
};
