'use client';

import { useState } from 'react';
import { useStockMutationStore } from '@/store/useStockMutationStore';
import { useProductStore } from '@/store/useProductStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Search, Plus, ArrowDownToLine, ArrowUpToLine, RotateCcw, Box } from 'lucide-react';
import { formatDate, cn } from '@/lib/utils';
import { MutationType } from '@/types';

export default function MutationsPage() {
    const { mutations, addMutation, loading } = useStockMutationStore();
    const { products } = useProductStore();
    const { user } = useAuthStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<MutationType | 'ALL'>('ALL');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Modal state
    const [selectedProductId, setSelectedProductId] = useState('');
    const [mutationType, setMutationType] = useState<MutationType>('IN');
    const [quantity, setQuantity] = useState('');
    const [note, setNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const filteredMutations = mutations.filter((mut) => {
        const matchesSearch = mut.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (mut.note && mut.note.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesType = filterType === 'ALL' || mut.type === filterType;
        return matchesSearch && matchesType;
    });

    const getMutationIcon = (type: MutationType) => {
        switch (type) {
            case 'IN': return <ArrowDownToLine size={16} className="text-emerald-500" />;
            case 'OUT': return <ArrowUpToLine size={16} className="text-red-500" />;
            case 'RETURN': return <RotateCcw size={16} className="text-blue-500" />;
        }
    };

    const getMutationLabel = (type: MutationType) => {
        switch (type) {
            case 'IN': return 'Masuk';
            case 'OUT': return 'Keluar';
            case 'RETURN': return 'Retur';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProductId || !quantity || !user) return;

        setIsSubmitting(true);
        try {
            const product = products.find(p => p.id === selectedProductId);
            if (!product) throw new Error('Produk tidak ditemukan');

            if (mutationType === 'OUT' && product.stock < Number(quantity)) {
                alert(`Stok tidak mencukupi! Stok saat ini: ${product.stock}`);
                setIsSubmitting(false);
                return;
            }

            await addMutation({
                productId: product.id,
                productName: product.name,
                type: mutationType,
                quantity: Number(quantity),
                note,
                userId: user.id,
                userName: user.name,
            });

            setIsModalOpen(false);
            setSelectedProductId('');
            setQuantity('');
            setNote('');
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Mutasi Stok</h1>
                    <p className="text-slate-500">Catat dan pantau riwayat stok masuk, keluar, dan retur.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20"
                >
                    <Plus size={18} />
                    Catat Mutasi
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Cari berdasarkan nama produk atau catatan..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as MutationType | 'ALL')}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500 appearance-none outline-none"
                >
                    <option value="ALL">Semua Tipe Mutasi</option>
                    <option value="IN">Stok Masuk</option>
                    <option value="OUT">Stok Keluar</option>
                    <option value="RETURN">Retur</option>
                </select>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden text-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-bold border-b dark:border-slate-800">
                                <th className="px-6 py-4">Waktu</th>
                                <th className="px-6 py-4">Produk</th>
                                <th className="px-6 py-4">Tipe</th>
                                <th className="px-6 py-4">Kuantitas</th>
                                <th className="px-6 py-4">Pencatat</th>
                                <th className="px-6 py-4">Catatan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-slate-800">
                            {filteredMutations.map((mut) => (
                                <tr key={mut.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {mut.createdAt ? formatDate(mut.createdAt) : '-'}
                                    </td>
                                    <td className="px-6 py-4 font-bold">
                                        {mut.productName}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {getMutationIcon(mut.type)}
                                            <span className={cn(
                                                "font-semibold",
                                                mut.type === 'IN' ? 'text-emerald-600' :
                                                    mut.type === 'OUT' ? 'text-red-600' : 'text-blue-600'
                                            )}>
                                                {getMutationLabel(mut.type)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold font-mono">
                                        {mut.type === 'IN' || mut.type === 'RETURN' ? '+' : '-'}{mut.quantity}
                                    </td>
                                    <td className="px-6 py-4">
                                        {mut.userName}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 max-w-xs truncate" title={mut.note}>
                                        {mut.note || '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!loading && filteredMutations.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                            <Box size={48} className="mb-4 opacity-20" />
                            <p className="font-medium text-lg">Mutasi tidak ditemukan</p>
                            <p className="text-sm">Tidak ada riwayat mutasi stok yang sesuai.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Mutasi Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 zoom-in-95">
                        <div className="p-6 border-b dark:border-slate-800">
                            <h2 className="text-xl font-bold">Catat Mutasi Stok</h2>
                            <p className="text-sm text-slate-500 mt-1">Tambahkan riwayat perubahan stok barang</p>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Produk</label>
                                <select
                                    required
                                    value={selectedProductId}
                                    onChange={(e) => setSelectedProductId(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                >
                                    <option value="" disabled>Pilih Produk...</option>
                                    {products.map(p => (
                                        <option key={p.id} value={p.id}>{p.name} (Stok: {p.stock})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Tipe Mutasi</label>
                                    <select
                                        value={mutationType}
                                        onChange={(e) => setMutationType(e.target.value as MutationType)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    >
                                        <option value="IN">Masuk (+)</option>
                                        <option value="OUT">Keluar (-)</option>
                                        <option value="RETURN">Retur (+)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Kuantitas</label>
                                    <input
                                        required
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        placeholder="0"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Catatan Tambahan</label>
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Contoh: Barang datang dari supplier B"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none text-sm min-h-[100px] resize-none"
                                />
                            </div>

                            <div className="flex gap-3 pt-4 border-t dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-3 rounded-xl font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !selectedProductId}
                                    className="flex-1 px-4 py-3 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
