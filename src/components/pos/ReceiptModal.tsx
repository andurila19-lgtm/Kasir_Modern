'use client';

import { Printer, X, Download } from 'lucide-react';
import { Transaction } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

interface ReceiptModalProps {
    transaction: Transaction;
    onClose: () => void;
}

export function ReceiptModal({ transaction, onClose }: ReceiptModalProps) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
                <div className="flex items-center justify-between p-6 border-b dark:border-slate-800">
                    <h3 className="font-bold text-lg">Struk Pembayaran</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <div id="receipt-content" className="p-8 space-y-6 text-slate-800 dark:text-slate-100">
                    <div className="text-center space-y-1">
                        <h4 className="text-xl font-bold">KASIRPRO STORE</h4>
                        <p className="text-xs text-slate-500">Jl. Teknologi No. 404, Jakarta Pusat</p>
                        <p className="text-xs text-slate-500">Telp: 0812-3456-7890</p>
                    </div>

                    <div className="border-y border-dashed py-4 space-y-1 text-xs">
                        <div className="flex justify-between">
                            <span>No. Transaksi</span>
                            <span className="font-bold">{transaction.id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Waktu</span>
                            <span>{formatDate(transaction.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Kasir</span>
                            <span>{transaction.cashierName}</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {transaction.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <div className="flex-1">
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-xs text-slate-500">{item.quantity} x {formatCurrency(item.price)}</p>
                                </div>
                                <span className="font-bold">{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-dashed pt-4 space-y-1">
                        <div className="flex justify-between text-sm">
                            <span>Subtotal</span>
                            <span>{formatCurrency(transaction.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Pajak (11%)</span>
                            <span>{formatCurrency(transaction.tax)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold pt-2">
                            <span>TOTAL</span>
                            <span className="text-blue-600">{formatCurrency(transaction.total)}</span>
                        </div>
                    </div>

                    <div className="space-y-1 text-xs pt-2">
                        <div className="flex justify-between">
                            <span>Metode Pembayaran</span>
                            <span>{transaction.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between font-bold">
                            <span>Bayar</span>
                            <span>{formatCurrency(transaction.amountPaid)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Kembali</span>
                            <span>{formatCurrency(transaction.change)}</span>
                        </div>
                    </div>

                    <div className="text-center pt-8">
                        <p className="text-xs font-medium">Terima Kasih Atas Kunjungan Anda!</p>
                        <p className="text-[10px] text-slate-400 mt-1">Barang yang sudah dibeli tidak dapat ditukar atau dikembalikan.</p>
                    </div>
                </div>

                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 flex gap-3">
                    <button
                        onClick={handlePrint}
                        className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20"
                    >
                        <Printer size={18} />
                        Cetak Struk
                    </button>
                    <button className="p-3 border dark:border-slate-700 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors">
                        <Download size={20} />
                    </button>
                </div>
            </div>

            <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #receipt-content, #receipt-content * {
            visibility: visible;
          }
          #receipt-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 80mm;
            padding: 5mm;
          }
        }
      `}</style>
        </div>
    );
}
