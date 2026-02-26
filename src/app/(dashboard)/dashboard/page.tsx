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
import { getDashboardStats } from '@/lib/data';
import { formatCurrency, cn } from '@/lib/utils';

export default function DashboardPage() {
    const stats = getDashboardStats();

    const cards = [
        {
            title: 'Pendapatan Hari Ini',
            value: formatCurrency(stats.todayRevenue),
            icon: DollarSign,
            trend: '+12.5%',
            trendUp: true,
            color: 'bg-green-500',
        },
        {
            title: 'Transaksi Hari Ini',
            value: stats.todayTransactions.toString(),
            icon: ShoppingCart,
            trend: '+8.2%',
            trendUp: true,
            color: 'bg-blue-500',
        },
        {
            title: 'Stok Menipis',
            value: stats.lowStockProducts.toString(),
            icon: Package,
            trend: '-2',
            trendUp: false,
            color: 'bg-orange-500',
        },
        {
            title: 'Total Produk',
            value: stats.totalProducts.toString(),
            icon: TrendingUp,
            trend: '+4.1%',
            trendUp: true,
            color: 'bg-purple-500',
        },
    ];

    return (
        <div className="p-4 md:p-8 space-y-8">
            <div>
                <h1 className="text-2xl font-bold">Ringkasan Penjualan</h1>
                <p className="text-slate-500">Selamat datang kembali! Berikut adalah statistik terbaru hari ini.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => (
                    <div key={card.title} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                        <div className="flex justify-between items-start mb-4">
                            <div className={cn("p-3 rounded-xl text-white", card.color)}>
                                <card.icon size={24} />
                            </div>
                            <div className={cn(
                                "flex items-center text-xs font-medium px-2 py-1 rounded-full",
                                card.trendUp ? "bg-green-50 text-green-600 dark:bg-green-900/20" : "bg-red-50 text-red-600 dark:bg-red-900/20"
                            )}>
                                {card.trendUp ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                                {card.trend}
                            </div>
                        </div>
                        <h3 className="text-slate-500 text-sm mb-1">{card.title}</h3>
                        <p className="text-2xl font-bold">{card.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <h2 className="text-lg font-bold mb-6">Tren Pendapatan 7 Hari Terakhir</h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.revenueByDay}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `Rp${v / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => formatCurrency(value as number)}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <h2 className="text-lg font-bold mb-6">Produk Terlaris</h2>
                    <div className="space-y-6">
                        {stats.bestSellingProducts.map((product, idx) => (
                            <div key={product.name} className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500">
                                    {idx + 1}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-sm">{product.name}</p>
                                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 rounded-full"
                                            style={{ width: `${(product.sales / stats.bestSellingProducts[0].sales) * 100}%` }}
                                        />
                                    </div>
                                </div>
                                <p className="font-bold text-sm">{product.sales}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
