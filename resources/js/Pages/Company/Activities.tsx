import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import CompanyLayout from '@/Layouts/CompanyLayout';
import {
    Camera,
    Video,
    Calendar,
    FileText,
    Sparkles,
    CheckCircle2,
    X,
    ChevronLeft,
    ChevronRight,
    Leaf,
    Recycle,
    Sprout,
} from 'lucide-react';

interface Activity {
    id: number;
    activity_date: string;
    note: string | null;
    media_path: string | null;
    media_type: 'image' | 'video' | null;
}

interface Props {
    company: any;
    activities: {
        data: Activity[];
        current_page: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
        total: number;
    };
    plan: string;
    auth: {
        user: { name: string };
    };
}

export default function Activities({ auth, company, activities, plan }: Props) {
    const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

    const formatDateIndo = (dateStr: string) => {
        try {
            return new Intl.DateTimeFormat('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }).format(new Date(dateStr));
        } catch {
            return dateStr;
        }
    };

    return (
        <CompanyLayout
            activeTab="kegiatan"
            title="Kegiatan & Dokumentasi Pemanfaatan"
            subtitle="Arsip visual proses biokonversi maggot BSF dan pemilahan sirkuler di fasilitas WellTrash Farm."
            company={company}
            userName={auth.user?.name}
        >
            {/* 1. FACILITY & CIRCULAR DOWNSTREAM INFOGRAPHIC */}
            <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-950 text-white rounded-2xl p-6 sm:p-7 border border-emerald-950 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-5 border-b border-white/10">
                        <div>
                            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2">
                                <Sparkles className="w-3 h-3 text-emerald-400" />
                                <span>WellTrash Farm Hub &bull; Jember MRF</span>
                            </div>
                            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
                                Alur Hilir Pemanfaatan Sampah Mitra
                            </h2>
                            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                                Setiap kilogram material yang dijemput dari bisnis Anda diproses transparan melalui 3 siklus ekonomi sirkuler.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
                                {activities.total} Dokumentasi Tersimpan
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3.5 border border-white/10">
                            <div className="flex items-center gap-2 mb-1.5 text-amber-300 font-bold">
                                <Leaf className="w-4 h-4" />
                                <span>1. Biokonversi Maggot BSF</span>
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed">
                                Sampah organik dicacah higienis sebagai pakan larva Black Soldier Fly penghasil protein tinggi.
                            </p>
                        </div>

                        <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3.5 border border-white/10">
                            <div className="flex items-center gap-2 mb-1.5 text-teal-300 font-bold">
                                <Recycle className="w-4 h-4" />
                                <span>2. Pemilahan Sirkuler</span>
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed">
                                Anorganik bernilai (kardus, plastik, logam) disortir per kategori dan disalurkan ke industri daur ulang.
                            </p>
                        </div>

                        <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3.5 border border-white/10">
                            <div className="flex items-center gap-2 mb-1.5 text-emerald-300 font-bold">
                                <Sprout className="w-4 h-4" />
                                <span>3. Pupuk Kasgot Alami</span>
                            </div>
                            <p className="text-[11px] text-slate-300 leading-relaxed">
                                Residu feses maggot (kasgot) diolah menjadi pupuk hayati kaya nutrisi bagi pertanian regeneratif.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. ACTIVITY LOG FEED */}
            <div className="space-y-4 mt-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                        Log Dokumentasi Kegiatan
                    </h3>
                    <span className="text-xs text-slate-400">
                        Foto & Video Verifikasi Lapangan
                    </span>
                </div>

                {activities.data.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-2xs">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                            <Camera className="w-6 h-6" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-700">Belum Ada Dokumentasi Kegiatan</h4>
                        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                            Dokumentasi pemilahan dan biokonversi dari batch sampah perusahaan Anda akan diunggah berkala oleh tim operasional.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activities.data.map((act) => {
                            const isVideo = act.media_type === 'video';

                            return (
                                <div
                                    key={act.id}
                                    className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col justify-between hover:shadow-xs transition-shadow"
                                >
                                    <div>
                                        {act.media_path ? (
                                            <div className="relative aspect-video bg-slate-900 flex items-center justify-center overflow-hidden group">
                                                {isVideo ? (
                                                    <video
                                                        src={`/storage/${act.media_path}`}
                                                        controls
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <>
                                                        <img
                                                            src={`/storage/${act.media_path}`}
                                                            alt="Dokumentasi"
                                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setSelectedMedia(`/storage/${act.media_path}`)}
                                                            className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                                                        >
                                                            <span className="px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-xs text-white text-xs font-bold flex items-center gap-1.5 shadow-sm">
                                                                <Camera className="w-3.5 h-3.5" />
                                                                Perbesar
                                                            </span>
                                                        </button>
                                                    </>
                                                )}
                                                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs flex items-center gap-1">
                                                    {isVideo ? <Video className="w-3 h-3 text-emerald-400" /> : <Camera className="w-3 h-3 text-emerald-400" />}
                                                    <span>{isVideo ? 'Video' : 'Foto'}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="aspect-video bg-slate-50 flex flex-col items-center justify-center text-slate-400 border-b border-slate-100">
                                                <Camera className="w-8 h-8 stroke-1 mb-1" />
                                                <span className="text-[11px]">Tanpa lampiran media</span>
                                            </div>
                                        )}

                                        <div className="p-4 sm:p-5">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-2">
                                                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                                                <span>{formatDateIndo(act.activity_date)}</span>
                                            </div>

                                            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap line-clamp-3">
                                                {act.note || 'Tidak ada catatan tertulis untuk kegiatan ini.'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="px-4 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                                        <span>Status: Terverifikasi Batch</span>
                                        <span className="font-semibold text-emerald-700">WellTrash Jember</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 3. PAGINATION */}
            {activities.last_page > 1 && (
                <div className="flex items-center justify-between mt-6 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                    <span className="text-xs text-slate-500 font-medium">
                        Halaman <strong>{activities.current_page}</strong> dari <strong>{activities.last_page}</strong>
                    </span>
                    <div className="flex items-center gap-1.5">
                        {activities.links.map((link, i) => {
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

            {/* LIGHTBOX MODAL */}
            {selectedMedia && (
                <div
                    className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setSelectedMedia(null)}
                >
                    <div
                        className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-900">
                                Foto Dokumentasi Pemanfaatan Sampah
                            </h4>
                            <button
                                onClick={() => setSelectedMedia(null)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4 bg-slate-950 flex items-center justify-center max-h-[70vh]">
                            <img
                                src={selectedMedia}
                                alt="Dokumentasi Full"
                                className="max-h-full max-w-full object-contain rounded-lg"
                            />
                        </div>
                        <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="text-slate-500 font-medium">Fasilitas WellTrash Farm Jember</span>
                            <a
                                href={selectedMedia}
                                target="_blank"
                                rel="noreferrer"
                                className="font-bold text-emerald-700 hover:underline"
                            >
                                Buka Tab Baru
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </CompanyLayout>
    );
}

