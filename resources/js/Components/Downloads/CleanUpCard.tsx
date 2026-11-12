import React, { useState } from "react";
import {
    ArrowDownToLine,
    Smartphone,
    Terminal,
    ChevronDown,
    ChevronUp,
    Calendar,
    Lock,
    Copy,
    Check,
    CheckCircle2,
} from "lucide-react";
import { ApkInfo } from "@/types";

interface Props {
    onDownload: (id: string, url: string, filename: string) => void;
    downloadingId: string | null;
    onInstallPwa: () => void;
    apk: ApkInfo | null;
}

export default function CleanUpCard({ onDownload, downloadingId, onInstallPwa, apk }: Props) {
    const [copiedHash, setCopiedHash] = useState(false);
    const [showChangelog, setShowChangelog] = useState(false);
    const cleanupApkHash = apk?.sha256 ?? "-";
    const version = apk?.version_name ?? "-";
    const build = apk ? `${apk.version_name} (Build ${apk.version_code})` : "-";
    const size = apk?.size_bytes ? `${(apk.size_bytes / 1048576).toFixed(1)} MB` : "-";

    const handleCopy = () => {
        navigator.clipboard.writeText(cleanupApkHash);
        setCopiedHash(true);
        setTimeout(() => setCopiedHash(false), 2500);
    };

    return (
        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200/90 dark:border-zinc-800 rounded-sm p-6 sm:p-8 lg:p-10 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                <div className="lg:col-span-7 space-y-6">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="w-10 h-10 rounded-sm bg-emerald-800 text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs">
                            CU
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl sm:text-2xl font-sans font-bold text-ink dark:text-white">
                                    WellTrash CleanUP Operator
                                </h2>
                                <span className="px-2 py-0.5 rounded-sm bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] uppercase font-bold tracking-wider">
                                    APK v{version}
                                </span>
                            </div>
                            <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                                Aplikasi Mandiri Pengemudi Armada &amp; Petugas Lapangan
                            </p>
                        </div>
                    </div>

                    <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
                        Aplikasi khusus operasional armada penjemputan limbah komersial WellTrash di Kabupaten Jember. Dirancang dengan pengoperasian satu tangan, presensi GPS, dokumentasi foto timbangan teroptimasi, serta ketahanan offline 48 jam di basement gedung tanpa jangkauan sinyal.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs text-zinc-700 dark:text-zinc-300">
                        <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>Pencatatan tonase timbangan multi-kategori (Organik, Daur Ulang, Residu).</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>Kompresi foto nota timbangan otomatis (78% lebih hemat kuota).</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>Presensi geolokasi GPS &amp; verifikasi swafoto saat bertugas.</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>Toleransi offline 48 jam (Store-and-Forward) di basement gedung.</span>
                        </div>
                    </div>

                    <div className="pt-3 flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={() =>
                                onDownload(
                                    "cleanup-apk",
                                    "/downloads/welltrash-cleanup-operator.apk",
                                    `welltrash-cleanup-operator-v${version}.apk`
                                )
                            }
                            disabled={downloadingId === "cleanup-apk"}
                            className="px-6 py-3 rounded-sm bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-sans font-semibold text-sm inline-flex items-center gap-2.5 transition-all shadow-xs active:scale-[0.98] disabled:opacity-75 cursor-pointer"
                        >
                            <ArrowDownToLine className={`w-4 h-4 ${downloadingId === "cleanup-apk" ? "animate-bounce" : ""}`} />
                            <span>{downloadingId === "cleanup-apk" ? "Menyiapkan Berkas..." : `Unduh Berkas APK (${size})`}</span>
                        </button>

                        <button
                            type="button"
                            onClick={onInstallPwa}
                            className="px-5 py-3 rounded-sm bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 text-zinc-800 dark:text-zinc-200 font-sans font-medium text-sm inline-flex items-center gap-2 transition-colors cursor-pointer"
                        >
                            <Smartphone className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                            <span>Pasang Versi PWA Cepat</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowChangelog(!showChangelog)}
                            className="px-4 py-3 text-xs font-mono text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                            <span>Catatan Rilis</span>
                            {showChangelog ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                    </div>
                </div>
                <div className="lg:col-span-5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-sm p-5 space-y-4 font-mono text-xs">
                    <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
                        <span className="uppercase tracking-wider text-zinc-900 dark:text-white font-bold flex items-center gap-1.5 text-[11px]">
                            <Terminal className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                            Spesifikasi Teknis
                        </span>
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-sm">
                            Production v{version}
                        </span>
                    </div>

                    <div className="space-y-2 text-zinc-600 dark:text-zinc-400 text-[11px]">
                        <div className="flex items-center justify-between py-1 border-b border-zinc-200/50 dark:border-zinc-800/50">
                            <span>Nama Berkas:</span>
                            <span className="text-zinc-800 dark:text-zinc-200 font-medium">welltrash-cleanup-operator.apk</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-zinc-200/50 dark:border-zinc-800/50">
                            <span>Versi / Build:</span>
                            <span className="text-zinc-800 dark:text-zinc-200 font-medium">{build}</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-zinc-200/50 dark:border-zinc-800/50">
                            <span>Arsitektur:</span>
                            <span className="text-zinc-800 dark:text-zinc-200 font-medium">Universal (arm64, v7a, x86)</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-zinc-200/50 dark:border-zinc-800/50">
                            <span>Kebutuhan OS:</span>
                            <span className="text-zinc-800 dark:text-zinc-200 font-medium">Android 7.0 (API 24)+</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-zinc-200/50 dark:border-zinc-800/50">
                            <span>Ukuran Unduhan:</span>
                            <span className="text-zinc-800 dark:text-zinc-200 font-medium">{size} (Paket Mandiri)</span>
                        </div>
                    </div>

                    {/* SHA-256 Checksum Box */}
                    <div className="pt-1">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] text-zinc-500 uppercase tracking-wider flex items-center gap-1 font-bold">
                                <Lock className="w-3 h-3 text-emerald-600" />
                                SHA-256 Checksum
                            </span>
                            <button
                                type="button"
                                onClick={handleCopy}
                                className="text-[10px] text-emerald-800 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                            >
                                {copiedHash ? (
                                    <>
                                        <Check className="w-3 h-3 text-emerald-600" />
                                        <span>Tersalin!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-3 h-3" />
                                        <span>Salin Hash</span>
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="p-2 rounded-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[10px] text-zinc-600 dark:text-zinc-400 break-all leading-tight">
                            {cleanupApkHash}
                        </div>
                    </div>
                </div>
            </div>
            {/* Changelog Accordion */}
            {showChangelog && (
                <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800 animate-in fade-in duration-200">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-900 dark:text-white font-bold mb-4 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                        Riwayat Pembaruan (Changelog)
                    </h3>
                    <div className="space-y-3 font-sans text-xs">
                        <div className="border-l-2 border-emerald-800 dark:border-emerald-500 pl-3.5 space-y-1">
                            <div className="flex items-center gap-2 font-mono text-[11px]">
                                <span className="font-bold text-ink dark:text-white">v{build}</span>
                                {apk?.release_date && (
                                    <span className="text-zinc-500">
                                        {new Date(apk.release_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                                    </span>
                                )}
                            </div>
                            <p className="text-zinc-600 dark:text-zinc-400 whitespace-pre-line">{apk?.changelog}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
