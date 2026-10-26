import React from "react";
import { Link } from "@inertiajs/react";
import WhatsAppWidget from "./WhatsAppWidget";
import { MapPin, Mail, Phone, ArrowUpRight } from "lucide-react";
import Welltrash_logo from "../assets/img/logowelltrash.webp";

interface FooterProps {
    dark?: boolean;
}

const Footer: React.FC<FooterProps> = () => {
    return (
        <footer className="bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 border-t border-zinc-200/80 dark:border-zinc-800 pt-16 pb-12 font-sans relative">
            <WhatsAppWidget />
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-14 border-b border-zinc-100 dark:border-zinc-800">
                    {/* Brand Col */}
                    <div className="md:col-span-5">
                        <Link href={route("beranda")} className="inline-block mb-4">
                            <img
                                src={Welltrash_logo}
                                alt="WellTrash Logo"
                                className="h-9 w-auto object-contain brightness-100 dark:brightness-105"
                            />
                        </Link>
                        <p className="font-sans text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm mb-5">
                            Layanan pengangkutan dan pengelolaan limbah terjadwal untuk sektor bisnis, perhotelan, manufaktur, dan institusi di Kabupaten Jember dengan pencatatan transparan.
                        </p>
                        <p className="font-serif italic text-emerald-800 dark:text-emerald-400 text-lg">
                            Waste better. Grow better.
                        </p>
                    </div>

                    {/* Navigation Col */}
                    <div className="md:col-span-3">
                        <span className="font-mono text-xs uppercase tracking-wider text-zinc-900 dark:text-white block mb-5 font-bold">
                            NAVIGASI
                        </span>
                        <ul className="space-y-3 text-sm font-sans text-zinc-600 dark:text-zinc-400">
                            <li><a href="#solusi" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Solusi Bisnis</a></li>
                            <li><a href="#cara-kerja" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Cara Kerja</a></li>
                            <li><a href="#kegiatan" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Kegiatan Lapangan</a></li>
                            <li><Link href={route("services")} className="hover:text-zinc-950 dark:hover:text-white transition-colors">Paket Layanan</Link></li>
                            <li><Link href={route("about")} className="hover:text-zinc-950 dark:hover:text-white transition-colors">Tentang Kami</Link></li>
                            <li><Link href={route("news")} className="hover:text-zinc-950 dark:hover:text-white transition-colors">Berita &amp; Wawasan</Link></li>
                            <li><Link href={route("katalog")} className="hover:text-zinc-950 dark:hover:text-white transition-colors">Katalog Daur Ulang</Link></li>
                        </ul>
                    </div>

                    {/* Contact & Location Col */}
                    <div className="md:col-span-4">
                        <span className="font-mono text-xs uppercase tracking-wider text-zinc-900 dark:text-white block mb-5 font-bold">
                            KONTAK BISNIS
                        </span>
                        <ul className="space-y-3.5 text-sm font-sans text-zinc-600 dark:text-zinc-400">
                            <li className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-emerald-800 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                                    <MapPin className="w-3.5 h-3.5" />
                                </div>
                                <span className="leading-relaxed">Baratan Wetan, Baratan, Kec. Patrang, Kabupaten Jember, Jawa Timur 68100</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-emerald-800 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                    <Mail className="w-3.5 h-3.5" />
                                </div>
                                <a href="mailto:new.welltrashjember@gmail.com" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                                    new.welltrashjember@gmail.com
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-emerald-800 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                    <Phone className="w-3.5 h-3.5" />
                                </div>
                                <a href="https://wa.me/62819848706" target="_blank" rel="noreferrer" className="hover:text-zinc-950 dark:hover:text-white transition-colors">
                                    +62 819-848-706
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-400 dark:text-zinc-500">
                    <p>© {new Date().getFullYear()} PT Sarana Utama Welltrash. Hak cipta dilindungi undang-undang.</p>
                    <p>Kabupaten Jember, Jawa Timur</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
