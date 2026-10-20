import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { CheckCircle2, Mail } from 'lucide-react';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verifikasi Email - WellTrash" />

            <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                    <Mail className="w-6 h-6" />
                </div>
                <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Verifikasi Email Anda</h1>
                <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
                    Terima kasih telah bergabung! Silakan klik tautan verifikasi yang baru saja kami kirimkan ke email Anda untuk mengaktifkan akun.
                </p>
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2 border border-emerald-100 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Tautan verifikasi baru telah dikirimkan ke alamat email Anda.</span>
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium py-2.5 px-4 rounded-xl text-sm transition-all duration-150 shadow-sm hover:shadow cursor-pointer disabled:opacity-50"
                    disabled={processing}
                >
                    Kirim Ulang Email Verifikasi
                </button>

                <div className="text-center">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors hover:underline cursor-pointer"
                    >
                        Keluar Akun
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
