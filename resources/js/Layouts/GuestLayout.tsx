
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import Welltrash_logo from '@/assets/img/logowelltrash.webp';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen flex flex-col justify-between p-4 sm:p-6 lg:p-8 bg-[#FBFDFB] font-sans text-zinc-900 selection:bg-emerald-500 selection:text-white">
            <header className="w-full max-w-md mx-auto flex items-center justify-between">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-emerald-700 transition-colors py-1 px-2.5 rounded-lg hover:bg-emerald-50/60"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Kembali ke Beranda</span>
                </Link>
                <span className="text-[11px] font-medium text-emerald-700/80 tracking-wide uppercase">
                    WellTrash ID
                </span>
            </header>

            <main className="w-full max-w-md mx-auto my-auto py-6">
                <div className="bg-white rounded-3xl p-7 sm:p-9 border border-zinc-200/80 shadow-[0_10px_35px_rgba(0,0,0,0.03)]">
                    <div className="text-center mb-6">
                        <Link href="/" className="inline-block transition-transform hover:opacity-90">
                            <img
                                src={Welltrash_logo}
                                alt="WellTrash"
                                className="h-10 w-auto mx-auto object-contain"
                            />
                        </Link>
                    </div>
                    {children}
                </div>
            </main>

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

