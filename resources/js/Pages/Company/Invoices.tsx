import { Head, useForm } from '@inertiajs/react';
import React, { useState, useRef } from 'react';
import CompanySidebar from '@/Components/CompanySidebar';
import { compressImage } from '@/utils/compressImage';

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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<'all' | 'unpaid' | 'paid'>('all');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        payment_proof: null as File | null,
    });

    const formatRupiah = (amount: string | number) => {
        const num = typeof amount === 'string' ? parseFloat(amount) : amount;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(num);
    };

    const formatDateShort = (date: string) =>
        new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

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
                alert('Ukuran file melebihi batas maksimal 2MB. Silakan pilih file yang lebih kecil atau kompres terlebih dahulu.');
                setData('payment_proof', null);
                setPreviewUrl(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
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

    // Local filtering
    const filteredInvoices = invoices.data.filter(inv => {
        if (statusFilter === 'all') return true;
        return inv.status === statusFilter;
    });

    const unpaidCount = invoices.data.filter(i => i.status === 'unpaid').length;
    const paidCount = invoices.data.filter(i => i.status === 'paid').length;

    const totalUnpaidAmount = invoices.data
        .filter(i => i.status === 'unpaid')
        .reduce((sum, i) => sum + parseFloat(i.amount), 0);

    const totalPaidAmount = invoices.data
        .filter(i => i.status === 'paid')
        .reduce((sum, i) => sum + parseFloat(i.amount), 0);

    return (
        <div className="flex h-screen bg-[#FAFBFD] text-slate-800 font-sans antialiased">
            <Head title="Invoice & Tagihan" />

            <CompanySidebar
                active="invoices"
                isMobileOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                plan={company.subscription_plan}
                isLocked={false}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* ── HEADER ── */}
                <header className="h-20 flex items-center justify-between px-6 sm:px-10 bg-white border-b border-slate-100 z-10 sticky top-0 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 text-slate-400 hover:text-green-600 md:hidden transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900">Tagihan & Invoice</h1>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">
                                {company.company_name} · Paket <span className="font-semibold text-green-600">{company.subscription_plan}</span>
                            </p>
                        </div>
                    </div>


                </header>

                <main className="flex-1 overflow-y-auto px-6 sm:px-10 py-8 space-y-8">
                    
                    {/* ── STATS CARDS ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:border-slate-200 transition-colors">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Tagihan</span>
                            <span className="text-2xl font-extrabold text-slate-900 mt-2">{invoices.total}</span>
                            <span className="text-[11px] text-slate-400 mt-1">Seluruh periode kemitraan</span>
                        </div>
                        
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:border-slate-200 transition-colors">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Belum Lunas</span>
                            <span className="text-2xl font-extrabold text-rose-600 mt-2">{formatRupiah(totalUnpaidAmount)}</span>
                            <span className="text-[11px] text-slate-400 mt-1">{unpaidCount} tagihan menunggu pembayaran</span>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:border-slate-200 transition-colors">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sudah Lunas</span>
                            <span className="text-2xl font-extrabold text-emerald-600 mt-2">{formatRupiah(totalPaidAmount)}</span>
                            <span className="text-[11px] text-slate-400 mt-1">{paidCount} tagihan selesai diverifikasi</span>
                        </div>
                    </div>

                    {/* ── FILTER & CONTENT TABS ── */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setStatusFilter('all')}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                        statusFilter === 'all'
                                            ? 'bg-slate-900 text-white shadow-sm'
                                            : 'bg-transparent text-slate-500 hover:text-slate-900'
                                    }`}
                                >
                                    Semua
                                </button>
                                <button
                                    onClick={() => setStatusFilter('unpaid')}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                        statusFilter === 'unpaid'
                                            ? 'bg-slate-900 text-white shadow-sm'
                                            : 'bg-transparent text-slate-500 hover:text-slate-900'
                                    }`}
                                >
                                    Belum Lunas
                                    {unpaidCount > 0 && (
                                        <span className="bg-rose-500 text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold px-1">
                                            {unpaidCount}
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => setStatusFilter('paid')}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                        statusFilter === 'paid'
                                            ? 'bg-slate-900 text-white shadow-sm'
                                            : 'bg-transparent text-slate-500 hover:text-slate-900'
                                    }`}
                                >
                                    Lunas
                                </button>
                            </div>
                            <span className="text-xs text-slate-400 font-medium">Menampilkan {filteredInvoices.length} tagihan</span>
                        </div>

                        {/* ── INVOICE ITEMS LIST ── */}
                        {filteredInvoices.length === 0 ? (
                            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-sm font-bold text-slate-700">Tidak Ada Tagihan</h3>
                                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                                    Tagihan dalam kategori ini tidak ditemukan atau belum diterbitkan oleh Admin.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredInvoices.map(invoice => (
                                    <div
                                        key={invoice.id}
                                        className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md hover:border-slate-200 transition-all duration-300 transform hover:scale-[1.005]"
                                    >
                                        {/* Left: Info Invoice */}
                                        <div className="space-y-2 flex-1">
                                            <div className="flex items-center gap-2.5 flex-wrap">
                                                <span className="font-mono font-bold text-sm text-slate-900 tracking-tight">
                                                    {invoice.invoice_number}
                                                </span>
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                                    invoice.status === 'paid'
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                        : invoice.payment_proof_path
                                                            ? 'bg-amber-50 text-amber-700 border-amber-100'
                                                            : isOverdue(invoice)
                                                                ? 'bg-rose-50 text-rose-700 border-rose-100 animate-pulse'
                                                                : 'bg-slate-50 text-slate-600 border-slate-100'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                                        invoice.status === 'paid'
                                                            ? 'bg-emerald-500'
                                                            : invoice.payment_proof_path
                                                                ? 'bg-amber-500'
                                                                : 'bg-rose-500'
                                                    }`} />
                                                    {invoice.status === 'paid'
                                                        ? 'Lunas'
                                                        : invoice.payment_proof_path
                                                            ? 'Menunggu Verifikasi'
                                                            : 'Belum Lunas'}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-6 text-xs text-slate-400 flex-wrap">
                                                <div>
                                                    <span className="font-medium text-slate-400">Periode:</span>{' '}
                                                    <span className="font-semibold text-slate-600">
                                                        {formatDateShort(invoice.period_start)} – {formatDateShort(invoice.period_end)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-slate-400">Jatuh Tempo:</span>{' '}
                                                    <span className={`font-semibold ${isOverdue(invoice) ? 'text-rose-600' : 'text-slate-600'}`}>
                                                        {formatDateShort(invoice.due_date)}
                                                    </span>
                                                </div>
                                            </div>

                                            {invoice.notes && (
                                                <div className="bg-slate-50 text-slate-500 text-[11px] px-3 py-1.5 rounded-xl inline-block max-w-md italic">
                                                    Catatan: "{invoice.notes}"
                                                </div>
                                            )}
                                        </div>

                                        {/* Right: Amount & Actions */}
                                        <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                                            <div className="text-left md:text-right">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Tagihan</p>
                                                <p className="text-lg font-black text-slate-900 mt-0.5">{formatRupiah(invoice.amount)}</p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <a
                                                    href={route('company.invoices.download', invoice.id)}
                                                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-100"
                                                    title="Download PDF"
                                                >
                                                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                    </svg>
                                                    PDF
                                                </a>

                                                {invoice.status === 'unpaid' && (
                                                    <button
                                                        onClick={() => handleOpenUploadModal(invoice)}
                                                        className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                                                            invoice.payment_proof_path
                                                                ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                                                                : 'bg-green-600 hover:bg-green-500 text-white shadow-green-100'
                                                        }`}
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                        </svg>
                                                        {invoice.payment_proof_path ? 'Ubah Bukti' : 'Kirim Bukti'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── CARA PEMBAYARAN BOX ── */}
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex gap-4 items-start max-w-3xl">
                        <div className="w-9 h-9 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-bold text-slate-800">Petunjuk Pembayaran</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Transfer sesuai total tagihan ke rekening <span className="font-bold text-slate-700">BCA 1234567890 a.n PT Welltrash Indonesia</span>. 
                                Setelah transfer berhasil, klik tombol <span className="font-bold text-green-600">"Kirim Bukti"</span> pada tagihan terkait untuk diverifikasi Admin.
                            </p>
                        </div>
                    </div>
                </main>
            </div>

            {/* ── MODAL UPLOAD BUKTI PEMBAYARAN ── */}
            {selectedInvoice && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-100 shadow-2xl relative">
                        <button
                            onClick={handleCloseUploadModal}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h3 className="text-lg font-bold text-slate-900 tracking-tight">Kirim Bukti Transfer</h3>
                        <p className="text-xs text-slate-400 font-medium mt-1">
                            Unggah resi untuk tagihan <span className="font-mono font-semibold text-slate-700">{selectedInvoice.invoice_number}</span> sebesar{' '}
                            <span className="font-bold text-slate-900">{formatRupiah(selectedInvoice.amount)}</span>.
                        </p>

                        <form onSubmit={handleSubmitProof} className="space-y-6 mt-6">
                            <div className="space-y-2">
                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">File Bukti (JPG/PNG/WEBP/HEIC/PDF, Max 2MB)</label>
                                
                                <div className={`flex justify-center px-6 pt-6 pb-6 border-2 border-dashed rounded-2xl transition-colors ${previewUrl ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200 hover:border-green-400 hover:bg-slate-50/30'}`}>
                                    <div className="space-y-2 text-center w-full flex flex-col items-center">
                                        {previewUrl ? (
                                            <div className="mb-2">
                                                <img src={previewUrl} alt="Preview" className="mx-auto h-32 object-contain rounded-xl shadow-sm border border-slate-100" />
                                            </div>
                                        ) : selectedInvoice.payment_proof_path && !data.payment_proof ? (
                                            <div className="mb-2">
                                                {selectedInvoice.payment_proof_path.endsWith('.pdf') ? (
                                                    <div className="p-4 bg-rose-50/50 rounded-2xl text-rose-600 inline-block border border-rose-100">
                                                        <span className="text-2xl">📄</span> PDF Bukti
                                                    </div>
                                                ) : (
                                                    <img src={`/storage/${selectedInvoice.payment_proof_path}`} alt="Bukti Saat Ini" className="mx-auto h-32 object-contain rounded-xl shadow-sm border border-slate-100 bg-white" />
                                                )}
                                                <p className="text-[10px] text-slate-400 mt-2 font-medium">Bukti terkirim sebelumnya</p>
                                            </div>
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mb-2">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                        
                                        <div className="flex text-xs text-slate-500 justify-center items-center">
                                            <button 
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="px-3 py-1.5 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors shadow-sm"
                                            >
                                                Pilih File
                                            </button>
                                            <input 
                                                ref={fileInputRef}
                                                type="file" 
                                                className="hidden" 
                                                accept=".jpeg,.png,.jpg,.pdf,.webp,.heic"
                                                onChange={handleFileChange}
                                            />
                                            {!data.payment_proof && <span className="pl-2">atau seret file ke sini</span>}
                                        </div>
                                        {data.payment_proof && (
                                            <p className="text-xs text-slate-700 font-bold mt-1">Terpilih: {data.payment_proof.name}</p>
                                        )}
                                    </div>
                                </div>
                                {errors.payment_proof && <p className="text-rose-500 text-xs mt-1 font-semibold">{errors.payment_proof}</p>}
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={handleCloseUploadModal}
                                    className="flex-1 py-3 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={processing || !data.payment_proof}
                                    className="flex-1 py-3 px-4 border border-transparent rounded-xl shadow-sm text-xs font-bold text-white bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {processing ? 'Mengirimkan...' : 'Kirim Bukti'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
