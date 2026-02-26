import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Role } from '@/types';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, role: Role) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            login: (email, role) => {
                const mockUser: User = {
                    id: '1',
                    name: role === 'ADMIN' ? 'Ahmad Admin' : 'Budi Kasir',
                    email,
                    role,
                };
                set({ user: mockUser, isAuthenticated: true });
            },
            logout: () => set({ user: null, isAuthenticated: false }),
        }),
        {
            name: 'auth-storage',
        }
    )
);
