import React, { useState, useMemo } from 'react';
import StatCard from '@/Components/Admin/StatCard';
import { SegmentedBar, CHART } from '@/Components/Admin/Charts';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import {
    Receipt,
    CheckCircle2,
    Clock,
    AlertCircle,
    Search,
    Filter,
    PlusCircle,
    FileText,
    ExternalLink,
    Send,
    Trash2,
    Eye,
    MessageSquare,
    DollarSign,
    Layers,
    X,
    Building2,
    ArrowUpRight,
    RefreshCw,
} from 'lucide-react';

interface Company {
    id: number;
    company_name: string;
}

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
    wa_status: 'pending' | 'sent' | 'failed' | 'skipped';
    wa_send_at: string | null;
    wa_sent_at: string | null;
    company: {
        id: number;
        company_name: string;
        pic_name: string;
        phone: string;
    };
}

interface PaginatedInvoices {
    data: Invoice[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    invoices: PaginatedInvoices;
    companies: Company[];
    filters: { company_id?: string; status?: string; wa_status?: string };
}

export default function InvoicesIndex({ invoices, companies, filters }: Props) {
    const [companyFilter, setCompanyFilter] = useState(filters.company_id ?? '');
    const [statusFilter, setStatusFilter] = useState(filters.status ?? '');
    const [waStatusFilter, setWaStatusFilter] = useState(filters.wa_status ?? '');
    const [viewingProofInvoice, setViewingProofInvoice] = useState<Invoice | null>(null);

    const applyFilters = () => {
        router.get(route('admin.invoices.index'), {
            company_id: companyFilter || undefined,
            status: statusFilter || undefined,
            wa_status: waStatusFilter || undefined,
        }, { preserveScroll: true });
    };

    const clearFilters = () => {
        setCompanyFilter('');
        setStatusFilter('');
        setWaStatusFilter('');
        router.get(route('admin.invoices.index'), {}, { preserveScroll: true });
    };

    const formatRupiah = (amount: string | number) => {
        const num = typeof amount === 'string' ? parseFloat(amount) : amount;
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
    };

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

    const handleMarkPaid = (invoice: Invoice) => {
        if (confirm(`Tandai invoice ${invoice.invoice_number} sebagai LUNAS?`)) {
            router.patch(route('admin.invoices.markPaid', invoice.id), {}, { preserveScroll: true });
        }
    };

    const handleResendWa = (invoice: Invoice) => {
        if (confirm(`Kirim ulang WA invoice ${invoice.invoice_number} ke ${invoice.company.pic_name} (${invoice.company.phone})?`)) {
            router.post(route('admin.invoices.resendWa', invoice.id), {}, { preserveScroll: true });
        }
    };

    const handleDelete = (invoice: Invoice) => {
        if (confirm(`Hapus invoice ${invoice.invoice_number}? Tindakan ini tidak bisa dibatalkan.`)) {
            router.delete(route('admin.invoices.destroy', invoice.id), { preserveScroll: true });
        }
    };

    const waBadge = (invoice: Invoice) => {
        if (invoice.wa_status === 'sent') {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>WA Terkirim</span>
                </span>
            );
        }
        if (invoice.wa_status === 'pending') {
            const sendAt = invoice.wa_send_at ? new Date(invoice.wa_send_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/70" title={`Jadwal: ${sendAt}`}>
                    <Clock className="w-3 h-3 text-amber-600" />
                    <span>WA Dijadwalkan</span>
                </span>
            );
        }
        if (invoice.wa_status === 'failed') {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/70">
                    <AlertCircle className="w-3 h-3 text-rose-600" />
                    <span>WA Gagal</span>
                </span>
            );
        }
        return null;
    };

    // Financial Infographics Calculations
    const totalRevenueSum = useMemo(() => {
        return invoices.data.reduce((acc, inv) => acc + (parseFloat(inv.amount) || 0), 0);
    }, [invoices.data]);

    const paidSum = useMemo(() => {
        return invoices.data
            .filter(inv => inv.status === 'paid')
            .reduce((acc, inv) => acc + (parseFloat(inv.amount) || 0), 0);
    }, [invoices.data]);

    const unpaidSum = useMemo(() => {
        return invoices.data
            .filter(inv => inv.status === 'unpaid')
            .reduce((acc, inv) => acc + (parseFloat(inv.amount) || 0), 0);
    }, [invoices.data]);

    const proofSum = useMemo(() => invoices.data
        .filter(inv => inv.status === 'unpaid' && inv.payment_proof_path)
        .reduce((acc, inv) => acc + (parseFloat(inv.amount) || 0), 0), [invoices.data]);
    const paidCount = useMemo(() => invoices.data.filter(inv => inv.status === 'paid').length, [invoices.data]);
    const unpaidCount = useMemo(() => invoices.data.filter(inv => inv.status === 'unpaid').length, [invoices.data]);
    const proofCount = useMemo(() => invoices.data.filter(inv => inv.status === 'unpaid' && inv.payment_proof_path).length, [invoices.data]);

    const settlementRate = invoices.data.length > 0 ? Math.round((paidCount / invoices.data.length) * 100) : 0;

    return (
        <AdminLayout
            title="Manajemen Invoice & Billing"
            subtitle="Penerbitan tagihan retribusi limbah industri dan verifikasi bukti bayar mitra"
            activeTab="invoices"
            headerAction={
                <Link
                    href={route('admin.invoices.create')}
                    className="adm-btn adm-btn-primary"
                >
                    <PlusCircle className="w-4 h-4" />
                    <span>Buat Invoice Baru</span>
                </Link>
            }
        >
            <div className="space-y-6">
                {/* 1. Infographic Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard index={0} tone="brand" icon={Receipt} label="Total tagihan" value={formatRupiah(totalRevenueSum)}
                        note={<span>Dari {invoices.total} total invoice</span>} />
                    <StatCard index={1} tone="ok" icon={CheckCircle2} label="Tagihan lunas" value={formatRupiah(paidSum)}
                        note={<><span className="font-semibold text-emerald-700">{settlementRate}%</span><span>({paidCount} invoice lunas)</span></>} />
                    <StatCard index={2} tone="bad" icon={AlertCircle} label="Belum lunas" value={formatRupiah(unpaidSum)}
                        note={<><span className="font-semibold text-rose-600">{unpaidCount} invoice</span><span>tertunggak</span></>} />
                    <StatCard index={3} tone="warn" icon={Clock} label="Verifikasi bukti" value={proofCount} unit="dokumen"
                        note={proofCount > 0 ? <span className="font-semibold text-amber-700">Perlu dicek & verifikasi</span> : <span>Semua bukti telah ditinjau</span>} />
                </div>

                {/* 2. Where the billed money stands: paid / proof awaiting check / unpaid, by amount */}
                <div className="bg-white rounded-md p-5 sm:p-6 border border-slate-200/80">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4">
                    <div>
                        <h3 className="text-base font-semibold text-ink tracking-tight">Posisi tagihan</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Nilai tagihan pada halaman ini menurut status pembayaran.</p>
                    </div>
                    <span className="text-sm text-slate-500">Terbayar <span className="font-semibold text-ink tabular-nums">{settlementRate}%</span> dari jumlah invoice</span>
                </div>
                    <SegmentedBar
                        label="Nilai tagihan menurut status pembayaran"
                        emptyText="Belum ada tagihan untuk ditampilkan."
                        parts={[
                            { label: 'Lunas', value: paidSum, display: formatRupiah(paidSum), color: CHART.green },
                            { label: 'Bukti menunggu verifikasi', value: proofSum, display: formatRupiah(proofSum), color: CHART.amber, ink: 'dark' },
                            { label: 'Belum dibayar', value: unpaidSum - proofSum, display: formatRupiah(unpaidSum - proofSum), color: CHART.red },
                        ]}
                    />
                </div>

                {/* 3. Minimalist Filter Bar */}
                <div className="bg-white rounded-md p-4 border border-slate-200/80 shadow-2xs flex flex-wrap gap-3 items-center justify-between">
                    <div className="flex flex-wrap items-center gap-2.5">
                        <select
                            value={companyFilter}
                            onChange={e => setCompanyFilter(e.target.value)}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                        >
                            <option value="">Semua Mitra Industri</option>
                            {companies.map(c => (
                                <option key={c.id} value={c.id}>{c.company_name}</option>
                            ))}
                        </select>

                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                        >
                            <option value="">Semua Status Bayar</option>
                            <option value="unpaid">Belum Lunas</option>
                            <option value="paid">Lunas</option>
                        </select>

                        <select
                            value={waStatusFilter}
                            onChange={e => setWaStatusFilter(e.target.value)}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                        >
                            <option value="">Semua Status WA</option>
                            <option value="sent">WA Terkirim</option>
                            <option value="pending">WA Dijadwalkan</option>
                            <option value="failed">WA Gagal</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={applyFilters}
                            className="adm-btn adm-btn-primary adm-btn-sm"
                        >
                            Terapkan Filter
                        </button>
                        {(companyFilter || statusFilter || waStatusFilter) && (
                            <button
                                onClick={clearFilters}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                            >
                                Reset
                            </button>
                        )}
                    </div>
                </div>

                {/* 4. Invoices Table Container */}
                <div className="bg-white rounded-md border border-slate-200/80 shadow-2xs overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-bold text-slate-900">
                                Daftar Tagihan Invoice Mitra
                            </h2>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">
                                Menampilkan {invoices.data.length} dari {invoices.total} total invoice
                            </p>
                        </div>
                    </div>

                    {invoices.data.length === 0 ? (
                        <div className="p-16 text-center">
                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3 text-slate-400">
                                <Receipt className="w-6 h-6" />
                            </div>
                            <h4 className="text-sm font-bold text-slate-800">Tidak ada invoice ditemukan</h4>
                            <p className="text-xs text-slate-400 font-medium mt-1">
                                Belum ada tagihan dibuat atau sesuaikan filter di atas.
                            </p>
                            <Link
                                href={route('admin.invoices.create')}
                                className="mt-3 adm-btn adm-btn-primary adm-btn-sm"
                            >
                                <PlusCircle className="w-3.5 h-3.5" />
                                <span>Buat Invoice Baru</span>
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-100 text-left">
                                    <thead>
                                        <tr className="bg-slate-50/75">
                                            <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                                No. Invoice
                                            </th>
                                            <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                                Mitra Industri
                                            </th>
                                            <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                                Periode Layanan
                                            </th>
                                            <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                                Jatuh Tempo
                                            </th>
                                            <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                                Nominal Tagihan
                                            </th>
                                            <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                                Status Pembayaran
                                            </th>
                                            <th className="px-5 py-3.5 text-right text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                                Tindakan
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">

                                        {invoices.data.map((invoice) => {
                                            const isOverdue = new Date(invoice.due_date) < new Date() && invoice.status === 'unpaid';
                                            return (
                                                <tr key={invoice.id} className="hover:bg-slate-50/70 transition-colors group">
                                                    <td className="px-5 py-4">
                                                        <span className="font-mono font-bold text-xs text-slate-900 group-hover:text-emerald-700 transition-colors">
                                                            {invoice.invoice_number}
                                                        </span>
                                                        <div className="text-[11px] text-slate-400 font-medium">
                                                            Diterbitkan {formatDate(invoice.created_at)}
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <div className="font-bold text-slate-900 text-xs">
                                                            {invoice.company.company_name}
                                                        </div>
                                                        <div className="text-xs text-slate-400 font-medium mt-0.5">
                                                            PIC: <span className="text-slate-600">{invoice.company.pic_name}</span> &bull; {invoice.company.phone}
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4 text-xs font-medium text-slate-600">
                                                        {formatDate(invoice.period_start)} – {formatDate(invoice.period_end)}
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <span className={`text-xs font-bold ${isOverdue ? 'text-rose-600' : 'text-slate-700'}`}>
                                                            {formatDate(invoice.due_date)}
                                                        </span>
                                                        {isOverdue && (
                                                            <span className="block text-[10px] font-bold text-rose-500 uppercase tracking-wider mt-0.5">
                                                                Lewat Tempo
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <span className="font-extrabold text-slate-900 text-xs tabular-nums">
                                                            {formatRupiah(invoice.amount)}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <div className="flex flex-col items-start gap-1">
                                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${
                                                                invoice.status === 'paid'
                                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                                                                    : invoice.payment_proof_path
                                                                    ? 'bg-amber-50 text-amber-700 border-amber-200/80 animate-pulse'
                                                                    : 'bg-rose-50 text-rose-700 border-rose-200/80'
                                                            }`}>
                                                                <span className={`w-1.5 h-1.5 rounded-full ${
                                                                    invoice.status === 'paid' ? 'bg-emerald-500' : invoice.payment_proof_path ? 'bg-amber-500' : 'bg-rose-500'
                                                                }`} />
                                                                {invoice.status === 'paid' ? 'Lunas' : invoice.payment_proof_path ? 'Verifikasi Bukti' : 'Belum Lunas'}
                                                            </span>
                                                            {waBadge(invoice)}
                                                        </div>
                                                    </td>

                                                    <td className="px-5 py-4 text-right">
                                                        <div className="inline-flex items-center gap-1.5">
                                                            {/* Preview PDF */}
                                                            <a
                                                                href={route('admin.invoices.show', invoice.id)}
                                                                target="_blank"
                                                                className="p-1.5 rounded-md text-slate-600 hover:text-blue-700 hover:bg-blue-50 border border-slate-200 transition-colors"
                                                                title="Preview PDF Invoice"
                                                            >
                                                                <FileText className="w-3.5 h-3.5" />
                                                            </a>

                                                            {/* WA Kirim */}
                                                            <a
                                                                href={route('admin.invoices.whatsapp', invoice.id)}
                                                                target="_blank"
                                                                className="p-1.5 rounded-md text-emerald-700 hover:bg-emerald-50 border border-slate-200 transition-colors"
                                                                title="Kirim ke WhatsApp PIC"
                                                            >
                                                                <MessageSquare className="w-3.5 h-3.5" />
                                                            </a>

                                                            {/* Resend WA */}
                                                            {(invoice.wa_status === 'failed' || invoice.wa_status === 'sent' || invoice.wa_status === 'skipped') && (
                                                                <button
                                                                    onClick={() => handleResendWa(invoice)}
                                                                    className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 transition-colors"
                                                                    title="Kirim Ulang WA Otomatis"
                                                                >
                                                                    <RefreshCw className="w-3.5 h-3.5" />
                                                                </button>
                                                            )}

                                                            {/* Bukti Pembayaran */}
                                                            {invoice.status === 'unpaid' && invoice.payment_proof_path && (
                                                                <button
                                                                    onClick={() => setViewingProofInvoice(invoice)}
                                                                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-600 hover:text-white transition-colors"
                                                                >
                                                                    Bukti Bayar
                                                                </button>
                                                            )}

                                                            {/* Tandai Lunas */}
                                                            {invoice.status === 'unpaid' && (
                                                                <button
                                                                    onClick={() => handleMarkPaid(invoice)}
                                                                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-600 hover:text-white transition-colors"
                                                                >
                                                                    Tandai Lunas
                                                                </button>
                                                            )}

                                                            {/* Hapus */}
                                                            <button
                                                                onClick={() => handleDelete(invoice)}
                                                                className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
                                                                title="Hapus Invoice"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card Feed View */}
                            <div className="lg:hidden divide-y divide-slate-100">
                                {invoices.data.map((invoice) => {
                                    const isOverdue = new Date(invoice.due_date) < new Date() && invoice.status === 'unpaid';
                                    return (
                                        <div key={invoice.id} className="p-4 sm:p-5 hover:bg-slate-50/50 transition-colors">
                                            <div className="flex items-start justify-between gap-3 mb-2.5">
                                                <div>
                                                    <span className="font-mono font-bold text-xs text-slate-900">{invoice.invoice_number}</span>
                                                    <h3 className="font-bold text-slate-800 text-sm mt-0.5">{invoice.company.company_name}</h3>
                                                    <p className="text-xs text-slate-400 font-medium">PIC: {invoice.company.pic_name}</p>
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${
                                                        invoice.status === 'paid'
                                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                                                            : invoice.payment_proof_path
                                                            ? 'bg-amber-50 text-amber-700 border-amber-200/80 animate-pulse'
                                                            : 'bg-rose-50 text-rose-700 border-rose-200/80'
                                                    }`}>
                                                        {invoice.status === 'paid' ? 'Lunas' : invoice.payment_proof_path ? 'Verifikasi' : 'Belum Lunas'}
                                                    </span>
                                                    {waBadge(invoice)}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 text-xs py-2 px-3 rounded-md bg-slate-50 border border-slate-100 mb-3">
                                                <div>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Jatuh Tempo</span>
                                                    <span className={`font-semibold mt-0.5 inline-block ${isOverdue ? 'text-rose-600 font-bold' : 'text-slate-700'}`}>
                                                        {formatDate(invoice.due_date)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Tagihan</span>
                                                    <span className="font-extrabold text-slate-900 mt-0.5 inline-block">{formatRupiah(invoice.amount)}</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2">
                                                <a
                                                    href={route('admin.invoices.show', invoice.id)}
                                                    target="_blank"
                                                    className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 text-center transition-colors"
                                                >
                                                    Preview PDF
                                                </a>
                                                <a
                                                    href={route('admin.invoices.whatsapp', invoice.id)}
                                                    target="_blank"
                                                    className="flex-1 py-1.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-center transition-colors"
                                                >
                                                    Kirim WA
                                                </a>
                                                {invoice.status === 'unpaid' && invoice.payment_proof_path && (
                                                    <button
                                                        onClick={() => setViewingProofInvoice(invoice)}
                                                        className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 text-center transition-colors"
                                                    >
                                                        Bukti Bayar
                                                    </button>
                                                )}
                                                {invoice.status === 'unpaid' && (
                                                    <button
                                                        onClick={() => handleMarkPaid(invoice)}
                                                        className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 text-center transition-colors shadow-2xs"
                                                    >
                                                        Tandai Lunas
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Pagination */}
                            {invoices.last_page > 1 && (
                                <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between">
                                    <p className="text-xs text-slate-400 font-medium">
                                        Halaman {invoices.current_page} dari {invoices.last_page}
                                    </p>
                                    <div className="flex gap-1">
                                        {invoices.links.map((link, i) => (
                                            link.url ? (
                                                <Link
                                                    key={i}
                                                    href={link.url}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                                        link.active
                                                            ? 'bg-slate-900 text-white'
                                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ) : (
                                                <span key={i} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-50 cursor-not-allowed"
                                                    dangerouslySetInnerHTML={{ __html: link.label }} />
                                            )
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

            {/* Payment Proof Modal */}
            {viewingProofInvoice && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
                    <div className="bg-white rounded-md p-6 max-w-xl w-full border border-slate-200 shadow-xl relative animate-in fade-in zoom-in-95">
                        <button
                            onClick={() => setViewingProofInvoice(null)}
                            className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-2.5 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                                <Receipt className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Bukti Pembayaran Invoice</h3>
                                <p className="text-xs text-slate-400 font-medium">
                                    Mitra: <span className="font-semibold text-slate-700">{viewingProofInvoice.company.company_name}</span> &bull; {viewingProofInvoice.invoice_number}
                                </p>
                            </div>
                        </div>

                        <div className="my-4 p-3 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                            <span className="text-slate-500">Nominal Tagihan:</span>
                            <span className="font-extrabold text-slate-900 text-sm">{formatRupiah(viewingProofInvoice.amount)}</span>
                        </div>

                        <div className="bg-slate-100 rounded-md p-3 flex justify-center items-center min-h-[260px] max-h-[400px] border border-slate-200 overflow-hidden mb-5">
                            {viewingProofInvoice.payment_proof_path ? (
                                viewingProofInvoice.payment_proof_path.endsWith('.pdf') ? (
                                    <div className="text-center space-y-3">
                                        <div className="p-4 bg-rose-50 rounded-xl text-rose-600 inline-block">
                                            <FileText className="w-8 h-8" />
                                        </div>
                                        <p className="text-xs text-slate-600 font-semibold">Bukti Pembayaran berupa Dokumen PDF</p>
                                        <a
                                            href={`/storage/${viewingProofInvoice.payment_proof_path}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-2xs"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                            <span>Buka PDF di Tab Baru</span>
                                        </a>
                                    </div>
                                ) : (
                                    <img
                                        src={`/storage/${viewingProofInvoice.payment_proof_path}`}
                                        alt="Bukti Bayar"
                                        className="max-h-[360px] w-auto object-contain rounded-lg shadow-2xs"
                                    />
                                )
                            ) : (
                                <p className="text-xs text-slate-400 italic">Bukti transfer belum diunggah</p>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                            <button
                                onClick={() => setViewingProofInvoice(null)}
                                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
                            >
                                Tutup
                            </button>
                            <button
                                onClick={() => {
                                    handleMarkPaid(viewingProofInvoice);
                                    setViewingProofInvoice(null);
                                }}
                                className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
                            >
                                Konfirmasi & Tandai Lunas
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </AdminLayout>
    );
}
