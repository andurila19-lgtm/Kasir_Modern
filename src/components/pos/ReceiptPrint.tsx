'use client';

import React, { forwardRef } from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Transaction } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

export const ReceiptPrint = forwardRef<HTMLDivElement, { transaction: Transaction }>(
    ({ transaction }, ref) => {
        const { storeName, storeAddress } = useSettingsStore();

        return (
            <div ref={ref} className="p-8 bg-white text-black font-mono text-sm max-w-[400px] mx-auto">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-xl font-bold uppercase">{storeName}</h1>
                    <p>{storeAddress}</p>
                </div>

                <div className="border-b border-dashed border-black mb-4 pb-2">
                    <div className="flex justify-between">
                        <span>ID Transaksi:</span>
                        <span>{transaction.id.slice(0, 8).toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Tanggal:</span>
                        <span>{transaction.createdAt ? formatDate(transaction.createdAt) : '-'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Kasir:</span>
                        <span>{transaction.cashierName}</span>
                    </div>
                </div>

                {/* Items */}
                <div className="space-y-2 mb-4">
                    {transaction.items.map((item, idx) => (
                        <div key={idx} className="flex flex-col">
                            <div className="flex justify-between font-bold">
                                <span>{item.name}</span>
                                <span>{formatCurrency((item.price * item.quantity) - (item.discount || 0))}</span>
                            </div>
                            <div className="text-xs flex justify-between">
                                <span>{item.quantity} x {formatCurrency(item.price)}</span>
                                {item.discount && item.discount > 0 && (
                                    <span className="text-black italic">Disc. -{formatCurrency(item.discount)}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Totals */}
                <div className="border-t border-dashed border-black pt-4 space-y-2 mb-6">
                    <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(transaction.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Pajak ({transaction.taxRate || 11}%):</span>
                        <span>{formatCurrency(transaction.tax)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                        <span>TOTAL:</span>
                        <span>{formatCurrency(transaction.total)}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                        <span>Metode:</span>
                        <span>{transaction.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Bayar:</span>
                        <span>{formatCurrency(transaction.amountPaid)}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                        <span>Kembali:</span>
                        <span>{formatCurrency(transaction.change)}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-xs mt-8">
                    <p>Terima Kasih Atas Kunjungan Anda</p>
                    <p>Barang yang sudah dibeli</p>
                    <p>tidak dapat ditukar/dikembalikan</p>
                    <p className="mt-4">*** KasirPro v1.0 ***</p>
                </div>
            </div>
        );
    });

ReceiptPrint.displayName = 'ReceiptPrint';
