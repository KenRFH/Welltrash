import React, { useState } from "react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { Link } from "@inertiajs/react";
import SEO from "@/Components/SEO";
import videoDemo from "@/assets/img/mini_demo.mp4";

const DAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const DayPicker = ({ maxDays, disabled }: { maxDays: number; disabled?: boolean }) => {
    const [selected, setSelected] = useState<number[]>([]);

    const toggle = (i: number) => {
        if (disabled) return;
        if (selected.includes(i)) {
            setSelected(selected.filter((d) => d !== i));
        } else if (selected.length < maxDays) {
            setSelected([...selected, i]);
        }
    };

    if (disabled) {
        return (
            <div className="mt-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Jadwal Fleksibel</p>
                <p className="text-[10px] text-slate-400 font-semibold">Hubungi kami untuk mengatur jadwal</p>
            </div>
        );
    }

    return (
        <div className="mt-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Pilih Hari ({selected.length}/{maxDays} hari)
            </p>
            <div className="flex gap-1.5 flex-wrap">
                {DAYS.map((day, i) => {
                    const isSelected = selected.includes(i);
                    const isDisabled = !isSelected && selected.length >= maxDays;
                    return (
                        <button
                            key={i}
                            onClick={() => toggle(i)}
                            disabled={isDisabled}
                            className={`w-9 h-9 rounded-lg text-[10px] font-black transition-all duration-200 border
                                ${isSelected
                                    ? "bg-lime-500 text-white border-lime-500 shadow-md shadow-lime-500/30 scale-105"
                                    : isDisabled
                                    ? "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed"
                                    : "bg-white text-slate-600 border-slate-200 hover:border-lime-400 hover:text-lime-600"
                                }`}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

const Services = () => {
    const packages = [
        {
            name: "Paket Request (By Call)",
            price: "500k",
            priceDetail: "Biaya mulai dari",
            pickup: "Sekali Angkut",
            maxDays: 0,
            dayPickerDisabled: true,
            description: "Jasa angkut sampah on-demand yang fleksibel untuk kebutuhan mendadak atau frekuensi tidak rutin.",
            features: [
                "Layanan Jemput Sesuai Panggilan",
                "Jadwal Fleksibel & Cepat",
                "Pemilahan Sampah Standar",
                "Konsultasi via WhatsApp",
            ],
        },
        {
            name: "Paket Rumah Tangga (< 10km)",
            price: "750k",
            priceDetail: "Per bulan",
            pickup: "Maks. 4 Hari / Minggu",
            maxDays: 4,
            description: "Penjemputan sampah harian untuk area dengan radius kurang dari 10km.",
            features: [
                "Max 1m³ (4 kantong trashbag) / sekali angkut",
                "Pilih 4 hari kerja dari Senin – Sabtu",
                "Akses Aplikasi Terbatas (Hanya Jadwal)",
            ],
        },
        {
            name: "Paket Rumah Tangga (> 10km)",
            price: "1.000k",
            priceDetail: "Per bulan",
            pickup: "Maks. 4 Hari / Minggu",
            maxDays: 4,
            description: "Penjemputan sampah harian untuk area dengan radius lebih dari 10km.",
            features: [
                "Max 1m³ (4 kantong trashbag) / sekali angkut",
                "Pilih 4 hari kerja dari Senin – Sabtu",
                "Akses penuh Dashboard Aplikasi",
            ],
        },
        {
            name: "Paket Reguler",
            price: "2.500k",
            priceDetail: "Biaya mulai dari",
            pickup: "Maks. 4 Hari / Minggu",
            maxDays: 4,
            description: "Solusi pengolahan limbah untuk bisnis kecil dan menengah dengan jadwal pengambilan teratur.",
            features: [
                "Ideal untuk Kafe, Restoran atau bagian non-klinis RS",
                "Maks 4m³ / sekali angkut",
                "Pilih 4 hari kerja dari Senin – Sabtu",
                "Akses penuh Dashboard Aplikasi",
                "Sertifikat Mitra Ramah Lingkungan",
            ],
        },
        {
            name: "Paket Prime (Bisnis)",
            price: "3.200k",
            priceDetail: "Biaya mulai dari",
            pickup: "Maks. 6 Hari / Minggu",
            maxDays: 6,
            isFeatured: true,
            description: "Layanan pengolahan sampah prioritas untuk perusahaan yang fokus pada standar kebersihan tinggi.",
            features: [
                "Ideal untuk SPPG, Gudang, Hotel & operasional besar",
                "Maks 4m³ / sekali angkut",
                "Pilih hingga 6 hari kerja (Senin – Sabtu)",
                "Akses penuh Dashboard Aplikasi",
                "Sertifikat Mitra Ramah Lingkungan",
            ],
        },
        {
            name: "Paket Premium+",
            price: "4.499k",
            priceDetail: "Biaya mulai dari",
            pickup: "Maks. 6 Hari / Minggu",
            maxDays: 6,
            description: "Solusi pengelolaan limbah industri skala besar dengan sistem pelaporan audit yang mendalam.",
            features: [
                "Tanpa perlu pilah sampah",
                "Maks 4m³ / sekali angkut",
                "Pilih hingga 6 hari kerja (Senin – Sabtu)",
                "Akses penuh Dashboard Aplikasi",
                "Sertifikat Mitra Ramah Lingkungan",
            ],
        },
    ];
    return (
        <div className="bg-white min-h-screen font-sans selection:bg-lime-100">
            <SEO
                title="Harga Jasa Angkut Sampah & Pengolahan Limbah"
                description="Cari jasa angkut sampah terpercaya? WellTrash menyediakan layanan penjemputan sampah rumah tangga dan industri dengan harga terjangkau dan ramah lingkungan."
            />
            <Navbar />

            <section className="pt-40 pb-24 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-8">
                        Layanan <span className="text-lime-500 italic font-serif">Penjemputan</span> Sampah <br />
                        Terbaik & Terpercaya
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
                        Pilih paket yang sesuai dan atur hari penjemputan Anda — Senin hingga Sabtu, sesuai kebutuhan bisnis Anda.
                    </p>
                </div>
            </section>

            <section className="pb-40 px-6">
                <div className="max-w-[1440px] mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {packages.map((pkg, idx) => {
                            const isPremiumPlus = pkg.name.includes("Premium+");
                            return (
                                <div
                                    key={idx}
                                    className={`group relative flex flex-col rounded-[40px] p-8 transition-all duration-700 hover:-translate-y-2 ${
                                        isPremiumPlus
                                            ? "bg-slate-900 border-2 border-lime-500 shadow-2xl shadow-lime-500/20 text-white"
                                            : pkg.isFeatured
                                            ? "bg-white border-2 border-lime-500 shadow-2xl shadow-lime-500/10"
                                            : "bg-white border border-slate-100 hover:border-lime-200 shadow-sm hover:shadow-xl"
                                    }`}
                                >
                                    {(pkg.isFeatured || isPremiumPlus) && (
                                        <div
                                            className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-[9px] font-black uppercase tracking-[0.3em] px-5 py-1.5 rounded-full shadow-lg whitespace-nowrap ${
                                                isPremiumPlus ? "bg-slate-900 border border-lime-500" : "bg-lime-500 shadow-lime-500/30"
                                            }`}
                                        >
                                            {isPremiumPlus ? "Paket Eksklusif" : "Pilihan Populer"}
                                        </div>
                                    )}

                                    <div className="mb-6">
                                        <h3 className={`text-xl font-black leading-tight mb-3 transition-colors ${isPremiumPlus ? "text-white" : "text-slate-900 group-hover:text-lime-600"}`}>
                                            {pkg.name}
                                        </h3>
                                        <p className={`text-sm font-semibold leading-relaxed h-14 overflow-hidden ${isPremiumPlus ? "text-slate-400" : "text-slate-400"}`}>
                                            {pkg.description}
                                        </p>
                                    </div>

                                    <div className="mb-6">
                                        <p className={`text-xs font-black uppercase tracking-[0.2em] mb-2 ${isPremiumPlus ? "text-lime-500" : "text-slate-400"}`}>
                                            {pkg.priceDetail}
                                        </p>
                                        <div className="flex items-baseline gap-1.5">
                                            <span className={`text-xs font-bold ${isPremiumPlus ? "text-slate-500" : "text-slate-300"}`}>Rp</span>
                                            <span className={`text-4xl lg:text-5xl font-black tracking-tighter ${isPremiumPlus ? "text-white" : "text-slate-900"}`}>
                                                {pkg.price}
                                            </span>
                                        </div>
                                        <div className={`mt-3 flex items-center gap-2.5 px-4 py-2 rounded-2xl border w-fit ${isPremiumPlus ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-100"}`}>
                                            <svg className="w-3.5 h-3.5 text-lime-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className={`text-xs font-black uppercase tracking-widest ${isPremiumPlus ? "text-white" : "text-slate-900"}`}>
                                                {pkg.pickup}
                                            </span>
                                        </div>

                                        {/* Day Picker */}
                                        <DayPicker maxDays={pkg.maxDays} disabled={pkg.dayPickerDisabled} />
                                    </div>

                                    <div className={`w-full h-px mb-6 ${isPremiumPlus ? "bg-white/10" : "bg-slate-100"}`} />

                                    <ul className="space-y-4 mb-12 flex-grow">
                                        {pkg.features.map((feature, fIdx) => (
                                            <li key={fIdx} className="flex items-start gap-4">
                                                <div className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-lime-50 text-lime-600 flex items-center justify-center">
                                                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <span className={`text-sm font-bold leading-tight ${isPremiumPlus ? "text-slate-300" : "text-slate-600"}`}>
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    {pkg.name.includes("Request") ? (
                                        <a
                                            href="https://wa.me/62811988706?text=Halo%20WellTrash,%20saya%20tertarik%20dengan%20Paket%20Request%20(By%20Call)"
                                            target="_blank"
                                            rel="noreferrer"
                                            className={`w-full block py-4 rounded-2xl text-sm font-black uppercase tracking-wider text-center transition-all active:scale-[0.98] ${
                                                isPremiumPlus
                                                    ? "bg-lime-500 text-white hover:bg-lime-400 shadow-lg shadow-lime-500/30"
                                                    : pkg.isFeatured
                                                    ? "bg-lime-500 text-white hover:bg-lime-600 shadow-lg shadow-lime-500/20"
                                                    : "bg-slate-900 text-white hover:bg-lime-600"
                                            }`}
                                        >
                                            Hubungi WhatsApp
                                        </a>
                                    ) : (
                                        <Link
                                            href={route("register")}
                                            className={`w-full block py-4 rounded-2xl text-sm font-black uppercase tracking-wider text-center transition-all active:scale-[0.98] ${
                                                isPremiumPlus
                                                    ? "bg-lime-500 text-white hover:bg-lime-400 shadow-lg shadow-lime-500/30"
                                                    : pkg.isFeatured
                                                    ? "bg-lime-500 text-white hover:bg-lime-600 shadow-lg shadow-lime-500/20"
                                                    : "bg-slate-900 text-white hover:bg-lime-600"
                                            }`}
                                        >
                                            Pilih Paket
                                        </Link>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
            
            <section className="bg-white py-12 md:py-20 px-4 md:px-6">
  <div className="max-w-5xl mx-auto">

    {/* Header */}
    <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 md:mb-12 gap-3 md:gap-6">
      <h2 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight text-center">
        Kenapa <br />
        <span className="text-lime-500">Well<span className="text-amber-500">Trash?</span></span>
      </h2>
      <p className="text-xs font-semibold text-slate-400 leading-loose md:text-right text-center">
        Komitmen kami adalah <br /> lingkungan yang bersih & sehat.
      </p>
    </div>

    {/* Video dengan fade edges */}
    <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-slate-100">
      <video
        autoPlay={true}
        muted={true}
        loop={true}
        playsInline={true}
        className="w-full object-cover max-h-[220px] md:max-h-none"
        src={videoDemo}
      />

      {/* Fade bawah — selalu ada */}
      <div className="absolute inset-x-0 bottom-0 h-20 md:h-24 bg-gradient-to-t from-white to-transparent" />

      {/* Fade atas, kiri, kanan — hanya desktop */}
      <div className="hidden md:block absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white to-transparent" />
      <div className="hidden md:block absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent" />
      <div className="hidden md:block absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent" />
    </div>

  </div>
</section>

            <section className="py-40 px-6 bg-white text-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-lime-50/30 rounded-full blur-[140px] pointer-events-none" />
                <div className="max-w-3xl mx-auto relative z-10">
                    <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-10">
                        Mulai Hidup Bersih <br /> Bersama WellTrash.
                    </h2>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href={route("register")}
                            className="px-12 py-5 bg-none text-black border border-lime-500 font-black uppercase tracking-[0.2em] rounded-full hover:bg-lime-500 hover:shadow-2xl hover:text-white duration-500 text-[10px]"
                        >
                            Daftar Sekarang
                        </Link>
                        <button className="px-12 py-5 bg-white text-slate-900 font-black uppercase tracking-[0.2em] rounded-full border border-slate-100 hover:bg-slate-50 transition-all active:scale-[0.98] text-[10px]">
                            Hubungi Kami
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Services;
