'use client';

import {
    TrendingUp,
    Users,
    ShoppingBag,
    ChevronRight,
    ArrowUpRight,
    BarChart3,
    PieChart as PieChartIcon,
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie
} from 'recharts';
import { formatCurrency, cn } from '@/lib/utils';

const PIE_DATA = [
    { name: 'Makanan', value: 4500000, color: '#3b82f6' },
    { name: 'Minuman', value: 2500000, color: '#10b981' },
    { name: 'Snack', value: 1200000, color: '#f59e0b' },
    { name: 'Lainnya', value: 800000, color: '#6366f1' },
];

export default function ReportsPage() {
    return (
        <div className="p-4 md:p-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Laporan & Analitik</h1>
                    <p className="text-slate-500">Analisis mendalam performa bisnis Anda.</p>
                </div>
                <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    {['Hari', 'Minggu', 'Bulan', 'Tahun'].map((t) => (
                        <button key={t} className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                            t === 'Bulan' ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600" : "text-slate-500"
                        )}>
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Laba Bersih</p>
                            <p className="text-2xl font-bold">{formatCurrency(12450000)}</p>
                        </div>
                    </div>
                    <div className="flex items-center text-xs text-green-600 font-bold bg-green-50 dark:bg-green-900/20 w-fit px-2 py-1 rounded-full">
                        <ArrowUpRight size={14} className="mr-1" />
                        +15% dari bln lalu
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-900/20 text-purple-600">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Pelanggan Baru</p>
                            <p className="text-2xl font-bold">342</p>
                        </div>
                    </div>
                    <div className="flex items-center text-xs text-green-600 font-bold bg-green-50 dark:bg-green-900/20 w-fit px-2 py-1 rounded-full">
                        <ArrowUpRight size={14} className="mr-1" />
                        +8.2% dari bln lalu
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-2xl bg-orange-50 dark:bg-orange-900/20 text-orange-600">
                            <ShoppingBag size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Rata-rata Pesanan</p>
                            <p className="text-2xl font-bold">{formatCurrency(85000)}</p>
                        </div>
                    </div>
                    <div className="flex items-center text-xs text-red-600 font-bold bg-red-50 dark:bg-red-900/20 w-fit px-2 py-1 rounded-full">
                        -2% dari bln lalu
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <PieChartIcon size={20} className="text-blue-500" />
                            Penjualan per Kategori
                        </h2>
                        <button className="text-sm text-blue-600 font-bold flex items-center gap-1">
                            Lihat Detail <ChevronRight size={16} />
                        </button>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={PIE_DATA}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {PIE_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => formatCurrency(value as number)}
                                    contentStyle={{ borderRadius: '12px', border: 'none' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <BarChart3 size={20} className="text-blue-500" />
                            Metode Pembayaran
                        </h2>
                        <button className="text-sm text-blue-600 font-bold flex items-center gap-1">
                            Lihat Detail <ChevronRight size={16} />
                        </button>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                                { name: 'Tunai', value: 12000000 },
                                { name: 'QRIS', value: 8500000 },
                                { name: 'Transfer', value: 4200000 },
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `Rp${v / 1000000}M`} />
                                <Tooltip
                                    formatter={(value) => formatCurrency(value as number)}
                                    contentStyle={{ borderRadius: '12px', border: 'none' }}
                                />
                                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} barSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
