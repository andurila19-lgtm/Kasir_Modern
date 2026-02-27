'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuthStore } from '@/store/useAuthStore';
import { useProductStore } from '@/store/useProductStore';
import { useTransactionStore } from '@/store/useTransactionStore';
import { useThemeStore } from '@/store/useThemeStore';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, isInitialized, initialize } = useAuthStore();
    const { fetchProducts } = useProductStore();
    const { fetchTransactions } = useTransactionStore();
    const { applyTheme } = useThemeStore();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
        applyTheme();

        if (!isInitialized) {
            initialize();
        }
    }, [isInitialized, initialize, applyTheme]);

    useEffect(() => {
        if (mounted && isInitialized) {
            if (!isAuthenticated) {
                router.push('/');
            } else {
                fetchProducts();
                fetchTransactions();
            }
        }
    }, [isAuthenticated, isInitialized, mounted, router, fetchProducts, fetchTransactions]);

    if (!mounted || !isInitialized) {
        return (
            <div className="flex items-center justify-center h-screen bg-white dark:bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center text-blue-600">
                            <Menu size={18} className="animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden">
            {/* Mobile Header / Burger */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-b dark:border-slate-800 z-[60] flex items-center px-4 justify-between">
                <div className="flex items-center gap-2 font-bold text-blue-600">
                    <span className="bg-blue-600 text-white p-1 rounded-lg">PRO</span>
                    <span>KasirPro</span>
                </div>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400"
                >
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Overlay for Mobile */}
            <div
                className={cn(
                    "fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70] transition-opacity duration-300 lg:hidden",
                    isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsSidebarOpen(false)}
            />

            {/* Sidebar */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-[80] transition-transform duration-300 transform lg:relative lg:translate-x-0 lg:z-auto",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <Sidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0 flex flex-col h-full bg-slate-50 dark:bg-slate-950 pt-16 lg:pt-0">
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
