'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    History,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    ArrowLeftRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export const MENU_ITEMS = [
    { icon: LayoutDashboard, label: 'Beranda', href: '/dashboard', adminOnly: true },
    { icon: ShoppingCart, label: 'Point of Sale', href: '/pos', adminOnly: false },
    { icon: Package, label: 'Stok Produk', href: '/products', adminOnly: true },
    { icon: ArrowLeftRight, label: 'Mutasi Stok', href: '/mutations', adminOnly: true },
    { icon: History, label: 'Riwayat Order', href: '/transactions', adminOnly: false },
    { icon: TrendingUp, label: 'Laporan Laba', href: '/reports', adminOnly: true },
    { icon: Settings, label: 'Konfigurasi', href: '/settings', adminOnly: false },
];

interface SidebarProps {
    onCloseMobile?: () => void;
}

export function Sidebar({ onCloseMobile }: SidebarProps) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const logout = useAuthStore((state) => state.logout);
    const isAdmin = useAuthStore((state) => state.isAdmin);
    const user = useAuthStore((state) => state.user);

    const filteredItems = MENU_ITEMS.filter(item => !item.adminOnly || isAdmin());

    return (
        <aside
            className={cn(
                "bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col h-full",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 h-16">
                {!isCollapsed && (
                    <div className="flex items-center gap-2 font-bold text-xl text-blue-600 dark:text-blue-400">
                        <div className="bg-blue-600 text-white p-1 rounded-lg">
                            <ShoppingCart size={20} />
                        </div>
                        <span>KasirPro</span>
                    </div>
                )}
                {isCollapsed && (
                    <div className="mx-auto bg-blue-600 text-white p-2 rounded-lg">
                        <ShoppingCart size={20} />
                    </div>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hidden md:block"
                >
                    {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>

            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {filteredItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 p-3 rounded-xl transition-all group",
                                isActive
                                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                                    : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                            )}
                            onClick={onCloseMobile}
                        >
                            <item.icon size={22} className={cn(isActive ? "text-blue-600" : "group-hover:text-slate-700 dark:group-hover:text-slate-300")} />
                            {!isCollapsed && <span>{item.label}</span>}
                            {isActive && !isCollapsed && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-3 border-t border-slate-100 dark:border-slate-800">
                {!isCollapsed && user && (
                    <div className="flex items-center gap-3 px-3 py-4 mb-2">
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                            {user.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate dark:text-slate-200">{user.name}</p>
                            <p className="text-xs text-slate-500 truncate capitalize">{user.role.toLowerCase()}</p>
                        </div>
                    </div>
                )}
                <button
                    onClick={logout}
                    className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all",
                        isCollapsed && "justify-center"
                    )}
                >
                    <LogOut size={22} />
                    {!isCollapsed && <span>Keluar</span>}
                </button>
            </div>
        </aside>
    );
}
