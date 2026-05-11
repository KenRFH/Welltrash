import { Head, useForm, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import AdminSidebar from '@/Components/AdminSidebar';

interface Company {
    id: number;
    company_name: string;
    pic_name: string;
    address: string;
    phone: string;
    business_category: string | null;
    pickup_schedule: string[] | null;
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

export default function PendingCompanies({ companies }: Props) {
    const { patch, processing } = useForm();
    const rejectForm = useForm({
        rejection_reason: '',
    });
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);

    const handleApprove = (e: React.FormEvent, id: number) => {
        e.preventDefault();
        patch(route('admin.companies.approve', id));
    };

    const openRejectModal = (id: number) => {
        setSelectedCompanyId(id);
        rejectForm.reset();
        setRejectModalOpen(true);
    };

    const closeRejectModal = () => {
        setRejectModalOpen(false);
        setSelectedCompanyId(null);
        rejectForm.reset();
    };

    const handleRejectSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedCompanyId) {
            rejectForm.post(route('admin.companies.reject', selectedCompanyId), {
                onSuccess: () => closeRejectModal(),
            });
        }
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans">
            <Head title="Menunggu Persetujuan | WellTrash Admin" />
            <AdminSidebar active="pending" isMobileOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-20 flex items-center justify-between px-6 sm:px-10 bg-white/70 backdrop-blur-md border-b border-gray-100 z-10 sticky top-0">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-gray-500 hover:text-orange-600 md:hidden focus:outline-none">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <div>
                            <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Menunggu Persetujuan</h1>
                            <p className="text-xs text-gray-400 font-medium">Tinjau dan verifikasi pendaftaran baru</p>
                        </div>
                    </div>
                    <div className="bg-yellow-50 text-yellow-700 px-4 py-2 rounded-xl font-bold text-sm border border-yellow-100">
                        {companies.length} Menunggu
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto px-4 sm:px-10 py-8">
                    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                        {companies.length === 0 ? (
                            <div className="p-16 flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">Tidak Ada Pendaftaran</h3>
                                <p className="text-gray-500">Saat ini tidak ada perusahaan yang menunggu persetujuan Anda.</p>
                            </div>
                        ) : (
                            <ul role="list" className="divide-y divide-gray-100">
                                {companies.map((company) => (
                                    <li key={company.id} className="hover:bg-gray-50/50 transition-colors">
                                        <div className="px-6 py-6 flex flex-col lg:flex-row lg:items-center">
                                            <div className="flex-1 flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                                <div className="mb-4 lg:mb-0 lg:pr-6 lg:w-1/2">
                                                    <div className="flex flex-col">
                                                        <h3 className="text-xl font-bold text-gray-900 truncate mb-2">{company.company_name}</h3>
                                                        <div className="text-sm text-gray-600 space-y-1.5 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                            <p className="flex justify-between">
                                                                <span className="font-semibold text-gray-500">PIC:</span>
                                                                <span className="text-right text-gray-900">{company.pic_name} ({company.phone})</span>
                                                            </p>
                                                            <p className="flex justify-between">
                                                                <span className="font-semibold text-gray-500">Akun:</span>
                                                                <span className="text-right text-gray-900">{company.user.name} ({company.user.email})</span>
                                                            </p>
                                                            <p className="flex justify-between">
                                                                <span className="font-semibold text-gray-500">Kategori:</span>
                                                                <span className="text-right text-gray-900">{company.business_category || '-'}</span>
                                                            </p>
                                                            <div className="pt-2 mt-2 border-t border-gray-200">
                                                                <p className="flex flex-col">
                                                                    <span className="font-semibold text-gray-500 mb-1">Alamat:</span>
                                                                    <span className="text-gray-900 leading-snug">{company.address}</span>
                                                                </p>
                                                            </div>
                                                            <div className="pt-2 mt-2 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                                <span className="font-semibold text-gray-500 shrink-0">Jadwal:</span>
                                                                <div className="flex flex-wrap gap-1.5 justify-end">
                                                                    {company.pickup_schedule && company.pickup_schedule.length > 0 ? (
                                                                        company.pickup_schedule.map((day, index) => (
                                                                            <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-100 uppercase tracking-wider">
                                                                                {day}
                                                                            </span>
                                                                        ))
                                                                    ) : (
                                                                        <span className="text-[10px] text-gray-400 italic">Belum diset</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4">
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold leading-5 bg-orange-50 text-orange-700 border border-orange-100 shadow-sm">
                                                            Paket: {company.subscription_plan}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="mb-6 lg:mb-0 flex-shrink-0 lg:mx-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Dokumen Terlampir</h4>
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm font-medium">
                                                        {company.payment_evidence_path ? (
                                                            <a href={`/storage/${company.payment_evidence_path}`} target="_blank" rel="noopener noreferrer" className="flex items-center px-4 py-2 bg-white text-orange-600 hover:text-orange-800 border border-orange-100 hover:border-orange-300 hover:shadow-sm rounded-xl transition-all">
                                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                                                Lihat Pembayaran
                                                            </a>
                                                        ) : (
                                                            <span className="flex items-center px-4 py-2 bg-gray-50 text-gray-400 border border-dashed border-gray-200 rounded-xl">Belum Ada Pembayaran</span>
                                                        )}
                                                        {company.signed_mou_path ? (
                                                            <a href={`/storage/${company.signed_mou_path}`} target="_blank" rel="noopener noreferrer" className="flex items-center px-4 py-2 bg-white text-green-600 hover:text-green-800 border border-green-100 hover:border-green-300 hover:shadow-sm rounded-xl transition-all">
                                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                                                                Lihat MOU
                                                            </a>
                                                        ) : (
                                                            <span className="flex items-center px-4 py-2 bg-gray-50 text-gray-400 border border-dashed border-gray-200 rounded-xl">Belum Ada MOU</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex-shrink-0 flex flex-wrap items-center gap-3 lg:border-l lg:border-gray-100 lg:pl-6">
                                                <a 
                                                    href={`https://wa.me/${company.phone.startsWith('0') ? '62' + company.phone.slice(1) : company.phone}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full sm:w-auto px-4 py-2.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-xl font-bold text-sm flex items-center justify-center transition-colors"
                                                    title="Hubungi PIC via WhatsApp"
                                                >
                                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                                    </svg>
                                                    Hubungi PIC
                                                </a>
                                                <button type="button" onClick={() => openRejectModal(company.id)} className="w-full sm:w-auto px-4 py-2.5 text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-xl font-bold text-sm flex items-center justify-center transition-colors" title="Tolak Pendaftaran">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                                                    Tolak
                                                </button>
                                                <form onSubmit={(e) => handleApprove(e, company.id)} className="w-full sm:w-auto">
                                                    <button type="submit" disabled={processing} className="w-full sm:w-auto px-6 py-2.5 text-white bg-green-600 hover:bg-green-700 border border-transparent rounded-xl font-bold text-sm flex items-center justify-center shadow-sm transition-colors disabled:opacity-50" title="Setujui Pendaftaran">
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                                                        Setujui
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

            {/* Modal Penolakan */}
            {rejectModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                        <div className="fixed inset-0 transition-opacity bg-gray-900/75 backdrop-blur-sm" onClick={closeRejectModal} />

                        <div className="relative inline-block w-full max-w-lg p-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-3xl sm:my-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-black text-gray-900">Penolakan Mitra</h3>
                                <button onClick={closeRejectModal} className="p-2 text-gray-400 bg-gray-50 rounded-full hover:text-gray-500 hover:bg-gray-100 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <form onSubmit={handleRejectSubmit}>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">Alasan Penolakan</label>
                                        <textarea
                                            value={rejectForm.data.rejection_reason}
                                            onChange={e => rejectForm.setData('rejection_reason', e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
                                            rows={3}
                                            placeholder="Tuliskan alasan penolakan secara spesifik..."
                                            required
                                        ></textarea>
                                        {rejectForm.errors.rejection_reason && <p className="mt-2 text-sm text-red-600 font-medium">{rejectForm.errors.rejection_reason}</p>}
                                    </div>
                                </div>

                                <div className="mt-8 flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
                                    <button type="button" onClick={closeRejectModal} className="px-6 py-2.5 text-sm font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                                        Batal
                                    </button>
                                    <button type="submit" disabled={rejectForm.processing} className="px-6 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm transition-colors disabled:opacity-50 flex items-center">
                                        {rejectForm.processing && <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                                        Kirim Penolakan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
