import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import CompanySidebar from '@/Components/CompanySidebar';

interface Invoice {
    id: number;
    invoice_number: string;
    period_start: string;
    period_end: string;
    due_date: string;
    amount: string;
    status: 'unpaid' | 'paid';
    notes: string | null;
    created_at: string;
}

interface PaginatedInvoices {
    data: Invoice[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    company: {
        id: number;
        company_name: string;
        pic_name: string;
        subscription_plan: string;
        subscription_status: string;
        subscription_end_date: string | null;
    };
    invoices: PaginatedInvoices;
    activeDaysLeft: number;
}

export default function CompanyInvoices({ company, invoices, activeDaysLeft }: Props) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const formatRupiah = (amount: string | number) => {
        const num = typeof amount === 'string' ? parseFloat(amount) : amount;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
        }).format(num);
    };

    const formatDateShort = (date: string) =>
        new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

    const isOverdue = (inv: Invoice) =>
        inv.status === 'unpaid' && new Date(inv.due_date) < new Date();

    const unpaidInvoices = invoices.data.filter(i => i.status === 'unpaid');
    const paidInvoices   = invoices.data.filter(i => i.status === 'paid');
    const totalUnpaid    = unpaidInvoices.reduce((s, i) => s + parseFloat(i.amount), 0);
    const totalPaid      = paidInvoices.reduce((s, i) => s + parseFloat(i.amount), 0);

    return (
        <div className="flex h-screen bg-[#F2F6F0] font-sans">
            <Head title="Invoice Saya" />

            <CompanySidebar
                active="invoices"
                isMobileOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                plan={company.subscription_plan}
                isLocked={activeDaysLeft <= 0}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* ── HEADER ── */}
                <header className="h-20 flex items-center justify-between px-6 sm:px-10 bg-white border-b border-gray-100 z-10 sticky top-0 shadow-[0_1px_12px_rgba(0,0,0,0.04)]">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 text-gray-500 hover:text-green-600 md:hidden"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-xl font-black text-gray-900 tracking-tight">Invoice Saya</h1>
                            <p className="text-[11px] text-gray-400 font-medium">
                                {company.company_name} · Paket <span className="font-bold text-green-600">{company.subscription_plan}</span>
                            </p>
                        </div>
                    </div>

                    {/* Masa aktif pill */}
                    <div className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black border ${
                        activeDaysLeft > 7
                            ? 'bg-green-50 text-green-700 border-green-100'
                            : activeDaysLeft > 0
                                ? 'bg-yellow-50 text-yellow-700 border-yellow-100'
                                : 'bg-red-50 text-red-600 border-red-100'
                    }`}>
                        <span className={`w-2 h-2 rounded-full ${activeDaysLeft > 7 ? 'bg-green-500' : activeDaysLeft > 0 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                        {activeDaysLeft > 0 ? `${activeDaysLeft} hari aktif` : 'Masa aktif habis'}
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto">
                    {/* ── HERO BANNER ── */}
                    <div className="bg-gradient-to-br from-green-700 via-green-600 to-emerald-600 px-6 sm:px-10 py-10 relative overflow-hidden">
                        {/* Dekorasi */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-4 right-16 w-48 h-48 rounded-full border-2 border-white/60" />
                            <div className="absolute -bottom-8 right-4 w-72 h-72 rounded-full border border-white/30" />
                            <div className="absolute top-2 left-1/2 w-32 h-32 rounded-full bg-white/20" />
                        </div>

                        <div className="relative z-10 max-w-4xl mx-auto">
                            <p className="text-green-200 text-xs font-bold uppercase tracking-widest mb-1">Welltrash Mitra</p>
                            <h2 className="text-2xl sm:text-3xl font-black text-white mb-6">Invoice & Tagihan</h2>

                            <div className="grid grid-cols-3 gap-3 sm:gap-6">
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                                    <p className="text-green-200 text-[10px] font-bold uppercase tracking-widest">Total Invoice</p>
                                    <p className="text-3xl font-black text-white mt-1">{invoices.total}</p>
                                    <p className="text-green-300 text-[10px] mt-1">Semua periode</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                                    <p className="text-red-200 text-[10px] font-bold uppercase tracking-widest">Belum Lunas</p>
                                    <p className="text-xl sm:text-2xl font-black text-white mt-1 leading-tight">{formatRupiah(totalUnpaid)}</p>
                                    <p className="text-green-300 text-[10px] mt-1">{unpaidInvoices.length} invoice</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                                    <p className="text-green-200 text-[10px] font-bold uppercase tracking-widest">Sudah Lunas</p>
                                    <p className="text-xl sm:text-2xl font-black text-white mt-1 leading-tight">{formatRupiah(totalPaid)}</p>
                                    <p className="text-green-300 text-[10px] mt-1">{paidInvoices.length} invoice</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── INVOICE LIST ── */}
                    <div className="px-6 sm:px-10 py-8 max-w-4xl mx-auto space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-black text-gray-700 uppercase tracking-widest">Daftar Invoice</h3>
                            <span className="text-xs text-gray-400 font-medium">{invoices.total} tagihan</span>
                        </div>

                        {invoices.data.length === 0 ? (
                            <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
                                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
                                    <svg className="w-10 h-10 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <p className="text-gray-700 font-bold">Belum ada invoice</p>
                                <p className="text-xs text-gray-400 mt-2 max-w-xs mx-auto leading-relaxed">
                                    Invoice akan muncul di sini setelah diterbitkan oleh admin Welltrash
                                </p>
                            </div>
                        ) : (
                            <>
                                {invoices.data.map(invoice => (
                                    <div
                                        key={invoice.id}
                                        className={`bg-white rounded-3xl shadow-sm border overflow-hidden transition-all hover:shadow-md ${
                                            isOverdue(invoice)
                                                ? 'border-red-100'
                                                : invoice.status === 'paid'
                                                    ? 'border-green-100'
                                                    : 'border-gray-100'
                                        }`}
                                    >
                                        {/* Status strip di atas */}
                                        <div className={`h-1 w-full ${
                                            invoice.status === 'paid'
                                                ? 'bg-green-500'
                                                : isOverdue(invoice)
                                                    ? 'bg-red-500'
                                                    : 'bg-yellow-400'
                                        }`} />

                                        <div className="p-6">
                                            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                                {/* Kiri: info invoice */}
                                                <div className="flex-1 space-y-3">
                                                    {/* Nomor & Status */}
                                                    <div className="flex items-center gap-3 flex-wrap">
                                                        <span className="font-mono font-black text-gray-900 text-base tracking-tight">
                                                            {invoice.invoice_number}
                                                        </span>
                                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                                            invoice.status === 'paid'
                                                                ? 'bg-green-50 text-green-700 border-green-200'
                                                                : isOverdue(invoice)
                                                                    ? 'bg-red-50 text-red-700 border-red-200'
                                                                    : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                        }`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${
                                                                invoice.status === 'paid' ? 'bg-green-500'
                                                                    : isOverdue(invoice) ? 'bg-red-500' : 'bg-yellow-500'
                                                            }`} />
                                                            {invoice.status === 'paid' ? 'Lunas' : isOverdue(invoice) ? 'Jatuh Tempo' : 'Belum Lunas'}
                                                        </span>
                                                    </div>

                                                    {/* Detail grid */}
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
                                                        <div>
                                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Periode</p>
                                                            <p className="text-xs text-gray-700 font-semibold mt-0.5">
                                                                {formatDateShort(invoice.period_start)} – {formatDateShort(invoice.period_end)}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Jatuh Tempo</p>
                                                            <p className={`text-xs font-semibold mt-0.5 ${isOverdue(invoice) ? 'text-red-600 font-black' : 'text-gray-700'}`}>
                                                                {formatDateShort(invoice.due_date)}
                                                            </p>
                                                        </div>
                                                        <div className="col-span-2 sm:col-span-1">
                                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Tagihan</p>
                                                            <p className="text-lg font-black text-gray-900 mt-0.5 leading-none">
                                                                {formatRupiah(invoice.amount)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {invoice.notes && (
                                                        <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 text-xs text-amber-800 flex items-start gap-2">
                                                            <span className="text-sm flex-shrink-0">📝</span>
                                                            <span>{invoice.notes}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Kanan: tombol download */}
                                                <div className="flex sm:flex-col items-center gap-2 flex-shrink-0">
                                                    <a
                                                        href={route('company.invoices.download', invoice.id)}
                                                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-2xl text-xs font-black transition-all shadow-sm shadow-green-100/60 whitespace-nowrap"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                        </svg>
                                                        Download PDF
                                                    </a>

                                                    {invoice.status === 'unpaid' && (
                                                        <a
                                                            href={route('company.billing')}
                                                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 rounded-2xl text-xs font-black transition-all whitespace-nowrap"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                            </svg>
                                                            Upload Bukti
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Pagination */}
                                {invoices.last_page > 1 && (
                                    <div className="flex justify-center gap-1 pt-2">
                                        {invoices.links.map((link, i) => (
                                            link.url ? (
                                                <a key={i} href={link.url}
                                                    className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                                                        link.active ? 'bg-green-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ) : (
                                                <span key={i}
                                                    className="px-3.5 py-2 rounded-xl text-xs font-black text-gray-300 bg-white border border-gray-100"
                                                    dangerouslySetInnerHTML={{ __html: link.label }} />
                                            )
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                        {/* Info box */}
                        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex gap-4 items-start">
                            <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg className="w-4.5 h-4.5 w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-black text-gray-800">Cara Pembayaran</p>
                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                    Transfer ke <span className="font-bold text-gray-700">BCA 1234567890 a.n PT Welltrash Indonesia</span> sesuai total tagihan.
                                    Setelah transfer, klik <span className="font-bold text-green-600">"Upload Bukti"</span> di samping invoice yang belum lunas.
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
