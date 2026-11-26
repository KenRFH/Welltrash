import React from "react";
import { Link } from "@inertiajs/react";
import {
    UserPlus,
    MessageCircle,
    ClipboardList,
    ShieldCheck,
    Receipt,
    CalendarCheck,
    ArrowRight,
} from "lucide-react";
import { motion } from "motion/react";

const WA_URL =
    "https://wa.me/62819848706?text=Halo%20WellTrash,%20kami%20ingin%20dibuatkan%20akun%20mitra";

const PATHS = [
    {
        tag: "JALUR A",
        title: "Daftar Mandiri",
        icon: UserPlus,
        steps: ["Buat akun di halaman Daftar", "Masuk ke dashboard mitra"],
        cta: { label: "Daftar Sekarang", href: "register" },
    },
    {
        tag: "JALUR B",
        title: "Dibuatkan oleh Tim WellTrash",
        icon: MessageCircle,
        steps: ["Hubungi tim kami via WhatsApp", "Terima email & kata sandi akun Anda"],
        cta: { label: "Hubungi Tim", href: WA_URL },
    },
];

const FORM_FIELDS = [
    "Data perusahaan & PIC",
    "Alamat & titik penjemputan",
    "Paket langganan & kategori bisnis",
    "MOU bertanda tangan (PDF)",
];

const AFTER_STEPS = [
    { title: "Verifikasi Tim", desc: "Data & MOU Anda diperiksa oleh tim WellTrash.", icon: ShieldCheck },
    { title: "Unggah Bukti Bayar", desc: "Setelah disetujui, unggah bukti pembayaran di dashboard.", icon: Receipt },
    { title: "Akun Aktif", desc: "Jadwal penjemputan pertama dibuat otomatis.", icon: CalendarCheck },
];

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, delay },
});

const Connector: React.FC = () => (
    <div aria-hidden="true" className="flex justify-center h-10">
        <div className="border-l-2 border-dashed border-emerald-300 dark:border-emerald-700" />
    </div>
);

const PartnerRegistrationFlow: React.FC = () => (
    <section
        id="pendaftaran-mitra"
        className="scroll-mt-24 bg-white dark:bg-zinc-950 py-20 lg:py-28 border-b border-zinc-100 dark:border-zinc-800"
    >
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
            <motion.div {...fadeUp()} className="max-w-3xl mb-12 lg:mb-14">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold tracking-tight text-zinc-900 dark:text-white leading-tight mb-4">
                    Cara bergabung sebagai mitra.
                </h2>
                <p className="text-zinc-600 dark:text-zinc-300 font-sans text-base lg:text-lg leading-relaxed">
                    Pilih jalur yang paling mudah untuk Anda. Apa pun jalurnya, setiap mitra
                    mengisi formulir pendaftaran yang sama agar data dan layanan tercatat dengan benar.
                </p>
            </motion.div>

            {/* Two entry paths */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {PATHS.map((p, i) => {
                    const Icon = p.icon;
                    const external = p.cta.href.startsWith("http");
                    const ctaClass =
                        "inline-flex items-center gap-1.5 text-sm font-sans font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 transition-colors group";
                    return (
                        <motion.div
                            key={p.tag}
                            {...fadeUp(i * 0.1)}
                            className="bg-zinc-50/70 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-6"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="block font-mono text-[11px] font-bold text-zinc-400">{p.tag}</span>
                                    <h3 className="font-sans font-bold text-base text-zinc-900 dark:text-white tracking-tight">
                                        {p.title}
                                    </h3>
                                </div>
                            </div>
                            <ol className="space-y-2 mb-5">
                                {p.steps.map((s, n) => (
                                    <li key={s} className="flex items-start gap-2.5 text-sm font-sans text-zinc-600 dark:text-zinc-300">
                                        <span className="w-5 h-5 shrink-0 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono text-[10px] font-bold text-zinc-500 flex items-center justify-center">
                                            {n + 1}
                                        </span>
                                        {s}
                                    </li>
                                ))}
                            </ol>
                            {external ? (
                                <a href={p.cta.href} target="_blank" rel="noreferrer" className={ctaClass}>
                                    {p.cta.label}
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </a>
                            ) : (
                                <Link href={route(p.cta.href)} className={ctaClass}>
                                    {p.cta.label}
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Both paths merge into the form */}
            <div aria-hidden="true" className="hidden md:block relative h-12">
                <div className="absolute left-1/4 right-1/4 top-0 h-6 border-x-2 border-b-2 border-dashed border-emerald-300 dark:border-emerald-700 rounded-b-xl" />
                <div className="absolute left-1/2 top-6 h-6 border-l-2 border-dashed border-emerald-300 dark:border-emerald-700" />
            </div>
            <div className="md:hidden">
                <Connector />
            </div>

            <motion.div
                {...fadeUp(0.1)}
                className="relative bg-green-deep dark:bg-emerald-950 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-6"
            >
                <div className="flex items-center gap-4 sm:w-2/5">
                    <div className="w-12 h-12 shrink-0 rounded-xl bg-lime text-green-deep flex items-center justify-center">
                        <ClipboardList className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="block font-mono text-[11px] font-bold text-lime">WAJIB UNTUK SEMUA MITRA</span>
                        <h3 className="font-sans font-bold text-lg sm:text-xl tracking-tight">Isi Formulir Pendaftaran</h3>
                    </div>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 sm:flex-1">
                    {FORM_FIELDS.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm font-sans text-white/85">
                            <span className="w-1.5 h-1.5 rounded-full bg-lime shrink-0" />
                            {f}
                        </li>
                    ))}
                </ul>
            </motion.div>

            <Connector />

            {/* Shared steps after the form */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {AFTER_STEPS.map((s, i) => {
                    const Icon = s.icon;
                    return (
                        <motion.div
                            key={s.title}
                            {...fadeUp(i * 0.1)}
                            className="relative bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-5"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200/70 dark:border-zinc-700 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <span className="font-mono text-xs font-bold text-zinc-400">0{i + 1}</span>
                            </div>
                            <h4 className="font-sans font-bold text-base text-zinc-900 dark:text-white tracking-tight mb-1">
                                {s.title}
                            </h4>
                            <p className="font-sans text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{s.desc}</p>
                            {i < AFTER_STEPS.length - 1 && (
                                <ArrowRight
                                    aria-hidden="true"
                                    className="hidden md:block absolute top-1/2 -right-5 -translate-y-1/2 w-4 h-4 text-emerald-400"
                                />
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    </section>
);

export default PartnerRegistrationFlow;
