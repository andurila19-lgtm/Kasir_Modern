'use client';

import {
    DollarSign,
    ShoppingCart,
    Package,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { useTransactionStore } from '@/store/useTransactionStore';
import { useProductStore } from '@/store/useProductStore';
import { formatCurrency, cn } from '@/lib/utils';
import { subDays, format, isSameDay } from 'date-fns';
import { id } from 'date-fns/locale';

export default function DashboardPage() {
    const { transactions } = useTransactionStore();
    const { products } = useProductStore();

    // Stats calculations
    const today = new Date();
    const todayTransactions = transactions.filter(trx => trx.createdAt && isSameDay(new Date(trx.createdAt), today));
    const todayRevenue = todayTransactions.reduce((acc, trx) => acc + trx.total, 0);
    const lowStockProducts = products.filter(p => p.stock <= 5);

    // Revenue Trend (7 days)
    const revenueByDay = Array.from({ length: 7 }, (_, i) => {
        const d = subDays(today, 6 - i);
        const dayRevenue = transactions
            .filter(trx => trx.createdAt && isSameDay(new Date(trx.createdAt), d))
            .reduce((acc, trx) => acc + trx.total, 0);

        return {
            day: format(d, 'EEE', { locale: id }),
            revenue: dayRevenue,
        };
    });

    // Best Selling Products
    const productSalesMap: Record<string, number> = {};
    transactions.forEach(trx => {
        trx.items.forEach(item => {
            productSalesMap[item.name] = (productSalesMap[item.name] || 0) + item.quantity;
        });
    });

    const bestSellingProducts = Object.entries(productSalesMap)
        .map(([name, sales]) => ({ name, sales }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5);

    const cards = [
        {
            title: 'Omzet Hari Ini',
            value: formatCurrency(todayRevenue),
            icon: DollarSign,
            trend: todayTransactions.length > 0 ? 'Sedang Ramai' : 'Siap Melayani',
            trendUp: true,
            color: 'bg-emerald-500',
        },
        {
            title: 'Total Transaksi',
            value: todayTransactions.length.toString(),
            icon: ShoppingCart,
            trend: `${todayTransactions.length} Order`,
            trendUp: true,
            color: 'bg-blue-600',
        },
        {
            title: 'Stok Menipis',
            value: lowStockProducts.length.toString(),
            icon: Package,
            trend: lowStockProducts.length > 0 ? 'Perlu Restock' : 'Semua Aman',
            trendUp: lowStockProducts.length === 0,
            color: 'bg-orange-500',
        },
        {
            title: 'Katalog Produk',
            value: products.length.toString(),
            icon: TrendingUp,
            trend: 'Tersedia',
            trendUp: true,
            color: 'bg-indigo-600',
        },
    ];

    return (
        <div className="p-4 md:p-8 space-y-8 pb-12">
            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                <h1 className="text-2xl font-bold tracking-tight">Ikhtisar Bisnis</h1>
                <p className="text-slate-500">Pantau performa penjualan dan stok barang Anda secara real-time.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => (
                    <div key={card.title} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                        <div className="flex justify-between items-start mb-4">
                            <div className={cn("p-3 rounded-xl text-white", card.color)}>
                                <card.icon size={24} />
                            </div>
                            <div className={cn(
                                "flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full",
                                card.trendUp ? "bg-green-50 text-green-600 dark:bg-green-900/20" : "bg-red-50 text-red-600 dark:bg-red-900/20"
                            )}>
                                {card.trend}
                            </div>
                        </div>
                        <h3 className="text-slate-500 text-xs mb-1 font-medium">{card.title}</h3>
                        <p className="text-xl font-bold">{card.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <h2 className="text-lg font-bold mb-6">Tren Pendapatan 7 Hari Terakhir</h2>
                    <div className="h-[300px] w-full">
                        {transactions.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueByDay}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => `Rp${v / 1000}k`} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        formatter={(value) => formatCurrency(value as number)}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400 italic text-sm">
                                Belum ada data transaksi untuk ditampilkan
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <h2 className="text-lg font-bold mb-6">Produk Terlaris</h2>
                    <div className="space-y-6">
                        {bestSellingProducts.length > 0 ? (
                            bestSellingProducts.map((product, idx) => (
                                <div key={product.name} className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500 text-xs">
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-xs truncate">{product.name}</p>
                                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 rounded-full"
                                                style={{ width: `${(product.sales / bestSellingProducts[0].sales) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                    <p className="font-bold text-xs">{product.sales}x</p>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 text-center text-slate-400 text-sm">
                                Belum ada data penjualan
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
