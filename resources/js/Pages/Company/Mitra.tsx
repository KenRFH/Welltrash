import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import CompanyLayout from '@/Layouts/CompanyLayout';
import {
    Building2,
    User,
    Phone,
    MapPin,
    ShieldCheck,
    Sparkles,
    CheckCircle2,
    ArrowUpRight,
    Zap,
    AlertTriangle,
    Clock,
    FileCheck2,
    Truck,
} from 'lucide-react';

interface Props {
    company: {
        id: number;
        company_name: string;
        pic_name: string;
        business_category: string;
        subscription_plan: string;
        subscription_status: string;
        subscription_end_date: string | null;
        address: string;
        phone: string;
    };
    auth: {
        user: { name: string };
    };
}

const PLANS = [
    {
        name: 'Rumah Tangga (> 10km)',
        tagline: 'Residensial & Komunitas',
        days: 'Hingga 5 Hari/Minggu',
        features: ['Ritase berkala CleanUP', 'Laporan rekap bulanan', 'Pakan larva BSF'],
    },
    {
        name: 'Reguler',
        tagline: 'Usaha Kecil & Kafe',
        days: 'Hingga 5 Hari/Minggu',
        features: ['Ritase rutin terjadwal', 'Dashboard & analitik fraksi', 'Unduh laporan PDF'],
    },
    {
        name: 'Prime',
        tagline: 'Restoran & Swalayan',
        days: 'Hingga 7 Hari/Minggu',
        features: ['Prioritas armada setiap hari', 'Log kegiatan & foto verifikasi', 'Sertifikat sirkuler ESG'],
    },
    {
        name: 'Premium+',
        tagline: 'Hotel, Mall & Industri',
        days: 'Setiap Hari (Fleksibel)',
        features: ['Armada dedicated harian', 'Konsultasi zero-waste', 'Laporan ESG audit-ready'],
    },
];

