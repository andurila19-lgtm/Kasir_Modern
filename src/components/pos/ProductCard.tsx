'use client';

import Image from 'next/image';
import { Plus } from 'lucide-react';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';
import { useAlertStore } from '@/store/useAlertStore';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem);
    const { showAlert } = useAlertStore();

    return (
        <div
            className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md group cursor-pointer"
            onClick={() => addItem(product)}
        >
            <div className="relative h-40 w-full overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="bg-white/90 p-2 rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform">
                        <Plus size={24} className="text-blue-600" />
                    </div>
                </div>
                <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-white/90 dark:bg-slate-800/90 text-[10px] font-bold uppercase tracking-wider text-blue-600">
                    {product.categoryName}
                </div>
            </div>
            <div className="p-4">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 line-clamp-1 mb-1">{product.name}</h3>
                <p className="text-xs text-slate-500 mb-2 line-clamp-1">{product.description}</p>
                <div className="flex items-center justify-between">
                    <p className="font-bold text-blue-600 dark:text-blue-400">{formatCurrency(product.price)}</p>
                    <p className="text-[10px] text-slate-400">Stok: {product.stock}</p>
                </div>
            </div>
        </div>
    );
}
