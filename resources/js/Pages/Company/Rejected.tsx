import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

interface Props {
    company: {
        company_name: string;
        rejection_reason: string;
        refund_evidence_path: string | null;
    };
}

export default function Rejected({ company }: Props) {
    const { post, processing } = useForm();

    const handleReRegister = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('company.reregister'));
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-[#F8FAFC] p-4 font-sans relative overflow-hidden">
            <Head title="Pendaftaran Ditolak | WellTrash" />
            
            {/* Background elements to match theme */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-gray-100 to-transparent -z-10"></div>
            <div className="absolute top-20 right-20 w-96 h-96 rounded-full blur-[100px] opacity-20 pointer-events-none" style={{ backgroundColor: '#FE961C' }}></div>
            <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full blur-[100px] opacity-20 pointer-events-none" style={{ backgroundColor: '#7CC13B' }}></div>

            <div className="max-w-2xl w-full">
                {/* Logo Area */}
                <div className="flex justify-center mb-8">
                    <Link href="/" className="inline-block">
                        <h1 className="text-3xl font-black tracking-tighter text-gray-900">
                            Well<span style={{ color: '#7CC13B' }}>trash.</span>
                        </h1>
                    </Link>
                </div>

                <div className="bg-white shadow-[0_20px_60px_rgb(0,0,0,0.04)] rounded-[2rem] p-8 sm:p-12 border border-gray-100 relative overflow-hidden text-center">
                    
                    {/* Icon */}
                    <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm border" style={{ backgroundColor: '#FFF5F5', borderColor: '#FFE5E5' }}>
                        <svg className="w-12 h-12" style={{ color: '#EF4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    
                    <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4 tracking-tight leading-tight">Pendaftaran <span style={{ color: '#EF4444' }}>Ditolak</span></h2>
                    <p className="text-gray-500 mb-8 text-base sm:text-lg leading-relaxed max-w-lg mx-auto">
                        Mohon maaf, pengajuan kemitraan untuk <strong className="font-bold text-gray-900">{company.company_name}</strong> belum dapat kami setujui pada saat ini.
                    </p>

                    {/* Reason Box */}
                    <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6 sm:p-8 mb-10 text-left relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Keterangan Admin</h3>
                        <p className="text-gray-900 font-medium leading-relaxed mb-6">
                            {company.rejection_reason || 'Tidak ada alasan spesifik yang diberikan oleh tim admin.'}
                        </p>

                        {company.refund_evidence_path && (
                            <div className="pt-6 border-t border-gray-200">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Dana Telah Dikembalikan</h3>
                                <a 
                                    href={`/storage/${company.refund_evidence_path}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="group inline-flex items-center px-5 py-3 bg-white text-gray-900 hover:text-[#FE961C] border border-gray-200 hover:border-[#FE961C] rounded-xl font-bold text-sm transition-all shadow-sm"
                                >
                                    <svg className="w-5 h-5 mr-3 text-gray-400 group-hover:text-[#FE961C] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                    Lihat Bukti Transfer Refund
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <form onSubmit={handleReRegister} className="flex-1">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex items-center justify-center px-8 py-4 text-white font-black rounded-2xl shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl disabled:opacity-50 disabled:hover:translate-y-0"
                                style={{ backgroundColor: '#FE961C' }}
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                Daftar Ulang
                            </button>
                        </form>

                        <div className="flex flex-1 gap-4">
                            <Link
                                href="/"
                                className="flex-1 inline-flex items-center justify-center px-6 py-4 bg-white border-2 border-gray-100 rounded-2xl font-bold text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
                            >
                                Beranda
                            </Link>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="flex-1 inline-flex items-center justify-center px-6 py-4 bg-white border-2 border-gray-100 rounded-2xl font-bold text-sm text-gray-600 hover:bg-red-50 hover:border-red-100 hover:text-red-600 transition-all"
                            >
                                Keluar
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
