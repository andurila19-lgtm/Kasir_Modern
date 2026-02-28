'use client';

import { useEffect, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { X, Camera } from 'lucide-react';

interface BarcodeScannerProps {
    onScan: (decodedText: string) => void;
    onClose: () => void;
}

export function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        const html5QrCode = new Html5Qrcode("reader", {
            verbose: false,
            formatsToSupport: [
                Html5QrcodeSupportedFormats.EAN_13,
                Html5QrcodeSupportedFormats.EAN_8,
                Html5QrcodeSupportedFormats.UPC_A,
                Html5QrcodeSupportedFormats.UPC_E,
                Html5QrcodeSupportedFormats.CODE_128,
                Html5QrcodeSupportedFormats.CODE_39,
                Html5QrcodeSupportedFormats.QR_CODE,
            ]
        });
        let mounted = true;

        const startScanner = async () => {
            try {
                // This will ask for camera permission
                const devices = await Html5Qrcode.getCameras();
                if (devices && devices.length > 0 && mounted) {
                    await html5QrCode.start(
                        { facingMode: "environment" },
                        {
                            fps: 15,
                            qrbox: { width: 250, height: 150 }, // Rectangular for 1D barcodes
                        },
                        (decodedText) => {
                            if (html5QrCode.isScanning) {
                                html5QrCode.stop().then(() => {
                                    onScan(decodedText);
                                    onClose();
                                }).catch(console.error);
                            }
                        },
                        () => {
                            // ignore frame parse errors
                        }
                    );
                } else {
                    if (mounted) setErrorMsg("Kamera tidak ditemukan di perangkat ini.");
                }
            } catch (err: any) {
                console.error("Error starting camera", err);
                if (mounted) {
                    setErrorMsg(`Izin kamera ditolak atau error: ${err?.message || err}`);
                }
            }
        };

        // Give UI a tiny bit of time to render the #reader div before starting
        const timerId = setTimeout(() => {
            startScanner();
        }, 300);

        return () => {
            mounted = false;
            clearTimeout(timerId);
            if (html5QrCode.isScanning) {
                html5QrCode.stop().catch(() => { });
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
                    {errorMsg ? (
                        <div className="text-center p-6 border-2 border-red-200 bg-red-50 text-red-600 rounded-2xl flex flex-col items-center gap-3">
                            <Camera size={32} />
                            <p className="font-bold text-sm">{errorMsg}</p>
                            <p className="text-xs text-red-400">Pastikan Anda telah mengizinkan akses kamera di pengaturan browser.</p>
                        </div>
                    ) : (
                        <div id="reader" className="w-full rounded-2xl overflow-hidden border-4 border-blue-600/20 bg-black min-h-[300px]"></div>
                    )}
                </div>

                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 text-center">
                    <p className="text-xs text-slate-500 font-medium">Arahkan barcode produk ke kamera Anda</p>
                </div>
            </div>
        </div>
    );
}
