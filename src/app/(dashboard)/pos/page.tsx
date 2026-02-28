'use client';

import { useState } from 'react';
import { Search, Package, ShoppingCart, Barcode } from 'lucide-react';
import { ProductCard } from '@/components/pos/ProductCard';
import { Cart } from '@/components/pos/Cart';
import { BarcodeScanner } from '@/components/pos/BarcodeScanner';
import { CATEGORIES } from '@/lib/data';
import { useProductStore } from '@/store/useProductStore';
import { useCartStore } from '@/store/useCartStore';
import { useAlertStore } from '@/store/useAlertStore';
import { cn } from '@/lib/utils';

export default function POSPage() {
    const { products } = useProductStore();
    const { items } = useCartStore();
    const { showAlert } = useAlertStore();
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const { addItem } = useCartStore();

    const filteredProducts = products.filter((product) => {
        const matchesCategory = activeCategory === 'all' || String(product.categoryId) === String(activeCategory);
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch = (product.name || '').toLowerCase().includes(q);
        return matchesCategory && matchesSearch;
    });

    const handleScan = (code: string) => {
        const product = products.find(p => p.barcode === code || p.id === code || p.name.toLowerCase() === code.toLowerCase());
        if (product) {
            addItem(product);
            showAlert({ title: 'Berhasil!', message: `${product.name} telah ditambah ke keranjang.`, variant: 'info' });
        } else {
            showAlert({ title: 'Gagal!', message: 'Produk tidak ditemukan.', variant: 'warning' });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            const exactMatch = products.find(p =>
                p.barcode === searchQuery.trim() ||
                p.id === searchQuery.trim() ||
                p.name.toLowerCase() === searchQuery.trim().toLowerCase()
            );
            if (exactMatch) {
                addItem(exactMatch);
                setSearchQuery('');
            }
        }
    };

    return (
        <div className="flex h-[calc(100vh-4rem)] md:h-screen overflow-hidden relative">
            {/* Product Section */}
            <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950">
                <div className="p-4 md:p-6 space-y-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Cari menu atau pindai barcode..."
                                className="w-full pl-10 pr-4 py-4 rounded-2xl border-none bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                autoFocus
                            />
                        </div>
                        <button
                            onClick={() => setIsScannerOpen(true)}
                            className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none text-blue-600 dark:text-blue-400 active:scale-95 transition-all"
                            title="Scan Barcode"
                        >
                            <Barcode size={24} />
                        </button>
                        <button
                            onClick={() => setIsMobileCartOpen(true)}
                            className="lg:hidden relative p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none text-slate-600 dark:text-slate-400 active:scale-95 transition-all"
                        >
                            <ShoppingCart size={24} />
                            {items.length > 0 && (
                                <span className="absolute -top-1 -right-1 w-6 h-6 bg-blue-600 text-white text-[11px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-lg">
                                    {items.length}
                                </span>
                            )}
                        </button>
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide pt-2">
                        <button
                            onClick={() => setActiveCategory('all')}
                            className={cn(
                                "px-8 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all shadow-sm",
                                activeCategory === 'all'
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                                    : "bg-white dark:bg-slate-900 text-slate-500 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                            )}
                        >
                            Semua Menu
                        </button>
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={cn(
                                    "px-8 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all shadow-sm",
                                    activeCategory === cat.id
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                                        : "bg-white dark:bg-slate-900 text-slate-500 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                                )}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-6 pt-0 pb-20 md:pb-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                    {filteredProducts.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-500">
                            <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mb-6">
                                <Search size={40} className="text-slate-300 dark:text-slate-700" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Menu Tidak Ditemukan</h3>
                            <p className="text-slate-500 max-w-[250px] text-center font-medium">Coba gunakan kata kunci lain atau pilih kategori yang berbeda.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Cart Section - Desktop */}
            <div className="hidden lg:block w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-xl">
                <Cart />
            </div>

            {/* Barcode Scanner Modal */}
            {isScannerOpen && (
                <BarcodeScanner
                    onScan={handleScan}
                    onClose={() => setIsScannerOpen(false)}
                />
            )}

            {/* Cart Section - Mobile Overlay */}
            {isMobileCartOpen && (
                <div className="fixed inset-0 z-[110] lg:hidden animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMobileCartOpen(false)} />
                    <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-slate-950 animate-in slide-in-from-right duration-300">
                        <Cart onClose={() => setIsMobileCartOpen(false)} />
                    </div>
                </div>
            )}
        </div>
    );
}
