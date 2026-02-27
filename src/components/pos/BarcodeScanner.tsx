'use client';

import { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X } from 'lucide-react';

interface BarcodeScannerProps {
    onScan: (decodedText: string) => void;
    onClose: () => void;
}

export function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    useEffect(() => {
        scannerRef.current = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            /* verbose= */ false
        );

        scannerRef.current.render(
            (decodedText) => {
                onScan(decodedText);
                if (scannerRef.current) {
                    scannerRef.current.clear();
                }
                onClose();
            },
            (error) => {
                // Ignore errors
            }
        );

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
            }
        };
    }, [onScan, onClose]);

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center">
                    <h3 className="text-xl font-bold italic tracking-tight">Scan Barcode / QR</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-8">
                    <div id="reader" className="w-full rounded-2xl overflow-hidden border-4 border-blue-600/20"></div>
                </div>
                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 text-center">
                    <p className="text-xs text-slate-500 font-medium">Arahkan barcode produk ke kamera Anda</p>
                </div>
            </div>
        </div>
    );
}
