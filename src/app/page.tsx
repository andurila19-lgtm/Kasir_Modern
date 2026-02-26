'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@kasirpro.id');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      login(email, email.includes('admin') ? 'ADMIN' : 'CASHIER');
      router.push('/dashboard');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-blue-600 text-white mb-4 shadow-xl shadow-blue-500/30">
            <ShoppingCart size={32} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">KasirPro</h1>
          <p className="text-slate-500">Pusat kelola bisnis Anda dengan mudah dan cepat.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-2xl relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>

          <form onSubmit={handleLogin} className="space-y-6 relative">
            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold">Kata Sandi</label>
                <button type="button" className="text-xs text-blue-600 font-bold hover:underline">Lupa password?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Masuk Sekarang
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-sm text-slate-500">
          Belum punya akun? <button className="text-blue-600 font-bold hover:underline">Daftar sekarang</button>
        </p>

        <div className="mt-12 flex items-center justify-center gap-8 text-slate-400 grayscale opacity-50">
          <div className="flex items-center gap-1 font-bold italic">VISA</div>
          <div className="flex items-center gap-1 font-bold italic">MasterCard</div>
          <div className="flex items-center gap-1 font-bold italic">QRIS</div>
        </div>
      </div>
    </div>
  );
}
