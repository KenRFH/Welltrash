import React, { useState, useRef } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import CompanyLayout from '@/Layouts/CompanyLayout';
import { compressImage } from '@/utils/compressImage';
import {
    ReceiptText,
    Download,
    Upload,
    CheckCircle2,
    Clock,
    AlertCircle,
    X,
    Building2,
    Calendar,
    ChevronLeft,
    ChevronRight,
    CreditCard,
    FileCheck,
    Eye,
} from 'lucide-react';

interface Invoice {
    id: number;
    invoice_number: string;
    period_start: string;
    period_end: string;
    due_date: string;
    amount: string;
    status: 'unpaid' | 'paid';
    notes: string | null;
    payment_proof_path: string | null;
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
}

export default function CompanyInvoices({ company, invoices }: Props) {
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [viewProofUrl, setViewProofUrl] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<'all' | 'unpaid' | 'paid'>('all');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        payment_proof: null as File | null,
    });

    const formatRupiah = (val: string | number) => {
        const num = typeof val === 'string' ? parseFloat(val) : val;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(num || 0);
    };

    const formatDateShort = (dateStr: string) => {
        try {
            return new Intl.DateTimeFormat('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            }).format(new Date(dateStr));
        } catch {
            return dateStr;
        }
    };

    const isOverdue = (inv: Invoice) =>
        inv.status === 'unpaid' && new Date(inv.due_date) < new Date();

    const handleOpenUploadModal = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setData('payment_proof', null);
        setPreviewUrl(null);
    };

    const handleCloseUploadModal = () => {
        setSelectedInvoice(null);
        reset();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            let file = e.target.files[0];
            if (file.type.startsWith('image/')) {
                file = await compressImage(file, 1600, 1600, 0.8);
            }
            if (file.size > 2 * 1024 * 1024) {
                alert('Ukuran file melebihi batas 2MB. Silakan pilih berkas yang lebih kecil.');
                return;
            }
            setData('payment_proof', file);
            if (file.type.startsWith('image/')) {
                setPreviewUrl(URL.createObjectURL(file));
            } else {
                setPreviewUrl(null);
            }
        }
    };

    const handleSubmitProof = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedInvoice) return;
        post(route('company.invoices.uploadProof', selectedInvoice.id), {
            preserveScroll: true,
            onSuccess: () => {
                handleCloseUploadModal();
                alert('Bukti pembayaran berhasil diunggah. Menunggu verifikasi admin.');
            },
        });
    };

    const unpaidInvoices = invoices.data.filter((i) => i.status === 'unpaid');
    const paidInvoices = invoices.data.filter((i) => i.status === 'paid');

    const totalUnpaid = unpaidInvoices.reduce((sum, i) => sum + parseFloat(i.amount || '0'), 0);
    const totalPaid = paidInvoices.reduce((sum, i) => sum + parseFloat(i.amount || '0'), 0);

    const filteredInvoices = invoices.data.filter((inv) => {
        if (statusFilter === 'all') return true;
        return inv.status === statusFilter;
    });

    return (
        <CompanyLayout
            activeTab="invoices"
            title="Invoice & Tagihan Kemitraan"
            subtitle="Rekapitulasi tagihan berlangganan bulanan dan upload bukti transfer pembayaran resmi."
            company={company}
            userName={company.pic_name}
        >
            {/* 1. FINANCIAL SUMMARY KPIS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-500">Tagihan Belum Dibayar</span>
                        <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                            <Clock className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-xl sm:text-2xl font-black text-rose-600 tracking-tight">
                            {formatRupiah(totalUnpaid)}
                        </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2">
                        {unpaidInvoices.length} tagihan menunggu penyelesaian
                    </p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-500">Total Tagihan Lunas</span>
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-xl sm:text-2xl font-black text-emerald-700 tracking-tight">
                            {formatRupiah(totalPaid)}
                        </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2">
                        {paidInvoices.length} tagihan telah diverifikasi
                    </p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-500">Masa Langganan Aktif</span>
                        <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                            <Calendar className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                            {company.subscription_end_date
                                ? formatDateShort(company.subscription_end_date)
                                : 'Aktif Tanpa Batas'}
                        </span>
                    </div>
                    <p className="text-[11px] text-emerald-700 font-semibold mt-2">
                        Paket {company.subscription_plan}
                    </p>
                </div>
            </div>

            {/* 2. OFFICIAL BANK TRANSFER INFO BOX */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-sm mt-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                            <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-extrabold tracking-tight">Rekening Resmi Pembayaran WellTrash</h3>
                            <p className="text-xs text-slate-300">
                                Harap lakukan transfer pembayaran tagihan hanya ke rekening resmi terdaftar di bawah ini.
                            </p>
                        </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 self-start md:self-auto">
                        a.n PT Welltrash Karya Nusantara
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white/5 rounded-xl p-3.5 border border-white/10 flex items-center justify-between">
                        <div>
                            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Bank Mandiri</span>
                            <span className="font-mono text-sm sm:text-base font-bold text-white tracking-wider">143-00-98218-111</span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded-md">Utama</span>
                    </div>

                    <div className="bg-white/5 rounded-xl p-3.5 border border-white/10 flex items-center justify-between">
                        <div>
                            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Bank BCA</span>
                            <span className="font-mono text-sm sm:text-base font-bold text-white tracking-wider">088-294-1188</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-300 bg-white/10 px-2 py-1 rounded-md">Alternatif</span>
                    </div>
                </div>
            </div>

            {/* 3. INVOICES TABLE WITH FILTER TABS */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden mt-6">
                <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                            Daftar Tagihan Berlangganan
                        </h3>
                        <p className="text-xs text-slate-400">
                            Unduh invoice PDF resmi dan unggah bukti transfer pembayaran Anda
                        </p>
                    </div>

                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
                        <button
                            type="button"
                            onClick={() => setStatusFilter('all')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                statusFilter === 'all'
                                    ? 'bg-white text-slate-900 shadow-2xs'
                                    : 'text-slate-500 hover:text-slate-900'
                            }`}
                        >
                            Semua ({invoices.total})
                        </button>
                        <button
                            type="button"
                            onClick={() => setStatusFilter('unpaid')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                statusFilter === 'unpaid'
                                    ? 'bg-white text-rose-600 shadow-2xs'
                                    : 'text-slate-500 hover:text-rose-600'
                            }`}
                        >
                            Belum Bayar ({unpaidInvoices.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setStatusFilter('paid')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                statusFilter === 'paid'
                                    ? 'bg-white text-emerald-700 shadow-2xs'
                                    : 'text-slate-500 hover:text-emerald-700'
                            }`}
                        >
                            Lunas ({paidInvoices.length})
                        </button>
                    </div>
                </div>

                {filteredInvoices.length === 0 ? (
                    <div className="py-16 text-center">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                            <ReceiptText className="w-6 h-6" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-700">Tidak Ada Tagihan Ditemukan</h4>
                        <p className="text-xs text-slate-400 mt-1">Tidak ada data tagihan pada filter yang dipilih.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    <th className="py-3 px-5">Nomor Invoice</th>
                                    <th className="py-3 px-5">Periode Layanan</th>
                                    <th className="py-3 px-5">Jatuh Tempo</th>
                                    <th className="py-3 px-5">Nominal</th>
                                    <th className="py-3 px-5">Status</th>
                                    <th className="py-3 px-5 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs">
                                {filteredInvoices.map((inv) => {
                                    const isPaid = inv.status === 'paid';
                                    const overdue = isOverdue(inv);

                                    return (
                                        <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-3.5 px-5 font-mono font-bold text-slate-900">{inv.invoice_number}</td>
                                            <td className="py-3.5 px-5 text-slate-600">{formatDateShort(inv.period_start)} – {formatDateShort(inv.period_end)}</td>
                                            <td className="py-3.5 px-5">
                                                <span className={overdue ? 'text-rose-600 font-bold' : 'text-slate-700'}>{formatDateShort(inv.due_date)}</span>
                                            </td>
                                            <td className="py-3.5 px-5 font-bold text-slate-900">{formatRupiah(inv.amount)}</td>
                                            <td className="py-3.5 px-5">
                                                {isPaid ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Lunas
                                                    </span>
                                                ) : inv.payment_proof_path ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                                        <Clock className="w-3 h-3 text-amber-600" /> Verifikasi
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                                        <AlertCircle className="w-3 h-3 text-rose-600" /> Belum Bayar
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-5 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <a href={route('company.invoices.download', inv.id)} target="_blank" rel="noreferrer" className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs inline-flex items-center gap-1">
                                                        <Download className="w-3.5 h-3.5" /> PDF
                                                    </a>
                                                    {!isPaid && (
                                                        <button type="button" onClick={() => handleOpenUploadModal(inv)} className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1 cursor-pointer">
                                                            <Upload className="w-3.5 h-3.5" /> Bayar
                                                        </button>
                                                    )}
                                                    {inv.payment_proof_path && (
                                                        <button type="button" onClick={() => setViewProofUrl(`/storage/${inv.payment_proof_path}`)} className="px-2.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-xs inline-flex items-center gap-1 cursor-pointer">
                                                            <Eye className="w-3.5 h-3.5" /> Bukti
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* 4. PAGINATION */}
            {invoices.last_page > 1 && (
                <div className="flex items-center justify-between mt-6 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                    <span className="text-xs text-slate-500 font-medium">
                        Halaman <strong>{invoices.current_page}</strong> dari <strong>{invoices.last_page}</strong>
                    </span>
                    <div className="flex items-center gap-1.5">
                        {invoices.links.map((link, i) => {
                            const isPrev = link.label.includes('Previous') || link.label.includes('&laquo;');
                            const isNext = link.label.includes('Next') || link.label.includes('&raquo;');
                            const content = isPrev ? <ChevronLeft className="w-4 h-4" /> : isNext ? <ChevronRight className="w-4 h-4" /> : link.label;

                            if (!link.url) {
                                return (
                                    <span key={i} className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold text-slate-300 cursor-not-allowed">
                                        {content}
                                    </span>
                                );
                            }

                            return (
                                <Link
                                    key={i}
                                    href={link.url}
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                                        link.active ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                                >
                                    {content}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* 5. UPLOAD PAYMENT PROOF MODAL */}
            {selectedInvoice && (
                <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                            <div>
                                <h4 className="text-sm font-extrabold text-slate-900">Unggah Bukti Pembayaran</h4>
                                <p className="text-[11px] text-slate-400">Invoice: {selectedInvoice.invoice_number}</p>
                            </div>
                            <button onClick={handleCloseUploadModal} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitProof} className="space-y-4">
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between">
                                <span className="text-slate-500">Nominal Tagihan:</span>
                                <span className="font-bold text-slate-900">{formatRupiah(selectedInvoice.amount)}</span>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">Berkas Bukti Transfer (JPG/PNG/PDF, maks 2MB)</label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/jpg,application/pdf"
                                    onChange={handleFileChange}
                                    required
                                    className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer border border-slate-200 rounded-xl p-1"
                                />
                                {errors.payment_proof && <p className="text-xs text-rose-600 mt-1">{errors.payment_proof}</p>}
                            </div>

                            {previewUrl && (
                                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center max-h-48 overflow-hidden">
                                    <img src={previewUrl} alt="Preview" className="max-h-40 rounded-lg object-contain" />
                                </div>
                            )}

                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={handleCloseUploadModal} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer">
                                    Batal
                                </button>
                                <button type="submit" disabled={processing} className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs disabled:opacity-50 cursor-pointer">
                                    {processing ? 'Mengunggah...' : 'Kirim Bukti Pembayaran'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 6. PROOF VIEWER MODAL */}
            {viewProofUrl && (
                <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setViewProofUrl(null)}>
                    <div className="bg-white rounded-2xl max-w-lg w-full p-4 shadow-2xl border border-slate-200" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                            <h4 className="text-xs font-bold text-slate-900">Bukti Pembayaran Terunggah</h4>
                            <button onClick={() => setViewProofUrl(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-xl flex items-center justify-center max-h-96 overflow-hidden">
                            <img src={viewProofUrl} alt="Bukti Transfer" className="max-h-80 object-contain rounded-lg" />
                        </div>
                    </div>
                </div>
            )}
        </CompanyLayout>
    );
}

