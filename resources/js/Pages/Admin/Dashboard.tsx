import React, { useState, useMemo } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import {
    Building2,
    CheckCircle2,
    Clock,
    Truck,
    Sprout,
    Recycle,
    Trash2,
    TrendingUp,
    Search,
    ArrowUpRight,
    Ban,
    Receipt,
    Sparkles,
    ShieldCheck,
    Scale,
    Filter,
    Layers,
    ArrowUpDown,
    Check,
    Leaf,
    Activity,
} from 'lucide-react';

interface TrashStat {
    company_name: string;
    subscription_plan: string;
    subscription_status: string;
    organic: number;
    anorganic: number;
    residue: number;
    trash_bags?: number;
    total_pickups: number;
}

interface Totals {
    organic: number;
    anorganic: number;
    residue: number;
    trash_bags?: number;
    total_pickups: number;
    total_companies: number;
    active_companies: number;
    pending_companies: number;
}

interface Props {
    trashStats: TrashStat[];
    totals: Totals;
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.06,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

interface KpiCardProps {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: number | string;
    unit?: string;
    badge: string;
    subtext: React.ReactNode;
    color: 'emerald' | 'amber' | 'teal' | 'slate';
    href?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ icon: Icon, label, value, unit, badge, subtext, color, href }) => {
    const colorStyles = {
        emerald: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white',
        amber: 'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white',
        teal: 'bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white',
        slate: 'bg-slate-100 text-slate-700 group-hover:bg-slate-900 group-hover:text-white',
    };

    const content = (
        <motion.div
            variants={itemVariants}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className={`bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all group ${
                color === 'amber' && typeof value === 'number' && value > 0 ? 'bg-amber-50/30 border-amber-200' : ''
            }`}
        >
            <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${colorStyles[color]}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {badge}
                </span>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
                {value}
                {unit && <span className="text-xs font-medium text-slate-400 ml-1 font-sans">{unit}</span>}
            </div>
            <div className="mt-2 text-xs text-slate-500 font-medium">{subtext}</div>
        </motion.div>
    );

    return href ? <Link href={href} className="block">{content}</Link> : content;
};

interface WasteCardProps {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    weight: number;
    pct: string;
    desc: string;
    bg: string;
    border: string;
    iconBg: string;
    textColor: string;
}

