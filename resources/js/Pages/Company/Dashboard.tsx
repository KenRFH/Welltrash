import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import CompanyLayout from '@/Layouts/CompanyLayout';
import {
    Leaf,
    Recycle,
    Trash2,
    TrendingUp,
    FileText,
    Calendar,
    ArrowUpRight,
    Sparkles,
    ShieldCheck,
    CheckCircle2,
    Activity,
    Building2,
} from 'lucide-react';

interface Props {
    company: {
        id: number;
        company_name: string;
        subscription_plan: string;
        subscription_status: string;
    };
    auth: {
        user: {
            name: string;
        };
    };
    statistics: {
        total_organic: number;
        total_anorganic: number;
        total_residue: number;
    };
    weekly_statistics: Array<{
        week: string;
        organic: number;
        anorganic: number;
    }>;
}

export default function Dashboard({ auth, company, statistics, weekly_statistics }: Props) {
    const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);

    const totalOrganic = Number(statistics.total_organic || 0);
    const totalAnorganic = Number(statistics.total_anorganic || 0);
    const totalResidue = Number(statistics.total_residue || 0);
    const grandTotal = totalOrganic + totalAnorganic + totalResidue;

    // Percentages
    const organicPercent = grandTotal > 0 ? (totalOrganic / grandTotal) * 100 : 0;
    const anorganicPercent = grandTotal > 0 ? (totalAnorganic / grandTotal) * 100 : 0;
    const residuePercent = grandTotal > 0 ? (totalResidue / grandTotal) * 100 : 0;
    const diversionRate = grandTotal > 0 ? ((totalOrganic + totalAnorganic) / grandTotal) * 100 : 0;

    // Sustainability metrics estimates
    const co2Reduction = (totalOrganic * 0.85 + totalAnorganic * 1.4).toFixed(1);
    const maggotFeedEstimated = (totalOrganic * 0.22).toFixed(1);

    // Calculate max weekly value for SVG Bar Chart scaling
    const maxWeeklyVal = Math.max(
        ...weekly_statistics.flatMap((w) => [Number(w.organic || 0), Number(w.anorganic || 0)]),
        10
    );

    // Donut chart math (circumference = 2 * PI * r; with r = 70 => 439.82)
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const organicStroke = (organicPercent / 100) * circumference;
    const anorganicStroke = (anorganicPercent / 100) * circumference;
    const residueStroke = (residuePercent / 100) * circumference;

    const organicOffset = 0;
    const anorganicOffset = -organicStroke;
    const residueOffset = -(organicStroke + anorganicStroke);

    return (
        <CompanyLayout
            activeTab="dashboard"
            title="Dasbor & Analitik Sampah"
            subtitle="Ringkasan pemilahan, metrik sirkularitas, dan kontribusi keberlanjutan perusahaan Anda."
            company={company}
            userName={auth.user.name}
            headerAction={
                <a
                    href={route('company.laporan.pdf')}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all hover:shadow-sm"
                >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Unduh PDF</span>
                </a>
            }
        >
            {/* 1. HERO GREETING & PARTNER HIGHLIGHT */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white p-6 sm:p-8 shadow-sm border border-emerald-500/30">
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/15 text-white border border-white/20">
                            <Building2 className="w-3.5 h-3.5 text-emerald-200" />
                            <span>PORTAL MITRA BISNIS &bull; Paket {company.subscription_plan}</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                            Selamat Datang, {company.company_name}
                        </h2>
                        <p className="text-xs sm:text-sm text-emerald-50/90 max-w-2xl leading-relaxed">
                            Dasbor pemantauan sirkularitas sampah bisnis Anda. Sampah organik diproses menjadi pakan maggot BSF di WellTrash Farm dan residu dialihkan secara bertanggung jawab.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                        <Link
                            href={route('company.schedule')}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-900 text-xs font-bold hover:bg-slate-100 transition-all shadow-xs"
                        >
                            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Atur Jadwal</span>
                        </Link>
                        <Link
                            href={route('company.history')}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/15 transition-all"
                        >
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Lihat Riwayat</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* 2. STATISTIC KPI CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                {/* Grand Total */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-slate-500">Total Sampah Terkelola</span>
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <Activity className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            {grandTotal.toLocaleString('id-ID')}
                        </span>
                        <span className="text-xs font-bold text-slate-400 uppercase">Kg</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-medium">Diversi TPA</span>
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                            {diversionRate.toFixed(1)}% Sirkuler
                        </span>
                    </div>
                </div>

                {/* Organik */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-slate-500">Sampah Organik</span>
                        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                            <Leaf className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            {totalOrganic.toLocaleString('id-ID')}
                        </span>
                        <span className="text-xs font-bold text-amber-600 uppercase">Kg</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-medium">Porsi: {organicPercent.toFixed(1)}%</span>
                        <span className="font-semibold text-amber-700">Maggot BSF 🐛</span>
                    </div>
                </div>

                {/* Anorganik */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-slate-500">Sampah Anorganik</span>
                        <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                            <Recycle className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            {totalAnorganic.toLocaleString('id-ID')}
                        </span>
                        <span className="text-xs font-bold text-teal-600 uppercase">Kg</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-medium">Porsi: {anorganicPercent.toFixed(1)}%</span>
                        <span className="font-semibold text-teal-700">Daur Ulang ♻️</span>
                    </div>
                </div>

                {/* Residu */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-slate-500">Sampah Residu</span>
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                            <Trash2 className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            {totalResidue.toLocaleString('id-ID')}
                        </span>
                        <span className="text-xs font-bold text-slate-400 uppercase">Kg</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-medium">Porsi: {residuePercent.toFixed(1)}%</span>
                        <span className="font-semibold text-slate-600">TPA Terkontrol 🚛</span>
                    </div>
                </div>
            </div>

            {/* 3. SUSTAINABILITY IMPACT SCORECARD INFOGRAPHIC */}
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50/50 to-slate-50 rounded-2xl p-5 sm:p-6 border border-emerald-100/80 mt-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-700" />
                            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight uppercase">
                                Infografis Dampak Lingkungan & ESG
                            </h3>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Estimasi jejak positif pengelolaan sampah mitra terhadap reduksi gas rumah kaca & biokonversi.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-xs font-bold text-emerald-800 shadow-2xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Eco-Partner Certified
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-white/90 backdrop-blur-xs rounded-xl p-4 border border-emerald-100">
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Potensi Emisi Dicegah</p>
                        <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-2xl font-black text-emerald-900">{co2Reduction}</span>
                            <span className="text-xs font-bold text-emerald-700">kg CO₂e</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">Dari pencegahan pembusukan anaerobik terbuka</p>
                    </div>

                    <div className="bg-white/90 backdrop-blur-xs rounded-xl p-4 border border-emerald-100">
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Biomassa Pakan Maggot</p>
                        <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-2xl font-black text-amber-900">{maggotFeedEstimated}</span>
                            <span className="text-xs font-bold text-amber-700">kg Pakan</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">Dikonversi menjadi protein larva pakan unggas & ikan</p>
                    </div>

                    <div className="bg-white/90 backdrop-blur-xs rounded-xl p-4 border border-emerald-100">
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Laju Pengalihan TPA</p>
                        <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-2xl font-black text-teal-900">{diversionRate.toFixed(1)}%</span>
                            <span className="text-xs font-bold text-teal-700">Terselamatkan</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                            <div
                                className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(diversionRate, 100)}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. DUAL CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                    <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                            <div>
                                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                                    Statistik Ritase Pengumpulan Mingguan
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Volume penjemputan Organik vs Anorganik bulan berjalan
                                </p>
                            </div>
                            <div className="flex items-center gap-4 text-xs font-semibold">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                    <span className="text-slate-600">Organik</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                                    <span className="text-slate-600">Anorganik</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative h-64 w-full">
                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none border-b border-slate-200 pb-6">
                                {[1, 0.75, 0.5, 0.25, 0].map((step, idx) => (
                                    <div key={idx} className="flex items-center w-full">
                                        <span className="text-[10px] text-slate-400 w-8 text-right pr-2 font-mono">
                                            {Math.round(maxWeeklyVal * step)}
                                        </span>
                                        <div className="flex-1 border-t border-slate-100" />
                                    </div>
                                ))}
                            </div>

                            <div className="absolute inset-0 pl-8 pb-6 flex items-end justify-around">
                                {weekly_statistics.map((w, idx) => {
                                    const orgVal = Number(w.organic || 0);
                                    const anorgVal = Number(w.anorganic || 0);
                                    const orgH = orgVal > 0 ? Math.max((orgVal / maxWeeklyVal) * 100, 4) : 0;
                                    const anorgH = anorgVal > 0 ? Math.max((anorgVal / maxWeeklyVal) * 100, 4) : 0;
                                    const isHovered = hoveredWeek === idx;

                                    return (
                                        <div
                                            key={idx}
                                            className="group relative flex flex-col items-center h-full justify-end px-2 sm:px-4 cursor-pointer"
                                            onMouseEnter={() => setHoveredWeek(idx)}
                                            onMouseLeave={() => setHoveredWeek(null)}
                                        >
                                            {isHovered && (
                                                <div className="absolute -top-12 z-20 bg-slate-900 text-white text-[11px] rounded-lg px-2.5 py-1.5 shadow-lg whitespace-nowrap pointer-events-none">
                                                    <span className="font-bold text-emerald-400">{w.week}: </span>
                                                    <span>Org: {orgVal} kg</span> | <span>Anorg: {anorgVal} kg</span>
                                                </div>
                                            )}

                                            <div className="flex items-end gap-1.5 sm:gap-2.5 h-full">
                                                <div
                                                    className={`w-4 sm:w-6 bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-md transition-all duration-300 ${isHovered ? 'brightness-110 scale-y-105' : 'opacity-90'}`}
                                                    style={{ height: `${orgH}%` }}
                                                />
                                                <div
                                                    className={`w-4 sm:w-6 bg-gradient-to-t from-teal-600 to-teal-400 rounded-t-md transition-all duration-300 ${isHovered ? 'brightness-110 scale-y-105' : 'opacity-90'}`}
                                                    style={{ height: `${anorgH}%` }}
                                                />
                                            </div>
                                            <span className="text-[11px] font-bold text-slate-500 mt-2">{w.week}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                        <span>Unit: Kilogram (Kg)</span>
                        <Link href={route('company.history')} className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
                            Rincian Riwayat <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>

                {/* COMPOSITION DONUT CHART */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-extrabold text-slate-900 tracking-tight mb-1">
                            Komposisi Fraksi Sampah
                        </h3>
                        <p className="text-xs text-slate-400 mb-6">
                            Proporsi keseluruhan material yang telah terangkut
                        </p>

                        <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                                <circle
                                    cx="80"
                                    cy="80"
                                    r={radius}
                                    fill="none"
                                    stroke="#F1F5F9"
                                    strokeWidth="16"
                                />
                                {grandTotal > 0 && (
                                    <>
                                        <circle
                                            cx="80"
                                            cy="80"
                                            r={radius}
                                            fill="none"
                                            stroke="#F59E0B"
                                            strokeWidth="16"
                                            strokeDasharray={`${organicStroke} ${circumference}`}
                                            strokeDashoffset={organicOffset}
                                        />
                                        <circle
                                            cx="80"
                                            cy="80"
                                            r={radius}
                                            fill="none"
                                            stroke="#14B8A6"
                                            strokeWidth="16"
                                            strokeDasharray={`${anorganicStroke} ${circumference}`}
                                            strokeDashoffset={anorganicOffset}
                                        />
                                        <circle
                                            cx="80"
                                            cy="80"
                                            r={radius}
                                            fill="none"
                                            stroke="#94A3B8"
                                            strokeWidth="16"
                                            strokeDasharray={`${residueStroke} ${circumference}`}
                                            strokeDashoffset={residueOffset}
                                        />
                                    </>
                                )}
                            </svg>

                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-xl font-black text-slate-900 tracking-tight">
                                    {grandTotal.toLocaleString('id-ID')}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Kg Total
                                </span>
                            </div>
                        </div>



                        <div className="mt-6 space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                    <span className="font-semibold text-slate-700">Organik</span>
                                </div>
                                <span className="font-bold text-slate-900">
                                    {totalOrganic.toLocaleString('id-ID')} kg{' '}
                                    <span className="text-slate-400 font-normal">({organicPercent.toFixed(1)}%)</span>
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                                    <span className="font-semibold text-slate-700">Anorganik</span>
                                </div>
                                <span className="font-bold text-slate-900">
                                    {totalAnorganic.toLocaleString('id-ID')} kg{' '}
                                    <span className="text-slate-400 font-normal">({anorganicPercent.toFixed(1)}%)</span>
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                                    <span className="font-semibold text-slate-700">Residu</span>
                                </div>
                                <span className="font-bold text-slate-900">
                                    {totalResidue.toLocaleString('id-ID')} kg{' '}
                                    <span className="text-slate-400 font-normal">({residuePercent.toFixed(1)}%)</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                        <span className="text-[11px] font-medium text-emerald-700">
                            95%+ Material dialihkan dari penumpukan terbuka
                        </span>
                    </div>
                </div>
            </div>
        </CompanyLayout>
    );
}
