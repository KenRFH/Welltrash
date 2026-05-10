import Navbar from "@/Components/Navbar";
import imgHero from "@/assets/img/imgHero.png";
import React from "react";
import Why from "@/Components/Why";
import Mitra from "@/Components/Mitra";
import WasteFlow from "@/Components/WasteFlow";
import Footer from "@/Components/Footer";
import { Link } from "@inertiajs/react";

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
    return (
        <>
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
                                <Link href={route("about")}
                                    className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-full border border-gray-200 transition-all shadow-sm">
                                    Pelajari Lebih Lanjut
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
                                <p>Dipercaya <span className="font-bold text-gray-800">10+ Mitra di Jember</span></p>
                            </div>
                        </div>

                        <div className="relative w-full max-w-md mx-auto lg:max-w-lg">
                            <div className="absolute inset-0 -z-10 flex items-center justify-center">
                                <div className="w-[110%] h-[110%] bg-gradient-to-tr from-blue-200/40 to-purple-300/40 rounded-full blur-3xl" />
                            </div>
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white border border-gray-200">
                                <div className="aspect-[4/5] overflow-hidden">
                                    <img src={imgHero}
                                        alt="Jasa Pengangkutan Sampah Profesional Kabupaten Jember - Welltrash"
                                        className="w-full h-full object-cover transition-transform duration-700" />
                                </div>
                                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md px-5 py-4 rounded-2xl shadow-lg border border-gray-200 max-w-[220px]">
                                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Efisiensi Pengelolaan</p>
                                    <h4 className="text-2xl font-bold text-gray-900">Up to 20x</h4>
                                    <p className="text-xs text-gray-600 mt-1">Cepat, Bersih &amp; Terjadwal</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Why />
            <WasteFlow />

            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex items-center gap-4 mb-16">
                        <span className="h-px flex-1 max-w-[60px]" style={{ background: "#7CC13B" }} />
                        <p className="text-xs font-black tracking-[0.4em] uppercase" style={{ color: "#7CC13B" }}>
                            Kegiatan Terbaru
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                        <div>
                            <h2 className="text-5xl lg:text-6xl font-black leading-tight text-gray-900 mb-10">
                                Aksi Nyata<br />
                                <em className="not-italic" style={{ color: "#FE961C" }}>di Lapangan</em>
                            </h2>

                            {activities.length === 0 ? (
                                <p className="text-gray-300 font-bold py-10">Belum ada aktivitas.</p>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {activities.map((a, i) => (
                                        <Link key={a.id} href={route("activity.show", a.id)}
                                            className="group flex items-start gap-6 py-6 hover:bg-gray-50 -mx-4 px-4 rounded-2xl transition-colors duration-200"
                                            aria-label={`Kegiatan Welltrash: ${a.title}`}>
                                            <span className="text-5xl font-black tabular-nums leading-none flex-shrink-0 select-none"
                                                style={{ color: "#F3F4F6" }}>
                                                {String(i + 1).padStart(2, "0")}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                {a.date && <p className="text-xs text-gray-400 font-medium mb-1">{fmt(a.date)}</p>}
                                                <h3 className="text-lg font-black text-gray-900 leading-snug group-hover:text-[#FE961C] transition-colors duration-300 mb-2">
                                                    {a.title}
                                                </h3>
                                                <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{a.description}</p>
                                            </div>
                                            <svg className="w-5 h-5 flex-shrink-0 mt-1 text-gray-300 group-hover:text-[#FE961C] group-hover:translate-x-1 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            <Link href={route("activity")}
                                className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold text-white transition-all hover:opacity-90"
                                style={{ backgroundColor: "#7CC13B" }}>
                                Lihat Semua Aktivitas
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>

                        <div className="hidden lg:grid grid-cols-2 gap-4">
                            {activities.map((a, i) => (
                                <Link key={a.id} href={route("activity.show", a.id)}
                                    className={`group relative rounded-2xl overflow-hidden ${i === 0 ? "col-span-2 h-56" : "h-40"}`}>
                                    {a.image_path
                                        ? <img src={`/storage/${a.image_path}`}
                                            alt={`Kegiatan Welltrash - ${a.title} | Jasa Pengangkutan Sampah Jember`}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        : <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                            <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                          </div>
                                    }
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <span className="absolute bottom-3 left-3 text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        {a.title}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24" style={{ backgroundColor: "#F8FAF6" }}>
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-gray-900 pb-6 mb-12">
                        <div className="flex items-center gap-4">
                            <p className="text-xs font-black tracking-[0.4em] uppercase" style={{ color: "#FE961C" }}>Berita & Blog</p>
                            <span className="w-1 h-1 rounded-full bg-gray-400" />
                            <p className="text-xs text-gray-400 font-medium">Welltrash Kabupaten Jember</p>
                        </div>
                        <Link href={route("news")}
                            className="group inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
                            Lihat Semua Berita
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>

                    {news.length === 0 ? (
                        <p className="py-16 text-center text-gray-300 font-bold">Belum ada berita.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {news.map((item, i) => (
                                <Link key={item.id} href={route("news.show", item.id)}
                                    className="group flex flex-col"
                                    aria-label={`Berita Welltrash: ${item.title}`}>
                                    <div className={`overflow-hidden rounded-2xl bg-gray-200 mb-5 ${i === 0 ? "h-64" : "h-48"}`}>
                                        {item.image_path
                                            ? <img src={`/storage/${item.image_path}`}
                                                alt={`Berita Welltrash - ${item.title} | Jasa Pengangkutan Sampah Jember`}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                            : <div className="w-full h-full flex items-center justify-center" style={{ background: "#F4FAF0" }}>
                                                <svg className="w-10 h-10" style={{ color: "#7CC13B", opacity: 0.3 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7" />
                                                </svg>
                                              </div>
                                        }
                                    </div>
                                    <div className="flex items-center gap-2 mb-3">
                                        {i === 0 && (
                                            <span className="text-xs font-black px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: "#FE961C" }}>
                                                Terbaru
                                            </span>
                                        )}
                                        {item.published_date && (
                                            <span className="text-xs text-gray-400 font-medium">{fmt(item.published_date)}</span>
                                        )}
                                    </div>
                                    <h3 className="font-black text-gray-900 leading-snug mb-2 group-hover:text-[#FE961C] transition-colors duration-300"
                                        style={{ fontSize: i === 0 ? "1.2rem" : "1rem" }}>
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 flex-1">{item.content}</p>
                                    <span className="mt-4 text-xs font-bold" style={{ color: "#7CC13B" }}>
                                        Baca Selengkapnya →
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="md:block hidden relative py-28 overflow-hidden rounded-t-[3rem]" style={{ backgroundColor: "#0f2417" }}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 select-none pointer-events-none"
                    style={{ fontSize: "28rem", lineHeight: 1, color: "rgba(124,193,59,0.05)", fontFamily: "Georgia, serif" }}>
                    &ldquo;
                </div>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[600px] h-[600px] rounded-full"
                        style={{ background: "radial-gradient(circle, rgba(124,193,59,0.08) 0%, transparent 70%)" }} />
                </div>

                <div className="relative max-w-5xl mx-auto px-6 lg:px-8">
                    <div className="flex items-center justify-center gap-3 mb-14">
                        <span className="h-px w-12" style={{ background: "rgba(124,193,59,0.4)" }} />
                        <p className="text-xs font-black tracking-[0.5em] uppercase" style={{ color: "#7CC13B" }}>
                            Inspirasi Lingkungan
                        </p>
                        <span className="h-px w-12" style={{ background: "rgba(124,193,59,0.4)" }} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: "rgba(255,255,255,0.05)" }}>
                        {[
                            {
                                quote: "We do not inherit the earth from our ancestors, we borrow it from our children.",
                                author: "Antoine de Saint-Exupéry",
                                role: "Penulis & Filsuf",
                                accent: "#7CC13B",
                            },
                            {
                                quote: "The greatest threat to our planet is the belief that someone else will save it.",
                                author: "Robert Swan",
                                role: "Penjelajah & Aktivis Lingkungan",
                                accent: "#FE961C",
                                featured: true,
                            },
                            {
                                quote: "In every walk with nature, one receives far more than he seeks.",
                                author: "John Muir",
                                role: "Naturalis & Pelestari Alam",
                                accent: "#7CC13B",
                            },
                        ].map(({ quote, author, role, accent, featured }) => (
                            <div key={author}
                                className={`relative flex flex-col justify-between p-10 transition-colors duration-300 ${featured ? "bg-[#0f2417]" : "bg-[#0d1f14] hover:bg-[#0f2417]"}`}>
                                <div className="w-8 h-0.5 mb-8" style={{ backgroundColor: accent }} />

                                {featured && (
                                    <span className="absolute top-6 right-6 text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full"
                                        style={{ background: "rgba(254,150,28,0.15)", color: "#FE961C" }}>
                                        ★ Pilihan
                                    </span>
                                )}

                                <p className={`leading-relaxed mb-8 italic ${featured ? "text-xl font-semibold" : "text-base"}`}
                                    style={{ color: featured ? "rgba(240,255,240,0.9)" : "rgba(240,255,240,0.6)" }}>
                                    &ldquo;{quote}&rdquo;
                                </p>

                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                        style={{ background: `${accent}25` }}>
                                        <span className="text-xs font-black" style={{ color: accent }}>
                                            {author.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-black" style={{ color: "rgba(240,255,240,0.85)" }}>{author}</p>
                                        <p className="text-xs" style={{ color: "rgba(240,255,240,0.35)" }}>{role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="mt-14 text-center text-sm leading-relaxed max-w-xl mx-auto"
                        style={{ color: "rgba(255,255,255,0.3)" }}>
                        Bersama <span className="font-bold" style={{ color: "#7CC13B" }}>Welltrash</span>,
                        setiap sampah yang diangkut adalah satu langkah nyata menuju
                        Kabupaten Jember yang lebih hijau dan berkelanjutan.
                    </p>
                </div>
            </section>

            <section className="py-24 relative overflow-hidden rounded-t-[3rem] rounded-b-[2rem] -mt-12" style={{ backgroundColor: "#0D1520" }}>
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
            <Footer />
        </>
    );
};

export default Welcome;
