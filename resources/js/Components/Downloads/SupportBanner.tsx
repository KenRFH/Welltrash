import React from "react";
import { HelpCircle, ExternalLink } from "lucide-react";

export default function SupportBanner() {
    return (
        <div className="border border-zinc-200/90 dark:border-zinc-800 rounded-sm p-6 sm:p-8 bg-white dark:bg-zinc-900/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
            <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    <h3 className="font-sans font-bold text-base text-ink dark:text-white">
                        Membutuhkan Bantuan Teknis Pemasangan atau Akun Operator?
                    </h3>
                </div>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Tim Dispatcher &amp; Dukungan Sistem WellTrash siap membantu pendaftaran akun pengemudi, pembaruan aplikasi, atau kendala verifikasi GPS di lokasi mitra.
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
                <a
                    href="https://wa.me/62819848706?text=Halo%20Admin%20WellTrash,%20saya%20butuh%20bantuan%20terkait%20unduhan%20aplikasi%20atau%20dokumen%20operasional."
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-sm bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-sans font-semibold text-xs inline-flex items-center gap-2 transition-colors shadow-xs"
                >
                    <span>Hubungi WhatsApp Dispatch</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                    href="mailto:new.welltrashjember@gmail.com"
                    className="px-4 py-2.5 rounded-sm bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-sans font-medium text-xs inline-flex items-center gap-2 transition-colors"
                >
                    <span>Kirim Email Dukungan</span>
                </a>
            </div>
        </div>
    );
}
