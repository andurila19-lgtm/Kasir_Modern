'use client';

import { useState, useRef } from 'react';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    PackageX,
    FileUp,
    Download,
    Loader2,
    Barcode,
} from 'lucide-react';
import { useProductStore } from '@/store/useProductStore';
import { formatCurrency, cn } from '@/lib/utils';
import { ProductModal } from '@/components/products/ProductModal';
import { BarcodeScanner } from '@/components/pos/BarcodeScanner';
import { Product } from '@/types';
import Papa from 'papaparse';
import { useAlertStore } from '@/store/useAlertStore';

export default function ProductsPage() {
    const {
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        importProducts,
        loading
    } = useProductStore();
    const { showAlert } = useAlertStore();
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const filteredProducts = products.filter((product) => {
        const matchesTab = activeTab === 'all' || (activeTab === 'out-of-stock' && product.stock === 0);
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            String(product.id).toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const handleOpenAddModal = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleSave = (productData: any) => {
        if (editingProduct) {
            updateProduct(editingProduct.id, productData);
        } else {
            addProduct(productData);
        }
    };

    const handleDelete = (id: string) => {
        showAlert({
            title: 'Hapus Produk?',
            message: 'Tindakan ini tidak bisa dibatalkan. Produk akan dihapus permanen dari sistem.',
            variant: 'danger',
            confirmText: 'Ya, Hapus',
            onConfirm: () => deleteProduct(id)
        });
    };

    const handleScan = (code: string) => {
        setSearchQuery(code);
        showAlert({ title: 'Barcode Dipindai', message: `Mencari produk dengan kode: ${code}`, variant: 'info' });
    };

    const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results: Papa.ParseResult<any>) => {
                const data = results.data;
                if (data.length === 0) {
                    alert('File CSV kosong atau format tidak valid.');
                    return;
                }

                // Map header names to expected property names (if necessary)
                // Expected headers: name, price, stock, categoryName, description, image
                const mappedData = data.map((item: any) => ({
                    name: item.name || item.Nama || '',
                    price: Number(item.price || item.Harga) || 0,
                    stock: Number(item.stock || item.Stok) || 0,
                    categoryName: item.categoryName || item.Kategori || '',
                    description: item.description || item.Deskripsi || '',
                    image: item.image || item.Gambar || '',
                }));

                const { success, failed } = await importProducts(mappedData);
                showAlert({
                    title: 'Impor Selesai',
                    message: `Proses impor data CSV telah selesai.\nBerhasil: ${success}\nGagal: ${failed}`,
                    variant: 'info',
                    confirmText: 'Selesai'
                });

                // Reset input
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
            error: (error: Error) => {
                console.error('CSV Parsing Error:', error);
                alert('Gagal membaca file CSV.');
            }
        });
    };

    const downloadTemplate = () => {
        const headers = 'name,price,stock,categoryName,description,image';
        const example = 'Nasi Goreng,25000,50,Makanan,Nasi goreng enak,https://example.com/image.jpg';
        const csvContent = `${headers}\n${example}`;

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'template_produk.csv');
        link.click();
    };

    return (
        <div className="p-4 md:p-8 space-y-6">
            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                editingProduct={editingProduct}
            />

            <input
                type="file"
                ref={fileInputRef}
                accept=".csv"
                className="hidden"
                onChange={handleImportCSV}
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Manajemen Produk</h1>
                    <p className="text-slate-500">Kelola daftar produk, stok, dan kategori toko Anda.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={downloadTemplate}
                        className="flex items-center justify-center gap-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-5 py-3 rounded-2xl font-bold transition-all border border-slate-200 dark:border-slate-800 shadow-sm hover:bg-slate-50 active:scale-95"
                    >
                        <Download size={18} />
                        Template
                    </button>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-5 py-3 rounded-2xl font-bold transition-all border border-emerald-100 dark:border-emerald-800 hover:bg-emerald-100 active:scale-95 disabled:opacity-50"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <FileUp size={18} />}
                        Impor CSV
                    </button>
                    <button
                        onClick={handleOpenAddModal}
                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                    >
                        <Plus size={20} />
                        Tambah Produk
                    </button>
                </div>
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

                    <div className="relative flex items-center gap-2 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Cari berdasarkan nama atau ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                        <button
                            onClick={() => setIsScannerOpen(true)}
                            className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all flex-shrink-0 border border-blue-100 dark:border-blue-900/50"
                            title="Scan Barcode / QR"
                        >
                            <Barcode size={20} />
                        </button>
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
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800">
                                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm">{product.name}</p>
                                                <p className="text-xs text-slate-500">ID: PRD-{String(product.id).substring(0, 6)}</p>
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
                                            <button
                                                onClick={() => handleOpenEditModal(product)}
                                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredProducts.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-24 animate-in fade-in zoom-in duration-500">
                            <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
                                <Search size={40} className="text-slate-300 dark:text-slate-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Produk Tidak Ditemukan</h3>
                            <p className="text-slate-500 max-w-[280px] text-center font-medium">Coba gunakan kata kunci lain atau tambahkan produk baru ke dalam sistem.</p>
                        </div>
                    )}
                </div>
            </div>

            {isScannerOpen && (
                <BarcodeScanner
                    onScan={handleScan}
                    onClose={() => setIsScannerOpen(false)}
                />
            )}
        </div>
    );
}
