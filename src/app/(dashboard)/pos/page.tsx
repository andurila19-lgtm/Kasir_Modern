'use client';

import { useState } from 'react';
import { Search, Package } from 'lucide-react';
import { ProductCard } from '@/components/pos/ProductCard';
import { Cart } from '@/components/pos/Cart';
import { PRODUCTS, CATEGORIES } from '@/lib/data';
import { cn } from '@/lib/utils';

export default function POSPage() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProducts = PRODUCTS.filter((product) => {
        const matchesCategory = activeCategory === 'all' || product.categoryId === activeCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
            {/* Product Section */}
            <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950">
                <div className="p-4 md:p-6 space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Cari produk..."
                                className="w-full pl-10 pr-4 py-3 rounded-2xl border-none bg-white dark:bg-slate-900 shadow-sm focus:ring-2 focus:ring-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        <button
                            onClick={() => setActiveCategory('all')}
                            className={cn(
                                "px-6 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                                activeCategory === 'all'
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                            )}
                        >
                            Semua
                        </button>
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={cn(
                                    "px-6 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                                    activeCategory === cat.id
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                                )}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-6 pt-0">
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                    {filteredProducts.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                            <Package size={48} className="mb-4 opacity-20" />
                            <p>Produk tidak ditemukan</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Cart Section - Desktop */}
            <div className="hidden lg:block w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-xl">
                <Cart />
            </div>
        </div>
    );
}
