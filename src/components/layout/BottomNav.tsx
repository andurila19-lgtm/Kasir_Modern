'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import { MENU_ITEMS } from './Sidebar';

export function BottomNav() {
    const pathname = usePathname();
    const isAdmin = useAuthStore((state) => state.isAdmin);

    const filteredItems = MENU_ITEMS.filter(item => !item.adminOnly || isAdmin());

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-around px-2 pb-safe pt-2 h-[72px] shadow-[0_-4px_24px_rgba(0,0,0,0.02)] dark:shadow-none">
            {filteredItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                            isActive
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
                        )}
                    >
                        <div className={cn(
                            "p-1.5 rounded-xl transition-all",
                            isActive ? "bg-blue-50 dark:bg-blue-900/20" : "bg-transparent"
                        )}>
                            <item.icon size={22} className={cn(isActive ? "text-blue-600 dark:text-blue-400 flex-shrink-0" : "flex-shrink-0")} />
                        </div>
                        <span className={cn(
                            "text-[10px] truncate max-w-[64px] text-center",
                            isActive ? "font-bold text-blue-600 dark:text-blue-400" : "font-medium text-slate-500"
                        )}>
                            {item.label}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}
