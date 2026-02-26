'use client';

import {
    User,
    Store,
    Bell,
    Lock,
    ChevronRight,
    Save,
    Palette,
    ShieldCheck,
    Smartphone,
    Moon,
    Sun,
    Monitor
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
    const [activeSegment, setActiveSegment] = useState('profile');

    const segments = [
        { id: 'profile', icon: User, label: 'Profil Saya' },
        { id: 'store', icon: Store, label: 'Informasi Toko' },
        { id: 'security', icon: Lock, label: 'Keamanan' },
        { id: 'notifications', icon: Bell, label: 'Notifikasi' },
        { id: 'theme', icon: Palette, label: 'Tampilan' },
    ];

    return (
        <div className="p-4 md:p-8 space-y-8">
            <div>
                <h1 className="text-2xl font-bold">Pengaturan</h1>
                <p className="text-slate-500">Kelola konfigurasi akun dan sistem kasir Anda.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
                {/* Sidebar Settings */}
                <div className="w-full md:w-72 bg-slate-50/50 dark:bg-slate-800/20 border-r border-slate-100 dark:border-slate-800 p-6 space-y-2">
                    {segments.map((s) => (
                        <button
                            key={s.id}
                            onClick={() => setActiveSegment(s.id)}
                            className={cn(
                                "w-full flex items-center gap-3 p-3 rounded-2xl transition-all font-medium text-sm",
                                activeSegment === s.id
                                    ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400"
                                    : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                            )}
                        >
                            <s.icon size={20} />
                            {s.label}
                            {activeSegment === s.id && <ChevronRight size={16} className="ml-auto" />}
                        </button>
                    ))}
                </div>

                {/* Content Settings */}
                <div className="flex-1 p-8 md:p-12 overflow-y-auto">
                    {activeSegment === 'profile' && (
                        <div className="space-y-8 animate-fade-in max-w-2xl">
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 text-3xl font-bold border-4 border-white dark:border-slate-800 shadow-lg">
                                    A
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">Ahmad Admin</h3>
                                    <p className="text-slate-500 text-sm">ahmad@kasirpro.id</p>
                                    <button className="mt-2 text-blue-600 font-bold text-sm hover:underline">Ganti Foto Profil</button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Nama Lengkap</label>
                                    <input type="text" defaultValue="Ahmad Admin" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Nomor Telepon</label>
                                    <input type="text" defaultValue="081234567890" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 transition-all" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-semibold">Email</label>
                                    <input type="email" defaultValue="ahmad@kasirpro.id" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 transition-all" />
                                </div>
                            </div>

                            <div className="flex justify-end pt-6 border-t dark:border-slate-800">
                                <button className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center gap-2">
                                    <Save size={18} />
                                    Simpan Perubahan
                                </button>
                            </div>
                        </div>
                    )}

                    {activeSegment === 'store' && (
                        <div className="space-y-8 animate-fade-in max-w-2xl">
                            <div>
                                <h2 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-100">Informasi Toko</h2>
                                <p className="text-slate-500 text-sm">Data ini akan muncul pada struk pembayaran pelanggan.</p>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Nama Toko</label>
                                    <input type="text" defaultValue="KasirPro Store" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Alamat Lengkap</label>
                                    <textarea rows={3} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 transition-all">Jl. Teknologi No. 404, Jakarta Pusat, DKI Jakarta 10110</textarea>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Nomor Telepon Toko</label>
                                        <input type="text" defaultValue="021-555666" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Mata Uang</label>
                                        <select className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none">
                                            <option>IDR (Rupiah)</option>
                                            <option>USD (Dollar)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-6 border-t dark:border-slate-800">
                                <button className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center gap-2">
                                    <Save size={18} />
                                    Simpan Toko
                                </button>
                            </div>
                        </div>
                    )}

                    {activeSegment === 'security' && (
                        <div className="space-y-8 animate-fade-in max-w-2xl">
                            <div>
                                <h2 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-100">Keamanan Akun</h2>
                                <p className="text-slate-500 text-sm">Perbarui kata sandi dan amankan akses Anda.</p>
                            </div>

                            <div className="space-y-6">
                                <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-2xl bg-green-50 dark:bg-green-900/20 text-green-600">
                                            <ShieldCheck size={24} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">Autentikasi Dua Faktor</p>
                                            <p className="text-xs text-slate-500 italic-none">Aktifkan untuk keamanan ekstra.</p>
                                        </div>
                                    </div>
                                    <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Kata Sandi Saat Ini</label>
                                        <input type="password" placeholder="••••••••" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Kata Sandi Baru</label>
                                        <input type="password" placeholder="••••••••" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 transition-all" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-6 border-t dark:border-slate-800">
                                <button className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">
                                    Perbarui Kata Sandi
                                </button>
                            </div>
                        </div>
                    )}

                    {activeSegment === 'notifications' && (
                        <div className="space-y-8 animate-fade-in max-w-2xl">
                            <div>
                                <h2 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-100">Pemberitahuan</h2>
                                <p className="text-slate-500 text-sm">Atur bagaimana Anda menerima update dari sistem.</p>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { title: 'Laporan Penjualan Harian', desc: 'Terima ringkasan laba setiap sore via email.' },
                                    { title: 'Peringatan Stok Rendah', desc: 'Notifikasi saat stok produk di bawah ambang batas.' },
                                    { title: 'Update Keamanan', desc: 'Notifikasi saat ada aktivitas login mencurigakan.' },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-colors">
                                        <div className="flex-1 pr-4">
                                            <p className="font-bold text-sm">{item.title}</p>
                                            <p className="text-xs text-slate-500">{item.desc}</p>
                                        </div>
                                        <div className="w-10 h-5 bg-slate-200 dark:bg-slate-700 rounded-full relative cursor-pointer">
                                            <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeSegment === 'theme' && (
                        <div className="space-y-8 animate-fade-in max-w-2xl">
                            <div>
                                <h2 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-100">Personalisasi Tampilan</h2>
                                <p className="text-slate-500 text-sm">Sesuaikan tema aplikasi sesuai kenyamanan mata Anda.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { id: 'light', icon: Sun, label: 'Terang', active: true },
                                    { id: 'dark', icon: Moon, label: 'Gelap', active: false },
                                    { id: 'system', icon: Monitor, label: 'Sistem', active: false },
                                ].map((t) => (
                                    <button
                                        key={t.id}
                                        className={cn(
                                            "flex flex-col items-center gap-3 p-6 rounded-3xl border transition-all",
                                            t.active
                                                ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500/50 text-blue-600 dark:text-blue-400"
                                                : "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-100 dark:border-slate-800"
                                        )}
                                    >
                                        <t.icon size={32} />
                                        <span className="font-bold text-sm">{t.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
