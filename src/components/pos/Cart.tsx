'use client';

import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';

export function Cart() {
    const { items, updateQuantity, removeItem, clearCart, getTotal } = useCartStore();
    const subtotal = getTotal();
    const tax = subtotal * 0.11; // 11% PPN
    const total = subtotal + tax;

    const [showReceipt, setShowReceipt] = useState(false);
    const [lastTransaction, setLastTransaction] = useState<any>(null);

    const handleCheckout = () => {
        const transaction = {
            id: `TRX-${Math.floor(Math.random() * 9000) + 1000}`,
            items: [...items],
            subtotal,
            tax,
            total,
            paymentMethod: 'CASH',
            amountPaid: Math.ceil(total / 50000) * 50000, // Round up to nearest 50k
            change: 0,
            createdAt: new Date().toISOString(),
            cashierId: '1',
            cashierName: 'Ahmad Admin',
        };
        transaction.change = transaction.amountPaid - transaction.total;

        setLastTransaction(transaction);
        setShowReceipt(true);
    };

    if (items.length === 0 && !showReceipt) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                    <ShoppingBag size={40} />
                </div>
                <p className="font-medium text-lg text-slate-600 dark:text-slate-400">Keranjang Kosong</p>
                <p className="text-sm">Pilih produk di sebelah kiri untuk memulai pesanan.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {showReceipt && lastTransaction && (
                <ReceiptModal
                    transaction={lastTransaction}
                    onClose={() => {
                        setShowReceipt(false);
                        clearCart();
                    }}
                />
            )}

            <div className="flex items-center justify-between p-4 border-b dark:border-slate-800">
                <h2 className="font-bold text-lg">Pesanan Aktif</h2>
                <button
                    onClick={clearCart}
                    className="text-red-500 hover:text-red-600 text-sm font-medium"
                >
                    Hapus Semua
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {items.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                            <p className="text-blue-600 font-bold text-sm">{formatCurrency(item.price)}</p>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                            <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 rounded-md transition-shadow"
                            >
                                <Minus size={14} />
                            </button>
                            <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                            <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 rounded-md transition-shadow"
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                        <button
                            onClick={() => removeItem(item.id)}
                            className="text-slate-300 hover:text-red-500 transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>

            <div className="p-6 border-t dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-3">
                <div className="flex justify-between text-sm text-slate-500">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                    <span>Pajak (11%)</span>
                    <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-2 border-t dark:border-slate-800">
                    <span>Total</span>
                    <span className="text-blue-600">{formatCurrency(total)}</span>
                </div>

                <button
                    onClick={handleCheckout}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold mt-4 shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
                >
                    Bayar Sekarang
                </button>
            </div>
        </div>
    );
}

import { ReceiptModal } from './ReceiptModal';
