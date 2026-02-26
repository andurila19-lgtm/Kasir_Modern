'use client';

import { useState } from 'react';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
} from 'lucide-react';
import { PRODUCTS } from '@/lib/data';
import { formatCurrency, cn } from '@/lib/utils';

export default function ProductsPage() {
    const [activeTab, setActiveTab] = useState('all');

    return (
        <div className="p-4 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Manajemen Produk</h1>
                    <p className="text-slate-500">Kelola daftar produk, stok, dan kategori toko Anda.</p>
                </div>
                <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20">
                    <Plus size={20} />
                    Tambah Produk
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between">
                    <div className="flex gap-2 p-1 bg-slate-50 dark:bg-slate-800 rounded-xl w-fit">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={cn(
                                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                activeTab === 'all' ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-slate-500"
                            )}
                        >
                            Semua Produk
                        </button>
                        <button
                            onClick={() => setActiveTab('out-of-stock')}
                            className={cn(
                                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                activeTab === 'out-of-stock' ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-slate-500"
                            )}
                        >
                            Stok Habis
                        </button>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Cari berdasarkan nama atau SKU..."
                            className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm w-full md:w-64 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                                <th className="px-6 py-4">Produk</th>
                                <th className="px-6 py-4">Kategori</th>
                                <th className="px-6 py-4">Harga</th>
                                <th className="px-6 py-4">Stok</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-slate-800">
                            {PRODUCTS.map((product) => (
                                <tr key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800">
                                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm">{product.name}</p>
                                                <p className="text-xs text-slate-500">ID: PRD-{product.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-medium">
                                            {product.categoryName}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-sm">{formatCurrency(product.price)}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={cn(
                                                "w-2 h-2 rounded-full",
                                                product.stock > 10 ? "bg-green-500" : product.stock > 0 ? "bg-orange-500" : "bg-red-500"
                                            )} />
                                            <span className="text-sm font-medium">{product.stock} pcs</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-blue-600">
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-600">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
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
