'use client';

import { create } from 'zustand';

interface AlertState {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    showAlert: (config: {
        title: string;
        message: string;
        onConfirm?: () => void;
        confirmText?: string;
        cancelText?: string;
        variant?: 'danger' | 'warning' | 'info';
    }) => void;
    hideAlert: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { },
    onCancel: () => { },
    confirmText: 'Ya, Lanjutkan',
    cancelText: 'Batal',
    variant: 'info',

    showAlert: (config) => set({
        isOpen: true,
        title: config.title,
        message: config.message,
        onConfirm: () => {
            if (config.onConfirm) config.onConfirm();
            set({ isOpen: false });
        },
        onCancel: () => set({ isOpen: false }),
        confirmText: config.confirmText || 'Ya, Lanjutkan',
        cancelText: config.cancelText || 'Batal',
        variant: config.variant || 'info',
    }),

    hideAlert: () => set({ isOpen: false }),
}));
