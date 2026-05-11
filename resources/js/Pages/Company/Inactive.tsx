import { Head, Link } from '@inertiajs/react';
import React from 'react';

export default function Inactive() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-[#F8FAFC] p-4 font-sans relative overflow-hidden">
            <Head title="Akun Dinonaktifkan | WellTrash" />
            
            <div className="max-w-md w-full bg-white shadow-[0_20px_60px_rgb(0,0,0,0.04)] rounded-[2rem] p-10 text-center border border-gray-100">
                <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-200">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                
                <h2 className="text-2xl font-black text-gray-900 mb-3">Akun Dinonaktifkan</h2>
                <p className="text-gray-500 mb-8 leading-relaxed">
                    Mohon maaf, layanan kemitraan Anda saat ini sedang dinonaktifkan oleh tim admin kami. Silakan hubungi admin via WhatsApp untuk informasi lebih lanjut.
                </p>

                <div className="flex flex-col gap-3">
                    <a
                        href="https://wa.me/62811988706"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center px-6 py-4 bg-[#FE961C] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all"
                    >
                        Hubungi Admin
                    </a>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full inline-flex items-center justify-center px-6 py-4 bg-white border border-gray-200 rounded-xl font-bold text-sm text-gray-700 hover:bg-gray-50 transition-all"
                    >
                        Keluar
                    </Link>
                </div>
            </div>
        </div>
    );
}
