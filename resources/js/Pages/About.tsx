import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import React, { useRef, useEffect } from "react";
import { Link } from "@inertiajs/react";
import SEO from "@/Components/SEO";

import videoHero from "@/assets/img/header_main_welltrash.mp4";

import imgProfileDirektur from "@/assets/img/profile_Direktur.webp";
import imgProfileHarry from "@/assets/img/profile_Andik.webp";
import imgProfileAndik from "@/assets/img/profile_Andik.webp";
import imgProfileKen from "@/assets/img/profile_Ken.webp";

const About = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const heroRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!videoRef.current || !heroRef.current) return;
            // Use getBoundingClientRect to track section position relative to viewport
            const rect = heroRef.current.getBoundingClientRect();
            // rect.top is negative as section scrolls up — use it to move video downward
            if (window.innerWidth < 768) {
                videoRef.current.style.transform = 'none';
                return;
            }
            const offset = -rect.top * 0.4; // 40% parallax speed
            videoRef.current.style.transform = `translateY(${offset}px)`;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // run once on mount
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="bg-white min-h-screen font-outfit font-light selection:bg-[#7CC13B]/20 selection:text-gray-900">
            <SEO 
                title="Tentang Kami - WellTrash" 
                description="Pelajari lebih lanjut tentang WellTrash, pelopor manajemen limbah digital di Jember yang mewujudkan ekonomi sirkular." 
            />
            <Navbar />

            {/* Video Parallax Hero Section */}
            <section
                ref={heroRef}
                className="relative w-full aspect-video md:aspect-auto md:h-screen overflow-hidden bg-slate-900 flex items-center justify-center"
            >
                <video
                    ref={videoRef}
                    src={videoHero}
                    autoPlay={true}
                    muted={true}
                    loop={true}
                    playsInline={true}
                    className="absolute md:top-[-20%] top-0 left-0 w-full md:h-[140%] h-full object-cover object-center will-change-transform"
                />
            </section>

            {/* Profil Perusahaan */}
            <section className="overflow-hidden z-10 py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                        <div>
                            <h2 className="text-3xl lg:text-5xl font-thin text-gray-900 leading-tight tracking-wider uppercase mb-8">
                                Ekonomi Sirkular di <span className="text-[#7CC13B] font-normal">Jember</span>
                            </h2>
                            <div className="space-y-6 text-gray-500 text-lg leading-relaxed font-light">
                                <p>
                                    PT Sarana Utama Welltrash Farm didirikan dengan visi untuk mentransformasi cara perusahaan dan fasilitas komersial mengelola limbah mereka. Kami memahami bahwa manajemen sampah sering kali menjadi tantangan operasional yang kompleks.
                                </p>
                                <p>
                                    Dengan pendekatan End-to-End Waste Management, kami memastikan bahwa setiap proses—dari penjemputan hingga pemrosesan akhir—dilakukan secara transparan, mudah dilacak, dan sepenuhnya mematuhi regulasi lingkungan hidup (ESG) di Indonesia.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-px bg-gray-100 border border-gray-100 mt-4 lg:mt-0">
                            {[
                                { title: "Terjadwal", desc: "Penjemputan rutin sesuai SLA", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
                                { title: "Efisien", desc: "Sistem logistik pintar", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
                                { title: "Transparan", desc: "Laporan data real-time", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
                                { title: "Kepatuhan", desc: "Standar regulasi LH", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" }
                            ].map((item, i) => (
                                <div key={i} className="p-8 bg-white hover:bg-gray-50 transition-colors flex flex-col justify-center">
                                    <svg className="w-8 h-8 text-[#7CC13B] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                    </svg>
                                    <h3 className="text-xl font-normal text-gray-900 mb-2 uppercase tracking-wide">{item.title}</h3>
                                    <p className="text-gray-400 text-sm font-light">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Visi Misi */}
            <section className="py-24 bg-gray-50 border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                        <div>
                            <div className="flex items-center gap-4 mb-8">
                                <span className="h-px w-12 bg-[#FE961C]" />
                                <h2 className="text-sm font-normal tracking-[0.3em] uppercase text-[#FE961C]">Visi Kami</h2>
                            </div>
                            <p className="text-3xl lg:text-4xl font-thin text-gray-900 leading-tight tracking-wide">
                                Menjadi platform kolaboratif nomor satu di Indonesia yang mengintegrasikan kecerdasan logistik dan prinsip ekonomi sirkular untuk mewujudkan lanskap industri masa depan yang <span className="text-[#7CC13B] font-normal">Zero Waste to Landfill</span>.
                            </p>
                        </div>
                        <div>
                            <div className="flex items-center gap-4 mb-8">
                                <span className="h-px w-12 bg-[#7CC13B]" />
                                <h2 className="text-sm font-normal tracking-[0.3em] uppercase text-[#7CC13B]">Misi Kami</h2>
                            </div>
                            <ul className="space-y-8">
                                {[
                                    "Menyediakan solusi B2B yang hemat waktu, praktis, dan dapat diandalkan setiap harinya.",
                                    "Menyajikan pelaporan data secara rutin yang kredibel untuk mendukung inisiatif Environmental, Social, and Governance (ESG) mitra bisnis.",
                                    "Mendorong recovery rate sampah yang dapat didaur ulang bersama jaringan fasilitas pengolahan."
                                ].map((misi, i) => (
                                    <li key={i} className="flex gap-6 items-start">
                                        <div className="shrink-0 w-12 h-12 flex items-center justify-center border border-gray-200 text-lg font-thin text-black">
                                            0{i + 1}
                                        </div>
                                        <p className="text-lg text-gray-500 leading-relaxed font-light pt-2">{misi}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Struktur Organisasi */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl lg:text-5xl font-thin text-gray-900 tracking-wider uppercase">Struktur Organisasi</h2>
                    </div>

                    <div className="max-w-5xl mx-auto">
                        <div className="flex flex-col items-center relative">
                            {/* Level 1 */}
                            <div className="w-full max-w-[300px] p-8 bg-white border border-gray-400 text-center mb-10 relative z-10 hover:border-[#7CC13B] transition-colors">
                                <div className="w-28 h-28 mx-auto bg-gray-100 mb-6 overflow-hidden">
                                    <img src={imgProfileDirektur} alt="Direktur Utama" loading="lazy" decoding="async" className="w-full h-full object-cover transition-all duration-500" />
                                </div>
                                <h3 className="text-xl font-normal text-gray-900 uppercase tracking-wide">Direktur Utama</h3>
                                <p className="text-[#FE961C] text-xs font-normal tracking-[0.2em] mt-2 uppercase">Mashudi</p>
                            </div>

                            {/* Connecting Line Vertical */}
                            <div className="w-px h-10 bg-gray-400 hidden md:block" />
                            {/* Connecting Line Horizontal */}
                            <div className="w-[calc(100%-33%)] h-px bg-gray-400 hidden md:block" />

                            {/* Level 2 */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 w-full">
                                {[
                                    { name: "Bag. Humas & Kesekretariatan", role: "Harry", img: imgProfileHarry },
                                    { name: "Bag. Oprasional", role: "Andik", img: imgProfileAndik },
                                    { name: "Bag. Teknologi Informasi", role: "Ken", img: imgProfileKen },
                                ].map((person, i) => (
                                    <div key={i} className="relative flex flex-col items-center">
                                        <div className="w-px h-10 bg-gray-400 absolute -top-10 hidden md:block" />
                                        <div className="w-full p-8 bg-white border border-gray-400 text-center hover:border-gray-300 transition-colors relative z-10">
                                            <div className="w-20 h-20 mx-auto bg-gray-100 mb-5 overflow-hidden">
                                                <img src={person.img} alt={person.name} loading="lazy" decoding="async" className="w-full h-full object-cover transition-all duration-500" />
                                            </div>
                                            <h3 className="text-lg font-normal text-gray-900 leading-tight mb-2">{person.name}</h3>
                                            <p className="text-gray-400 text-xs font-light tracking-[0.2em]">{person.role}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-[#0E172A] relative overflow-hidden rounded-t-[2rem]">
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
                
                <div className="relative z-10 max-w-3xl mx-auto px-6 text-center text-white">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-8 font-outfit">
                        Mulai Transformasi <span className="text-white font-outfit italic bg-lime-500 px-4 py-1 rounded-lg">Hijau</span> Anda
                    </h2>
                    <p className="text-gray-400 text-lg lg:text-xl mb-12 leading-relaxed font-light tracking-wide">
                        Bergabunglah bersama mitra-mitra kami untuk mengelola limbah dengan cara yang lebih pintar, transparan, dan efisien.
                    </p>
                    <Link
                        href={route("login")}
                        className="inline-flex items-center justify-center px-12 py-4 bg-transparent border border-[#7CC13B] text-[#7CC13B] hover:bg-[#7CC13B] hover:text-white font-normal transition-all duration-300 rounded-lg font-outfit font-bold"
                    >
                        Mulai Bermitra
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default About;
