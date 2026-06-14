import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';

interface Company {
    id: number;
    company_name: string;
    pic_name: string;
    phone: string;
    address: string;
    subscription_plan: string;
}

interface Props {
    companies: Company[];
    selectedCompanyId: number | null;
}

// Suggested prices per plan (admin can override)
const PLAN_PRICES: Record<string, number> = {
    'Rumah Tangga (> 10km)': 1000000,
    'Reguler': 2500000,
    'Prime': 3200000,
    'Premium+': 5200000,
};

export default function InvoicesCreate({ companies, selectedCompanyId }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        company_id: selectedCompanyId ? String(selectedCompanyId) : '',
        period_start: '',
        period_end: '',
        due_date: '',
        amount: '',
        notes: '',
        wa_send_at: '',
        wa_enabled: false as boolean,
    });

    const [selectedCompany, setSelectedCompany] = useState<Company | null>(
        selectedCompanyId ? companies.find(c => c.id === selectedCompanyId) ?? null : null
    );

    useEffect(() => {
        if (data.company_id) {
            const found = companies.find(c => c.id === Number(data.company_id)) ?? null;
            setSelectedCompany(found);
            if (found) {
                setData('amount', String(PLAN_PRICES[found.subscription_plan] ?? ''));
            }
        } else {
            setSelectedCompany(null);
        }
    }, [data.company_id]);

    // Auto-set period to current month if empty
    useEffect(() => {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const lastDay = new Date(y, now.getMonth() + 1, 0).getDate();

        if (!data.period_start) setData('period_start', `${y}-${m}-01`);
        if (!data.period_end) setData('period_end', `${y}-${m}-${lastDay}`);
        if (!data.due_date) {
            const due = new Date(now);
            due.setDate(due.getDate() + 14);
            const dueStr = due.toISOString().split('T')[0];
            setData('due_date', dueStr);
            // Default jadwal WA = tanggal jatuh tempo jam 08:00
            setData('wa_send_at', `${dueStr}T08:00`);
        }
    }, []);

    // Sinkronkan default wa_send_at saat due_date berubah
    useEffect(() => {
        if (data.due_date && data.wa_enabled) {
            setData('wa_send_at', `${data.due_date}T08:00`);
        }
    }, [data.due_date]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Jika WA tidak diaktifkan, kosongkan wa_send_at sebelum submit
        if (!data.wa_enabled) {
            setData('wa_send_at', '');
        }
        post(route('admin.invoices.store'));
    };

    const formatRupiah = (val: string) => {
        const num = parseFloat(val.replace(/\D/g, ''));
        if (isNaN(num)) return '';
        return new Intl.NumberFormat('id-ID').format(num);
    };

    return (
        <AdminLayout
            title="Buat Invoice Baru"
            subtitle="Tagihan Mitra Welltrash"
            activeTab="invoices"
        >
            <div className="max-w-3xl mx-auto">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-xs text-gray-400 font-bold mb-6">
                    <Link href={route('admin.invoices.index')} className="hover:text-green-600 transition-colors">
                        Invoice
                    </Link>
                    <span>/</span>
                    <span className="text-gray-600">Buat Baru</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Company Selector */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <h3 className="text-base font-black text-gray-900 mb-6 flex items-center gap-2">
                            <span className="w-6 h-6 bg-green-600 text-white rounded-full text-xs flex items-center justify-center font-black">1</span>
                            Pilih Mitra
                        </h3>

                        <div>
                            <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">
                                Perusahaan Mitra *
                            </label>
                            <select
                                value={data.company_id}
                                onChange={e => setData('company_id', e.target.value)}
                                className="w-full pl-4 pr-10 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-gray-900 font-medium focus:ring-2 focus:ring-green-100 focus:border-green-400 focus:bg-white transition-all"
                            >
                                <option value="">-- Pilih Mitra --</option>
                                {companies.map(c => (
                                    <option key={c.id} value={c.id}>{c.company_name}</option>
                                ))}
                            </select>
                            {errors.company_id && <p className="text-red-500 text-xs mt-1">{errors.company_id}</p>}
                        </div>

                        {/* Company Preview Card */}
                        {selectedCompany && (
                            <div className="mt-4 p-4 bg-green-50 rounded-2xl border border-green-100">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-black text-green-900">{selectedCompany.company_name}</p>
                                        <p className="text-sm text-green-700 mt-0.5">PIC: {selectedCompany.pic_name}</p>
                                        <p className="text-xs text-green-600 mt-0.5">📱 {selectedCompany.phone}</p>
                                        <p className="text-xs text-green-600 mt-0.5">📍 {selectedCompany.address}</p>
                                    </div>
                                    <span className="text-xs font-black bg-green-600 text-white px-3 py-1 rounded-lg">
                                        {selectedCompany.subscription_plan}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Period & Due Date */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <h3 className="text-base font-black text-gray-900 mb-6 flex items-center gap-2">
                            <span className="w-6 h-6 bg-green-600 text-white rounded-full text-xs flex items-center justify-center font-black">2</span>
                            Periode & Jatuh Tempo
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">
                                    Awal Periode *
                                </label>
                                <input
                                    type="date"
                                    value={data.period_start}
                                    onChange={e => setData('period_start', e.target.value)}
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-green-100 focus:border-green-400 focus:bg-white transition-all"
                                />
                                {errors.period_start && <p className="text-red-500 text-xs mt-1">{errors.period_start}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">
                                    Akhir Periode *
                                </label>
                                <input
                                    type="date"
                                    value={data.period_end}
                                    onChange={e => setData('period_end', e.target.value)}
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-green-100 focus:border-green-400 focus:bg-white transition-all"
                                />
                                {errors.period_end && <p className="text-red-500 text-xs mt-1">{errors.period_end}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">
                                    Tanggal Jatuh Tempo *
                                </label>
                                <input
                                    type="date"
                                    value={data.due_date}
                                    onChange={e => setData('due_date', e.target.value)}
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-green-100 focus:border-green-400 focus:bg-white transition-all"
                                />
                                {errors.due_date && <p className="text-red-500 text-xs mt-1">{errors.due_date}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Amount & Notes */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <h3 className="text-base font-black text-gray-900 mb-6 flex items-center gap-2">
                            <span className="w-6 h-6 bg-green-600 text-white rounded-full text-xs flex items-center justify-center font-black">3</span>
                            Tagihan & Catatan
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">
                                    Total Tagihan (Rp) *
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">Rp</span>
                                    <input
                                        type="number"
                                        min="0"
                                        step="1000"
                                        value={data.amount}
                                        onChange={e => setData('amount', e.target.value)}
                                        placeholder="0"
                                        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-gray-900 font-bold text-lg focus:ring-2 focus:ring-green-100 focus:border-green-400 focus:bg-white transition-all"
                                    />
                                </div>
                                {data.amount && (
                                    <p className="text-xs text-green-600 font-bold mt-1">
                                        = Rp {formatRupiah(data.amount)}
                                    </p>
                                )}
                                {selectedCompany && PLAN_PRICES[selectedCompany.subscription_plan] && (
                                    <p className="text-xs text-gray-400 mt-1">
                                        Saran harga paket {selectedCompany.subscription_plan}: Rp {new Intl.NumberFormat('id-ID').format(PLAN_PRICES[selectedCompany.subscription_plan])}
                                    </p>
                                )}
                                {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">
                                    Catatan (Opsional)
                                </label>
                                <textarea
                                    value={data.notes}
                                    onChange={e => setData('notes', e.target.value)}
                                    rows={3}
                                    placeholder="Catatan tambahan yang akan muncul di invoice..."
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-green-100 focus:border-green-400 focus:bg-white transition-all resize-none"
                                />
                                {errors.notes && <p className="text-red-500 text-xs mt-1">{errors.notes}</p>}
                            </div>
                        </div>
                    </div>

                    {/* WA Schedule */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <h3 className="text-base font-black text-gray-900 mb-2 flex items-center gap-2">
                            <span className="w-6 h-6 bg-green-600 text-white rounded-full text-xs flex items-center justify-center font-black">4</span>
                            Jadwal Kirim WhatsApp
                        </h3>
                        <p className="text-xs text-gray-400 mb-5">
                            Invoice akan otomatis dikirim via WhatsApp ke nomor PIC pada waktu yang ditentukan.
                        </p>

                        {/* Toggle */}
                        <label className="flex items-center gap-3 cursor-pointer mb-5 select-none">
                            <div
                                onClick={() => setData('wa_enabled', !data.wa_enabled)}
                                className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                                    data.wa_enabled ? 'bg-green-500' : 'bg-gray-200'
                                }`}
                            >
                                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                                    data.wa_enabled ? 'translate-x-6' : ''
                                }`} />
                            </div>
                            <span className={`text-sm font-bold ${
                                data.wa_enabled ? 'text-green-700' : 'text-gray-400'
                            }`}>
                                {data.wa_enabled ? '✅ Aktif — WA akan dikirim otomatis' : 'Nonaktif — kirim manual'}
                            </span>
                        </label>

                        {data.wa_enabled && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">
                                        Tanggal &amp; Jam Kirim WA *
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={data.wa_send_at}
                                        onChange={e => setData('wa_send_at', e.target.value)}
                                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-green-100 focus:border-green-400 focus:bg-white transition-all"
                                    />
                                    {errors.wa_send_at && <p className="text-red-500 text-xs mt-1">{errors.wa_send_at}</p>}
                                </div>

                                {selectedCompany && (
                                    <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-2xl px-4 py-3">
                                        <span className="text-xl">📱</span>
                                        <div>
                                            <p className="text-xs font-black text-green-800">Akan dikirim ke:</p>
                                            <p className="text-sm font-bold text-green-700">{selectedCompany.pic_name}</p>
                                            <p className="text-xs text-green-600">{selectedCompany.phone}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-4">
                        <Link
                            href={route('admin.invoices.index')}
                            className="px-6 py-3 rounded-2xl border border-gray-200 text-sm font-black text-gray-600 hover:bg-gray-50 transition-all"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing || !data.company_id || !data.amount}
                            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-2xl text-sm font-black transition-all shadow-lg shadow-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? (
                                <>
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Membuat Invoice...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Buat Invoice & Generate PDF
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
