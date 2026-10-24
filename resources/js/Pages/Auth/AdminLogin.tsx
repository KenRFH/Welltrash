import { Head, Link, useForm } from '@inertiajs/react';
import React, { useState, FormEventHandler } from 'react';
import Welltrash_logo from '@/assets/img/logowelltrash.webp';
import QuickLoginDemo from '@/Components/QuickLoginDemo';
import {
    Eye,
    EyeOff,
    ArrowRight,
    ArrowLeft,
    AlertCircle,
    CheckCircle2,
    Shield,
} from 'lucide-react';

export default function AdminLogin({ status, isDemo = false }: { status?: string; isDemo?: boolean }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('admin.login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans text-zinc-900 selection:bg-emerald-500 selection:text-white">
            <Head title="Masuk Admin - WellTrash" />

            {/* Top Navigation */}
            <header className="w-full max-w-md mx-auto flex items-center justify-between">
                <Link
                    href={route('login')}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors py-1 px-2.5 rounded-lg hover:bg-zinc-200/50"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Portal Pengguna</span>
                </Link>
                <div className="flex items-center gap-1 text-[11px] font-medium text-zinc-400">
                    <Shield className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Internal Staf</span>
                </div>
            </header>

            {/* Main Centered Card */}
            <main className="w-full max-w-md mx-auto my-auto py-6">
                <div className="bg-white rounded-3xl p-7 sm:p-9 border border-zinc-200/80 shadow-[0_10px_35px_rgba(0,0,0,0.03)]">
                    {/* Header */}
                    <div className="text-center mb-7">
                        <Link href={route('beranda')} className="inline-block transition-transform hover:opacity-90 mb-4">
                            <img
                                src={Welltrash_logo}
                                alt="WellTrash"
                                className="h-10 w-auto mx-auto object-contain"
                            />
                        </Link>
                        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
                            Masuk Administrator
                        </h1>
                        <p className="text-xs sm:text-sm text-zinc-500 mt-1.5 leading-relaxed">
                            Akses internal untuk staf dan operasional sistem WellTrash.
                        </p>
                    </div>

                    {/* Status Message */}
                    {status && (
                        <div className="mb-5 p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-800 text-xs flex items-center gap-2 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>{status}</span>
                        </div>
                    )}

                    {/* Quick Demo Credentials */}
                    <QuickLoginDemo
                        isDemo={isDemo}
                        onFill={(email, password) => setData((prev) => ({ ...prev, email, password }))}
                        activeEmail={data.email}
                        submitRoute={route('admin.login')}
                        actorScope="staff"
                    />

                    {/* Form */}
                    <form onSubmit={submit} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-xs font-medium text-zinc-700 mb-1.5"
                            >
                                Email Administrator
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="admin@welltrash.id"
                                autoFocus
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
                                    placeholder="••••••••"
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

                        {/* Remember Me */}
                        <div className="flex items-center pt-0.5">
                            <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-zinc-600 hover:text-zinc-900">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="w-4 h-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0 transition-colors"
                                />
                                <span>Ingat saya</span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-950 text-white font-medium py-2.5 px-4 rounded-xl text-sm transition-all duration-150 shadow-sm hover:shadow flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
                            >
                                <span>{processing ? 'Mengautentikasi...' : 'Masuk Dashboard Staf'}</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            {/* Clean Minimalist Page Footer */}
            <footer className="w-full max-w-md mx-auto text-center text-xs text-zinc-400">
                <span>© {new Date().getFullYear()} PT WellTrash Sirkular Indonesia • Akses Internal</span>
            </footer>
        </div>
    );
}
