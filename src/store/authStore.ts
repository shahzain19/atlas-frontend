import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: number;
    username: string;
    email: string;
    role: 'admin' | 'contributor' | 'viewer';
    onboarding_completed?: boolean;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            login: (token: string, user: User) => {
                set({ token, user, isAuthenticated: true });
            },

            logout: () => {
                set({ token: null, user: null, isAuthenticated: false });
            },

            updateUser: (user: User) => {
                set({ user });
            },
        }),
        {
            name: 'atlas-auth-storage',
        }
    )
);