const WasteCard: React.FC<WasteCardProps> = ({ icon: Icon, title, weight, pct, desc, bg, border, iconBg, textColor }) => (
    <div className={`p-4 rounded-xl ${bg} ${border} border transition-colors`}>
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg ${iconBg} text-white flex items-center justify-center`}>
                    <Icon className="w-4 h-4" />
                </div>
                <span className={`font-bold text-xs ${textColor}`}>{title}</span>
            </div>
            <span className="text-[11px] font-black px-2 py-0.5 rounded-md bg-white text-slate-700 shadow-2xs">
                {pct}%
            </span>
        </div>
        <div className="text-2xl font-black text-slate-900 tracking-tight my-1">
            {weight.toLocaleString('id-ID')}
            <span className="text-xs font-bold text-slate-400 ml-1">Kg</span>
        </div>
        <p className="text-[11px] text-slate-600 font-medium leading-relaxed">{desc}</p>
    </div>
);

export default function Dashboard({ trashStats, totals }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending'>('all');
    const [sortBy, setSortBy] = useState<'total' | 'organic' | 'anorganic' | 'pickups' | 'name'>('total');

    // Dynamic Greeting
    const hour = new Date().getHours();
    const greeting = hour < 11 ? 'Selamat Pagi' : hour < 15 ? 'Selamat Siang' : hour < 18 ? 'Selamat Sore' : 'Selamat Malam';

    // Comprehensive Environmental & Waste Calculations
    const totalOrganic = totals.organic || 0;
    const totalAnorganic = totals.anorganic || 0;
    const totalResidue = totals.residue || 0;
    const totalWasteKg = Math.round((totalOrganic + totalAnorganic + totalResidue) * 100) / 100;

    const organicPct = totalWasteKg > 0 ? ((totalOrganic / totalWasteKg) * 100).toFixed(1) : '0';
    const anorganicPct = totalWasteKg > 0 ? ((totalAnorganic / totalWasteKg) * 100).toFixed(1) : '0';
    const residuePct = totalWasteKg > 0 ? ((totalResidue / totalWasteKg) * 100).toFixed(1) : '0';

    const divertedKg = Math.round((totalOrganic + totalAnorganic) * 100) / 100;
    const diversionRate = totalWasteKg > 0 ? Math.round((divertedKg / totalWasteKg) * 100) : 0;
    const co2eAvoided = Math.round((totalOrganic * 0.48 + totalAnorganic * 1.15) * 10) / 10;
    const activeRate = totals.total_companies > 0 ? Math.round((totals.active_companies / totals.total_companies) * 100) : 0;
    const avgPerPickup = totals.total_pickups > 0 ? (totalWasteKg / totals.total_pickups).toFixed(1) : '0';

    // Filtered & Sorted Table Data
    const filteredStats = useMemo(() => {
        return trashStats
            .filter((item) => {
                const matchesSearch =
                    item.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.subscription_plan.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesStatus = statusFilter === 'all' || item.subscription_status.toLowerCase() === statusFilter;
                return matchesSearch && matchesStatus;
            })
            .sort((a, b) => {
                const totalA = a.organic + a.anorganic + a.residue;
                const totalB = b.organic + b.anorganic + b.residue;
                if (sortBy === 'total') return totalB - totalA;
                if (sortBy === 'organic') return b.organic - a.organic;
                if (sortBy === 'anorganic') return b.anorganic - a.anorganic;
                if (sortBy === 'pickups') return b.total_pickups - a.total_pickups;
                if (sortBy === 'name') return a.company_name.localeCompare(b.company_name);
                return 0;
            });
    }, [trashStats, searchQuery, statusFilter, sortBy]);

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Aktif
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Menunggu
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                        {status}
                    </span>
                );
        }
    };

    return (
        <AdminLayout
            title="Dasbor Analitik"
            subtitle="Ringkasan platform pengolahan limbah & kemitraan industri"
            activeTab="dashboard"
        >
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-6"
            >
                {/* 1. Greeting & Intelligence Summary Bar */}
                <motion.div
                    variants={itemVariants}
                    className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-800"
                >
                    <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-emerald-500/10 via-teal-500/5 to-transparent pointer-events-none" />
                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                    <Sparkles className="w-3 h-3 text-emerald-400" />
                                    WellTrash Enterprise
                                </span>
                                <span className="text-xs text-slate-400 font-medium hidden sm:inline">&bull;</span>
                                <span className="text-xs text-slate-400 font-medium hidden sm:inline">Pusat Kendali Operasional</span>
                            </div>
                            <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white">
                                {greeting}, Administrator
                            </h2>
                            <p className="text-xs text-slate-300/90 mt-1 max-w-2xl leading-relaxed">
                                Memonitor <span className="font-bold text-white">{totals.total_companies} mitra industri</span> di Jember dengan akumulasi <span className="font-bold text-emerald-400">{totalWasteKg.toLocaleString('id-ID')} Kg</span> limbah terkelola secara sirkular.
                            </p>
                        </div>

                        {/* Quick Intelligence Badges */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-center gap-2.5">
                                <Leaf className="w-4 h-4 text-emerald-400" />
                                <div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tingkat Daur Ulang</div>
                                    <div className="text-xs font-black text-white">{diversionRate}% Teralihkan</div>
                                </div>
                            </div>
                            <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-center gap-2.5">
                                <Scale className="w-4 h-4 text-teal-400" />
                                <div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Reduksi Karbon</div>
                                    <div className="text-xs font-black text-white">{co2eAvoided} Kg CO₂e</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
                {/* 2. Primary KPI Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard
                        icon={Building2}
                        label="Total Perusahaan"
                        value={totals.total_companies}
                        unit="Entitas"
                        badge="Total Mitra"
                        color="slate"
                        subtext={
                            <div className="flex items-center gap-1.5">
                                <span className="font-bold text-emerald-600">{activeRate}%</span>
                                <span>berlangganan aktif</span>
                            </div>
                        }
                    />

                    <KpiCard
                        icon={CheckCircle2}
                        label="Mitra Aktif"
                        value={totals.active_companies}
                        unit="Mitra"
                        badge="Berjalan Rutin"
                        color="emerald"
                        subtext={
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                <span>Jadwal aktif beroperasi</span>
                            </div>
                        }
                    />

                    <KpiCard
                        icon={Clock}
                        label="Persetujuan"
                        value={totals.pending_companies}
                        unit="Permohonan"
                        badge={totals.pending_companies > 0 ? "Perlu Tindakan" : "Bersih"}
                        color="amber"
                        href="/admin/companies/pending"
                        subtext={
                            totals.pending_companies > 0 ? (
                                <span className="text-amber-700 font-semibold inline-flex items-center gap-1">
                                    Tinjau permohonan <ArrowUpRight className="w-3 h-3" />
                                </span>
                            ) : (
                                <span>Semua permohonan diproses</span>
                            )
                        }
                    />

                    <KpiCard
                        icon={Truck}
                        label="Total Penjemputan"
                        value={totals.total_pickups}
                        unit="Trip"
                        badge={totals.trash_bags && totals.trash_bags > 0 ? `${totals.trash_bags} Trashbag` : "Terverifikasi"}
                        color="teal"
                        subtext={
                            <div className="flex items-center gap-1.5">
                                <span>Rata-rata</span>
                                <span className="font-bold text-teal-700">{avgPerPickup} Kg / trip</span>
                            </div>
                        }
                    />
                </div>

                {/* 3. Waste Composition & Alur Sirkularitas */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                        <div>
                            <div className="flex items-center gap-2">
                                <Layers className="w-4 h-4 text-emerald-600" />
                                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                                    Komposisi & Sirkularitas Pemilahan Sampah
                                </h3>
                            </div>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">
                                Akumulasi penimbangan dari penjemputan armada CleanUP yang telah selesai
                            </p>
                        </div>
                        <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs font-bold text-slate-700 self-start sm:self-auto">
                            Total: <span className="text-emerald-700 font-extrabold">{totalWasteKg.toLocaleString('id-ID')} Kg</span>
                        </div>
                    </div>

                    {/* Segmented Progress Bar */}
                    <div className="space-y-2 mb-6">
                        <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
                            <div
                                style={{ width: `${Math.max(Number(organicPct), totalOrganic > 0 ? 3 : 0)}%` }}
                                className="bg-emerald-500 transition-all duration-700"
                                title={`Organik: ${totalOrganic} Kg (${organicPct}%)`}
                            />
                            <div
                                style={{ width: `${Math.max(Number(anorganicPct), totalAnorganic > 0 ? 3 : 0)}%` }}
                                className="bg-teal-500 transition-all duration-700"
                                title={`Anorganik: ${totalAnorganic} Kg (${anorganicPct}%)`}
                            />
                            <div
                                style={{ width: `${Math.max(Number(residuePct), totalResidue > 0 ? 3 : 0)}%` }}
                                className="bg-slate-400 transition-all duration-700"
                                title={`Residu: ${totalResidue} Kg (${residuePct}%)`}
                            />
                        </div>
                        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 font-medium pt-1">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                <span>Organik ({organicPct}%)</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                                <span>Anorganik ({anorganicPct}%)</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                                <span>Residu ({residuePct}%)</span>
                            </div>
                        </div>
                    </div>

                    {/* 3 Waste Stream Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <WasteCard
                            icon={Sprout}
                            title="Sampah Organik"
                            weight={totalOrganic}
                            pct={organicPct}
                            desc="Dikompos & dibiokonversi larva Maggot BSF untuk pakan ternak tinggi protein."
                            bg="bg-emerald-50/50"
                            border="border-emerald-100"
                            iconBg="bg-emerald-600"
                            textColor="text-emerald-950"
                        />

                        <WasteCard
                            icon={Recycle}
                            title="Sampah Anorganik"
                            weight={totalAnorganic}
                            pct={anorganicPct}
                            desc="Pilah bernilai ekonomis (plastik PET/HDPE, kardus, kaleng) untuk rantai pasok daur ulang."
                            bg="bg-teal-50/50"
                            border="border-teal-100"
                            iconBg="bg-teal-600"
                            textColor="text-teal-950"
                        />

                        <WasteCard
                            icon={Trash2}
                            title="Limbah Residu"
                            weight={totalResidue}
                            pct={residuePct}
                            desc="Material sisa non-daur ulang diangkut secara terkontrol menuju TPA Pakusari."
                            bg="bg-slate-50"
                            border="border-slate-200/80"
                            iconBg="bg-slate-700"
                            textColor="text-slate-800"
                        />
                    </div>
                </motion.div>

                {/* 4. Per-Company Trash Ledger Table with Live Filters */}
                <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden"
                >
                    <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-emerald-600" />
                                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                                    Buku Besar Timbulan Sampah Mitra
                                </h3>
                            </div>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">
                                Catatan volume pemilahan per perusahaan mitra dari penjemputan selesai
                            </p>
                        </div>

                        {/* Search, Filter, and Sort Controls */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            {/* Search Input */}
                            <div className="relative min-w-[200px] sm:min-w-[240px]">
                                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari nama mitra / paket..."
                                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50/50"
                                />
                            </div>

                            {/* Status Filters */}
                            <div className="inline-flex p-0.5 rounded-xl bg-slate-100 border border-slate-200/70 text-xs font-semibold">
                                <button
                                    onClick={() => setStatusFilter('all')}
                                    className={`px-2.5 py-1 rounded-lg transition-all ${
                                        statusFilter === 'all'
                                            ? 'bg-white text-slate-900 shadow-2xs font-bold'
                                            : 'text-slate-500 hover:text-slate-900'
                                    }`}
                                >
                                    Semua
                                </button>
                                <button
                                    onClick={() => setStatusFilter('active')}
                                    className={`px-2.5 py-1 rounded-lg transition-all ${
                                        statusFilter === 'active'
                                            ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                                            : 'text-slate-500 hover:text-slate-900'
                                    }`}
                                >
                                    Aktif
                                </button>
                                <button
                                    onClick={() => setStatusFilter('pending')}
                                    className={`px-2.5 py-1 rounded-lg transition-all ${
                                        statusFilter === 'pending'
                                            ? 'bg-white text-amber-700 shadow-2xs font-bold'
                                            : 'text-slate-500 hover:text-slate-900'
                                    }`}
                                >
                                    Menunggu
                                </button>
                            </div>

                            {/* Sort Selector */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50/50 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                            >
                                <option value="total">Urutkan: Volume Terbanyak</option>
                                <option value="organic">Urutkan: Organik Terbanyak</option>
                                <option value="anorganic">Urutkan: Anorganik Terbanyak</option>
                                <option value="pickups">Urutkan: Pickup Terbanyak</option>
                                <option value="name">Urutkan: Nama A - Z</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead>
                                <tr className="bg-slate-50/70">
                                    <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Perusahaan</th>
                                    <th className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden sm:table-cell">Layanan</th>
                                    <th className="px-5 py-3 text-right text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Organik</th>
                                    <th className="px-5 py-3 text-right text-[11px] font-bold text-teal-700 uppercase tracking-wider">Anorganik</th>
                                    <th className="px-5 py-3 text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Residu</th>
                                    <th className="px-5 py-3 text-right text-[11px] font-bold text-slate-900 uppercase tracking-wider">Total Sampah</th>
                                    <th className="px-5 py-3 text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pickup</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredStats.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                                            <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                            <p className="text-xs font-semibold text-slate-600">Tidak ada mitra yang cocok dengan filter</p>
                                            <p className="text-[11px] text-slate-400 mt-0.5">Coba sesuaikan kata kunci pencarian atau status mitra</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStats.map((stat, i) => {
                                        const companyTotal = stat.organic + stat.anorganic + stat.residue;
                                        return (
                                            <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-emerald-100/70 text-emerald-800 font-extrabold text-xs flex items-center justify-center shrink-0">
                                                            {stat.company_name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                                                                {stat.company_name}
                                                            </div>
                                                            <div className="sm:hidden mt-0.5">{getStatusBadge(stat.subscription_status)}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5 hidden sm:table-cell">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-medium text-slate-600">{stat.subscription_plan}</span>
                                                        {getStatusBadge(stat.subscription_status)}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5 text-right font-extrabold text-emerald-700 text-xs">
                                                    {stat.organic.toLocaleString('id-ID')} <span className="text-[10px] text-slate-400 font-normal">Kg</span>
                                                </td>
                                                <td className="px-5 py-3.5 text-right font-extrabold text-teal-700 text-xs">
                                                    {stat.anorganic.toLocaleString('id-ID')} <span className="text-[10px] text-slate-400 font-normal">Kg</span>
                                                </td>
                                                <td className="px-5 py-3.5 text-right font-medium text-slate-500 text-xs hidden md:table-cell">
                                                    {stat.residue.toLocaleString('id-ID')} <span className="text-[10px] text-slate-400">Kg</span>
                                                </td>
                                                <td className="px-5 py-3.5 text-right">
                                                    <div className="flex flex-col items-end gap-0.5">
                                                        <span className="font-black text-slate-900 text-xs bg-slate-100 px-2 py-0.5 rounded-md">
                                                            {companyTotal.toLocaleString('id-ID')} Kg
                                                        </span>
                                                        {stat.trash_bags && stat.trash_bags > 0 ? (
                                                            <span className="text-[10px] text-blue-700 font-bold">
                                                                {stat.trash_bags} Trashbag
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5 text-center">
                                                    <span className="text-xs font-bold text-slate-600">
                                                        {stat.total_pickups}x
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* 5. Operational Quick Action Hub */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        {
                            label: 'Persetujuan Mitra',
                            sub: `${totals.pending_companies} permohonan baru`,
                            icon: Clock,
                            color: 'text-amber-700',
                            bg: 'bg-amber-50',
                            border: 'border-amber-200/80',
                            href: '/admin/companies/pending',
                        },
                        {
                            label: 'Permintaan Batal',
                            sub: 'Tinjau permohonan berhenti',
                            icon: Ban,
                            color: 'text-rose-700',
                            bg: 'bg-rose-50',
                            border: 'border-rose-200/80',
                            href: '/admin/companies/cancellations/requests',
                        },
                        {
                            label: 'Monitor Armada',
                            sub: 'Status CleanUP & rute',
                            icon: Truck,
                            color: 'text-teal-700',
                            bg: 'bg-teal-50',
                            border: 'border-teal-200/80',
                            href: '/admin/cleanups',
                        },
                        {
                            label: 'Invoice Mitra',
                            sub: 'Rekapitulasi tagihan bulanan',
                            icon: Receipt,
                            color: 'text-emerald-700',
                            bg: 'bg-emerald-50',
                            border: 'border-emerald-200/80',
                            href: '/admin/invoices',
                        },
                    ].map((action, i) => {
                        const ActionIcon = action.icon;
                        return (
                            <Link
                                key={i}
                                href={action.href}
                                className={`group bg-white rounded-2xl p-4 border ${action.border} hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-3.5`}
                            >
                                <div className={`w-11 h-11 ${action.bg} ${action.color} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                                    <ActionIcon className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <div className="font-extrabold text-xs text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                                        {action.label}
                                    </div>
                                    <div className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                                        {action.sub}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </motion.div>
        </AdminLayout>
    );
}
