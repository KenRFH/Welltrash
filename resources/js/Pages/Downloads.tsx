import React, { useState } from "react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import SEO from "@/Components/SEO";
import { usePwa } from "@/utils/pwa";
import PwaInstallModal from "@/Components/PwaInstallModal";
import { ApkInfo } from "@/types";
import CleanUpCard from "@/Components/Downloads/CleanUpCard";
import PartnerCard from "@/Components/Downloads/PartnerCard";
import DocumentList from "@/Components/Downloads/DocumentList";
import SideloadGuide from "@/Components/Downloads/SideloadGuide";
import SupportBanner from "@/Components/Downloads/SupportBanner";
import {
    ShieldCheck,
    CheckCircle2,
    HardDrive,
    Cpu,
} from "lucide-react";

export default function Downloads({ apk }: { apk: ApkInfo | null }) {
    const { install, showInstructionsModal, setShowInstructionsModal, isIos } = usePwa();
    const [selectedCategory, setSelectedCategory] = useState<"all" | "mobile" | "web" | "doc">("all");
    const [downloadingId, setDownloadingId] = useState<string | null>(null);

    const handleDownloadTrigger = (id: string, url: string, filename: string) => {
        setDownloadingId(id);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
            setDownloadingId(null);
        }, 1500);
    };

    const show = (category: "mobile" | "web" | "doc") =>
        selectedCategory === "all" || selectedCategory === category;

    return (
        <div className="bg-[#F8FAF8] dark:bg-zinc-950 min-h-screen font-sans text-ink dark:text-zinc-100 selection:bg-lime selection:text-ink">
            <SEO
                title="Pusat Unduhan Resmi Aplikasi & Dokumen Operasional | WellTrash"
                description="Portal unduh berkas APK resmi WellTrash CleanUP Operator, instalasi PWA Partner Portal B2B, dan dokumen legalitas operasional pengelolaan limbah Kabupaten Jember."
            />
            <Navbar />
            {/* Editorial Page Header */}
            <section className="pt-32 sm:pt-40 pb-12 sm:pb-16 px-6 lg:px-12 border-b border-black/10 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                <div className="max-w-[1440px] mx-auto">
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-emerald-900/20 dark:border-emerald-500/20 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-mono text-xs uppercase tracking-wider font-semibold">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600 dark:bg-emerald-400"></span>
                            </span>
                            <span>DISTRIBUSI RESMI SISTEM OPERASIONAL</span>
                        </div>
                        <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400 hidden sm:inline">
                            REPOSITORI VERIFIKASI v{apk?.version_name ?? "-"} • KABUPATEN JEMBER
                        </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end">
                        <div className="lg:col-span-8">
                            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-sans font-bold text-ink dark:text-white tracking-tight leading-[1.1]">
                                Pusat Unduhan{" "}
                                <span className="font-serif italic font-normal text-emerald-800 dark:text-emerald-400">
                                    Aplikasi &amp; Sistem
                                </span>{" "}
                                Operasional.
                            </h1>
                        </div>
                        <div className="lg:col-span-4">
                            <p className="font-sans text-sm sm:text-base text-muted dark:text-zinc-400 leading-relaxed">
                                Distribusi paket perangkat lunak resmi untuk pengemudi armada (CleanUP Operator), platform analitik mitra korporat (Partner Portal), serta instrumen legalitas operasional PT Sarana Utama Welltrash.
                            </p>
                        </div>
                    </div>

                    {/* Telemetry Strip */}
                    <div className="mt-10 pt-6 border-t border-zinc-100 dark:border-zinc-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-xs font-mono">
                        <div className="space-y-1">
                            <span className="text-zinc-500 dark:text-zinc-500 uppercase tracking-wider block text-[11px]">Keamanan Berkas</span>
                            <span className="font-bold text-zinc-900 dark:text-zinc-200 flex items-center gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                SHA-256 Verified
                            </span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-zinc-500 dark:text-zinc-500 uppercase tracking-wider block text-[11px]">Status Rilis</span>
                            <span className="font-bold text-zinc-900 dark:text-zinc-200 flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                Stable v{apk?.version_name ?? "-"}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-zinc-500 dark:text-zinc-500 uppercase tracking-wider block text-[11px]">Infrastruktur</span>
                            <span className="font-bold text-zinc-900 dark:text-zinc-200 flex items-center gap-1.5">
                                <Cpu className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                Android &amp; PWA
                            </span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-zinc-500 dark:text-zinc-500 uppercase tracking-wider block text-[11px]">Pusat Kendali</span>
                            <span className="font-bold text-zinc-900 dark:text-zinc-200 flex items-center gap-1.5">
                                <HardDrive className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                WellTrash Farm Jember
                            </span>
                        </div>
                    </div>
                </div>
            </section>
            <main className="py-12 sm:py-16 px-6 lg:px-12">
                <div className="max-w-[1440px] mx-auto space-y-16">
                    {/* Filter Tabs */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200/90 dark:border-zinc-800 pb-4">
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                            <button
                                type="button"
                                onClick={() => setSelectedCategory("all")}
                                className={`px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                                    selectedCategory === "all"
                                        ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xs"
                                        : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-white"
                                }`}
                            >
                                Semua Berkas
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedCategory("mobile")}
                                className={`px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                                    selectedCategory === "mobile"
                                        ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xs"
                                        : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-white"
                                }`}
                            >
                                Aplikasi Mobile (CleanUP)
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedCategory("web")}
                                className={`px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                                    selectedCategory === "web"
                                        ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xs"
                                        : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-white"
                                }`}
                            >
                                Portal Web (Mitra B2B)
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedCategory("doc")}
                                className={`px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                                    selectedCategory === "doc"
                                        ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xs"
                                        : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-white"
                                }`}
                            >
                                Dokumen Legal &amp; SOP
                            </button>
                        </div>

                        <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span>Tersedia untuk Pengemudi &amp; Kemitraan</span>
                        </div>
                    </div>

                    {(show("mobile") || show("web")) && (
                        <div className={`grid grid-cols-1 gap-8 ${selectedCategory === "all" ? "lg:grid-cols-2" : ""}`}>
                            {show("mobile") && (
                                <CleanUpCard
                                    onDownload={handleDownloadTrigger}
                                    downloadingId={downloadingId}
                                    onInstallPwa={install}
                                    apk={apk}
                                />
                            )}
                            {show("web") && <PartnerCard onInstallPwa={install} />}
                        </div>
                    )}

                    {show("mobile") && <SideloadGuide />}

                    {show("doc") && (
                        <DocumentList onDownload={handleDownloadTrigger} downloadingId={downloadingId} />
                    )}

                    <SupportBanner />
                </div>
            </main>
            <Footer />
            <PwaInstallModal
                isOpen={showInstructionsModal}
                onClose={() => setShowInstructionsModal(false)}
                isIos={isIos}
            />
        </div>
    );
}
