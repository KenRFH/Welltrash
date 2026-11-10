import React from "react";
import { Link } from "@inertiajs/react";
import { CheckCircle2, ExternalLink, Monitor } from "lucide-react";

export default function PartnerCard({ onInstallPwa }: { onInstallPwa: () => void }) {
    return (
        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200/90 dark:border-zinc-800 rounded-sm p-6 sm:p-8 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-sm bg-zinc-900 dark:bg-zinc-800 text-white flex items-center justify-center font-bold text-xs">
                            B2B
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-sans font-bold text-ink dark:text-white">
                                    WellTrash Partner Portal
                                </h2>
                                <span className="px-2 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[10px] uppercase font-bold">
                                    PWA Web
                                </span>
                            </div>
                            <p className="font-mono text-xs text-zinc-500">Dasbor Kemitraan Bisnis, F&amp;B, &amp; Rumah Sakit</p>
                        </div>
                    </div>

                    <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                        Dasbor manajemen limbah terpadu untuk Facility Manager dan tim ESG. Pantau armada via live GPS, unduh manifest tonase berkala untuk audit KLHK, dan kelola invoice bulanan.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Live Tracking Armada ke Titik Jemput</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Manifest &amp; Sertifikat Kemitraan ESG</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Faktur Tagihan Digital &amp; Riwayat Transaksi</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Dapat Dipasang di Layar HP &amp; Desktop</span>
                        </div>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                        <Link
                            href="/login"
                            className="px-5 py-2.5 rounded-sm bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-sans font-semibold text-xs inline-flex items-center gap-2 transition-colors shadow-xs"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Buka Partner Portal</span>
                        </Link>
                        <button
                            type="button"
                            onClick={onInstallPwa}
                            className="px-4 py-2.5 rounded-sm bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 font-sans font-medium text-xs inline-flex items-center gap-2 transition-colors cursor-pointer"
                        >
                            <Monitor className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Pasang PWA di Perangkat</span>
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-sm p-4 space-y-2.5 font-mono text-xs">
                    <span className="uppercase tracking-wider text-zinc-500 block font-bold text-[10px]">
                        KOMPATIBILITAS AKSES
                    </span>
                    <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400 text-[11px]">
                        <li className="flex justify-between border-b border-zinc-200/50 pb-1">
                            <span>Google Chrome / Edge</span>
                            <span className="text-emerald-700 font-bold">Didukung</span>
                        </li>
                        <li className="flex justify-between border-b border-zinc-200/50 pb-1">
                            <span>Apple Safari (iOS / Mac)</span>
                            <span className="text-emerald-700 font-bold">Add to Home</span>
                        </li>
                        <li className="flex justify-between">
                            <span>Windows / macOS App</span>
                            <span className="text-emerald-700 font-bold">Mandiri</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
