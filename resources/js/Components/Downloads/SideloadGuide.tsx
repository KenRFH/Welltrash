import React from "react";
import { ShieldCheck } from "lucide-react";

export default function SideloadGuide() {
    const installSteps = [
        {
            step: "01",
            title: "Unduh Berkas APK Resmi",
            desc: "Klik tombol Unduh Berkas APK pada kartu WellTrash CleanUP. Berkas tersimpan di folder Unduhan ponsel Anda.",
        },
        {
            step: "02",
            title: "Izinkan Sumber Tak Dikenal",
            desc: "Buka Pengaturan > Keamanan > Pasang aplikasi tidak dikenal (Install Unknown Apps) > Aktifkan izin untuk browser.",
        },
        {
            step: "03",
            title: "Buka & Pasang Paket APK",
            desc: "Buka berkas welltrash-cleanup-operator.apk dari notifikasi atau pengelola berkas, lalu pilih Pasang (Install).",
        },
        {
            step: "04",
            title: "Beri Izin & Masuk Akun",
            desc: "Buka aplikasi, izinkan Lokasi GPS dan Akses Kamera untuk foto timbangan, lalu login akun operator CleanUP.",
        },
    ];

    return (
        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200/90 dark:border-zinc-800 rounded-sm p-6 sm:p-8 lg:p-10 space-y-8">
            <div>
                <span className="font-mono text-xs uppercase tracking-wider text-emerald-800 dark:text-emerald-400 font-bold block mb-1">
                    PANDUAN PEMASANGAN
                </span>
                <h2 className="text-xl sm:text-2xl font-sans font-bold text-ink dark:text-white tracking-tight">
                    Cara Memasang APK{" "}
                    <span className="font-serif italic font-normal text-emerald-800 dark:text-emerald-400">
                        CleanUP Operator di Ponsel Android
                    </span>
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
                    Karena aplikasi CleanUP Operator diperuntukkan khusus bagi petugas internal dan mitra pengangkutan resmi WellTrash, instalasi dilakukan secara mandiri (sideloading) dengan langkah verifikasi berikut:
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {installSteps.map((step) => (
                    <div
                        key={step.step}
                        className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/70 dark:border-zinc-800/80 p-5 rounded-sm flex flex-col justify-between"
                    >
                        <div className="space-y-2.5">
                            <span className="font-mono text-2xl font-bold text-emerald-800 dark:text-emerald-400 block">
                                {step.step}
                            </span>
                            <h3 className="font-sans font-bold text-sm text-ink dark:text-white">
                                {step.title}
                            </h3>
                            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                {step.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Security Assurance Banner */}
            <div className="p-4 sm:p-5 rounded-sm bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-900/20 dark:border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-sm bg-emerald-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                        <ShieldCheck className="w-4 h-4 text-lime" />
                    </div>
                    <div className="space-y-0.5">
                        <h4 className="text-xs font-sans font-bold text-emerald-950 dark:text-emerald-200 uppercase tracking-wide">
                            Jaminan Integritas &amp; Keamanan Berkas Resmi
                        </h4>
                        <p className="text-xs text-emerald-900/80 dark:text-emerald-300/80 leading-relaxed">
                            Seluruh berkas installer dikompilasi langsung dari repositori resmi PT Sarana Utama Welltrash. Aplikasi bebas dari pelacak pihak ketiga atau iklan komersial.
                        </p>
                    </div>
                </div>
                <div className="font-mono text-[11px] text-emerald-900 dark:text-emerald-300 shrink-0 bg-white/70 dark:bg-emerald-900/50 px-3 py-1.5 rounded-sm border border-emerald-900/10 dark:border-emerald-500/20">
                    Sertifikat Digital: Sarana-Utama-2026-Release
                </div>
            </div>
        </div>
    );
}
