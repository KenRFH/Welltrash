import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import React, { useRef, useEffect } from "react";
import { Link } from "@inertiajs/react";
import SEO from "@/Components/SEO";

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
    teams: TeamMember[];
}

const About = ({ teams = [] }: Props) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const heroRef = useRef<HTMLElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);

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
            <div className="md:hidden block bg-white mx-auto h-24"></div>
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
                                <h2 className="text-sm italic font-black text-white bg-lime-500 p-4">Visi Kami</h2>
                            </div>
                            <p className="text-3xl lg:text-4xl font-thin text-gray-900 leading-tight tracking-wide">
                               “Menjadi perusahaan pengelolaan limbah yang bertanggung jawab, inovatif, dan berkelanjutan dalam menciptakan lingkungan yang bersih serta bernilai bagi masyarakat”
                            </p>
                        </div>
                        <div>
                            <div className="flex items-center gap-4 mb-8">
                                <h2 className="text-md font-old text-amber-500">Misi Kami</h2>
                            </div>
                            <ul className="space-y-8">
                                {[
                                    "Menjalankan konsep green business di dalam manajemen lingkungan hidup",
                                    "Menyajikan pelaporan data secara rutin yang kredibel untuk mendukung inisiatif Environmental, Social, and Governance (ESG) mitra bisnis.",
                                    "Menjadikan pengelolaan limbah sebagai sumber ekonomi yang mampu memberikan manfaat dan kesejahteraan bagi tim serta masyarakat. (Social Value)"
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

            {/* Tim Kopasus Slider */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                        <div>
                            <h2 className="text-4xl lg:text-5xl font-thin text-gray-900 uppercase tracking-wide">Tim Kopasus</h2>
                        </div>
                        
                        {/* Navigation Arrows */}
                        <div className="flex gap-3">
                            <button 
                                onClick={() => {
                                    if (sliderRef.current) {
                                        sliderRef.current.scrollBy({ left: -380, behavior: 'smooth' });
                                    }
                                }}
                                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300 focus:outline-none"
                                aria-label="Previous slide"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                </svg>
                            </button>
                            <button 
                                onClick={() => {
                                    if (sliderRef.current) {
                                        sliderRef.current.scrollBy({ left: 380, behavior: 'smooth' });
                                    }
                                }}
                                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300 focus:outline-none"
                                aria-label="Next slide"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Slider Container */}
                    <div 
                        ref={sliderRef}
                        className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 scroll-smooth -mx-6 px-6 md:-mx-8 md:px-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {teams.length > 0 ? (
                            teams.map((person) => (
                                <div 
                                    key={person.id} 
                                    className="snap-start shrink-0 w-[290px] md:w-[360px] bg-white border border-gray-100 rounded-3xl p-6 hover:shadow-2xl hover:shadow-gray-100 transition-all duration-500 group"
                                >
                                    {/* Photo Container */}
                                    <div className="w-full aspect-[4/5] bg-gray-50 rounded-2xl overflow-hidden mb-6 relative">
                                        {person.image_path ? (
                                            <img 
                                                src={`/storage/${person.image_path}`} 
                                                alt={person.name} 
                                                loading="lazy" 
                                                decoding="async" 
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                                                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Info */}
                                    <h3 className="text-xl font-normal text-gray-900 mb-1 group-hover:text-[#7CC13B] transition-colors duration-300">{person.name}</h3>
                                    <p className="text-[#FE961C] text-xs font-semibold tracking-[0.15em] mb-4 uppercase">{person.role}</p>
                                    <p className="text-gray-400 text-sm font-light leading-relaxed">{person.desc}</p>
                                </div>
                            ))
                        ) : (
                            <div className="py-12 text-center text-gray-500 w-full">
                                Belum ada anggota tim Kopasus yang terdaftar.
                            </div>
                        )}
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
