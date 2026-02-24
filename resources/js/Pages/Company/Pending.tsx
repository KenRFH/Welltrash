import { Head, Link } from '@inertiajs/react';

export default function Pending() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-4 font-sans">
            <Head title="Menunggu Persetujuan | WellMaggot" />
            
            <div className="max-w-md w-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-3xl p-10 text-center border border-gray-100 relative overflow-hidden">
                {/* Decorative background blur */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                <div className="relative">
                    <div className="w-20 h-20 bg-yellow-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-yellow-100">
                        <svg className="w-10 h-10 text-yellow-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-3 tracking-tight">Menunggu Persetujuan</h2>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        Pendaftaran perusahaan dan dokumen Anda saat ini sedang dalam proses peninjauan oleh tim admin kami. Kami akan memberi tahu Anda segera setelah akun Anda disetujui.
                    </p>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="inline-flex items-center justify-center w-full px-6 py-3 bg-white border border-gray-200 rounded-xl font-semibold text-sm text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all"
                    >
                        Keluar dari Akun
                    </Link>
                </div>
            </div>
        </div>
    );
}
