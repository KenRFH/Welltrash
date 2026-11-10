import React from "react";
import { FileText, Download } from "lucide-react";

interface Props {
    onDownload: (id: string, url: string, filename: string) => void;
    downloadingId: string | null;
}

export default function DocumentList({ onDownload, downloadingId }: Props) {
    const documents = [
        {
            id: "mou-template",
            title: "Template Perjanjian Kerja Sama (MOU)",
            subtitle: "Kontrak resmi penjemputan limbah komersial B2B non-B3 berstandar KLHK & DLH Jember.",
            file: "/downloads/mou_template.pdf",
            fileName: "mou_template_welltrash.pdf",
            size: "424 KB",
            updated: "Maret 2026",
            format: "PDF Resmi (Bilingual)",
            pages: "6 Halaman",
        },
        {
            id: "sop-pemilahan",
            title: "SOP Pemilahan Sampah Terstandarisasi",
            subtitle: "Panduan pemisahan 15 kategori fraksi anorganik, residu, dan biokonversi Maggot BSF.",
            file: "/downloads/sop_pemilahan_sampah_welltrash.pdf",
            fileName: "sop_pemilahan_sampah_welltrash.pdf",
            size: "1.2 MB",
            updated: "Januari 2026",
            format: "Dokumen Teknis MRF",
            pages: "12 Halaman",
        },
        {
            id: "berita-acara",
            title: "Formulir Berita Acara Rekonsiliasi Tonase",
            subtitle: "Lembar verifikasi timbangan harian & manifest serah terima armada untuk audit ESG.",
            file: "/downloads/berita_acara_rekonsiliasi_tonase.pdf",
            fileName: "berita_acara_rekonsiliasi_tonase.pdf",
            size: "310 KB",
            updated: "Februari 2026",
            format: "Formulir Audit Standar",
            pages: "3 Halaman",
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div>
                    <span className="font-mono text-xs uppercase tracking-wider text-emerald-800 dark:text-emerald-400 font-bold block mb-1">
                        DOKUMEN &amp; TEMPLATE RESMI
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-sans font-bold text-ink dark:text-white tracking-tight">
                        Legalitas &amp; Pedoman{" "}
                        <span className="font-serif italic font-normal text-emerald-800 dark:text-emerald-400">
                            Operasional Terverifikasi
                        </span>
                    </h2>
                </div>
                <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                    Standar Regulasi KLHK &amp; Kebijakan Pengelolaan Sampah Jember
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {documents.map((doc) => (
                    <div
                        key={doc.id}
                        className="bg-white dark:bg-zinc-900/60 border border-zinc-200/90 dark:border-zinc-800 rounded-sm p-6 flex flex-col justify-between hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-xs"
                    >
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="w-8 h-8 rounded-sm bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 flex items-center justify-center">
                                    <FileText className="w-4 h-4" />
                                </div>
                                <span className="font-mono text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-sm">
                                    {doc.format}
                                </span>
                            </div>

                            <div>
                                <h3 className="font-sans font-bold text-base text-ink dark:text-white leading-snug">
                                    {doc.title}
                                </h3>
                                <p className="mt-1.5 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                    {doc.subtitle}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
                            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                                <span>Ukuran: {doc.size}</span>
                                <span>{doc.pages}</span>
                            </div>

                            <button
                                type="button"
                                onClick={() => onDownload(doc.id, doc.file, doc.fileName)}
                                className="w-full py-2.5 px-3 rounded-sm bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 text-xs font-sans font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
                            >
                                <Download className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                                <span>{downloadingId === doc.id ? "Mengunduh..." : "Unduh Dokumen PDF"}</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
