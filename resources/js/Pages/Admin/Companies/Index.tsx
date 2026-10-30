import React, { useState, useMemo } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';
import {
    Building2,
    CheckCircle2,
    Clock,
    AlertCircle,
    Search,
    PlusCircle,
    FileText,
    Power,
    PhoneCall,
    Sparkles,
    Layers,
    ArrowUpRight,
    X,
} from 'lucide-react';

interface Company {
    id: number;
    company_name: string;
    pic_name?: string;
    subscription_plan: string;
    subscription_status: string;
    remaining_days: number | null;
    phone: string;
    user?: {
        name: string;
        email: string;
    } | null;
}

interface Props {
    companies: Company[];
}

export default function Index({ companies }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [planFilter, setPlanFilter] = useState<string>('all');

    // Aggregate Metrics & Infographics Data
    const totalCompanies = companies.length;
    const activeCompanies = useMemo(() => companies.filter(c => c.subscription_status === 'active').length, [companies]);
    const pendingActivation = useMemo(() => companies.filter(c => ['payment_uploaded', 'pending'].includes(c.subscription_status)).length, [companies]);
    const inactiveCompanies = useMemo(() => companies.filter(c => ['inactive', 'rejected'].includes(c.subscription_status)).length, [companies]);

    const activeRate = totalCompanies > 0 ? Math.round((activeCompanies / totalCompanies) * 100) : 0;

    // Plan distribution calculation
    const planCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        companies.forEach(c => {
            const plan = c.subscription_plan || 'Reguler';
            counts[plan] = (counts[plan] || 0) + 1;
        });
        return counts;
    }, [companies]);

    const uniquePlans = useMemo(() => Object.keys(planCounts).sort(), [planCounts]);

    // Status distribution
    const statusCounts = useMemo(() => {
        const counts: Record<string, number> = {
            active: 0,
            payment_uploaded: 0,
            pending: 0,
            inactive: 0,
            rejected: 0,
            approved: 0,
        };
        companies.forEach(c => {
            if (counts[c.subscription_status] !== undefined) {
                counts[c.subscription_status]++;
            }
        });
        return counts;
    }, [companies]);

    // Filtered list
    const filteredCompanies = useMemo(() => {
        return companies.filter(c => {
            const matchesSearch =
                c.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (c.user?.name && c.user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (c.user?.email && c.user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (c.pic_name && c.pic_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (c.phone && c.phone.includes(searchQuery));

            const matchesStatus = statusFilter === 'all' || c.subscription_status === statusFilter;
            const matchesPlan = planFilter === 'all' || c.subscription_plan === planFilter;

            return matchesSearch && matchesStatus && matchesPlan;
        });
    }, [companies, searchQuery, statusFilter, planFilter]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Aktif
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Menunggu
                    </span>
                );
            case 'rejected':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        Ditolak
                    </span>
                );
            case 'approved':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        Disetujui
                    </span>
                );
            case 'payment_uploaded':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-teal-50 text-teal-700 border border-teal-200/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                        Verifikasi Pembayaran
                    </span>
                );
            case 'inactive':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        Nonaktif
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {status}
                    </span>
                );
        }
    };

    const getPlanBadge = (plan: string) => {
        const p = plan?.toLowerCase() || '';
        if (p.includes('prime') || p.includes('enterprise')) {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200/70">
                    <Sparkles className="w-3 h-3 text-purple-500" />
                    {plan}
                </span>
            );
        }
        if (p.includes('premium')) {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/70">
                    {plan}
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/70">
                {plan || 'Reguler'}
            </span>
        );
    };

    return (
        <AdminLayout
            title="Kelola Mitra Bisnis"
            subtitle="Direktori dan status operasional seluruh entitas perusahaan mitra Welltrash"
            activeTab="companies"
            headerAction={
                <Link
                    href={route('admin.invoices.create')}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
                >
                    <PlusCircle className="w-4 h-4" />
                    <span>Buat Invoice Baru</span>
                </Link>
            }
        >
            <div className="space-y-6">
                {/* 1. Infographic Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-2xs">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Mitra</span>
                            <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                                <Building2 className="w-4.5 h-4.5" />
                            </div>
                        </div>
                        <div className="text-2xl font-extrabold text-slate-900 tracking-tight tabular-nums">
                            {totalCompanies}
                            <span className="text-xs font-medium text-slate-400 ml-1 font-sans">Entitas</span>
                        </div>
                        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                            <span className="text-emerald-600 font-bold">{activeRate}%</span>
                            <span>berlangganan aktif</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-2xs">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mitra Aktif</span>
                            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <CheckCircle2 className="w-4.5 h-4.5" />
                            </div>
                        </div>
                        <div className="text-2xl font-extrabold text-emerald-700 tracking-tight tabular-nums">
                            {activeCompanies}
                            <span className="text-xs font-medium text-slate-400 ml-1 font-sans">Mitra</span>
                        </div>
                        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>Jadwal rutin terintegrasi</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-2xs">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Perlu Tindakan</span>
                            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                                <Clock className="w-4.5 h-4.5" />
                            </div>
                        </div>
                        <div className="text-2xl font-extrabold text-amber-700 tracking-tight tabular-nums">
                            {pendingActivation}
                            <span className="text-xs font-medium text-slate-400 ml-1 font-sans">Mitra</span>
                        </div>
                        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                            {pendingActivation > 0 ? (
                                <span className="text-amber-700 font-semibold inline-flex items-center gap-1">
                                    Verifikasi & aktivasi segera
                                </span>
                            ) : (
                                <span>Semua mitra terverifikasi</span>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-2xs">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nonaktif / Ditolak</span>
                            <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
                                <AlertCircle className="w-4.5 h-4.5" />
                            </div>
                        </div>
                        <div className="text-2xl font-extrabold text-slate-700 tracking-tight tabular-nums">
                            {inactiveCompanies}
                            <span className="text-xs font-medium text-slate-400 ml-1 font-sans">Entitas</span>
                        </div>
                        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                            <span>Bisa diaktifkan kembali sewaktu-waktu</span>
                        </div>
                    </div>
                </div>

                {/* 2. Visual Distribution & Plan Infographics */}
                <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <Layers className="w-4 h-4 text-emerald-600" />
                                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                                    Distribusi Status & Portofolio Paket Mitra
                                </h3>
                            </div>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">
                                Proporsi mitra bisnis berdasarkan status operasional dan pilihan paket layanan
                            </p>
                        </div>
                        <span className="text-xs font-semibold text-slate-500">
                            Basis {totalCompanies} Total Perusahaan
                        </span>
                    </div>

                    {/* Segmented Distribution Bar */}
                    <div className="space-y-2">
                        <div className="h-3 w-full bg-slate-100 rounded-md overflow-hidden flex">
                            {totalCompanies > 0 ? (
                                <>
                                    <div
                                        style={{ width: `${(activeCompanies / totalCompanies) * 100}%` }}
                                        className="bg-emerald-500 transition-all duration-500"
                                        title={`Aktif: ${activeCompanies} (${activeRate}%)`}
                                    />
                                    <div
                                        style={{ width: `${(statusCounts.payment_uploaded / totalCompanies) * 100}%` }}
                                        className="bg-teal-400 transition-all duration-500"
                                        title={`Verifikasi Pembayaran: ${statusCounts.payment_uploaded}`}
                                    />
                                    <div
                                        style={{ width: `${(statusCounts.pending / totalCompanies) * 100}%` }}
                                        className="bg-amber-400 transition-all duration-500"
                                        title={`Menunggu: ${statusCounts.pending}`}
                                    />
                                    <div
                                        style={{ width: `${(inactiveCompanies / totalCompanies) * 100}%` }}
                                        className="bg-slate-300 transition-all duration-500"
                                        title={`Nonaktif: ${inactiveCompanies}`}
                                    />
                                </>
                            ) : (
                                <div className="w-full bg-slate-200" />
                            )}
                        </div>

                        {/* Legend */}
                        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 pt-1">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
                                <span>Aktif ({activeCompanies})</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-xs bg-teal-400" />
                                <span>Verifikasi ({statusCounts.payment_uploaded})</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-xs bg-amber-400" />
                                <span>Menunggu ({statusCounts.pending})</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-xs bg-slate-300" />
                                <span>Nonaktif / Ditolak ({inactiveCompanies})</span>
                            </div>
                        </div>
                    </div>

                    {/* Plan Distribution Badges */}
                    {uniquePlans.length > 0 && (
                        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">
                                Paket Langganan:
                            </span>
                            {uniquePlans.map(plan => {
                                const count = planCounts[plan];
                                const pct = totalCompanies > 0 ? Math.round((count / totalCompanies) * 100) : 0;
                                return (
                                    <button
                                        key={plan}
                                        onClick={() => setPlanFilter(planFilter === plan ? 'all' : plan)}
                                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                                            planFilter === plan
                                                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                                                : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100'
                                        }`}
                                    >
                                        <span>{plan}</span>
                                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                            planFilter === plan ? 'bg-white/20 text-white' : 'bg-slate-200/70 text-slate-600'
                                        }`}>
                                            {count} ({pct}%)
                                        </span>
                                    </button>
                                );
                            })}
                            {planFilter !== 'all' && (
                                <button
                                    onClick={() => setPlanFilter('all')}
                                    className="text-xs font-semibold text-rose-600 hover:text-rose-700 ml-1 inline-flex items-center gap-1"
                                >
                                    <X className="w-3.5 h-3.5" />
                                    Reset
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* 3. Search & Filter Bar */}
                <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Cari nama perusahaan, PIC, email, atau telepon..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {/* Status Filter */}
                        <div className="flex items-center gap-1.5 bg-slate-100/70 p-1 rounded-lg border border-slate-200/60 text-xs">
                            <span className="text-[11px] font-bold text-slate-400 px-2 uppercase">Status:</span>
                            <button
                                onClick={() => setStatusFilter('all')}
                                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                                    statusFilter === 'all'
                                        ? 'bg-white text-slate-900 shadow-2xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Semua ({totalCompanies})
                            </button>
                            <button
                                onClick={() => setStatusFilter('active')}
                                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                                    statusFilter === 'active'
                                        ? 'bg-white text-emerald-700 shadow-2xs'
                                        : 'text-slate-600 hover:text-emerald-700'
                                }`}
                            >
                                Aktif ({activeCompanies})
                            </button>
                            <button
                                onClick={() => setStatusFilter('payment_uploaded')}
                                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                                    statusFilter === 'payment_uploaded'
                                        ? 'bg-white text-teal-700 shadow-2xs'
                                        : 'text-slate-600 hover:text-teal-700'
                                }`}
                            >
                                Verifikasi ({statusCounts.payment_uploaded})
                            </button>
                            <button
                                onClick={() => setStatusFilter('inactive')}
                                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                                    statusFilter === 'inactive'
                                        ? 'bg-white text-slate-800 shadow-2xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                Nonaktif ({inactiveCompanies})
                            </button>
                        </div>
                    </div>
                </div>

                {/* 4. Companies Table Container */}
                <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-bold text-slate-900">
                                Daftar Mitra Terdaftar
                            </h2>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">
                                Menampilkan {filteredCompanies.length} dari {totalCompanies} perusahaan mitra
                            </p>
                        </div>
                    </div>

                    {filteredCompanies.length === 0 ? (
                        <div className="p-16 text-center">
                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3 text-slate-400">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <h4 className="text-sm font-bold text-slate-800">Tidak ada perusahaan ditemukan</h4>
                            <p className="text-xs text-slate-400 font-medium mt-1">
                                Coba ubah kata kunci pencarian atau sesuaikan opsi filter di atas.
                            </p>
                            {(searchQuery || statusFilter !== 'all' || planFilter !== 'all') && (
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setStatusFilter('all');
                                        setPlanFilter('all');
                                    }}
                                    className="mt-4 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                                >
                                    Reset Semua Filter
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-100 text-left">
                                    <thead>
                                        <tr className="bg-slate-50/75">
                                            <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                                Perusahaan & PIC
                                            </th>
                                            <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                                Paket Langganan
                                            </th>
                                            <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                                Status Mitra
                                            </th>
                                            <th className="px-5 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                                Kontak
                                            </th>
                                            <th className="px-5 py-3.5 text-right text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                                Tindakan
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">

                                        {filteredCompanies.map((company) => (
                                            <tr key={company.id} className="hover:bg-slate-50/70 transition-colors group">
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center font-extrabold text-xs">
                                                            {company.company_name.substring(0, 2).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                                                {company.company_name}
                                                            </div>
                                                            <div className="text-xs text-slate-400 font-medium mt-0.5">
                                                                PIC: <span className="text-slate-600">{company.user?.name || company.pic_name || '-'}</span> &bull; {company.user?.email || '-'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    {getPlanBadge(company.subscription_plan)}
                                                </td>
                                                <td className="px-5 py-4">
                                                    {getStatusBadge(company.subscription_status)}
                                                </td>
                                                <td className="px-5 py-4 text-xs font-medium text-slate-600">
                                                    {company.phone ? (
                                                        <a
                                                            href={`https://wa.me/${company.phone.startsWith('0') ? '62' + company.phone.slice(1) : company.phone}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1.5 text-slate-600 hover:text-emerald-700 font-medium transition-colors"
                                                            title="Buka WhatsApp PIC"
                                                        >
                                                            <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                                                            <span>{company.phone}</span>
                                                        </a>
                                                    ) : (
                                                        <span className="text-slate-400">-</span>
                                                    )}
                                                </td>

                                                <td className="px-5 py-4 text-right">
                                                    <div className="inline-flex items-center gap-1.5">
                                                        {company.subscription_status === 'payment_uploaded' && (
                                                            <Link
                                                                href={route('admin.companies.activate', company.id)}
                                                                method="patch"
                                                                as="button"
                                                                preserveScroll
                                                                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-teal-50 text-teal-700 hover:bg-teal-600 hover:text-white border border-teal-200 transition-colors"
                                                            >
                                                                Verifikasi & Aktifkan
                                                            </Link>
                                                        )}

                                                        {(company.subscription_status === 'active' || company.subscription_status === 'inactive') && (
                                                            <Link
                                                                href={route('admin.companies.toggleStatus', company.id)}
                                                                method="patch"
                                                                as="button"
                                                                preserveScroll
                                                                className={`p-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                                                                    company.subscription_status === 'active'
                                                                        ? 'text-rose-600 hover:bg-rose-50 border-rose-200/80'
                                                                        : 'text-emerald-600 hover:bg-emerald-50 border-emerald-200/80'
                                                                }`}
                                                                title={company.subscription_status === 'active' ? 'Nonaktifkan Mitra' : 'Aktifkan Mitra'}
                                                            >
                                                                <Power className="w-3.5 h-3.5" />
                                                            </Link>
                                                        )}

                                                        {company.subscription_status === 'active' && (
                                                            <Link
                                                                href={route('admin.invoices.create') + '?company_id=' + company.id}
                                                                className="p-1.5 rounded-lg text-xs font-semibold text-emerald-700 hover:bg-emerald-50 border border-emerald-200/80 transition-colors"
                                                                title="Buat Tagihan Invoice"
                                                            >
                                                                <FileText className="w-3.5 h-3.5" />
                                                            </Link>
                                                        )}

                                                        <Link
                                                            href={route('admin.companies.show', company.id)}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-2xs"
                                                        >
                                                            <span>Detail</span>
                                                            <ArrowUpRight className="w-3.5 h-3.5" />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card Feed View */}
                            <div className="lg:hidden divide-y divide-slate-100">
                                {filteredCompanies.map((company) => (
                                    <div key={company.id} className="p-4 sm:p-5 hover:bg-slate-50/50 transition-colors">
                                        <div className="flex items-start justify-between gap-3 mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center font-extrabold text-xs shrink-0">
                                                    {company.company_name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900 text-sm">{company.company_name}</h3>
                                                    <p className="text-xs text-slate-400 font-medium">
                                                        PIC: {company.user?.name || company.pic_name || '-'}
                                                    </p>
                                                </div>
                                            </div>
                                            {getStatusBadge(company.subscription_status)}
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-xs py-2.5 px-3 rounded-lg bg-slate-50 border border-slate-100 mb-3">
                                            <div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Paket</span>
                                                <span className="font-semibold text-slate-700 mt-0.5 inline-block">{company.subscription_plan || 'Reguler'}</span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Telepon / WA</span>
                                                <span className="font-medium text-slate-600 mt-0.5 inline-block">{company.phone || '-'}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={route('admin.companies.show', company.id)}
                                                className="flex-1 py-2 rounded-lg text-xs font-semibold bg-slate-900 text-white text-center hover:bg-slate-800 transition-colors"
                                            >
                                                Lihat Profil Lengkap
                                            </Link>

                                            {company.phone && (
                                                <a
                                                    href={`https://wa.me/${company.phone.startsWith('0') ? '62' + company.phone.slice(1) : company.phone}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 rounded-lg text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                                                    title="Hubungi WhatsApp"
                                                >
                                                    <PhoneCall className="w-4 h-4" />
                                                </a>
                                            )}

                                            {company.subscription_status === 'active' && (
                                                <Link
                                                    href={route('admin.invoices.create') + '?company_id=' + company.id}
                                                    className="p-2 rounded-lg text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                                                    title="Buat Tagihan Invoice"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
