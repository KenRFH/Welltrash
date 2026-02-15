import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function AdminLogin({ status }: { status?: string }) {
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
                                type="email"
                                name="email"
                                value={data.email}
                                className="w-full px-4 py-3 rounded-md border-transparent focus:border-black focus:ring-black bg-white placeholder-gray-400 text-black"
                                placeholder="Email"
                                autoComplete="username"
                                autoFocus
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                        </div>

                        <div>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="w-full px-4 py-3 rounded-md border-transparent focus:border-black focus:ring-black bg-white placeholder-gray-400 text-black"
                                placeholder="Password"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
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
