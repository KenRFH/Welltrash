import React, { useState } from 'react';
import { ApkInfo } from '@/types';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import SEO from '@/Components/SEO';
import {
    Smartphone,
    Download,
    ShieldCheck,
    CheckCircle2,
    Copy,
    Check,
    ChevronDown,
    ChevronUp,
    HardDrive,
    Cpu,
    AlertTriangle,
    BookOpen,
} from 'lucide-react';

const APK_URL = '/downloads/welltrash-cleanup-operator.apk';
const APK_FILENAME = 'welltrash-cleanup-operator.apk';

const installSteps = [
    {
        step: '01',
        title: 'Unduh Berkas APK Resmi',
        desc: 'Klik tombol "Unduh APK" pada halaman ini. Berkas akan tersimpan di folder Unduhan ponsel petugas.',
    },
    {
        step: '02',
        title: 'Izinkan Sumber Tak Dikenal',
        desc: 'Buka Pengaturan › Keamanan › Pasang aplikasi tidak dikenal › Aktifkan izin untuk browser/pengelola berkas.',
    },
    {
        step: '03',
        title: 'Buka & Pasang Paket APK',
        desc: 'Buka berkas welltrash-cleanup-operator.apk dari notifikasi atau pengelola berkas, lalu pilih Pasang (Install).',
    },
    {
        step: '04',
        title: 'Beri Izin & Masuk Akun',
        desc: 'Buka aplikasi, izinkan Lokasi GPS dan Akses Kamera untuk foto timbangan, lalu login dengan akun operator CleanUP.',
    },
];

