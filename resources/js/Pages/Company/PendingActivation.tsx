import { Head, Link } from '@inertiajs/react';
import React from 'react';

export default function PendingActivation() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-[#F8FAFC] p-4 font-sans relative overflow-hidden">
            <Head title="Menunggu Aktivasi" />
            
            <div className="max-w-md w-full bg-white shadow-[0_20px_60px_rgb(0,0,0,0.04)] rounded-[2rem] p-10 text-center border border-gray-100">
                <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-100">
                    <svg className="w-10 h-10 text-blue-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                
                <h2 className="text-2xl font-black text-gray-900 mb-3">Menunggu Aktivasi</h2>
                <p className="text-gray-500 mb-8 leading-relaxed">
                    Terima kasih telah melakukan pembayaran. Tim admin kami sedang memverifikasi bukti transfer Anda. Jadwal penjemputan akan otomatis dibuat setelah akun Anda diaktifkan.
                </p>

                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="w-full inline-flex items-center justify-center px-6 py-4 bg-white border border-gray-200 rounded-xl font-bold text-sm text-gray-700 shadow-sm hover:bg-gray-50 transition-all"
                >
                    Keluar dari Akun
                </Link>
            </div>
        </div>
    );
}
