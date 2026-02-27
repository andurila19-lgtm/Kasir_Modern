'use client';

import { useAlertStore } from '@/store/useAlertStore';
import { cn } from '@/lib/utils';
import { AlertTriangle, Info, XCircle, CheckCircle2 } from 'lucide-react';
import { useEffect } from 'react';

export function GlobalAlert() {
    const { isOpen, title, message, onConfirm, onCancel, confirmText, cancelText, variant, hideAlert } = useAlertStore();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === 'Enter') {
                e.preventDefault();
                onConfirm();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                onCancel();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onConfirm, onCancel]);

    if (!isOpen) return null;

    const variants = {
        danger: {
            bg: 'bg-red-50 dark:bg-red-900/20',
            border: 'border-red-100 dark:border-red-800',
            text: 'text-red-600 dark:text-red-400',
            icon: XCircle,
            button: 'bg-red-600 hover:bg-red-700 shadow-red-500/20'
        },
        warning: {
            bg: 'bg-amber-50 dark:bg-amber-900/20',
            border: 'border-amber-100 dark:border-amber-800',
            text: 'text-amber-600 dark:text-amber-400',
            icon: AlertTriangle,
            button: 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20'
        },
        info: {
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            border: 'border-blue-100 dark:border-blue-800',
            text: 'text-blue-600 dark:text-blue-400',
            icon: Info,
            button: 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
        }
    };

    const currentVariant = variants[variant || 'info'];
    const Icon = currentVariant.icon;

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onCancel}
            />
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-8 pt-10 animate-in zoom-in-95 duration-300">
                <div className={cn(
                    "w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6",
                    currentVariant.bg
                )}>
                    <Icon size={40} className={currentVariant.text} />
                </div>

                <div className="text-center space-y-3 mb-8">
                    <h3 className="text-2xl font-black tracking-tight">{title}</h3>
                    <p className="text-slate-500 font-medium">{message}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                    <button
                        onClick={onCancel}
                        className="px-6 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={cn(
                            "px-6 py-4 rounded-2xl text-white font-bold shadow-lg transition-all active:scale-95",
                            currentVariant.button
                        )}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