export default function AppDownload({ apk }: { apk: ApkInfo | null }) {
    const APK_VERSION = apk ? `v${apk.version_name} (Build ${apk.version_code})` : '-';
    const APK_DATE = apk?.release_date
        ? new Date(apk.release_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        : '-';
    const APK_SIZE = apk?.size_bytes ? `${(apk.size_bytes / 1048576).toFixed(1)} MB` : '-';
    const APK_SHA256 = apk?.sha256 ?? '-';
    const notes = (apk?.changelog ?? '').split('\n').map((n) => n.replace(/^\s*[•\-*]\s*/, '')).filter(Boolean);

    const [downloading, setDownloading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showChangelog, setShowChangelog] = useState(false);

    const handleDownload = () => {
        setDownloading(true);
        const link = document.createElement('a');
        link.href = APK_URL;
        link.download = APK_FILENAME;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => setDownloading(false), 1800);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(APK_SHA256);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <div className="bg-[#F8FAF8] dark:bg-zinc-950 min-h-screen font-sans text-ink dark:text-zinc-100">
            <SEO
                title="Unduh Aplikasi WellTrash CleanUP Operator"
                description="Unduh APK resmi WellTrash CleanUP Operator untuk petugas pengangkutan sampah armada WellTrash. Versi terbaru dengan panduan instalasi lengkap."
            />
            <Navbar />

            {/* Page Header */}
            <section className="pt-32 sm:pt-40 pb-12 sm:pb-16 px-6 lg:px-12 border-b border-black/10 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-emerald-900/20 dark:border-emerald-500/20 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-mono text-xs uppercase tracking-wider font-semibold mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600 dark:bg-emerald-400"></span>
                        </span>
                        <span>Distribusi Resmi Aplikasi Operasional</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-bold text-ink dark:text-white tracking-tight leading-tight mb-4">
                        Unduh Aplikasi{' '}
                        <span className="font-serif italic font-normal text-emerald-700 dark:text-emerald-400">
                            CleanUP Operator
                        </span>
                    </h1>
                    <p className="text-sm sm:text-base text-muted dark:text-zinc-400 leading-relaxed max-w-2xl">
                        Aplikasi resmi Android untuk petugas pengangkutan sampah armada WellTrash. Kelola ritase, presensi, dan dokumentasi timbangan langsung dari ponsel.
                    </p>
                </div>
            </section>

            <main className="py-12 sm:py-16 px-6 lg:px-12">
                <div className="max-w-4xl mx-auto space-y-6">

                    {/* Stat strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { label: 'Versi Terkini', value: apk ? `v${apk.version_name}` : '-', icon: CheckCircle2, color: 'text-emerald-600' },
                            { label: 'Platform', value: 'Android', icon: Smartphone, color: 'text-blue-600' },
                            { label: 'Ukuran Berkas', value: APK_SIZE, icon: HardDrive, color: 'text-violet-600' },
                            { label: 'Keamanan', value: 'SHA-256', icon: ShieldCheck, color: 'text-amber-600' },
                        ].map(({ label, value, icon: Icon, color }) => (
                            <div key={label} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 flex items-center gap-3">
                                <Icon className={`w-5 h-5 shrink-0 ${color}`} />
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
                                    <p className="text-sm font-bold text-slate-800 dark:text-zinc-100">{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Main download card */}
                    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
                        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-5 flex items-center gap-4">
                            <div className="bg-white/20 rounded-xl p-3">
                                <Smartphone className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-white font-bold text-base">WellTrash CleanUP Operator</h2>
                                <p className="text-emerald-100 text-xs mt-0.5">Aplikasi resmi untuk petugas pengangkutan sampah armada WellTrash</p>
                            </div>
                            <span className="ml-auto bg-white/20 text-white text-xs font-mono font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                                {APK_VERSION}
                            </span>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* Meta info */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-sm">
                                <div>
                                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">Tanggal Rilis</span>
                                    <span className="font-medium text-slate-700 dark:text-zinc-300">{APK_DATE}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">Ukuran</span>
                                    <span className="font-medium text-slate-700 dark:text-zinc-300">{APK_SIZE}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">Minimum OS</span>
                                    <span className="font-medium text-slate-700 dark:text-zinc-300">Android 8.0 (Oreo)</span>
                                </div>
                            </div>

                            {/* SHA-256 */}
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                    SHA-256 Checksum
                                </p>
                                <div className="flex items-center gap-2 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2.5">
                                    <code className="text-[11px] font-mono text-slate-600 dark:text-zinc-400 flex-1 break-all">{APK_SHA256}</code>
                                    <button
                                        type="button"
                                        onClick={handleCopy}
                                        title="Salin checksum"
                                        className="ml-2 shrink-0 p-1.5 rounded-md text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                                    >
                                        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Download button */}
                            <button
                                type="button"
                                onClick={handleDownload}
                                disabled={downloading}
                                className="w-full flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold text-sm px-6 py-3.5 rounded-xl transition-all shadow-sm active:scale-[0.98] cursor-pointer"
                            >
                                <Download className={`w-5 h-5 ${downloading ? 'animate-bounce' : ''}`} />
                                {downloading ? 'Mempersiapkan unduhan…' : `Unduh APK · ${APK_SIZE}`}
                            </button>

                            {/* Warning */}
                            <div className="flex items-start gap-2.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl px-4 py-3">
                                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                                    Aplikasi ini ditujukan khusus untuk petugas CleanUP yang terdaftar di sistem WellTrash. Pastikan mengunduh hanya dari halaman resmi ini.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Panduan instalasi */}
                    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                        <h3 className="font-bold text-slate-800 dark:text-zinc-100 text-sm mb-4 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-emerald-600" />
                            Panduan Instalasi
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {installSteps.map(({ step, title, desc }) => (
                                <div key={step} className="flex gap-4">
                                    <div className="shrink-0 w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/50 flex items-center justify-center">
                                        <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 font-mono">{step}</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-800 dark:text-zinc-100">{title}</p>
                                        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 leading-relaxed">{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Changelog (collapsible) */}
                    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
                        <button
                            type="button"
                            onClick={() => setShowChangelog(!showChangelog)}
                            className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
                        >
                            <span className="text-sm font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
                                <Cpu className="w-4 h-4 text-emerald-600" />
                                Riwayat Pembaruan (Changelog)
                            </span>
                            {showChangelog
                                ? <ChevronUp className="w-4 h-4 text-slate-400" />
                                : <ChevronDown className="w-4 h-4 text-slate-400" />
                            }
                        </button>

                        {showChangelog && (
                            <div className="border-t border-slate-100 dark:border-zinc-800 px-6 py-4 space-y-5">
                                <div>
                                    <div className="flex items-baseline gap-3 mb-2">
                                        <span className="text-xs font-black font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/50 px-2 py-0.5 rounded">
                                            {APK_VERSION}
                                        </span>
                                        <span className="text-xs text-slate-400">{APK_DATE}</span>
                                    </div>
                                    <ul className="space-y-1">
                                        {notes.map((note, i) => (
                                            <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-zinc-400">
                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                                                {note}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
