import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import CompanyLayout from '@/Layouts/CompanyLayout';
import {
    Calendar,
    CheckCircle2,
    XCircle,
    Clock,
    FileText,
    Camera,
    X,
    Truck,
    Scale,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

interface Pickup {
    id: number;
    status: 'scheduled' | 'on_the_way' | 'completed' | 'failed';
    organic_weight: number | null;
    anorganic_weight: number | null;
    residue_weight: number | null;
    evidence_pickup_path: string | null;
    cancellation_reason: string | null;
    pickup_date: string;
    cleanup: {
        id: number;
        name: string;
    } | null;
}

interface Props {
    company: {
        id: number;
        company_name: string;
        subscription_plan: string;
    };
    auth: {
        user: { name: string; email: string };
    };
    pickups: {
        data: Pickup[];
        current_page: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
        total: number;
    };
}

export default function History({ auth, company, pickups }: Props) {
    const [selectedProof, setSelectedProof] = useState<Pickup | null>(null);

    const completedPickups = pickups.data.filter((p) => p.status === 'completed');
    const pageTotalWeight = completedPickups.reduce(
        (sum, p) =>
            sum +
            Number(p.organic_weight || 0) +
            Number(p.anorganic_weight || 0) +
            Number(p.residue_weight || 0),
        0
    );

    const formatDateIndo = (dateStr: string) => {
        try {
            return new Intl.DateTimeFormat('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }).format(new Date(dateStr));
        } catch (e) {
            return dateStr;
        }
    };

    return (
        <CompanyLayout
            activeTab="history"
            title="Riwayat Pengambilan Sampah"
            subtitle="Daftar historis penjemputan berkala oleh armada CleanUP dan arsip timbangan harian."
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
                    <span>Unduh Rekap PDF</span>
                </a>
            }
        >
            {/* TOP METRICS SUMMARY */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-500">Total Riwayat Ritase</span>
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <Truck className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            {pickups.total}
                        </span>
                        <span className="text-xs font-bold text-slate-400">Jadwal</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2">Seluruh catatan historis operasional</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-500">Total Sampah Terdata</span>
                        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                            <Scale className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            {pageTotalWeight.toLocaleString('id-ID')}
                        </span>
                        <span className="text-xs font-bold text-amber-600 uppercase">Kg (Halaman Ini)</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2">Akumulasi timbangan terverifikasi</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-500">Tingkat Ritase Selesai</span>
                        <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            {pickups.data.length > 0
                                ? Math.round((completedPickups.length / pickups.data.length) * 100)
                                : 100}
                            %
                        </span>
                        <span className="text-xs font-bold text-teal-600">Terpenuhi</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2">Persentase keberhasilan armada</p>
                </div>
            </div>

            {/* TABLE / CARDS OF PICKUPS */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden mt-6">
                <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                            Daftar Riwayat Penjemputan
                        </h3>
                        <p className="text-xs text-slate-400">
                            Menampilkan data historis penjemputan berkala beserta bukti dokumentasi
                        </p>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg self-start sm:self-auto">
                        Total {pickups.total} Catatan
                    </span>
                </div>

                {pickups.data.length === 0 ? (
                    <div className="py-16 text-center">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                            <Clock className="w-6 h-6" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-700">Belum Ada Riwayat Penjemputan</h4>
                        <p className="text-xs text-slate-400 mt-1">Data penjemputan yang telah selesai akan muncul di sini.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {pickups.data.map((pickup) => {
                            const isCompleted = pickup.status === 'completed';
                            const isFailed = pickup.status === 'failed';
                            const totalWeight =
                                Number(pickup.organic_weight || 0) +
                                Number(pickup.anorganic_weight || 0) +
                                Number(pickup.residue_weight || 0);

                            return (
                                <div
                                    key={pickup.id}
                                    className="p-5 sm:p-6 hover:bg-slate-50/60 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                                >
                                    <div className="flex items-start gap-3.5">
                                        <div
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                                isCompleted
                                                    ? 'bg-emerald-50 text-emerald-600'
                                                    : isFailed
                                                    ? 'bg-rose-50 text-rose-600'
                                                    : 'bg-amber-50 text-amber-600'
                                            }`}
                                        >
                                            <Calendar className="w-5 h-5" />
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h4 className="text-sm font-extrabold text-slate-900">
                                                    {formatDateIndo(pickup.pickup_date)}
                                                </h4>
                                                {isCompleted ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                                        Selesai Terangkut
                                                    </span>
                                                ) : isFailed ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                                        <XCircle className="w-3 h-3 text-rose-600" />
                                                        Batal / Gagal
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                                        <Clock className="w-3 h-3 text-amber-600" />
                                                        Dalam Proses
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                                <span className="flex items-center gap-1">
                                                    <Truck className="w-3.5 h-3.5 text-slate-400" />
                                                    Armada: <strong className="text-slate-700">{pickup.cleanup?.name || 'Tim CleanUP'}</strong>
                                                </span>
                                                {isCompleted && (
                                                    <span className="font-semibold text-emerald-700">
                                                        Total Muatan: {totalWeight.toLocaleString('id-ID')} Kg
                                                    </span>
                                                )}
                                            </div>

                                            {isFailed && pickup.cancellation_reason && (
                                                <div className="flex items-center gap-1.5 text-xs text-rose-700 bg-rose-50 px-3 py-1 rounded-lg border border-rose-100 mt-2">
                                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                                    <span>Alasan: {pickup.cancellation_reason}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {isCompleted && (
                                        <div className="flex flex-wrap items-center gap-3">
                                            <div className="flex items-center gap-2">
                                                <div className="px-3 py-1.5 rounded-xl bg-amber-50/80 border border-amber-100 text-center">
                                                    <span className="text-[10px] uppercase font-bold text-amber-700 block">Organik</span>
                                                    <span className="text-xs font-black text-amber-900">{pickup.organic_weight || 0} kg</span>
                                                </div>
                                                <div className="px-3 py-1.5 rounded-xl bg-teal-50/80 border border-teal-100 text-center">
                                                    <span className="text-[10px] uppercase font-bold text-teal-700 block">Anorganik</span>
                                                    <span className="text-xs font-black text-teal-900">{pickup.anorganic_weight || 0} kg</span>
                                                </div>
                                                <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                                                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Residu</span>
                                                    <span className="text-xs font-black text-slate-800">{pickup.residue_weight || 0} kg</span>
                                                </div>
                                            </div>

                                            {pickup.evidence_pickup_path && (
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedProof(pickup)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200/80 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                                                >
                                                    <Camera className="w-3.5 h-3.5" />
                                                    <span>Bukti Foto</span>
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* PAGINATION */}
            {pickups.last_page > 1 && (
                <div className="flex items-center justify-between mt-6 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                    <span className="text-xs text-slate-500 font-medium">
                        Halaman <strong>{pickups.current_page}</strong> dari <strong>{pickups.last_page}</strong>
                    </span>
                    <div className="flex items-center gap-1.5">
                        {pickups.links.map((link, i) => {
                            const isPrev = link.label.includes('Previous') || link.label.includes('&laquo;');
                            const isNext = link.label.includes('Next') || link.label.includes('&raquo;');
                            const content = isPrev ? <ChevronLeft className="w-4 h-4" /> : isNext ? <ChevronRight className="w-4 h-4" /> : link.label;

                            if (!link.url) {
                                return (
                                    <span
                                        key={i}
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold text-slate-300 cursor-not-allowed"
                                    >
                                        {content}
                                    </span>
                                );
                            }

                            return (
                                <Link
                                    key={i}
                                    href={link.url}
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                                        link.active
                                            ? 'bg-emerald-600 text-white shadow-xs'
                                            : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                                >
                                    {content}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* LIGHTBOX MODAL FOR EVIDENCE PHOTO */}
            {selectedProof && (
                <div
                    className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setSelectedProof(null)}
                >
                    <div
                        className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h4 className="text-xs font-bold text-slate-900">
                                    Dokumentasi Timbangan Armada
                                </h4>
                                <p className="text-[10px] text-slate-400">
                                    {formatDateIndo(selectedProof.pickup_date)} &bull; {selectedProof.cleanup?.name || 'CleanUP'}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedProof(null)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4 bg-slate-50 flex items-center justify-center">
                            <img
                                src={`/storage/${selectedProof.evidence_pickup_path}`}
                                alt="Bukti Penjemputan"
                                className="max-h-96 w-auto object-contain rounded-xl shadow-xs"
                            />
                        </div>
                        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="text-slate-500 font-medium">Status: Terverifikasi Sistem</span>
                            <a
                                href={`/storage/${selectedProof.evidence_pickup_path}`}
                                target="_blank"
                                rel="noreferrer"
                                className="font-bold text-emerald-700 hover:underline"
                            >
                                Buka Ukuran Penuh
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </CompanyLayout>
    );
}

