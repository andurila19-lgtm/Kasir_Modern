'use client';

import { useRef, useEffect } from 'react';
import { Printer, X, Download } from 'lucide-react';
import { Transaction } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useReactToPrint } from 'react-to-print';
import { useSettingsStore } from '@/store/useSettingsStore';
import { ReceiptPrint } from './ReceiptPrint';

interface ReceiptModalProps {
    transaction: Transaction;
    onClose: () => void;
}

export function ReceiptModal({ transaction, onClose }: ReceiptModalProps) {
    const { storeName, storeAddress } = useSettingsStore();
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Receipt-${transaction.id}`,
    });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handlePrint();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handlePrint, onClose]);

    const downloadRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (!downloadRef.current) return;

        try {
            const { toPng } = await import('html-to-image');
            const dataUrl = await toPng(downloadRef.current, {
                cacheBust: true,
                backgroundColor: '#ffffff',
                style: {
                    borderRadius: '0',
                    color: '#000000', // Ensure text is always dark when generated as an image
                }
            });

            const link = document.createElement('a');
            link.download = `Receipt-${transaction.id}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Error downloading receipt:', err);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            {/* Hidden component for printing */}
            <div className="hidden">
                <ReceiptPrint ref={printRef} transaction={transaction} />
            </div>

            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
                <div className="flex items-center justify-between p-6 border-b dark:border-slate-800">
                    <h3 className="font-bold text-lg">Struk Pembayaran</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div
                    ref={downloadRef}
                    className="p-8 space-y-6 text-slate-800 dark:text-slate-100 max-h-[70vh] overflow-y-auto scrollbar-hide bg-white dark:bg-slate-900"
                >
                    <div className="text-center space-y-1">
                        <h4 className="text-xl font-bold uppercase tracking-tight">{storeName}</h4>
                        <p className="text-xs text-slate-500">{storeAddress}</p>
                    </div>

                    <div className="border-y border-dashed py-4 space-y-1 text-xs font-mono">
                        <div className="flex justify-between">
                            <span>No. Transaksi</span>
                            <span className="font-bold">{transaction.id.toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Waktu</span>
                            <span>{transaction.createdAt ? formatDate(transaction.createdAt) : '-'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Kasir</span>
                            <span>{transaction.cashierName}</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {transaction.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                                <div className="flex-1">
                                    <p className="font-medium">{item.name}</p>
                                    <div className="flex items-center gap-1">
                                        <p className="text-xs text-slate-500 font-mono">
                                            {item.quantity} x {formatCurrency(item.price)}
                                        </p>
                                        {item.discount && item.discount > 0 && (
                                            <p className="text-[10px] text-red-500 font-bold ml-1">
                                                (Disc. -{formatCurrency(item.discount)})
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <span className="font-bold font-mono">{formatCurrency((item.price * item.quantity) - (item.discount || 0))}</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-dashed pt-4 space-y-1 font-mono">
                        <div className="flex justify-between text-sm">
                            <span>Subtotal</span>
                            <span>{formatCurrency(transaction.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Pajak ({transaction.taxRate || 11}%)</span>
                            <span>{formatCurrency(transaction.tax)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold pt-2 border-t border-dashed mt-2">
                            <span>TOTAL</span>
                            <span className="text-blue-600 dark:text-blue-400">{formatCurrency(transaction.total)}</span>
                        </div>
                    </div>

                    <div className="space-y-1 text-xs pt-2 font-mono border-t border-dashed border-opacity-30">
                        <div className="flex justify-between">
                            <span>Metode Pembayaran</span>
                            <span>{transaction.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between font-bold">
                            <span>Bayar</span>
                            <span>{formatCurrency(transaction.amountPaid)}</span>
                        </div>
                        <div className="flex justify-between border-t border-dashed pt-1 mt-1">
                            <span>Kembali</span>
                            <span>{formatCurrency(transaction.change)}</span>
                        </div>
                    </div>

                    <div className="text-center pt-8">
                        <p className="text-xs font-bold tracking-widest">TERIMA KASIH</p>
                        <p className="text-[10px] text-slate-400 mt-1 uppercase">Silakan Berkunjung Kembali</p>
                    </div>
                </div>

                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 flex gap-3">
                    <button
                        onClick={() => handlePrint()}
                        className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                    >
                        <Printer size={18} />
                        Cetak Struk
                    </button>
                    <button
                        onClick={handleDownload}
                        className="p-4 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-95 shadow-sm"
                    >
                        <Download size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
