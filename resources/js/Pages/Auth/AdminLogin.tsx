import { Head, Link, useForm } from '@inertiajs/react';
import React, { useState, FormEventHandler } from 'react';

export default function AdminLogin({ status }: { status?: string }) {
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
         <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4 font-sans">
            <Head title="Admin Login" />
            
            {/* Logo area */}
            <div className="w-full max-w-[1000px] mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-black">WellTrash</h1>
            </div>

            {/* Main Card */}
            <div className="w-full max-w-[1000px] bg-[#BBF706] rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden flex items-center justify-center">
                
                {/* Form Section (Centered) */}
                <div className="z-10 w-full max-w-md">
                    <h2 className="text-4xl font-bold mb-8 text-black text-center">Admin Masuk</h2>
                    
                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-800 text-center">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <input
                                id="email"
                                type="text"
                                name="email"
                                value={data.email}
                                className="w-full px-4 py-3 rounded-md border-transparent focus:border-black focus:ring-black bg-white placeholder-gray-400 text-black"
                                placeholder="Nama / Email"
                                autoComplete="username"
                                autoFocus
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                        </div>

                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={data.password}
                                className="w-full px-4 py-3 pr-12 rounded-md border-transparent focus:border-black focus:ring-black bg-white placeholder-gray-400 text-black"
                                placeholder="Password"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-black focus:outline-none"
                            >
                                {showPassword ? (
                                    <svg className="h-5 w-5 animate-in fade-in duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                ) : (
                                    <svg className="h-5 w-5 animate-in fade-in duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.025 10.025 0 012.247-4.025m3.479-2.871A9.957 9.957 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21m-9-9a3 3 0 11-6 0 3 3 0 016 0z" strokeDasharray="3 3"/></svg>
                                )}
                            </button>
                            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-gray-300 text-black shadow-sm focus:ring-black"
                                />
                                <span className="ms-2 text-sm text-black">Ingat Saya</span>
                            </label>
                        </div>

                        <div className="pt-2">
                             <button
                                type="submit"
                                className="w-full justify-center bg-[#0F172A] hover:bg-black text-white py-3 rounded-md text-lg font-medium transition-colors disabled:opacity-50"
                                disabled={processing}
                            >
                                Masuk
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Footer */}
            <div className="w-full max-w-[1000px] mt-8">
                 <Link href="/" className="text-black font-semibold hover:underline flex items-center gap-1">
                    Kembali ke <span className="text-green-600">Beranda</span>
                </Link>
            </div>
        </div>
    );
}
