import React from "react";
import {
    ClipboardCheck,
    CalendarClock,
    Truck,
    FileSpreadsheet,
} from "lucide-react";
import { motion } from "motion/react";

interface Step {
    num: string;
    title: string;
    desc: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: "green" | "orange";
    points: string[];
}

const steps: Step[] = [
    {
        num: "01",
        title: "Waste Assessment",
        desc: "Memetakan volume timbulan, proporsi material organik & anorganik, dan ritme operasional perusahaan Anda.",
        icon: ClipboardCheck,
        accentColor: "green",
        points: ["Audit estimasi kilogram harian", "Klasifikasi fraksi material", "Penentuan titik penjemputan"],
    },
    {
        num: "02",
        title: "Tailored Plan",
        desc: "Menentukan frekuensi penjemputan armada logistik, penyediaan wadah pemilahan, dan kontrak kemitraan resmi.",
        icon: CalendarClock,
        accentColor: "orange",
        points: ["Jadwal fleksibel (2x s.d 7x/minggu)", "Armada terdedikasi se-Jember", "Perjanjian Kerjasama (MOU) resmi"],
    },
    {
        num: "03",
        title: "Reliable Collection",
        desc: "Pengangkutan tepat waktu dan higienis oleh petugas terlatih berstandar APD lengkap serta timbangan digital.",
        icon: Truck,
        accentColor: "green",
        points: ["Petugas berseragam & APD standar", "Protokol zero-spill higienis", "Pencatatan timbangan di lokasi"],
    },
    {
        num: "04",
        title: "Impact Reporting",
        desc: "Laporan rekapitulasi manifest tonase bulanan transparan untuk audit kepatuhan DLH dan pelaporan ESG.",
        icon: FileSpreadsheet,
        accentColor: "orange",
        points: ["Manifest digital terverifikasi", "Jejak riwayat penjemputan", "Sertifikat reduksi sampah TPA"],
    },
];

const WasteFlow: React.FC = () => {
    return (
        <section id="cara-kerja" className="scroll-mt-24 bg-zinc-50/50 py-20 lg:py-28 border-b border-zinc-200/60">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="max-w-3xl mb-14 lg:mb-16"
                >
                    <span className="text-xs font-semibold tracking-wider uppercase text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-full font-mono mb-4 inline-block">
                        ALUR SISTEMATIS
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold tracking-tight text-zinc-900 leading-tight mb-4">
                        Sederhana untuk Anda. Terukur untuk bisnis.
                    </h2>
                    <p className="text-zinc-600 font-sans text-base lg:text-lg leading-relaxed">
                        Kami merancang alur kerja yang terstruktur agar bisnis Anda dapat fokus pada operasional utama, sementara pengelolaan sampah ditangani secara tuntas dan bertanggung jawab.
                    </p>
                </motion.div>

                {/* 4 Process Columns with Modern Web Icons & Workflow Telemetry */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((step, idx) => {
                        const IconComponent = step.icon;
                        const isOrange = step.accentColor === "orange";
                        return (
                            <motion.div
                                key={step.num}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                whileHover={{ y: -4 }}
                                className="bg-white border border-zinc-200/80 rounded-2xl p-6 flex flex-col justify-between hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-200/40 transition-all duration-300 group"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="font-mono text-xs font-bold text-zinc-400 group-hover:text-zinc-900 transition-colors">
                                            LANGKAH {step.num}
                                        </span>
                                        <span
                                            className={`w-2 h-2 rounded-full ${
                                                isOrange ? "bg-orange-500" : "bg-emerald-600"
                                            }`}
                                        />
                                    </div>

                                    {/* Web Icon Visual Badge */}
                                    <div className="w-14 h-14 rounded-2xl bg-zinc-50 border border-zinc-200/70 p-3 mb-5 flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-2xs">
                                        <div
                                            className={`w-full h-full rounded-xl flex items-center justify-center ${
                                                isOrange
                                                    ? "bg-orange-50 text-orange-600 group-hover:bg-orange-500 group-hover:text-white"
                                                    : "bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white"
                                            } transition-colors duration-200`}
                                        >
                                            <IconComponent className="w-6 h-6" />
                                        </div>
                                    </div>

                                    <h3 className="font-sans font-bold text-lg text-zinc-900 mb-2 tracking-tight">
                                        {step.title}
                                    </h3>
                                    <p className="font-sans text-xs sm:text-sm text-zinc-600 leading-relaxed mb-4">
                                        {step.desc}
                                    </p>

                                    {/* Action Points / Checklist */}
                                    <div className="pt-3 border-t border-zinc-100 space-y-1.5">
                                        {step.points.map((pt) => (
                                            <div key={pt} className="flex items-center gap-2 text-xs font-sans text-zinc-500">
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                                        isOrange ? "bg-orange-400" : "bg-emerald-500"
                                                    }`}
                                                />
                                                <span>{pt}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default WasteFlow;
