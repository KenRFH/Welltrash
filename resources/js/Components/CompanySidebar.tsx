import { Link } from '@inertiajs/react';
import React from 'react';
import Welltrash_logo from "../assets/img/logowelltrash.webp";
import PwaInstallButton from './PwaInstallButton';
import {
    LayoutDashboard,
    History,
    CalendarDays,
    Camera,
    ReceiptText,
    Building2,
    LogOut,
    X,
    Sparkles,
    ShieldCheck,
} from 'lucide-react';

export type CompanyActiveTab = 'dashboard' | 'history' | 'schedule' | 'billing' | 'mitra' | 'kegiatan' | 'invoices';

interface Props {
    active: CompanyActiveTab;
    isLocked?: boolean;
    isMobileOpen?: boolean;
    onClose?: () => void;
    plan?: string;
}

export default function CompanySidebar({ active, isLocked = false, isMobileOpen = false, onClose, plan }: Props) {
    const navItem = (tab: CompanyActiveTab, href: string, label: string, Icon: React.ComponentType<{ className?: string }>) => {
        const isActive = active === tab || (tab === 'invoices' && active === 'billing');
        return (
            <Link
                href={href}
                className={`group flex items-center px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-emerald-900 hover:bg-emerald-50/70'
                }`}
            >
                <Icon
                    className={`w-4 h-4 mr-3 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-600'
                    }`}
                />
                <span className="truncate">{label}</span>
                {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                )}
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

            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col shadow-2xl md:shadow-none flex-shrink-0 transition-transform duration-300 ease-in-out md:sticky md:top-0 md:h-screen md:translate-x-0 ${
                    isMobileOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex-1 min-h-0 overflow-y-auto">
                    {/* Brand Header */}
                    <div className="h-20 flex items-center justify-between px-5 border-b border-emerald-100/60 bg-emerald-50/40">
                        <Link href={route('company.dashboard')} className="flex items-center gap-3">
                            <img
                                src={Welltrash_logo}
                                alt="WellTrash Logo"
                                className="h-9 w-9 object-contain"
                            />
                            <div>
                                <span className="font-extrabold text-sm text-emerald-950 tracking-tight flex items-center gap-1">
                                    WellTrash
                                    <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                                </span>
                                <span className="inline-block text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase tracking-wider mt-0.5">
                                    Portal Mitra
                                </span>
                            </div>
                        </Link>

                        <button
                            onClick={onClose}
                            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg md:hidden"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Plan Badge Info */}
                    {plan && (
                        <div className="mx-4 mt-4 p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Paket Langganan</p>
                                    <p className="text-xs font-extrabold text-slate-900 truncate">{plan}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Nav Categories */}
                    <nav className="mt-4 px-3 space-y-4 pb-6">
                        <div>
                            <div className="px-3 mb-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                Menu Operasional
                            </div>
                            <div className="space-y-1">
                                {!isLocked && (
                                    <>
                                        {navItem('dashboard', route('company.dashboard'), 'Dasbor & Metrik', LayoutDashboard)}
                                        {navItem('history', route('company.history'), 'Riwayat Sampah', History)}
                                        {navItem('schedule', route('company.schedule'), 'Jadwal & Agenda', CalendarDays)}
                                        {navItem('kegiatan', route('company.kegiatan'), 'Kegiatan & Bukti', Camera)}
                                    </>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="px-3 mb-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                Administrasi & Akun
                            </div>
                            <div className="space-y-1">
                                {navItem('invoices', route('company.invoices.index'), 'Invoice & Tagihan', ReceiptText)}
                                {navItem('mitra', route('company.mitra'), 'Profil & Kemitraan', Building2)}
                            </div>
                        </div>

                        {/* Akses & Sesi Akun - right below Administrasi & Akun */}
                        <div className="pt-2">
                            <div className="px-3 mb-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                Akses & Sesi
                            </div>
                            <div className="space-y-1.5">
                                <PwaInstallButton variant="sidebar" label="Unduh Aplikasi PWA" />
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="group flex items-center w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200/80 hover:border-rose-600 transition-all duration-200 shadow-2xs"
                                >
                                    <LogOut className="w-4 h-4 mr-3 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5 text-rose-500 group-hover:text-white" />
                                    <span>Keluar Sistem</span>
                                </Link>
                            </div>
                        </div>
                    </nav>
                </div>
            </aside>
        </>
    );
}
