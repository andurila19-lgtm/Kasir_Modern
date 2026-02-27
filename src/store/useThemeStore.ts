import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    applyTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            theme: 'system',
            setTheme: (theme) => {
                set({ theme });
                get().applyTheme();
            },
            applyTheme: () => {
                const { theme } = get();
                if (typeof window === 'undefined') return;

                const root = window.document.documentElement;

                const update = (isDark: boolean) => {
                    if (isDark) {
                        root.classList.add('dark');
                    } else {
                        root.classList.remove('dark');
                    }
                };

                if (theme === 'system') {
                    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                    update(mediaQuery.matches);

                    // Listen for changes
                    mediaQuery.onchange = (e) => {
                        if (get().theme === 'system') update(e.matches);
                    };
                } else {
                    update(theme === 'dark');
                }
            },
        }),
        {
            name: 'theme-storage',
        }
    )
);
