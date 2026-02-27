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
    Monitor,
    Trash2,
    RotateCcw,
    Database,
    BarChart3
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useAlertStore } from '@/store/useAlertStore';
import { useTransactionStore } from '@/store/useTransactionStore';

export default function SettingsPage() {
    const { user, updateProfile, updatePassword } = useAuthStore();
    const { theme, setTheme } = useThemeStore();
    const {
        taxRate, setTaxRate,
        storeName, storeAddress,
        notifications,
        setStoreInfo, toggleNotification
    } = useSettingsStore();
    const { showAlert } = useAlertStore();
    const { resetTransactions } = useTransactionStore();

    const [activeSegment, setActiveSegment] = useState('profile');
    const [userName, setUserName] = useState(user?.name || '');

    // Demo Mode: Set to true to show Reset Laporan & Advanced Database tools
    const showAdminTools = false;

    // Business Info State
    const [businessName, setBusinessName] = useState(storeName);
    const [businessAddress, setBusinessAddress] = useState(storeAddress);

    // Security State
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Sync state with store
    useEffect(() => {
        if (user?.name) setUserName(user.name);
    }, [user?.name]);

    useEffect(() => {
        setBusinessName(storeName);
    }, [storeName]);

    useEffect(() => {
        setBusinessAddress(storeAddress);
    }, [storeAddress]);

    const segments = [
        { id: 'profile', icon: User, label: 'Profil Akun' },
        { id: 'store', icon: Store, label: 'Info Bisnis' },
        { id: 'notifications', icon: Bell, label: 'Pemberitahuan' },
        { id: 'theme', icon: Palette, label: 'Tema & Tampilan' },
        ...(showAdminTools ? [
            { id: 'security', icon: Lock, label: 'Keamanan' },
            { id: 'reports', icon: BarChart3, label: 'Laporan & Data' },
            { id: 'reset', icon: Database, label: 'Database' }
        ] : []),
    ];

    return (
        <div className="p-4 md:p-8 space-y-8">
            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                <h1 className="text-2xl font-bold">Pengaturan Sistem</h1>
                <p className="text-slate-500">Sesuaikan aplikasi agar bekerja maksimal untuk bisnis Anda.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px] animate-in zoom-in-95 duration-500">
                {/* Sidebar Settings */}
                <div className="w-full md:w-72 bg-slate-50/50 dark:bg-slate-800/20 border-r border-slate-100 dark:border-slate-800 p-6 space-y-2">
                    {segments.map((s) => (
                        <button
                            key={s.id}
                            onClick={() => setActiveSegment(s.id)}
                            className={cn(
                                "w-full flex items-center gap-3 p-4 rounded-2xl transition-all font-semibold text-sm",
                                activeSegment === s.id
                                    ? "bg-blue-600 shadow-lg shadow-blue-500/20 text-white"
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
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl">
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-white dark:border-slate-800 shadow-xl">
                                    {userName?.charAt(0) || 'A'}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">{userName || 'Admin Kasir'}</h3>
                                    <p className="text-slate-500 text-sm font-medium">{user?.email}</p>
                                    <span className="inline-block mt-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                                        Status: {user?.role}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nama Kasir</label>
                                    <input
                                        type="text"
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Akun</label>
                                    <input type="email" readOnly value={user?.email || ''} className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border-none text-slate-400 font-medium cursor-not-allowed" />
                                </div>
                            </div>

                            <div className="flex justify-end pt-8 border-t dark:border-slate-800">
                                <button
                                    onClick={() => showAlert({
                                        title: 'Simpan Profil?',
                                        message: 'Apakah Anda yakin ingin memperbarui data profil akun Anda?',
                                        onConfirm: async () => {
                                            const { error } = await updateProfile(userName);
                                            if (error) {
                                                showAlert({ title: 'Gagal!', message: error, variant: 'danger' });
                                            } else {
                                                showAlert({ title: 'Berhasil!', message: 'Profil Anda telah diperbarui.', variant: 'info' });
                                            }
                                        }
                                    })}
                                    className="px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all flex items-center gap-2"
                                >
                                    <Save size={18} />
                                    Simpan Profil
                                </button>
                            </div>
                        </div>
                    )}

                    {activeSegment === 'store' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl">
                            <div>
                                <h2 className="text-xl font-bold mb-2">Informasi Toko & Pajak</h2>
                                <p className="text-slate-500 text-sm">Update nama, alamat, dan pengaturan pajak yang akan tertulis di struk Anda.</p>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nama Bisnis</label>
                                    <input
                                        type="text"
                                        value={businessName}
                                        onChange={(e) => setBusinessName(e.target.value)}
                                        className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Alamat Lengkap</label>
                                    <textarea
                                        rows={3}
                                        value={businessAddress}
                                        onChange={(e) => setBusinessAddress(e.target.value)}
                                        className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 transition-all font-medium resize-none"
                                    />
                                </div>

                                <div className="p-6 rounded-[2rem] bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 space-y-4">
                                    <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
                                        <ShieldCheck size={20} />
                                        <span className="font-bold text-sm uppercase tracking-wider">Konfigurasi Pajak</span>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Persentase PPN (%)</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={taxRate}
                                                onChange={(e) => setTaxRate(Number(e.target.value))}
                                                className="w-full p-4 pr-12 rounded-2xl bg-white dark:bg-slate-900 border-none focus:ring-2 focus:ring-blue-500 transition-all font-black text-lg"
                                                placeholder="0"
                                            />
                                            <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-slate-400">%</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-medium pl-1 italic">* PPN akan otomatis dihitung pada setiap transaksi baru.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-8 border-t dark:border-slate-800">
                                <button
                                    onClick={() => showAlert({
                                        title: 'Simpan Pengaturan?',
                                        message: 'Data toko dan pengaturan pajak akan diperbarui.',
                                        onConfirm: () => {
                                            setStoreInfo({ name: businessName, address: businessAddress });
                                            showAlert({ title: 'Tersimpan!', message: 'Pengaturan toko telah berhasil disimpan.', variant: 'info' });
                                        }
                                    })}
                                    className="px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all flex items-center gap-2"
                                >
                                    <Save size={18} />
                                    Simpan Pengaturan
                                </button>
                            </div>
                        </div>
                    )}

                    {activeSegment === 'security' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl">
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

                                <div className="space-y-4 pt-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Kata Sandi Baru</label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Konfirmasi Kata Sandi</label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-6 border-t dark:border-slate-800">
                                <button
                                    onClick={() => {
                                        if (!newPassword || !confirmPassword) {
                                            showAlert({ title: 'Gagal!', message: 'Semua kolom harus diisi.', variant: 'warning' });
                                            return;
                                        }
                                        if (newPassword !== confirmPassword) {
                                            showAlert({ title: 'Gagal!', message: 'Kata sandi tidak cocok.', variant: 'danger' });
                                            return;
                                        }
                                        showAlert({
                                            title: 'Perbarui Kata Sandi?',
                                            message: 'Anda akan memperbarui kata sandi akun ini.',
                                            onConfirm: async () => {
                                                const { error } = await updatePassword(newPassword);
                                                if (error) {
                                                    showAlert({ title: 'Gagal!', message: error, variant: 'danger' });
                                                } else {
                                                    showAlert({ title: 'Berhasil!', message: 'Kata sandi telah diperbarui.', variant: 'info' });
                                                    setNewPassword('');
                                                    setConfirmPassword('');
                                                }
                                            }
                                        });
                                    }}
                                    className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all"
                                >
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
                                    { key: 'dailyReport', title: 'Laporan Penjualan Harian', desc: 'Terima ringkasan laba setiap sore via email.' },
                                    { key: 'lowStock', title: 'Peringatan Stok Rendah', desc: 'Notifikasi saat stok produk di bawah ambang batas.' },
                                    { key: 'securityAlerts', title: 'Update Keamanan', desc: 'Notifikasi saat ada aktivitas login mencurigakan.' },
                                ].map((item) => (
                                    <div key={item.key} className="flex justify-between items-center p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-colors">
                                        <div className="flex-1 pr-4">
                                            <p className="font-bold text-sm">{item.title}</p>
                                            <p className="text-xs text-slate-500">{item.desc}</p>
                                        </div>
                                        <button
                                            onClick={() => toggleNotification(item.key as any)}
                                            className={cn(
                                                "w-12 h-6 rounded-full relative transition-all duration-300",
                                                notifications[item.key as keyof typeof notifications]
                                                    ? "bg-blue-600"
                                                    : "bg-slate-200 dark:bg-slate-700"
                                            )}
                                        >
                                            <div className={cn(
                                                "absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300",
                                                notifications[item.key as keyof typeof notifications] ? "right-1" : "left-1"
                                            )}></div>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeSegment === 'theme' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl">
                            <div>
                                <h2 className="text-xl font-bold mb-2">Tema & Tampilan</h2>
                                <p className="text-slate-500 text-sm">Pilih tampilan yang paling nyaman untuk mata Anda saat bekerja.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { id: 'light', icon: Sun, label: 'Mode Terang' },
                                    { id: 'dark', icon: Moon, label: 'Mode Gelap' },
                                    { id: 'system', icon: Monitor, label: 'Ikuti Sistem' },
                                ].map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setTheme(t.id as any)}
                                        className={cn(
                                            "flex flex-col items-center gap-4 p-8 rounded-[2rem] border transition-all group relative overflow-hidden",
                                            theme === t.id
                                                ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/30"
                                                : "bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-100 dark:border-slate-800 text-slate-400"
                                        )}
                                    >
                                        <div className={cn(
                                            "p-4 rounded-2xl transition-all",
                                            theme === t.id ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-blue-500"
                                        )}>
                                            <t.icon size={32} />
                                        </div>
                                        <span className={cn(
                                            "font-bold text-sm tracking-tight",
                                            theme === t.id ? "text-white" : "text-slate-600 dark:text-slate-400"
                                        )}>{t.label}</span>
                                        {theme === t.id && (
                                            <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeSegment === 'reports' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl">
                            <div>
                                <h2 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                    <BarChart3 className="text-blue-600" />
                                    Manajemen Laporan
                                </h2>
                                <p className="text-slate-500 text-sm">Bersihkan data transaksi untuk memulai periode baru atau mereset sistem.</p>
                            </div>

                            <div className="space-y-6">
                                <div className="p-8 rounded-[2.5rem] bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                                    <div className="flex items-center gap-4 mb-4 text-red-600 dark:text-red-400">
                                        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-sm">
                                            <RotateCcw size={24} />
                                        </div>
                                        <div>
                                            <p className="font-black uppercase tracking-widest text-xs">Zona Bahaya</p>
                                            <h3 className="text-lg font-bold">Reset Laporan Penjualan</h3>
                                        </div>
                                    </div>

                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 leading-relaxed font-medium">
                                        Menghapus seluruh riwayat transaksi secara permanen. Tindakan ini <span className="text-red-600 font-bold underline">tidak dapat dibatalkan</span>. Pastikan Anda telah mengunduh cadangan jika diperlukan.
                                    </p>

                                    <button
                                        onClick={() => showAlert({
                                            title: 'RESET SEMUA LAPORAN?',
                                            message: 'Tindakan ini akan menghapus SELURUH riwayat transaksi dari database. Apakah Anda yakin?',
                                            variant: 'danger',
                                            confirmText: 'Ya, Reset Laporan',
                                            cancelText: 'Batalkan',
                                            onConfirm: async () => {
                                                await resetTransactions();
                                                showAlert({
                                                    title: 'Berhasil Reset!',
                                                    message: 'Seluruh riwayat laporan telah dibersihkan.',
                                                    variant: 'info'
                                                });
                                            }
                                        })}
                                        className="w-full py-5 rounded-3xl bg-red-600 hover:bg-red-700 text-white font-black shadow-xl shadow-red-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                                    >
                                        <RotateCcw size={24} />
                                        Reset Laporan
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-slate-100 dark:border-slate-800">
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-2">Pemberitahuan</p>
                                <p className="text-xs text-slate-400 leading-normal">Hanya admin yang disarankan melakukan tindakan ini. Data yang sudah dihapus tidak dapat dipulihkan kembali melalui panel kontrol.</p>
                            </div>
                        </div>
                    )}

                    {activeSegment === 'reset' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl">
                            <div>
                                <h2 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                    <Database className="text-blue-600" />
                                    Manajemen Data
                                </h2>
                                <p className="text-slate-500 text-sm">Kelola data transaksi dan laporan aplikasi Anda.</p>
                            </div>

                            <div className="space-y-6">
                                <div className="p-8 rounded-[2.5rem] bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                                    <div className="flex items-center gap-4 mb-4 text-red-600 dark:text-red-400">
                                        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 shadow-sm">
                                            <RotateCcw size={24} />
                                        </div>
                                        <div>
                                            <p className="font-black uppercase tracking-widest text-xs">Zona Bahaya</p>
                                            <h3 className="text-lg font-bold">Reset Semua Laporan</h3>
                                        </div>
                                    </div>

                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 leading-relaxed font-medium">
                                        Menghapus seluruh riwayat transaksi secara permanen dari sistem dan database Supabase. Tindakan ini <span className="text-red-600 font-bold underline">tidak dapat dibatalkan</span>.
                                    </p>

                                    <button
                                        onClick={() => showAlert({
                                            title: 'RESET DATA TRANSAKSI?',
                                            message: 'SEMUA riwayat penjualan akan dihapus permanen. Anda yakin ingin melanjutkan?',
                                            variant: 'danger',
                                            confirmText: 'Ya, Reset Sekarang',
                                            cancelText: 'Batalkan',
                                            onConfirm: async () => {
                                                await resetTransactions();
                                                showAlert({
                                                    title: 'Berhasil di-Reset',
                                                    message: 'Seluruh riwayat transaksi telah dihapus dari sistem.',
                                                    variant: 'info'
                                                });
                                            }
                                        })}
                                        className="w-full py-5 rounded-3xl bg-red-600 hover:bg-red-700 text-white font-black shadow-xl shadow-red-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                                    >
                                        <Trash2 size={24} />
                                        Bersihkan Riwayat Laporan
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-slate-100 dark:border-slate-800">
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-2">Tips Database</p>
                                <p className="text-xs text-slate-400 leading-normal">Gunakan fitur ekspor PDF/CSV di halaman Laporan sebelum melakukan reset untuk mencadangkan data Anda.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}
