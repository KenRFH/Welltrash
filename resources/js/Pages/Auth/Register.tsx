import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Register() {
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
        <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4 font-sans">
            <Head title="Company Register" />

            {/* Logo area */}
            <div className="w-full max-w-[1000px] mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-black">WellTrash</h1>
            </div>

            {/* Main Card */}
            <div className="w-full max-w-[1000px] bg-[#BBF706] rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                
                {/* Form Section (Left) */}
                <div className="z-10">
                    <h2 className="text-4xl font-bold mb-8 text-black">Daftar</h2>

                    <form onSubmit={submit} className="space-y-4">
                        {/* Name */}
                        <div>
                            <input
                                id="name"
                                name="name"
                                value={data.name}
                                className="w-full px-4 py-3 rounded-md border-transparent focus:border-black focus:ring-black bg-white placeholder-gray-400 text-black"
                                placeholder="Nama Lengkap"
                                autoComplete="name"
                                autoFocus
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="w-full px-4 py-3 rounded-md border-transparent focus:border-black focus:ring-black bg-white placeholder-gray-400 text-black"
                                placeholder="Email"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="w-full px-4 py-3 rounded-md border-transparent focus:border-black focus:ring-black bg-white placeholder-gray-400 text-black"
                                placeholder="Password"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                        </div>

                         {/* Confirm Password - Hidden/Implicit or Explicit based on need, User kept it previously */}
                         <div>
                            <input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="w-full px-4 py-3 rounded-md border-transparent focus:border-black focus:ring-black bg-white placeholder-gray-400 text-black"
                                placeholder="Konfirmasi Password"
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                            {errors.password_confirmation && <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>}
                        </div>

                        {/* Forgot Password Link (for visual balance/consistency if desired, or remove) */}
                        <div className="flex justify-end">
                            {/* Empty space or a link if needed */}
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

                {/* Divider / Social Section (Right) */}
                <div className="flex flex-col items-center justify-center space-y-6 z-10">
                    <p className="text-lg font-medium text-black">Atau</p>
                    
                    <a
                        href={route('google.login')}
                        className="w-full max-w-xs flex items-center justify-center gap-3 bg-white py-3 px-4 rounded-md shadow-sm hover:shadow-md transition-shadow"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path
                                fill="#EA4335"
                                d="M12 10.2v3.6h5.1c-.2 1.3-1.5 3.8-5.1 3.8-3.1 0-5.7-2.6-5.7-5.8s2.6-5.8 5.7-5.8c1.8 0 3 .8 3.7 1.4l2.5-2.4C16.8 3.6 14.6 2.7 12 2.7 6.9 2.7 2.7 6.9 2.7 12s4.2 9.3 9.3 9.3c5.4 0 9-3.8 9-9.2 0-.6-.1-1.2-.2-1.9H12z"
                            />
                        </svg>
                        <span className="text-sm font-bold text-gray-800">Masuk dengan Google</span>
                    </a>

                    <div className="text-sm text-center text-black">
                         Sudah punya <span className="text-blue-700 font-bold">Akun?</span> Segera <Link href={route('login')} className="text-blue-700 font-bold hover:underline">Masuk</Link>
                    </div>
                </div>
            </div>

             {/* Footer */}
            <div className="w-full max-w-[1000px] mt-8">
                 <Link href={route('beranda')} className="text-black font-semibold hover:underline flex items-center gap-1">
                    Kembali ke <span className="text-green-600">Beranda</span>
                </Link>
            </div>
        </div>
    );
}