export default function Mitra({ auth, company }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        subscription_plan: company.subscription_plan,
    });

    const { post: postUnsub, processing: unsubProcessing } = useForm({});

    const handleUpgrade = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('company.mitra.upgrade'), {
            preserveScroll: true,
            onSuccess: () => alert('Permintaan upgrade layanan berhasil diajukan ke sistem WellTrash.'),
        });
    };

    const handleUnsubscribe = () => {
        if (
            confirm(
                'Apakah Anda yakin ingin membatalkan berlangganan? Akun Anda akan dinonaktifkan dan kehilangan akses dashboard.'
            )
        ) {
            postUnsub(route('company.unsubscribe'));
        }
    };

    return (
        <CompanyLayout
            activeTab="mitra"
            title="Profil & Kemitraan Bisnis"
            subtitle="Detail entitas terdaftar, tingkat paket layanan kemitraan, dan konfigurasi profil."
            company={company}
            userName={auth.user?.name}
        >
            {/* 1. COMPANY PROFILE OVERVIEW CARD */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-xl flex items-center justify-center shadow-xs shrink-0">
                            {company.company_name
                                ? company.company_name
                                      .split(' ')
                                      .map((w) => w[0])
                                      .filter(Boolean)
                                      .slice(0, 2)
                                      .join('')
                                      .toUpperCase()
                                : 'WT'}
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                                    {company.company_name}
                                </h2>
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    Mitra Terverifikasi
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5 font-medium">
                                {company.business_category || 'Kategori Bisnis Belum Ditentukan'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 self-start md:self-auto bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Paket Saat Ini</span>
                            <span className="text-xs font-black text-slate-900">{company.subscription_plan}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
                        <User className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                        <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Penanggung Jawab (PIC)</span>
                            <span className="text-xs font-bold text-slate-800">{company.pic_name || '-'}</span>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
                        <Phone className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                        <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Kontak / Telepon</span>
                            <span className="text-xs font-bold text-slate-800">{company.phone || '-'}</span>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
                        <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                        <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Alamat Titik Penjemputan</span>
                            <span className="text-xs font-bold text-slate-800 line-clamp-2">{company.address || '-'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. PLAN TIERS COMPARISON & UPGRADE MATRIX */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs mt-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                    <div>
                        <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-emerald-600" />
                            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                                Pilihan Paket Layanan Kemitraan
                            </h3>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Pilih tingkatan layanan yang sesuai dengan skala timbulan sampah dan frekuensi operasional bisnis Anda.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                    {PLANS.map((plan) => {
                        const isCurrent = plan.name === company.subscription_plan;
                        const isSelected = plan.name === data.subscription_plan;

                        return (
                            <div
                                key={plan.name}
                                onClick={() => setData('subscription_plan', plan.name)}
                                className={`rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                                    isCurrent
                                        ? 'bg-emerald-50/50 border-emerald-500 shadow-2xs ring-2 ring-emerald-500/20'
                                        : isSelected
                                        ? 'bg-slate-50 border-emerald-400 ring-2 ring-emerald-400/20 shadow-2xs'
                                        : 'bg-white border-slate-200 hover:border-slate-300'
                                }`}
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-black text-slate-900 tracking-tight">{plan.name}</span>
                                        {isCurrent && (
                                            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                                Aktif
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-slate-400 font-medium mb-3">{plan.tagline}</p>
                                    <div className="text-xs font-bold text-emerald-700 bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-100 mb-4 inline-block">
                                        {plan.days}
                                    </div>

                                    <ul className="space-y-2 text-[11px] text-slate-600 mb-4">
                                        {plan.features.map((feat, i) => (
                                            <li key={i} className="flex items-start gap-1.5">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                                <span>{feat}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setData('subscription_plan', plan.name)}
                                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all text-center ${
                                        isCurrent
                                            ? 'bg-emerald-600 text-white cursor-default'
                                            : isSelected
                                            ? 'bg-emerald-600 text-white shadow-2xs'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    {isCurrent ? 'Paket Aktif' : isSelected ? 'Dipilih' : 'Pilih Paket'}
                                </button>
                            </div>
                        );
                    })}
                </div>

                <form onSubmit={handleUpgrade} className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <p className="text-xs text-slate-600 font-semibold">
                            Paket yang diajukan: <strong className="text-emerald-700 font-bold">{data.subscription_plan}</strong>
                        </p>
                        <p className="text-[11px] text-slate-400">
                            Setelah pengajuan upgrade, tagihan periode berikutnya akan disesuaikan otomatis oleh sistem.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={processing || data.subscription_plan === company.subscription_plan}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{processing ? 'Memproses...' : 'Kirim Pengajuan Upgrade'}</span>
                    </button>
                </form>
            </div>

            {/* 3. PARTNERSHIP SLA & COMMITMENTS INFOGRAPHIC */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-2xs flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <FileCheck2 className="w-4 h-4" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-slate-900">Komitmen Zero-Waste to Landfill</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                            Menjamin sampah organik terolah penuh menjadi protein hewani dan pakan maggot BSF di Jember.
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-2xs flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                        <Truck className="w-4 h-4" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-slate-900">Armada CleanUP Terstandar</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                            Pengemudi dan kru dilengkapi SOP sanitasi wadah, timbangan digital, dan foto bukti pengambilan.
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-2xs flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-slate-900">Laporan ESG & Jejak Karbon</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                            Unduh rekapitulasi tonase berkala untuk keperluan audit keberlanjutan dan CSR perusahaan.
                        </p>
                    </div>
                </div>
            </div>

            {/* 4. DANGER ZONE: UNSUBSCRIBE */}
            <div className="bg-white rounded-2xl p-6 border border-rose-200 shadow-2xs mt-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-rose-600">
                            <AlertTriangle className="w-4 h-4" />
                            <h4 className="text-xs font-extrabold uppercase tracking-wider">Batalkan Langganan Kemitraan</h4>
                        </div>
                        <p className="text-xs text-slate-500 max-w-xl">
                            Jika Anda membatalkan kemitraan, penjemputan berkala akan dihentikan dan akun Anda akan dinonaktifkan.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleUnsubscribe}
                        disabled={unsubProcessing}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors disabled:opacity-50 cursor-pointer self-start sm:self-auto"
                    >
                        {unsubProcessing ? 'Memproses...' : 'Berhenti Berlangganan'}
                    </button>
                </div>
            </div>
        </CompanyLayout>
    );
}

