'use client';

import {
    TrendingUp,
    Users,
    ShoppingBag,
    ChevronRight,
    ArrowUpRight,
    BarChart3,
    PieChart as PieChartIcon,
    AlertCircle,
    Download,
    Printer,
    FileSpreadsheet,
    FileText,
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie
} from 'recharts';
import { formatCurrency, cn } from '@/lib/utils';
import { useTransactionStore } from '@/store/useTransactionStore';
import { useProductStore } from '@/store/useProductStore';
import { useAlertStore } from '@/store/useAlertStore';
import { useState, useMemo, useRef } from 'react';
import {
    startOfDay,
    startOfWeek,
    startOfMonth,
    startOfYear,
    isAfter,
    subDays,
    format
} from 'date-fns';
import { useReactToPrint } from 'react-to-print';

type FilterType = 'Hari' | 'Minggu' | 'Bulan' | 'Tahun' | 'Semua';

export default function ReportsPage() {
    const { transactions } = useTransactionStore();
    const { products } = useProductStore();
    const { showAlert } = useAlertStore();
    const [filter, setFilter] = useState<FilterType>('Semua');
    const reportRef = useRef<HTMLDivElement>(null);

    const filteredTransactions = useMemo(() => {
        const now = new Date();
        return transactions.filter(trx => {
            const trxDate = new Date(trx.createdAt);
            if (filter === 'Hari') return isAfter(trxDate, startOfDay(now));
            if (filter === 'Minggu') return isAfter(trxDate, startOfWeek(now));
            if (filter === 'Bulan') return isAfter(trxDate, startOfMonth(now));
            if (filter === 'Tahun') return isAfter(trxDate, startOfYear(now));
            return true;
        });
    }, [transactions, filter]);

    // Calculations based on filtered data
    const totalRevenue = filteredTransactions.reduce((acc, trx) => acc + trx.total, 0);
    const totalTransactions = filteredTransactions.length;
    const lowStockCount = products.filter(p => p.stock <= 5).length;
    const avgOrderValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

    // Revenue by Category
    const categoryData = useMemo(() => {
        const categoryMap: Record<string, number> = {};
        filteredTransactions.forEach(trx => {
            trx.items.forEach(item => {
                const cat = item.categoryName || 'Lainnya';
                categoryMap[cat] = (categoryMap[cat] || 0) + (item.price * item.quantity);
            });
        });

        return Object.entries(categoryMap).map(([name, value], index) => ({
            name,
            value,
            color: ['#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#ec4899'][index % 5]
        }));
    }, [filteredTransactions]);

    // Payment Method Distribution
    const barData = useMemo(() => {
        const methodMap: Record<string, number> = { CASH: 0, QRIS: 0, TRANSFER: 0 };
        filteredTransactions.forEach(trx => {
            methodMap[trx.paymentMethod] = (methodMap[trx.paymentMethod] || 0) + trx.total;
        });

        return [
            { name: 'Tunai', value: methodMap.CASH },
            { name: 'QRIS', value: methodMap.QRIS },
            { name: 'Transfer', value: methodMap.TRANSFER },
        ];
    }, [filteredTransactions]);

    const handleExportPDF = () => {
        if (filteredTransactions.length === 0) return;

        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.setTextColor(59, 130, 246);
        doc.text('Laporan Transaksi KasirPro', 14, 20);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Periode: ${filter}`, 14, 30);
        doc.text(`Tanggal Cetak: ${format(new Date(), 'dd/mm/yyyy HH:mm')}`, 14, 35);
        doc.text(`Total Transaksi: ${totalTransactions}`, 14, 40);
        doc.text(`Total Pendapatan: ${formatCurrency(totalRevenue)}`, 14, 45);

        const tableColumn = ['ID Transaksi', 'Waktu', 'Kasir', 'Total', 'Pajak', 'Metode'];
        const tableRows = filteredTransactions.map(trx => [
            trx.id,
            format(new Date(trx.createdAt), 'dd/MM/yy HH:mm'),
            trx.cashierName,
            formatCurrency(trx.total),
            formatCurrency(trx.tax),
            trx.paymentMethod
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 55,
            theme: 'striped',
            headStyles: { fillColor: [59, 130, 246], fontStyle: 'bold' },
            styles: { fontSize: 8, cellPadding: 3 },
            alternateRowStyles: { fillColor: [248, 250, 252] }
        });

        doc.save(`Laporan-KasirPro-${filter}-${format(new Date(), 'yyyyMMdd')}.pdf`);
    };

    const handleExportCSV = () => {
        if (filteredTransactions.length === 0) return;

        const headers = ['ID Transaksi', 'Waktu', 'Kasir', 'Total', 'Pajak', 'Metode Pembayaran'];
        const rows = filteredTransactions.map(trx => [
            trx.id,
            format(new Date(trx.createdAt), 'yyyy-MM-dd HH:mm:ss'),
            trx.cashierName,
            trx.total,
            trx.tax,
            trx.paymentMethod
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `Laporan-KasirPro-${filter}-${format(new Date(), 'yyyyMMdd')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePrint = useReactToPrint({
        contentRef: reportRef,
        documentTitle: `Laporan-KasirPro-${filter}`,
    });

    return (
        <div className="p-4 md:p-8 space-y-8 pb-12">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Laporan & Analitik</h1>
                    <p className="text-slate-500">Analisis bisnis Anda berdasarkan periode tertentu.</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                        {(['Hari', 'Minggu', 'Bulan', 'Tahun', 'Semua'] as FilterType[]).map((t) => (
                            <button
                                key={t}
                                onClick={() => setFilter(t)}
                                className={cn(
                                    "px-5 py-2.5 rounded-xl text-sm font-bold transition-all",
                                    filter === t
                                        ? "bg-white dark:bg-slate-700 shadow-lg shadow-black/5 text-blue-600 dark:text-blue-400"
                                        : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                )}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => showAlert({
                                title: 'Cetak Laporan?',
                                message: 'Laporan akan disiapkan untuk pencetakan. Pastikan printer Anda sudah siap.',
                                onConfirm: () => handlePrint(),
                                confirmText: 'Ya, Cetak'
                            })}
                            className="flex items-center gap-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-5 py-3 rounded-2xl font-bold text-sm border border-slate-200 dark:border-slate-800 hover:bg-slate-100 transition-all shadow-sm"
                        >
                            <Printer size={18} />
                            Cetak Laporan
                        </button>
                        <button
                            onClick={() => showAlert({
                                title: 'Ekspor Data?',
                                message: `Data transaksi untuk periode "${filter}" akan diunduh dalam format CSV.`,
                                onConfirm: handleExportCSV,
                                confirmText: 'Unduh CSV'
                            })}
                            className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 rounded-2xl font-bold text-sm hover:bg-emerald-50 transition-all border border-emerald-100 dark:border-emerald-800"
                        >
                            <FileSpreadsheet size={18} />
                            CSV
                        </button>
                        <button
                            onClick={() => showAlert({
                                title: 'Ekspor PDF?',
                                message: `Dokumen laporan untuk periode "${filter}" akan dibuat dalam format PDF.`,
                                onConfirm: handleExportPDF,
                                confirmText: 'Buat PDF'
                            })}
                            className="flex items-center gap-2 px-5 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl font-bold text-sm hover:bg-blue-100 transition-all border border-blue-100 dark:border-blue-800"
                        >
                            <FileText size={18} />
                            PDF
                        </button>
                    </div>
                </div>
            </div>

            <div ref={reportRef} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group transition-all hover:shadow-md">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600">
                                <TrendingUp size={28} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-widest font-black">Total Pendapatan</p>
                                <p className="text-3xl font-black tracking-tight">{formatCurrency(totalRevenue)}</p>
                            </div>
                        </div>
                        <div className="flex items-center text-[10px] text-green-600 font-black bg-green-50 dark:bg-green-900/20 w-fit px-3 py-1.5 rounded-lg uppercase tracking-wider">
                            <ArrowUpRight size={14} className="mr-1" />
                            Periode {filter}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3.5 rounded-2xl bg-orange-50 dark:bg-orange-900/20 text-orange-600">
                                <ShoppingBag size={28} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-widest font-black">Rata-rata Pesanan</p>
                                <p className="text-3xl font-black tracking-tight">{formatCurrency(avgOrderValue)}</p>
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Berdasarkan {totalTransactions} Transaksi</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600">
                                <AlertCircle size={28} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-widest font-black">Stok Menipis</p>
                                <p className="text-3xl font-black tracking-tight">{lowStockCount}</p>
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Perlu Perhatian Segera</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-lg font-black flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-500/20">
                                    <PieChartIcon size={20} />
                                </div>
                                Penjualan per Kategori
                            </h2>
                        </div>
                        <div className="h-[350px] w-full">
                            {categoryData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoryData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={90}
                                            outerRadius={120}
                                            paddingAngle={8}
                                            dataKey="value"
                                        >
                                            {categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip
                                            formatter={(value) => formatCurrency(value as number)}
                                            contentStyle={{
                                                borderRadius: '20px',
                                                border: 'none',
                                                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                                fontWeight: 'bold',
                                                padding: '12px 20px'
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
                                    <AlertCircle size={48} className="opacity-10" />
                                    <p className="font-bold text-sm tracking-widest uppercase opacity-40">Belum ada data</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-lg font-black flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-emerald-600 text-white shadow-lg shadow-emerald-500/20">
                                    <BarChart3 size={20} />
                                </div>
                                Pendapatan per Metode
                            </h2>
                        </div>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.3} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 'bold' }} />
                                    <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `Rp${v / 1000}k`} tick={{ fontSize: 12, fontWeight: 'bold' }} />
                                    <RechartsTooltip
                                        formatter={(value) => formatCurrency(value as number)}
                                        contentStyle={{
                                            borderRadius: '20px',
                                            border: 'none',
                                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                            fontWeight: 'bold',
                                            padding: '12px 20px'
                                        }}
                                    />
                                    <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={60}>
                                        {barData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.name === 'Tunai' ? '#10b981' : entry.name === 'QRIS' ? '#3b82f6' : '#6366f1'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
