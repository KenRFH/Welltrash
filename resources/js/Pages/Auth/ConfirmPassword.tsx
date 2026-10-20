import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { AlertCircle } from 'lucide-react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Konfirmasi Kata Sandi - WellTrash" />

            <div className="mb-6 text-center">
                <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Konfirmasi Keamanan</h1>
                <p className="mt-1.5 text-xs text-zinc-500 leading-relaxed">
                    Ini adalah area yang aman. Silakan konfirmasi kata sandi Anda untuk melanjutkan.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label htmlFor="password" className="block text-xs font-medium text-zinc-700 mb-1.5">
                        Kata Sandi
                    </label>

                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        placeholder="••••••••"
                        autoFocus
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 transition-all"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    {errors.password && (
                        <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.password}</span>
                        </p>
                    )}
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium py-2.5 px-4 rounded-xl text-sm transition-all duration-150 shadow-sm hover:shadow cursor-pointer disabled:opacity-50"
                        disabled={processing}
                    >
                        Konfirmasi & Lanjutkan
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
