'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuthStore } from '@/store/useAuthStore';
import { useProductStore } from '@/store/useProductStore';
import { useTransactionStore } from '@/store/useTransactionStore';
import { useStockMutationStore } from '@/store/useStockMutationStore';
import { useThemeStore } from '@/store/useThemeStore';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BottomNav } from '@/components/layout/BottomNav';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, isInitialized, initialize } = useAuthStore();
    const { fetchProducts } = useProductStore();
    const { fetchTransactions } = useTransactionStore();
    const { fetchMutations } = useStockMutationStore();
    const { applyTheme } = useThemeStore();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

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
                fetchMutations();
            }
        }
    }, [isAuthenticated, isInitialized, mounted, router, fetchProducts, fetchTransactions, fetchMutations]);

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
            {/* Sidebar (Desktop) */}
            <div className="hidden lg:block fixed inset-y-0 left-0 z-[80] lg:relative">
                <Sidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0 flex flex-col h-full bg-slate-50 dark:bg-slate-950 pb-[72px] lg:pb-0">
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <BottomNav />
        </div>
    );
}
