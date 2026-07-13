import Navbar from "@/Components/Navbar";
import imgHero from "@/assets/img/karyawanWelltrash.webp";
import React, { useState } from "react";
import Why from "@/Components/Why";
import Mitra from "@/Components/Mitra";
import WasteFlow from "@/Components/WasteFlow";
import Footer from "@/Components/Footer";
import { Link } from "@inertiajs/react";
import SEO from "@/Components/SEO";

interface Activity {
    id: number;
    title: string;
    description: string;
    image_path: string | null;
    date: string | null;
}
interface NewsItem {
    id: number;
    title: string;
    content: string;
    image_path: string | null;
    published_date: string | null;
}
interface KatalogItem {
    id: number;
    name: string;
    description: string;
    price: number | null;
    image_path: string | null;
}
interface Props {
    activities: Activity[];
    news: NewsItem[];
    katalogs: KatalogItem[];
}

function fmt(d: string | null) {
    if (!d) return null;
    return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

const Welcome = ({ activities, news, katalogs }: Props) => {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqItems = [
        {
            q: "Apa itu WellTrash?",
            a: "WellTrash adalah platform layanan pengelolaan limbah digital pertama di Jember yang mengusung konsep ekonomi sirkular. Kami menyediakan solusi pengangkutan sampah terjadwal dan terpadu untuk rumah tangga, institusi, hingga sektor bisnis/industri di Kabupaten Jember."
        },
        {
            q: "Wilayah mana saja yang dilayani oleh WellTrash?",
            a: "Saat ini, WellTrash melayani seluruh wilayah Kabupaten Jember. Kami mencakup area perumahan, perkantoran, kafe, restoran, instansi pemerintah, hingga sektor komersial/industri."
        },
        {
            q: "Bagaimana cara berlangganan jasa pengangkutan sampah WellTrash?",
            a: "Anda dapat mendaftar langsung secara online dengan mengklik tombol 'Pesan Layanan Sekarang', mengisi data profil, memilih jadwal penjemputan berkala yang sesuai, serta mengunggah kelengkapan berkas MOU kerja sama untuk memulai."
        },
        {
            q: "Apakah WellTrash mendukung inisiatif ESG perusahaan?",
            a: "Ya, kami sepenuhnya mendukung pemenuhan ESG (Environmental, Social, and Governance) mitra bisnis melalui sistem pencatatan volume limbah yang kredibel, serta menyajikan laporan pelacakan sampah secara rutin dan transparan."
        },
        {
            q: "Apa saja paket layanan pengangkutan sampah yang tersedia?",
            a: "Kami menyediakan paket layanan yang fleksibel sesuai kebutuhan Anda, mulai dari paket Reguler, Prime, hingga Premium+ dengan kapasitas frekuensi penjemputan berkala hingga 6 hari dalam seminggu."
        },
        {
            q: "Bagaimana sampah diolah setelah diangkut oleh tim WellTrash?",
            a: "Sampah yang diangkut oleh tim profesional kami dibawa ke fasilitas WellTrash Farm untuk dipilah, diolah menjadi produk daur ulang bernilai ekonomi, dan meminimalkan residu sampah yang terbuang langsung ke TPA."
        }
    ];

    return (
        <>
            <SEO 
                title="Jasa Pengangkutan Sampah Jember" 
                description="Layanan jasa pengangkutan sampah profesional dan terpercaya di Jember. Solusi kebersihan hemat & cepat untuk rumah tangga hingga bisnis. Pesan WellTrash sekarang!" 
            />
            <Navbar />

            <section className="relative w-full min-h-screen flex items-center bg-white mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="space-y-4 font-poppins">
                                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
                                    Jasa Pengangkutan{" "}
                                    <span className="bg-clip-text text-transparent bg-gradient-to-br from-green-500 to-green-600">
                                        Sampah{" "}
                                        <span className="text-[#FF9A0C]">Profesional</span>
                                    </span>
                                    <span className="text-pink-400">{" "}se-Jember</span>
                                </h1>
                                <p className="text-lg text-gray-600 max-w-lg">
                                    <span className="font-bold text-lime-500">Welltrash</span> hadir sebagai penyedia jasa pengangkutan
                                    sampah profesional dan terpercaya yang melayani
                                    seluruh wilayah Kabupaten Jember. Layanan terjadwal,
                                    cepat, dan ramah lingkungan untuk kebutuhan
                                    pengelolaan sampah rumah tangga dan perusahaan Anda.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <Link href={route("login")}
                                    className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full transition-all shadow-lg shadow-green-600/30 flex items-center gap-2 group duration-500">
                                    Pesan Layanan Sekarang
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                                <Link href={route("services")}
                                    className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-full border border-gray-200 transition-all shadow-sm">
                                    Lihat Layanan
                                </Link>
                            </div>

                            <div className="pt-8 flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex -space-x-3">
                                    {["SPPG", "Daf", "Res"].map((label, i) => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600"
                                            style={{ backgroundColor: `hsl(0,0%,${75 - i * 8}%)` }}>
                                            {label}
                                        </div>
                                    ))}
                                </div>
                                <p>Dipercaya <span className="font-bold text-gray-800">30+ Mitra di Jember</span></p>
                            </div>
                        </div>

                        <div className="relative w-full max-w-md mx-auto lg:max-w-lg">
                            <div className="absolute inset-0 -z-10 flex items-center justify-center">
                                <div className="w-[110%] h-[110%] bg-gradient-to-tr from-blue-200/40 to-purple-300/40 rounded-full blur-3xl" />
                            </div>
                            <div className="relative rounded-lg overflow-hidden shadow-2xl bg-white border border-gray-200">
                                <div className="aspect-[4/5] overflow-hidden">
                                    <img src={imgHero}
                                        alt="Jasa Pengangkutan Sampah Profesional Kabupaten Jember - Welltrash"
                                        fetchPriority="high"
                                        loading="eager"
                                        decoding="sync"
                                        className="w-full h-full object-cover transition-transform duration-700" />
                                </div>
                                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md px-5 py-4 rounded-lg shadow-lg border border-gray-200 max-w-[220px]">
                                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Telah Mengelola</p>
                                    <h4 className="text-2xl font-bold text-lime-500">8000 Kg+</h4>
                                    <p className="text-xs text-gray-600 mt-1">Sampah di Jember</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Why />
            <WasteFlow />

            <section className="py-24 bg-white relative overflow-hidden md:min-h-screen">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                        <div className="max-w-2xl -mt-17">
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                                Aksi & <span className="text-lime-500">Kegiatan</span>
                            </h2>
                            <p className="text-gray-500 mt-4 text-lg font-medium">Inisiatif kami di lapangan untuk menciptakan lingkungan Jember yang lebih bersih dan berkelanjutan.</p>
                        </div>
                        <Link href={route("activity")} className="hidden md:inline-flex group items-center gap-2 text-sm font-bold text-gray-900 border-2 border-gray-100 hover:bg-lime-600 hover:text-white px-8 py-3.5 rounded-full transition-all hover:shadow-lg hover:shadow-[#7CC13B]/20 bg-white duration-500 ">
                            Eksplorasi Semua
                            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>

                    {activities.length === 0 ? (
                        <div className="py-16 bg-gray-50 text-center rounded-[2rem] border border-dashed border-gray-200">
                            <p className="text-gray-500 font-medium">Belum ada aktivitas.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                            {/* Featured (1st item) */}
                            {activities[0] && (
                                <Link href={route("activity.show", activities[0].id)} className="lg:col-span-7 lg:row-span-2 group relative rounded-md overflow-hidden min-h-[400px] lg:min-h-[600px] flex items-end shadow-lg hover:shadow-2xl hover:shadow-[#7CC13B]/20 transition-all duration-500">
                                    <div className="absolute inset-0">
                                        {activities[0].image_path ? (
                                            <img src={`/storage/${activities[0].image_path}`} alt={activities[0].title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
                                        )}
                                        {/* Gradient overlay for readability */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>
                                    <div className="relative p-8 md:p-12 w-full transform transition-transform duration-500 group-hover:-translate-y-2">
                                        <div className="flex flex-wrap gap-3 mb-5">
                                            <span className="inline-block px-4 py-1.5 rounded-full bg-[#7CC13B] text-white text-xs font-black tracking-wide shadow-sm">TERBARU</span>
                                            {activities[0].date && <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold">{fmt(activities[0].date)}</span>}
                                        </div>
                                        <h3 className="text-3xl md:text-4xl font-black text-white group-hover:text-[#FE961C] transition-colors leading-tight mb-4">{activities[0].title}</h3>
                                        <p className="text-gray-300 line-clamp-2 md:line-clamp-3 max-w-xl text-sm md:text-base leading-relaxed">{activities[0].description}</p>
                                        
                                        <div className="mt-8 flex items-center gap-2 text-sm font-bold text-white opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                            Baca selengkapnya
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </div>
                                    </div>
                                </Link>
                            )}

                            {/* Remaining items (up to 2) */}
                            <div className="lg:col-span-5 flex flex-col gap-6 lg:gap-8">
                                {activities.slice(1, 3).map((a, i) => (
                                    <Link key={a.id} href={route("activity.show", a.id)} className="group relative rounded-md bg-white border border-gray-100 overflow-hidden flex flex-row sm:flex-col items-center sm:items-start hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 hover:-translate-y-1 h-full">
                                        <div className="relative w-2/5 sm:w-full h-full sm:h-48 overflow-hidden shrink-0">
                                            {a.image_path ? (
                                                <img src={`/storage/${a.image_path}`} alt={a.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                            ) : (
                                                <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                                                    <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                            {/* Accent colored bar on left/top */}
                                            <div className={`absolute top-0 left-0 w-1.5 sm:w-full h-full sm:h-1.5 ${i === 0 ? 'bg-[#FE961C]' : 'bg-[#7CC13B]'}`} />
                                        </div>
                                        <div className="p-5 sm:p-7 flex flex-col flex-1 justify-center w-full">
                                            <div className="flex items-center justify-between mb-3">
                                                {a.date && <span className="text-xs font-bold text-gray-400">{fmt(a.date)}</span>}
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 group-hover:bg-white group-hover:shadow-md transition-all ${i === 0 ? 'group-hover:text-[#FE961C]' : 'group-hover:text-[#7CC13B]'} text-gray-400 hidden sm:flex`}>
                                                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-[-45deg]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <h3 className="text-lg sm:text-xl font-black text-gray-900 group-hover:text-[#7CC13B] transition-colors mb-2 line-clamp-2">{a.title}</h3>
                                            <p className="text-gray-500 line-clamp-2 text-sm leading-relaxed">{a.description}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <div className="mt-10 md:hidden flex justify-center">
                        <Link href={route("activity")} className="inline-flex items-center gap-2 text-sm font-bold text-white bg-gray-900 px-8 py-3.5 rounded-full shadow-lg">
                            Eksplorasi Semua
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-gray-50 md:min-h-screen">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Berita & Artikel</h2>
                            <p className="text-gray-500 mt-2 font-medium">Informasi terbaru seputar lingkungan</p>
                        </div>
                        <Link href={route("news")} className="inline-flex items-center gap-2 text-sm font-bold text-[#7CC13B] hover:text-green-700 transition-colors">
                            Lihat semua berita
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>

                    {news.length === 0 ? (
                        <p className="text-gray-500 py-10 font-medium">Belum ada berita.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {news.map((item) => (
                                <Link key={item.id} href={route("news.show", item.id)} className="group flex flex-col bg-white rounded-md p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                    <div className="relative aspect-[16/10] rounded-md overflow-hidden bg-gray-100 mb-5">
                                        {item.image_path ? (
                                            <img src={`/storage/${item.image_path}`} alt={item.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col">
                                        {item.published_date && <p className="text-sm text-gray-400 mb-2 font-medium">{fmt(item.published_date)}</p>}
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#7CC13B] transition-colors line-clamp-2 mb-2">{item.title}</h3>
                                        <p className="text-gray-600 line-clamp-2 leading-relaxed flex-1">{item.content}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="md:min-h-screen py-24 relative overflow-hidden rounded-t-[1.2rem] " style={{ backgroundColor: "#0D1520" }}>
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "48px 48px" }} />

                <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="h-px w-8" style={{ background: "#7CC13B" }} />
                                <p className="text-xs font-black tracking-[0.4em] uppercase" style={{ color: "#7CC13B" }}>
                                    Produk Daur Ulang
                                </p>
                            </div>
                            <h2 className="text-5xl font-black leading-tight" style={{ color: "#F0F4FF" }}>
                                Katalog Produk<br />
                                <em className="not-italic" style={{ color: "#FE961C" }}>Welltrash</em>
                            </h2>
                            <p className="mt-4 max-w-md text-sm leading-relaxed" style={{ color: "rgba(240,244,255,0.4)" }}>
                                Produk hasil daur ulang berkualitas tinggi — dari bahan baku hingga produk siap pakai dari Kabupaten Jember.
                            </p>
                        </div>
                        <Link href={route("katalog")}
                            className="self-start md:self-end inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold transition-all border"
                            style={{ borderColor: "rgba(124,193,59,0.4)", color: "#7CC13B" }}>
                            Lihat Semua Katalog
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>

                    {katalogs.length === 0 ? (
                        <p className="py-16 text-center font-bold" style={{ color: "rgba(255,255,255,0.1)" }}>Belum ada katalog.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "rgba(255,255,255,0.05)" }}>
                            {katalogs.map((item) => (
                                <Link key={item.id} href={route("katalog")}
                                    className="group relative flex flex-col bg-[#0D1520] hover:bg-[#141F35] transition-colors duration-300 p-6"
                                    aria-label={`Produk Welltrash: ${item.name} | Daur Ulang Sampah Jember`}>
                                    <div className="aspect-square rounded-2xl overflow-hidden mb-5" style={{ backgroundColor: "#0A1020" }}>
                                        {item.image_path
                                            ? <img src={`/storage/${item.image_path}`}
                                                alt={`Produk Welltrash - ${item.name} | Daur Ulang Sampah Jember`}
                                                loading="lazy"
                                                decoding="async"
                                                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-700" />
                                            : <div className="w-full h-full flex items-center justify-center">
                                                <svg className="w-12 h-12" style={{ color: "rgba(255,255,255,0.05)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                </svg>
                                              </div>
                                        }
                                    </div>
                                    <h3 className="font-black text-base mb-1 group-hover:text-[#FE961C] transition-colors duration-300"
                                        style={{ color: "#F0F4FF" }}>
                                        {item.name}
                                    </h3>
                                    <p className="text-sm line-clamp-2 leading-relaxed flex-1 mb-4"
                                        style={{ color: "rgba(240,244,255,0.35)" }}>
                                        {item.description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        {item.price
                                            ? <span className="text-sm font-black" style={{ color: "#FE961C" }}>
                                                Rp {Number(item.price).toLocaleString("id-ID")}
                                              </span>
                                            : <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#7CC13B" }}>
                                                Harga bervariasi
                                              </span>
                                        }
                                        <span className="text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ color: "#7CC13B" }}>
                                            Lihat →
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Mitra />

            {/* FAQ SEO Section */}
            <section className="py-24 bg-white relative overflow-hidden">
                {/* JSON-LD Schema markup for Google Rich Snippets */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            "mainEntity": faqItems.map(item => ({
                                "@type": "Question",
                                "name": item.q,
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": item.a
                                }
                            }))
                        })
                    }}
                />

                <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                            FAQ Pengangkutan <span className="text-[#FE961C]">Sampah Jember</span>
                        </h2>
                        <p className="text-gray-500 mt-4 text-base font-light max-w-2xl mx-auto leading-relaxed">
                            Temukan jawaban lengkap atas pertanyaan umum mengenai layanan jasa pengangkut sampah profesional, tata cara berlangganan, serta pengolahan limbah daur ulang dari WellTrash.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {faqItems.map((item, idx) => {
                            const isOpen = openFaq === idx;
                            return (
                                <div
                                    key={idx}
                                    className="border border-gray-100 rounded-2xl bg-white hover:border-gray-200 transition-all duration-300 shadow-sm"
                                >
                                    <button
                                        type="button"
                                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                                        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                                        aria-expanded={isOpen}
                                    >
                                        <span className="text-lg font-bold text-gray-900 pr-4 group-hover:text-[#7CC13B] transition-colors">
                                            {item.q}
                                        </span>
                                        <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-[#7CC13B]/10 text-[#7CC13B]' : ''}`}>
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                            </svg>
                                        </span>
                                    </button>
                                    
                                    <div
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[300px] border-t border-gray-50' : 'max-h-0'}`}
                                    >
                                        <div className="px-6 py-5 text-gray-600 text-sm leading-relaxed font-light">
                                            {item.a}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
};

export default Welcome;
