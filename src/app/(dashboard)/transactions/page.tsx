'use client';

import {
    Search,
    Calendar,
    Download,
    Printer,
    ChevronRight,
    CreditCard,
    Banknote,
    QrCode
} from 'lucide-react';
import { TRANSACTIONS } from '@/lib/data';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function TransactionsPage() {
    return (
        <div className="p-4 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Riwayat Transaksi</h1>
                    <p className="text-slate-500">Lihat dan kelola semua riwayat penjualan Anda.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border dark:border-slate-800 rounded-xl text-sm font-medium hover:bg-white dark:hover:bg-slate-900 transition-colors">
                        <Download size={18} />
                        Ekspor CSV
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20">
                        <Printer size={18} />
                        Cetak Laporan
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Cari ID Transaksi..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Pilih Tanggal..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500 appearance-none">
                    <option>Semua Metode Pembayaran</option>
                    <option>Tunai</option>
                    <option>QRIS</option>
                    <option>Transfer Bank</option>
                </select>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden text-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-bold border-b dark:border-slate-800">
                                <th className="px-6 py-4">ID Transaksi</th>
                                <th className="px-6 py-4">Waktu</th>
                                <th className="px-6 py-4">Kasir</th>
                                <th className="px-6 py-4">Metode</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-slate-800">
                            {TRANSACTIONS.map((trx) => (
                                <tr key={trx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="font-bold text-blue-600 dark:text-blue-400">{trx.id}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {formatDate(trx.createdAt)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                                                {trx.cashierName.charAt(0)}
                                            </div>
                                            <span>{trx.cashierName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {trx.paymentMethod === 'CASH' && <Banknote size={16} className="text-green-500" />}
                                            {trx.paymentMethod === 'QRIS' && <QrCode size={16} className="text-blue-500" />}
                                            {trx.paymentMethod === 'TRANSFER' && <CreditCard size={16} className="text-purple-500" />}
                                            <span>{trx.paymentMethod}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap font-bold">
                                        {formatCurrency(trx.total)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium">
                                            Detail
                                            <ChevronRight size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
