'use client';

import { Minus, Plus, Trash2, ShoppingBag, X, Loader2, Banknote, QrCode, CreditCard, ChevronDown, ShoppingCart, Tag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useProductStore } from '@/store/useProductStore';
import { useTransactionStore } from '@/store/useTransactionStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useAlertStore } from '@/store/useAlertStore';
import { formatCurrency, cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { ReceiptModal } from './ReceiptModal';
import { PaymentMethod } from '@/types';

interface CartProps {
    onClose?: () => void;
}

export function Cart({ onClose }: CartProps) {
    const { items, updateQuantity, removeItem, clearCart, getTotal, setItemDiscount } = useCartStore();
    const { reduceStock } = useProductStore();
    const { addTransaction } = useTransactionStore();
    const { taxRate } = useSettingsStore();
    const { showAlert } = useAlertStore();

    const subtotal = getTotal();
    const tax = subtotal * (taxRate / 100);
    const total = subtotal + tax;

    const [showReceipt, setShowReceipt] = useState(false);
    const [lastTransaction, setLastTransaction] = useState<any>(null);
    const { user } = useAuthStore();
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
    const [amountPaid, setAmountPaid] = useState<string>('');
    const [editingDiscountId, setEditingDiscountId] = useState<string | null>(null);

    // Auto-fill amount paid for non-cash payments
    useEffect(() => {
        if (paymentMethod !== 'CASH') {
            setAmountPaid(total.toString());
        } else {
            setAmountPaid('');
        }
    }, [paymentMethod, total]);

    const handleCheckout = async () => {
        const paidValue = Number(amountPaid);
        if (paidValue < total) {
            showAlert({
                title: 'Pembayaran Kurang',
                message: 'Jumlah uang yang dimasukkan belum mencukupi total tagihan.',
                variant: 'warning',
                confirmText: 'Ok, Saya Cek'
            });
            return;
        }

        showAlert({
            title: 'Konfirmasi Bayar?',
            message: `Selesaikan transaksi dengan total ${formatCurrency(total)} via ${paymentMethod}?`,
            variant: 'info',
            confirmText: 'Ya, Bayar Lunas',
            cancelText: 'Cek Lagi',
            onConfirm: async () => {
                setIsProcessing(true);
                try {
                    const transaction = {
                        id: `TRX-${Math.floor(Math.random() * 9000) + 1000}`,
                        items: [...items],
                        subtotal,
                        tax,
                        taxRate,
                        total,
                        paymentMethod,
                        amountPaid: paidValue,
                        change: paidValue - total,
                        createdAt: new Date().toISOString(),
                        cashierId: user?.id || 'guest',
                        cashierName: user?.name || 'Guest',
                    };

                    // Save to History (Supabase)
                    await addTransaction(transaction);

                    // Reduce Stock (Supabase)
                    for (const item of items) {
                        await reduceStock(item.id, item.quantity);
                    }

                    setLastTransaction(transaction);
                    setShowReceipt(true);
                } catch (err) {
                    console.error('Checkout failed:', err);
                    showAlert({
                        title: 'Gagal!',
                        message: 'Proses checkout gagal. Silakan coba lagi.',
                        variant: 'danger',
                        confirmText: 'Tutup'
                    });
                } finally {
                    setIsProcessing(false);
                }
            }
        });
    };

    if (items.length === 0 && !showReceipt) {
        return (
            <div className="flex flex-col h-full bg-white dark:bg-slate-950">
                <div className="flex items-center justify-between p-4 border-b dark:border-slate-800 lg:hidden text-slate-800 dark:text-slate-200">
                    <h2 className="font-bold text-lg">Keranjang</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center animate-in fade-in zoom-in-95 duration-500">
                    <div className="relative mb-6">
                        <div className="w-24 h-24 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                            <ShoppingBag size={48} className="text-slate-200 dark:text-slate-800" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-white dark:bg-slate-950 rounded-full flex items-center justify-center shadow-lg">
                            <ShoppingCart size={20} className="text-slate-300 dark:text-slate-700" />
                        </div>
                    </div>
                    <p className="font-bold text-xl text-slate-800 dark:text-slate-200 tracking-tight">Keranjang Kosong</p>
                    <p className="text-sm text-slate-500 max-w-[200px] mt-2 font-medium">Belum ada menu yang dipilih. Yuk tambahkan pesanan!</p>
                </div>
            </div>
        );
    }

    const change = Number(amountPaid) - total;

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-950 border-l dark:border-slate-800 shadow-2xl">
            {showReceipt && lastTransaction && (
                <ReceiptModal
                    transaction={lastTransaction}
                    onClose={() => {
                        setShowReceipt(false);
                        clearCart();
                        onClose?.();
                    }}
                />
            )}

            <div className="flex items-center justify-between p-6 border-b dark:border-slate-800 bg-white dark:bg-slate-950">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
                        <ShoppingBag size={20} />
                    </div>
                    <div>
                        <h2 className="font-bold tracking-tight">Pesanan Aktif</h2>
                        <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest">{items.length} Item Terpilih</p>
                    </div>
                </div>
                <button
                    onClick={clearCart}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-xl transition-all active:scale-95"
                    title="Hapus Semua"
                >
                    <Trash2 size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
                {items.map((item) => (
                    <div key={item.id} className="space-y-2 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex gap-4 items-center">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800 border dark:border-slate-800">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm truncate">{item.name}</h4>
                                <div className="flex items-center gap-2">
                                    <p className="text-blue-600 dark:text-blue-400 font-black text-xs mt-0.5">{formatCurrency(item.price)}</p>
                                    {item.discount && item.discount > 0 && (
                                        <p className="text-[10px] text-red-500 font-bold bg-red-50 dark:bg-red-950/30 px-1.5 rounded-md">
                                            - {formatCurrency(item.discount)}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 rounded-xl p-1 px-2 border dark:border-slate-800">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="w-7 h-7 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-all active:scale-90"
                                    >
                                        <Minus size={12} />
                                    </button>
                                    <span className="w-4 text-center text-xs font-black">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="w-7 h-7 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-all active:scale-90"
                                    >
                                        <Plus size={12} />
                                    </button>
                                </div>
                                <button
                                    onClick={() => setEditingDiscountId(editingDiscountId === item.id ? null : item.id)}
                                    className={cn(
                                        "p-1.5 rounded-lg transition-all",
                                        item.discount ? "text-red-500 bg-red-50 dark:bg-red-950/20" : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    )}
                                >
                                    <Tag size={14} />
                                </button>
                            </div>
                        </div>
                        {editingDiscountId === item.id && (
                            <div className="flex items-center gap-2 px-2 py-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl animate-in slide-in-from-top-2 duration-300">
                                <span className="text-[10px] font-bold text-slate-500 uppercase ml-2">Diskon Rp</span>
                                <input
                                    type="number"
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-xs font-black p-0 h-6"
                                    value={item.discount || ''}
                                    onChange={(e) => setItemDiscount(item.id, Number(e.target.value))}
                                    placeholder="0"
                                    autoFocus
                                />
                                <button onClick={() => setEditingDiscountId(null)} className="text-[10px] font-bold text-blue-600 px-2 uppercase">Selesai</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t dark:border-slate-800 space-y-6">
                {/* Payment Selection */}
                <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Metode Pembayaran</p>
                    <div className="grid grid-cols-4 gap-2">
                        {[
                            { id: 'CASH', icon: Banknote, label: 'Tunai' },
                            { id: 'QRIS', icon: QrCode, label: 'QRIS' },
                            { id: 'TRANSFER', icon: CreditCard, label: 'TF' },
                            { id: 'DEBIT', icon: CreditCard, label: 'Kartu' },
                        ].map((m) => (
                            <button
                                key={m.id}
                                onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                                className={cn(
                                    "flex flex-col items-center gap-2 p-3 rounded-2xl transition-all border",
                                    paymentMethod === m.id
                                        ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20"
                                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-blue-500"
                                )}
                            >
                                <m.icon size={18} />
                                <span className="text-[10px] font-bold uppercase">{m.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Amount Paid Input */}
                <div className="space-y-3">
                    <div className="flex justify-between items-end">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Input Pembayaran</p>
                        {paymentMethod === 'CASH' && (
                            <div className="flex gap-2">
                                {[50000, 100000].map(val => (
                                    <button
                                        key={val}
                                        onClick={() => setAmountPaid(val.toString())}
                                        className="text-[10px] font-bold px-2 py-1 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg hover:border-blue-500"
                                    >
                                        +{(val / 1000).toFixed(0)}k
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">Rp</div>
                        <input
                            type="number"
                            value={amountPaid}
                            onChange={(e) => setAmountPaid(e.target.value)}
                            placeholder="0"
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 outline-none font-black text-lg transition-all"
                        />
                    </div>
                </div>

                {/* Summary */}
                <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-xs text-slate-500 font-bold">
                        <span>Subtotal</span>
                        <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 font-bold">
                        <span>Pajak ({taxRate}%)</span>
                        <span>{formatCurrency(tax)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-black py-4 border-t border-b border-dashed dark:border-slate-800 my-2">
                        <span className="tracking-tight text-slate-800 dark:text-slate-100">Total Tagihan</span>
                        <span className="text-blue-600 dark:text-blue-400">{formatCurrency(total)}</span>
                    </div>
                    {paymentMethod === 'CASH' && (
                        <div className="flex justify-between text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/10 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                            <span>Kembali</span>
                            <span>{formatCurrency(Math.max(0, change))}</span>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleCheckout}
                    disabled={isProcessing || !amountPaid || Number(amountPaid) < total}
                    className="w-full py-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:grayscale text-white rounded-3xl font-black shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-lg"
                >
                    {isProcessing ? (
                        <>
                            <Loader2 size={24} className="animate-spin" />
                            Memproses Lunas...
                        </>
                    ) : (
                        <>
                            <ShoppingCart size={24} />
                            Selesaikan Transaksi
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
