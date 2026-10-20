import { Head, Link, useForm } from '@inertiajs/react';
import React, { useState, FormEventHandler } from 'react';
import Welltrash_logo from '@/assets/img/logowelltrash.webp';
import {
    Eye,
    EyeOff,
    ArrowRight,
    ArrowLeft,
    AlertCircle,
    Sparkles,
} from 'lucide-react';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen bg-[#FBFDFB] flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans text-zinc-900 selection:bg-emerald-500 selection:text-white">
            <Head title="Daftar Akun - WellTrash" />

            {/* Top Navigation */}
            <header className="w-full max-w-md mx-auto flex items-center justify-between">
                <Link
                    href={route('beranda')}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-emerald-700 transition-colors py-1 px-2.5 rounded-lg hover:bg-emerald-50/60"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Kembali ke Beranda</span>
                </Link>
                <span className="text-[11px] font-medium text-emerald-700/80 tracking-wide uppercase">
                    WellTrash ID
                </span>
            </header>

            {/* Main Centered Card */}
            <main className="w-full max-w-md mx-auto my-auto py-6">
                <div className="bg-white rounded-3xl p-7 sm:p-9 border border-zinc-200/80 shadow-[0_10px_35px_rgba(0,0,0,0.03)]">
                    {/* Brand Logo & Title */}
                    <div className="text-center mb-7">
                        <Link href={route('beranda')} className="inline-block transition-transform hover:opacity-90 mb-4">
                            <img
                                src={Welltrash_logo}
                                alt="WellTrash"
                                className="h-10 w-auto mx-auto object-contain"
                            />
                        </Link>
                        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
                            Daftar Akun Baru
                        </h1>
                        <p className="text-xs sm:text-sm text-zinc-500 mt-1.5 leading-relaxed">
                            Mulai langkah cerdas untuk lingkungan yang bersih dan terawat.
                        </p>
                    </div>

                    {/* Google OAuth Button */}
                    <a
                        href={route('google.login')}
                        className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/70 text-zinc-700 text-sm font-medium transition-all cursor-pointer shadow-xs"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            />
                        </svg>
                        <span>Daftar dengan Google</span>
                    </a>

                    {/* Divider */}
                    <div className="relative my-5">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-zinc-200/80" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-white px-3 text-zinc-400">atau dengan email</span>
                        </div>
                    </div>

                    {/* Registration Form */}
                    <form onSubmit={submit} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-xs font-medium text-zinc-700 mb-1.5"
                            >
                                Nama Lengkap / Instansi
                            </label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Contoh: Budi Santoso / PT Bersih Berkah"
                                autoFocus
                                required
                                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 transition-all"
                            />
                            {errors.name && (
                                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                    <span>{errors.name}</span>
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-xs font-medium text-zinc-700 mb-1.5"
                            >
                                Alamat Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="nama@email.com"
                                required
                                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 transition-all"
                            />
                            {errors.email && (
                                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                    <span>{errors.email}</span>
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-xs font-medium text-zinc-700 mb-1.5"
                            >
                                Kata Sandi
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Minimal 8 karakter"
                                    required
                                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-600 transition-colors focus:outline-none cursor-pointer"
                                    title={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                    <span>{errors.password}</span>
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label
                                htmlFor="password_confirmation"
                                className="block text-xs font-medium text-zinc-700 mb-1.5"
                            >
                                Konfirmasi Kata Sandi
                            </label>
                            <div className="relative">
                                <input
                                    id="password_confirmation"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Ulangi kata sandi Anda"
                                    required
                                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-600 transition-colors focus:outline-none cursor-pointer"
                                    title={showConfirmPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            {errors.password_confirmation && (
                                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                    <span>{errors.password_confirmation}</span>
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium py-2.5 px-4 rounded-xl text-sm transition-all duration-150 shadow-sm hover:shadow flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
                            >
                                <span>{processing ? 'Mendaftarkan Akun...' : 'Daftar Sekarang'}</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                            </button>
                        </div>
                    </form>

                    {/* Bottom Switch Link */}
                    <div className="mt-6 pt-5 border-t border-zinc-100 text-center text-xs sm:text-sm text-zinc-600">
                        Sudah memiliki akun?{' '}
                        <Link
                            href={route('login')}
                            className="font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                        >
                            Masuk di sini
                        </Link>
                    </div>
                </div>
            </main>

            {/* Clean Minimalist Page Footer */}
            <footer className="w-full max-w-md mx-auto text-center text-xs text-zinc-400 flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5 text-emerald-700/80 font-medium">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Solusi Pengelolaan Sampah Bersih & Berkelanjutan</span>
                </div>
                <span>© {new Date().getFullYear()} PT WellTrash Sirkular Indonesia</span>
            </footer>
        </div>
    );
}
