import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import CompanySidebar from '@/Components/CompanySidebar';

interface Props {
    company: {
        id: number;
        company_name: string;
        subscription_plan: string;
        subscription_status: string;
        subscription_end_date: string | null;
        payment_evidence_path: string | null;
    };
    activeDaysLeft: number;
    auth: {
        user: { name: string }
    };
}

export default function Billing({ auth, company, activeDaysLeft }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        payment_evidence: null as File | null,
    });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData('payment_evidence', file);
            
            // Create preview if it's an image
            if (file.type.startsWith('image/')) {
                const url = URL.createObjectURL(file);
                setPreviewUrl(url);
            } else {
                setPreviewUrl(null);
            }
        }
    };

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('company.billing.pay'), {
            preserveScroll: true,
            onSuccess: () => {
                alert('Pembayaran berhasil diunggah dan masa aktif telah diperpanjang.');
                setData('payment_evidence', null);
                setPreviewUrl(null);
            },
        });
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans">
            <Head title="Tagihan | WellMaggot" />

            <CompanySidebar 
                active="billing" 
                isMobileOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                plan={company.subscription_plan}
            />

            <div className="flex-1 flex flex-col overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-green-50 to-emerald-50 opacity-50 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none"></div>

                <header className="h-24 flex items-center justify-between px-6 sm:px-10 bg-white/60 backdrop-blur-md border-b border-gray-100 z-10 sticky top-0">
                    <div className="flex items-center gap-4 flex-1">
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 text-gray-500 hover:text-green-600 md:hidden focus:outline-none"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 hidden sm:block">Tagihan & Perpanjangan</h1>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto px-6 py-8 sm:px-10">
                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* Days Left Card */}
                        <div className="md:col-span-1 bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-8 shadow-sm border border-white/10 text-white relative flex flex-col justify-center items-center text-center overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-400 opacity-20 rounded-full blur-2xl -ml-10 -mb-10"></div>
                            
                            <h3 className="text-sm font-bold text-green-100 uppercase tracking-wider mb-2 relative z-10">Sisa Masa Aktif Kemitraan</h3>
                            <div className="text-6xl font-black relative z-10 my-4 tracking-tight drop-shadow-md">
                                {activeDaysLeft}
                            </div>
                            <p className="text-green-100 font-medium relative z-10">Hari</p>
                            
                            {activeDaysLeft < 7 && activeDaysLeft >= 0 && (
                                <span className="mt-4 inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold bg-yellow-400/20 text-yellow-100 border border-yellow-400/50">
                                    Segera Perpanjang!
                                </span>
                            )}
                        </div>

                        {/* Payment Upload Card */}
                        <div className="md:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative z-10">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Perpanjang Kemitraan</h3>
                            <p className="text-gray-500 font-medium text-sm mb-6">Untuk memperpanjang masa aktif kemitraan selama 30 hari, silakan unggah bukti pembayaran Anda di bawah ini.</p>
                            
                            <form onSubmit={handleUpload} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-700">Bukti Pembayaran (JPG/PNG/PDF, Max 5MB)</label>
                                    
                                    <div className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-2xl transition-colors ${previewUrl ? 'border-green-300 bg-green-50/30' : 'border-gray-300 hover:border-green-400 hover:bg-green-50/10'}`}>
                                        <div className="space-y-1 text-center w-full">
                                            {previewUrl ? (
                                                <div className="mb-4">
                                                    <img src={previewUrl} alt="Preview" className="mx-auto h-32 object-contain rounded-lg shadow-sm" />
                                                </div>
                                            ) : (
                                                <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            )}
                                            
                                            <div className="flex text-sm text-gray-600 justify-center">
                                                <label className="relative cursor-pointer bg-white rounded-md font-bold text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500 transition-colors">
                                                    <span>{data.payment_evidence ? 'Ganti file' : 'Unggah file'}</span>
                                                    <input 
                                                        type="file" 
                                                        className="sr-only" 
                                                        accept=".jpeg,.png,.jpg,.pdf"
                                                        onChange={handleFileChange}
                                                    />
                                                </label>
                                                {!data.payment_evidence && <p className="pl-1">atau seret dan lepas</p>}
                                            </div>
                                            {data.payment_evidence && (
                                                <p className="text-xs text-gray-500 mt-2 font-medium">Terpilih: {data.payment_evidence.name}</p>
                                            )}
                                        </div>
                                    </div>
                                    {errors.payment_evidence && <p className="text-red-500 text-sm">{errors.payment_evidence}</p>}
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={processing || !data.payment_evidence}
                                    className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-2xl shadow-sm xl:text-base text-sm font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {processing ? 'Mengunggah...' : 'Kirim Bukti Pembayaran'}
                                </button>
                            </form>

                        </div>

                        {/* Payment Info Card */}
                        <div className="md:col-span-3 bg-blue-50/50 rounded-3xl p-8 border border-blue-100 flex items-start space-x-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-blue-900">Informasi Pembayaran Rekening</h4>
                                <p className="text-blue-800/80 mt-1 mb-3 text-sm">Silakan transfer sesuai dengan paket langganan Anda ke rekening berikut:</p>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between bg-white/60 p-3 rounded-xl border border-blue-100">
                                        <span className="font-bold text-gray-700">Bank BCA</span>
                                        <span className="font-bold text-blue-900 font-mono tracking-wider">1234 5678 90</span>
                                        <span className="text-gray-500 text-xs">a.n PT WellMaggot</span>
                                    </div>
                                    <div className="flex items-center justify-between bg-white/60 p-3 rounded-xl border border-blue-100">
                                        <span className="font-bold text-gray-700">Bank Mandiri</span>
                                        <span className="font-bold text-blue-900 font-mono tracking-wider">098 765 432 1</span>
                                        <span className="text-gray-500 text-xs">a.n PT WellMaggot</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
