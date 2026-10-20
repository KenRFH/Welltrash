import { Head, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import WebAdminSidebar from '@/Components/WebAdminSidebar';
import PwaInstallButton from '@/Components/PwaInstallButton';
import { motion, type Variants } from 'motion/react';
import {
    Menu,
    Calendar,
    Store,
    Newspaper,
    ArrowRight,
    Sparkles,
    ShieldCheck,
} from 'lucide-react';

interface Props {
    auth: {
        user: {
            name: string;
        }
    };
    activitiesCount: number;
    katalogCount: number;
    newsCount: number;
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

interface WebStatCardProps {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    count: number;
    unit: string;
    href: string;
    cta: string;
    color: 'emerald' | 'teal' | 'slate';
}

const WebStatCard: React.FC<WebStatCardProps> = ({ icon: Icon, title, count, unit, href, cta, color }) => {
    const colorStyles = {
        emerald: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white',
        teal: 'bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white',
        slate: 'bg-slate-100 text-slate-700 group-hover:bg-slate-900 group-hover:text-white',
    };
    return (
        <motion.div
            variants={itemVariants}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all group flex flex-col justify-between"
        >
            <div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors ${colorStyles[color]}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</h3>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900 tracking-tight">{count}</span>
                    <span className="text-xs font-semibold text-slate-500">{unit}</span>
                </div>
            </div>
            <Link
                href={href}
                className="mt-6 text-xs font-bold text-slate-700 hover:text-emerald-700 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-all"
            >
                {cta} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
        </motion.div>
    );
};

export default function Dashboard({ auth, activitiesCount, katalogCount, newsCount }: Props) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
            <Head title="Dasbor Web Admin | WellTrash" />

            <WebAdminSidebar 
                active="dashboard" 
                isMobileOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-18 flex items-center justify-between px-4 sm:px-8 bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1">
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-xl md:hidden transition-all"
                            aria-label="Buka Menu"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">Dasbor Web Admin</h1>
                                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                    <Sparkles className="w-2.5 h-2.5 text-emerald-500" /> Portal Konten
                                </span>
                            </div>
                            <p className="hidden sm:block text-[11px] font-medium text-slate-400 mt-0.5">
                                Manajemen publikasi kegiatan, katalog produk material recovery, dan artikel blog
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:block">
                            <PwaInstallButton variant="header" label="Pasang App" />
                        </div>
                        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
                            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                                <ShieldCheck className="w-4 h-4" />
                            </div>
                            <div className="hidden sm:flex flex-col text-left">
                                <span className="text-xs font-bold text-slate-900 leading-tight">{auth.user.name}</span>
                                <span className="text-[10px] font-medium text-emerald-600 leading-tight">Web Admin</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-8 pt-4 sm:pt-6">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="space-y-6"
                    >
                        {/* Greeting Banner */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                            <div>
                                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                                    Pusat Publikasi & Pengelolaan Konten
                                </h2>
                                <p className="text-xs text-slate-500 font-medium mt-1 max-w-xl leading-relaxed">
                                    Dokumentasikan aktivitas nyata CleanUP, kurasi produk material recovery, dan edukasi mitra melalui artikel wawasan lingkungan.
                                </p>
                            </div>
                        </motion.div>

                        {/* Metric Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <WebStatCard
                                icon={Calendar}
                                title="Aktivitas Publik"
                                count={activitiesCount}
                                unit="Dokumentasi"
                                href={route('webadmin.activities.index')}
                                cta="Kelola Aktivitas"
                                color="emerald"
                            />

                            <WebStatCard
                                icon={Store}
                                title="Katalog Produk"
                                count={katalogCount}
                                unit="Item Produk"
                                href={route('webadmin.katalogs.index')}
                                cta="Kelola Katalog"
                                color="teal"
                            />

                            <WebStatCard
                                icon={Newspaper}
                                title="Artikel & Berita"
                                count={newsCount}
                                unit="Artikel Terbit"
                                href={route('webadmin.news.index')}
                                cta="Kelola Berita"
                                color="slate"
                            />
                        </div>
                    </motion.div>
                </main>

                <footer className="px-6 py-4 text-center text-slate-400 text-[11px] font-medium border-t border-slate-200/60 bg-white/40">
                    &copy; {new Date().getFullYear()} WellTrash Content Management System &bull; Portal Web Admin
                </footer>
            </div>
        </div>
    );
}
