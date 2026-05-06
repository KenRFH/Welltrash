import { Head, useForm, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import AdminSidebar from '@/Components/AdminSidebar';

interface Company {
    id: number;
    company_name: string;
    subscription_plan: string;
    payment_evidence_path: string | null;
    signed_mou_path: string | null;
    user: {
        name: string;
        email: string;
    };
}

interface Props {
    companies: Company[];
}

export default function Cancellations({ companies }: Props) {
    const { delete: destroy, processing } = useForm();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleApproveCancellation = (e: React.FormEvent, id: number) => {
        e.preventDefault();
        if (confirm('Apakah Anda yakin ingin menyetujui pembatalan ini? Data perusahaan akan dihapus dari sistem.')) {
            destroy(route('admin.companies.cancellations.approve', id));
        }
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans">
            <Head title="Permintaan Pembatalan | WellTrash Admin" />
            <AdminSidebar active="cancellations" isMobileOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 flex items-center justify-between px-6 sm:px-10 bg-white/70 backdrop-blur-md border-b border-gray-100 z-10 sticky top-0">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-gray-500 hover:text-orange-600 md:hidden focus:outline-none">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <div>
                            <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Permintaan Pembatalan</h1>
                            <p className="text-xs text-gray-400 font-medium">Tinjau perusahaan yang ingin berhenti berlangganan</p>
                        </div>
                    </div>
                    <div className="bg-red-50 text-red-700 px-4 py-2 rounded-xl font-bold text-sm border border-red-100">
                        {companies.length} Permintaan
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto px-4 sm:px-10 py-8">
                    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                        {companies.length === 0 ? (
                            <div className="p-16 flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">Tidak Ada Permintaan Pembatalan</h3>
                                <p className="text-gray-500">Saat ini tidak ada perusahaan yang meminta untuk berhenti berlangganan.</p>
                            </div>
                        ) : (
                            <ul role="list" className="divide-y divide-gray-100">
                                {companies.map((company) => (
                                    <li key={company.id} className="hover:bg-gray-50/50 transition-colors">
                                        <div className="px-6 py-6 flex flex-col lg:flex-row lg:items-center gap-4">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-gray-900">{company.company_name}</h3>
                                                <p className="text-sm font-medium text-gray-500 mt-1">
                                                    Oleh: <span className="text-gray-700">{company.user.name}</span>{' '}
                                                    <span className="text-gray-400 font-normal">({company.user.email})</span>
                                                </p>
                                                <div className="mt-3">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-100">
                                                        Menunggu Pembatalan
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0 flex items-center gap-3 lg:border-l lg:border-gray-100 lg:pl-6">
                                                <Link href={route('admin.companies.show', company.id)} className="px-4 py-2.5 text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-100 rounded-xl font-bold text-sm flex items-center justify-center transition-colors">
                                                    Detail
                                                </Link>
                                                <form onSubmit={(e) => handleApproveCancellation(e, company.id)}>
                                                    <button type="submit" disabled={processing} className="px-6 py-2.5 text-white bg-red-600 hover:bg-red-700 border border-transparent rounded-xl font-bold text-sm flex items-center justify-center shadow-sm transition-colors disabled:opacity-50">
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                                                        Setujui & Hapus
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
