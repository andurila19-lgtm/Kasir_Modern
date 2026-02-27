import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
    taxRate: number;
    storeName: string;
    storeAddress: string;
    notifications: {
        dailyReport: boolean;
        lowStock: boolean;
        securityAlerts: boolean;
    };
    setTaxRate: (rate: number) => void;
    setStoreInfo: (info: { name: string; address: string }) => void;
    toggleNotification: (key: keyof SettingsState['notifications']) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            taxRate: 11,
            storeName: 'KasirPro Store',
            storeAddress: 'Jl. Teknologi No. 404, Jakarta Pusat, DKI Jakarta 10110',
            notifications: {
                dailyReport: true,
                lowStock: true,
                securityAlerts: true,
            },
            setTaxRate: (rate) => set({ taxRate: rate }),
            setStoreInfo: (info) => set({ storeName: info.name, storeAddress: info.address }),
            toggleNotification: (key) => set((state) => ({
                notifications: {
                    ...state.notifications,
                    [key]: !state.notifications[key]
                }
            })),
        }),
        {
            name: 'settings-storage',
        }
    )
);
