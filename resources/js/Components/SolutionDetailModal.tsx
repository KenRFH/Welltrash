import React, { useEffect } from "react";
import { X, CheckCircle2 } from "lucide-react";

export interface SolutionModalData {
    title: string;
    segment: string;
    tag: string;
    desc: string;
    icon: React.ComponentType<{ className?: string }>;
    image: string;
    imageAlt: string;
    accentColor: "green" | "orange";
}

interface Props {
    solution: SolutionModalData | null;
    onClose: () => void;
}

export default function SolutionDetailModal({ solution, onClose }: Props) {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    useEffect(() => {
        document.body.style.overflow = solution ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [solution]);

    if (!solution) return null;

    const Icon = solution.icon;
    const isOrange = solution.accentColor === "orange";
    const waText = encodeURIComponent(`Halo WellTrash, saya tertarik solusi ${solution.title} (${solution.segment}).`);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-zinc-950/70 backdrop-blur-xs" />
            <div className="relative bg-white dark:bg-zinc-900 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800 z-10 max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="relative aspect-[16/9] bg-zinc-100 dark:bg-zinc-800 shrink-0 overflow-hidden">
                    <img src={solution.image} alt={solution.imageAlt} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    <span className="absolute top-4 left-4 font-mono text-xs text-white/95 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                        {solution.segment}
                    </span>
                    <button type="button" onClick={onClose} aria-label="Tutup" className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer">
                        <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-lg backdrop-blur-md ${isOrange ? "bg-orange-500/90 text-white" : "bg-emerald-600/90 text-white"}`}>
                            {solution.tag}
                        </span>
                        <div className="w-9 h-9 rounded-lg bg-white/95 dark:bg-zinc-800/95 backdrop-blur-md text-zinc-900 dark:text-zinc-100 flex items-center justify-center shadow-xs">
                            <Icon className="w-4 h-4" />
                        </div>
                    </div>
                </div>
                <div className="p-6 sm:p-7 overflow-y-auto space-y-4">
                    <div>
                        <h3 className="text-2xl font-sans font-bold text-zinc-900 dark:text-white tracking-tight">{solution.title}</h3>
                        <p className="text-zinc-600 dark:text-zinc-300 font-sans text-sm leading-relaxed mt-2">{solution.desc}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold block mb-1">Keunggulan Layanan</span>
                        <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <span>Penjadwalan ritase armada khusus terdedikasi se-Kabupaten Jember.</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <span>Pencatatan timbangan akurat &amp; manifest digital resmi pemenuhan DLH.</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <span>Pemilahan hilir terpadu di fasilitas WellTrash Farm untuk target ESG.</span>
                        </div>
                    </div>
                </div>
                <div className="p-5 sm:px-7 bg-zinc-50/70 dark:bg-zinc-850/80 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-3 shrink-0">
                    <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer">
                        Tutup
                    </button>
                    <a href={`https://wa.me/62819848706?text=${waText}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer">
                        Konsultasi WhatsApp
                    </a>
                </div>
            </div>
        </div>
    );
}
