import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';

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
    created_at: string;
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
    filters: { company_id?: string; status?: string };
}

export default function InvoicesIndex({ invoices, companies, filters }: Props) {
    const [companyFilter, setCompanyFilter] = useState(filters.company_id ?? '');
    const [statusFilter, setStatusFilter] = useState(filters.status ?? '');

    const applyFilters = () => {
        router.get(route('admin.invoices.index'), {
            company_id: companyFilter || undefined,
            status: statusFilter || undefined,
        }, { preserveScroll: true });
    };

    const clearFilters = () => {
        setCompanyFilter('');
        setStatusFilter('');
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

    const handleDelete = (invoice: Invoice) => {
        if (confirm(`Hapus invoice ${invoice.invoice_number}? Tindakan ini tidak bisa dibatalkan.`)) {
            router.delete(route('admin.invoices.destroy', invoice.id), { preserveScroll: true });
        }
    };

    return (
        <AdminLayout
            title="Manajemen Invoice"
            subtitle="Tagihan Mitra Welltrash"
            activeTab="invoices"
        >
            {/* Top bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-lg font-black text-gray-900">Daftar Invoice</h2>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                        Total {invoices.total} Invoice
                    </p>
                </div>
                <Link
                    href={route('admin.invoices.create')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-2xl text-sm font-black transition-all shadow-md shadow-green-100"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Buat Invoice Baru
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-wrap gap-3 items-end">
                <div className="flex flex-col gap-1 min-w-[180px]">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Filter Mitra</label>
                    <select
                        value={companyFilter}
                        onChange={e => setCompanyFilter(e.target.value)}
                        className="pl-3 pr-8 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 bg-gray-50 focus:ring-2 focus:ring-green-100 focus:border-green-400 transition-all"
                    >
                        <option value="">Semua Mitra</option>
                        {companies.map(c => (
                            <option key={c.id} value={c.id}>{c.company_name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col gap-1 min-w-[150px]">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</label>
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="pl-3 pr-8 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 bg-gray-50 focus:ring-2 focus:ring-green-100 focus:border-green-400 transition-all"
                    >
                        <option value="">Semua Status</option>
                        <option value="unpaid">Belum Lunas</option>
                        <option value="paid">Lunas</option>
                    </select>
                </div>
                <button
                    onClick={applyFilters}
                    className="px-4 py-2 bg-gray-900 hover:bg-green-600 text-white rounded-xl text-xs font-black transition-all"
                >
                    Terapkan Filter
                </button>
                {(companyFilter || statusFilter) && (
                    <button
                        onClick={clearFilters}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-black transition-all"
                    >
                        Reset
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                {invoices.data.length === 0 ? (
                    <div className="p-20 text-center">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Belum ada invoice</p>
                        <Link href={route('admin.invoices.create')} className="mt-4 inline-block text-xs font-black text-green-600 hover:underline">
                            + Buat invoice pertama
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-50">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">No. Invoice</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Mitra</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Periode</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Jatuh Tempo</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {invoices.data.map(invoice => (
                                        <tr key={invoice.id} className="hover:bg-gray-50/80 transition-colors group">
                                            <td className="px-6 py-4">
                                                <span className="font-black text-gray-900 text-xs font-mono">{invoice.invoice_number}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-900 text-sm">{invoice.company.company_name}</span>
                                                    <span className="text-xs text-gray-400">{invoice.company.pic_name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-gray-600">
                                                {formatDate(invoice.period_start)} – {formatDate(invoice.period_end)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-xs font-bold ${new Date(invoice.due_date) < new Date() && invoice.status === 'unpaid' ? 'text-red-600' : 'text-gray-600'}`}>
                                                    {formatDate(invoice.due_date)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-black text-gray-900 text-sm">{formatRupiah(invoice.amount)}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                                                    invoice.status === 'paid'
                                                        ? 'bg-green-50 text-green-700 border-green-100'
                                                        : 'bg-red-50 text-red-600 border-red-100'
                                                }`}>
                                                    {invoice.status === 'paid' ? '✓ Lunas' : '⚠ Belum Lunas'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5 flex-wrap">
                                                    {/* Preview PDF */}
                                                    <a
                                                        href={route('admin.invoices.show', invoice.id)}
                                                        target="_blank"
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all border border-blue-100 hover:border-blue-600"
                                                        title="Preview PDF"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        PDF
                                                    </a>

                                                    {/* Kirim WhatsApp */}
                                                    <a
                                                        href={route('admin.invoices.whatsapp', invoice.id)}
                                                        target="_blank"
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100 hover:border-emerald-600"
                                                        title="Kirim via WhatsApp"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                                        </svg>
                                                        WA
                                                    </a>

                                                    {/* Tandai Lunas */}
                                                    {invoice.status === 'unpaid' && (
                                                        <button
                                                            onClick={() => handleMarkPaid(invoice)}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black bg-green-50 text-green-700 hover:bg-green-600 hover:text-white transition-all border border-green-100 hover:border-green-600"
                                                            title="Tandai Lunas"
                                                        >
                                                            ✓ Lunas
                                                        </button>
                                                    )}

                                                    {/* Hapus */}
                                                    <button
                                                        onClick={() => handleDelete(invoice)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all border border-red-100 hover:border-red-600"
                                                        title="Hapus Invoice"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="lg:hidden divide-y divide-gray-50">
                            {invoices.data.map(invoice => (
                                <div key={invoice.id} className="p-5">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="font-mono font-black text-gray-900 text-xs">{invoice.invoice_number}</p>
                                            <p className="font-bold text-gray-800 mt-0.5">{invoice.company.company_name}</p>
                                            <p className="text-xs text-gray-400">{invoice.company.pic_name}</p>
                                        </div>
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                                            invoice.status === 'paid'
                                                ? 'bg-green-50 text-green-700 border-green-100'
                                                : 'bg-red-50 text-red-600 border-red-100'
                                        }`}>
                                            {invoice.status === 'paid' ? '✓ Lunas' : '⚠ Belum Lunas'}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                                        <div>
                                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px]">Periode</p>
                                            <p className="text-gray-700 font-medium">{formatDate(invoice.period_start)} – {formatDate(invoice.period_end)}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px]">Total</p>
                                            <p className="text-gray-900 font-black">{formatRupiah(invoice.amount)}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <a href={route('admin.invoices.show', invoice.id)} target="_blank"
                                            className="flex-1 py-2 rounded-xl text-[10px] font-black bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all border border-blue-100 text-center">
                                            Preview PDF
                                        </a>
                                        <a href={route('admin.invoices.whatsapp', invoice.id)} target="_blank"
                                            className="flex-1 py-2 rounded-xl text-[10px] font-black bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100 text-center">
                                            Kirim WA
                                        </a>
                                        {invoice.status === 'unpaid' && (
                                            <button onClick={() => handleMarkPaid(invoice)}
                                                className="flex-1 py-2 rounded-xl text-[10px] font-black bg-green-50 text-green-700 hover:bg-green-600 hover:text-white transition-all border border-green-100">
                                                ✓ Tandai Lunas
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {invoices.last_page > 1 && (
                            <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between">
                                <p className="text-xs text-gray-400 font-medium">
                                    Halaman {invoices.current_page} dari {invoices.last_page}
                                </p>
                                <div className="flex gap-1">
                                    {invoices.links.map((link, i) => (
                                        link.url ? (
                                            <Link
                                                key={i}
                                                href={link.url}
                                                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                                                    link.active
                                                        ? 'bg-green-600 text-white'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : (
                                            <span key={i} className="px-3 py-1.5 rounded-xl text-xs font-black text-gray-300 bg-gray-50"
                                                dangerouslySetInnerHTML={{ __html: link.label }} />
                                        )
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </AdminLayout>
    );
}
