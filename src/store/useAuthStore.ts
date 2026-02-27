import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Role } from '@/types';
import { supabase } from '@/lib/supabase';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isAdmin: () => boolean;
    isInitialized: boolean;
    initialize: () => Promise<void>;
    login: (email: string, password: string) => Promise<{ error: string | null }>;
    logout: () => Promise<void>;
    setUser: (user: User | null) => void;
    updateProfile: (name: string) => Promise<{ error: string | null }>;
    updatePassword: (password: string) => Promise<{ error: string | null }>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isInitialized: false,
            isAdmin: () => get().user?.role === 'ADMIN',

            initialize: async () => {
                try {
                    const { data: { session } } = await supabase.auth.getSession();

                    if (session?.user) {
                        const { data: profile } = await supabase
                            .from('profiles')
                            .select('role, name')
                            .eq('id', session.user.id)
                            .single();

                        const user: User = {
                            id: session.user.id,
                            name: profile?.name || session.user.email?.split('@')[0] || 'User',
                            email: session.user.email || '',
                            role: (profile?.role as Role) || 'CASHIER',
                        };
                        set({ user, isAuthenticated: true, isInitialized: true });
                    } else {
                        set({ user: null, isAuthenticated: false, isInitialized: true });
                    }
                } catch (error) {
                    console.error('Initialization error:', error);
                    set({ isInitialized: true });
                }
            },

            login: async (email, password) => {
                try {
                    const { data, error } = await supabase.auth.signInWithPassword({
                        email,
                        password,
                    });

                    if (error) throw error;

                    if (data.user) {
                        // Fetch role from profiles table
                        const { data: profile } = await supabase
                            .from('profiles')
                            .select('role, name')
                            .eq('id', data.user.id)
                            .single();

                        const user: User = {
                            id: data.user.id,
                            name: profile?.name || data.user.email?.split('@')[0] || 'User',
                            email: data.user.email || '',
                            role: (profile?.role as Role) || 'CASHIER',
                        };

                        set({ user, isAuthenticated: true });
                        return { error: null };
                    }
                    return { error: 'Gagal mendapatkan data user' };
                } catch (err: any) {
                    console.error('Login error:', err.message);
                    return { error: err.message };
                }
            },

            logout: async () => {
                await supabase.auth.signOut();
                set({ user: null, isAuthenticated: false });
            },

            setUser: (user) => set({ user, isAuthenticated: !!user }),

            updateProfile: async (name) => {
                const currentUser = get().user;
                if (!currentUser) return { error: 'Not authenticated' };

                try {
                    const { error } = await supabase
                        .from('profiles')
                        .update({ name })
                        .eq('id', currentUser.id);

                    if (error) throw error;

                    set({
                        user: { ...currentUser, name }
                    });

                    return { error: null };
                } catch (err: any) {
                    console.error('Update profile error:', err.message);
                    return { error: err.message };
                }
            },
            updatePassword: async (password) => {
                try {
                    const { error } = await supabase.auth.updateUser({ password });
                    if (error) throw error;
                    return { error: null };
                } catch (err: any) {
                    console.error('Update password error:', err.message);
                    return { error: err.message };
                }
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);
