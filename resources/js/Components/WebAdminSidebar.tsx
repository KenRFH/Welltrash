import { Link } from '@inertiajs/react';
import React from 'react';
import Welltrash_logo from "../assets/img/logowelltrash.webp";
import PwaInstallButton from './PwaInstallButton';
import {
    LayoutDashboard,
    Calendar,
    Store,
    Newspaper,
    Users,
    LogOut,
    X,
    Sparkles,
} from 'lucide-react';

interface Props {
    active: 'dashboard' | 'activities' | 'katalogs' | 'news' | 'teams';
    isMobileOpen?: boolean;
    onClose?: () => void;
}

export default function WebAdminSidebar({ active, isMobileOpen = false, onClose }: Props) {
    const navItem = (tab: 'dashboard' | 'activities' | 'katalogs' | 'news' | 'teams', href: string, label: string, Icon: React.ComponentType<{ className?: string }>) => {
        const isActive = active === tab;
        return (
            <Link
                href={href}
                className={`group flex items-center px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                        ? 'bg-emerald-50 text-emerald-800 shadow-[inset_0_0_0_1px_rgba(5,150,105,0.2)]'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
            >
                <Icon
                    className={`w-4 h-4 mr-3 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                        isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-emerald-600'
                    }`}
                />
                <span className="truncate">{label}</span>
            </Link>
        );
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div 
                    className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
                    onClick={onClose}
                />
            )}

            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shadow-2xl md:shadow-none flex-shrink-0 transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex-1 min-h-0 overflow-y-auto">
                    <div className="h-20 flex items-center justify-between px-5 border-b border-slate-100">
                        <Link href={route('webadmin.dashboard')} className="flex items-center gap-3">
                            <img src={Welltrash_logo} alt="WellTrash Logo" className="h-9 w-9 object-contain" />
                            <div>
                                <span className="font-extrabold text-sm text-slate-900 tracking-tight flex items-center gap-1">
                                    WellTrash <Sparkles className="w-3 h-3 text-emerald-600" />
                                </span>
                                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest block -mt-0.5">
                                    Web Admin
                                </span>
                            </div>
                        </Link>
                        <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg md:hidden">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                
                    <nav className="mt-4 px-3 space-y-1">
                        <div className="px-3 mb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">Konten Publik</div>
                        {navItem('dashboard', route('webadmin.dashboard'), 'Beranda Admin', LayoutDashboard)}
                        {navItem('activities', route('webadmin.activities.index'), 'Aktivitas Publik', Calendar)}
                        {navItem('katalogs', route('webadmin.katalogs.index'), 'Katalog Produk', Store)}
                        {navItem('news', route('webadmin.news.index'), 'Berita / Artikel', Newspaper)}
                        {navItem('teams', route('webadmin.teams.index'), 'Tim & Profil', Users)}
                    </nav>
                </div>

                <div className="p-4 border-t border-slate-100 space-y-2 bg-slate-50/50">
                    <PwaInstallButton variant="sidebar" label="Unduh Aplikasi" />
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="flex items-center justify-center gap-2 w-full px-3.5 py-2.5 text-xs font-semibold text-slate-600 hover:text-red-600 bg-white hover:bg-red-50/70 border border-slate-200 hover:border-red-200 rounded-xl transition-all shadow-xs group"
                    >
                        <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-500 transition-colors" />
                        <span>Keluar Sistem</span>
                    </Link>
                </div>
            </aside>
        </>
    );
}
