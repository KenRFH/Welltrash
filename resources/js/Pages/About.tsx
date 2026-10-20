import React, { useRef, useEffect } from "react";
import { Link } from "@inertiajs/react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import SEO from "@/Components/SEO";
import { CtaBackgroundIllustration } from "@/Components/Illustrations/CtaBackgroundIllustration";
import videoHero from "@/assets/img/header_main_welltrash.mp4";

interface TeamMember {
    id: number;
    name: string;
    role: string;
    desc: string | null;
    image_path: string | null;
    order_num: number;
}

interface Props {
    teams?: TeamMember[];
}

const About: React.FC<Props> = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const heroRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!videoRef.current || !heroRef.current) return;
            if (window.innerWidth < 768) {
                videoRef.current.style.transform = "none";
                return;
            }
            const rect = heroRef.current.getBoundingClientRect();
            const offset = -rect.top * 0.35;
            videoRef.current.style.transform = `translateY(${offset}px)`;
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const coreValues = [
        {
            num: "01",
            title: "Kepatuhan & Integritas",
            desc: "Menjamin seluruh rantai penanganan limbah memiliki legalitas resmi, manifest terverifikasi, dan sesuai regulasi KLHK.",
        },
        {
            num: "02",
            title: "Keandalan Operasional",
            desc: "Jadwal ritase tepat waktu didukung armada resmi, personel ber-APD lengkap, dan pelacakan rute transparan.",
        },
        {
            num: "03",
            title: "Inovasi Sirkular",
            desc: "Mengubah residu organik menjadi pakan protein BSF & pupuk organik berkualitas, mengurangi beban TPA secara terukur.",
        },
        {
            num: "04",
            title: "Nilai Sosial & Komunitas",
            desc: "Memberdayakan tenaga kerja lokal Jember dengan standar keselamatan kerja modern dan upah yang layak.",
        },
    ];

    const stats = [
        { value: "85%+", label: "Rata-rata Material Recovery", sub: "Dari total timbulan mitra terpilah" },
        { value: "100%", label: "Manifest Legal & Tercatat", sub: "Sesuai audit kepatuhan lingkungan" },
        { value: "38+", label: "Mitra Bisnis & Institusi", sub: "Hotel, RS, manufaktur, dan F&B" },
        { value: "12 Ton", label: "Kapasitas Harian Fasilitas", sub: "WellTrash Farm MRF Jember" },
    ];

    return (
        <div className="bg-[#F8FAF8] min-h-screen font-sans text-ink selection:bg-lime selection:text-ink">
            <SEO 
                title="Tentang Kami - WellTrash" 
                description="Pelajari visi, misi, dan operasional WellTrash, pelopor manajemen limbah komersial dan ekonomi sirkular terpadu di Kabupaten Jember." 
            />
            <Navbar />

            {/* Editorial Page Header */}
            <section className="pt-36 md:pt-44 pb-16 md:pb-24 px-6 lg:px-12 border-b border-black/10 bg-white">
                <div className="max-w-[1440px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end">
                        <div className="lg:col-span-8">
                            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-sans font-bold text-ink tracking-tight leading-[1.05]">
                                Membangun ekosistem pengelolaan sampah{" "}
                                <span className="font-serif italic font-normal text-green-forest">
                                    berkelanjutan
                                </span>{" "}
                                di Jember.
                            </h1>
                        </div>
                        <div className="lg:col-span-4">
                            <p className="font-sans text-base sm:text-lg text-muted leading-relaxed">
                                WellTrash hadir sebagai mitra operasional limbah komersial dan industri non-B3, menggabungkan logistik terjadwal, pelaporan ESG akurat, serta pengolahan sirkular berbasis biokonversi.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Video Parallax Hero Section */}
            <section
                ref={heroRef}
                className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-green-deep border-b border-black/10"
            >
                <video
                    ref={videoRef}
                    src={videoHero}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute top-0 left-0 w-full h-[130%] object-cover object-center will-change-transform opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-deep/90 via-green-deep/30 to-transparent" />
                <div className="absolute bottom-6 left-6 md:left-12 right-6 md:right-12 z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 text-white">
                    <div>
                        <span className="font-mono text-xs uppercase tracking-wider text-lime block mb-1 font-semibold">
                            Fasilitas Operasional &amp; Armada
                        </span>
                        <p className="font-sans text-sm md:text-base font-medium max-w-xl text-white/90">
                            Pusat Daur Ulang Terpadu WellTrash Farm — Jl. Brawijaya, Jubung, Sukorambi, Kabupaten Jember.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-xs text-white/80">
                        <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
                        <span>OPERASIONAL AKTIF &amp; TERVERIFIKASI</span>
                    </div>
                </div>
            </section>

            {/* Operational Metrics Bar */}
            <section className="bg-white border-b border-black/10 py-12 md:py-16 px-6 lg:px-12">
                <div className="max-w-[1440px] mx-auto">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                        {stats.map((s, idx) => (
                            <div key={idx} className="border-l border-black/10 pl-6">
                                <span className="font-mono text-3xl sm:text-4xl lg:text-5xl font-bold text-green-forest tracking-tight block mb-2 tabular-nums">
                                    {s.value}
                                </span>
                                <h3 className="font-sans font-semibold text-sm sm:text-base text-ink mb-1">
                                    {s.label}
                                </h3>
                                <p className="font-sans text-xs text-muted leading-relaxed">
                                    {s.sub}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Profil Perusahaan / Cerita Kami */}
            <section className="py-20 md:py-28 px-6 lg:px-12">
                <div className="max-w-[1440px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
                        <div className="lg:col-span-5">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-bold text-ink tracking-tight leading-tight mb-6">
                                Dari inisiatif lokal menjadi partner{" "}
                                <span className="font-serif italic font-normal text-green-forest">
                                    keberlanjutan korporat.
                                </span>
                            </h2>
                            <p className="font-sans text-base text-muted leading-relaxed mb-6">
                                Didirikan di bawah naungan PT Sarana Utama Welltrash Farm, kami bertekad menjawab krisis pengelolaan sampah di kawasan Jawa Timur bagian timur melalui pendekatan yang transparan, modern, dan bernilai ekonomis.
                            </p>
                            <p className="font-sans text-base text-muted leading-relaxed">
                                Guna meminimalkan residu ke tempat pemrosesan akhir (TPA), kami mengintegrasikan rantai pasok pemilahan hulu di fasilitas mitra dengan proses biokonversi maggot BSF dan daur ulang polimer di hilir.
                            </p>
                        </div>

                        <div className="lg:col-span-7">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {coreValues.map((val) => (
                                    <div
                                        key={val.num}
                                        className="bg-white border border-black/10 rounded-sm p-6 sm:p-8 hover:border-green-forest/40 transition-colors duration-200"
                                    >
                                        <span className="font-mono text-xs text-muted block mb-4">
                                            // {val.num}
                                        </span>
                                        <h3 className="font-sans font-semibold text-lg text-ink mb-2">
                                            {val.title}
                                        </h3>
                                        <p className="font-sans text-sm text-muted leading-relaxed">
                                            {val.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Visi & Misi Section */}
            <section className="bg-green-deep text-white py-20 md:py-28 px-6 lg:px-12 border-y border-white/10">
                <div className="max-w-[1440px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                        {/* Visi */}
                        <div className="lg:col-span-5">
                            <h3 className="font-sans font-bold text-lg text-lime mb-6 tracking-tight">
                                Visi Perusahaan
                            </h3>
                            <blockquote className="font-serif italic text-2xl sm:text-3xl lg:text-4xl text-white font-normal leading-relaxed mb-6">
                                &ldquo;Menjadi perusahaan pengelolaan limbah yang bertanggung jawab, inovatif, dan berkelanjutan dalam menciptakan lingkungan yang bersih serta bernilai bagi masyarakat.&rdquo;
                            </blockquote>
                            <p className="font-sans text-sm text-paper/80 leading-relaxed">
                                Menjadikan setiap ton sampah komersial terkelola sebagai katalis perubahan positif menuju ekonomi sirkular Jawa Timur.
                            </p>
                        </div>

                        {/* Misi */}
                        <div className="lg:col-span-7 lg:border-l lg:border-white/10 lg:pl-16">
                            <h3 className="font-sans font-bold text-lg text-lime mb-8 tracking-tight">
                                Misi Utama
                            </h3>
                            <div className="space-y-8">
                                {[
                                    {
                                        step: "01",
                                        title: "Konsep Green Business Terukur",
                                        body: "Menjalankan tata kelola lingkungan terintegrasi dengan standar operasional zero-spill dan kepatuhan hukum penuh.",
                                    },
                                    {
                                        step: "02",
                                        title: "Pelaporan Data Kredibel untuk ESG",
                                        body: "Menyajikan pencatatan tonase limbah berkala yang transparan untuk mendukung laporan audit keberlanjutan mitra bisnis.",
                                    },
                                    {
                                        step: "03",
                                        title: "Pemberdayaan Sosial & Ekonomi",
                                        body: "Mengubah residu organik menjadi sumber ekonomi baru melalui biokonversi maggot BSF yang memberi manfaat bagi komunitas lokal.",
                                    },
                                ].map((m) => (
                                    <div key={m.step} className="flex gap-6 items-start">
                                        <span className="font-mono text-sm text-lime border border-lime/30 px-2.5 py-1 rounded-sm shrink-0">
                                            {m.step}
                                        </span>
                                        <div>
                                            <h3 className="font-sans font-semibold text-lg text-white mb-1.5">
                                                {m.title}
                                            </h3>
                                            <p className="font-sans text-sm text-paper/75 leading-relaxed">
                                                {m.body}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA Section - Lime Background as per design.md */}
            <section className="bg-lime text-green-deep py-20 md:py-28 px-6 lg:px-12 relative overflow-hidden">
                <CtaBackgroundIllustration />
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-bold text-green-deep tracking-tight leading-tight mb-6">
                        Mulai Transformasi Pengelolaan Limbah Bisnis Anda
                    </h2>
                    <p className="font-sans text-base sm:text-lg text-green-deep/90 max-w-2xl mx-auto leading-relaxed mb-10">
                        Konsultasikan timbulan sampah fasilitas Anda bersama spesialis kami. Dapatkan asesmen volume, jadwal ritase teratur, dan kepatuhan ESG lengkap.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href={route("login")}
                            className="w-full sm:w-auto px-8 py-3.5 bg-green-deep text-white hover:bg-black font-sans font-semibold text-sm rounded-sm transition-colors duration-200 tracking-tight"
                        >
                            Jadwalkan Konsultasi Gratis
                        </Link>
                        <Link
                            href={route("services")}
                            className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-green-deep/30 text-green-deep hover:border-green-deep font-sans font-semibold text-sm rounded-sm transition-colors duration-200 tracking-tight"
                        >
                            Pelajari Skema Layanan
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default About;
