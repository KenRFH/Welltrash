import { Link } from '@inertiajs/react';
import React from 'react';
import Welltrash_logo from "../assets/img/logowelltrash.webp";
import PwaInstallButton from './PwaInstallButton';
import {
    LayoutDashboard,
    Building2,
    Users,
    Clock,
    Ban,
    Truck,
    CalendarCheck2,
    Receipt,
    LogOut,
    X,
    Sparkles,
    MapPin,
    CarFront,
} from 'lucide-react';

export type AdminActiveTab = 'dashboard' | 'companies' | 'pending' | 'cancellations' | 'cleanups' | 'accounts' | 'attendance' | 'invoices' | 'map' | 'vehicles';

interface Props {
    active: AdminActiveTab;
    isMobileOpen?: boolean;
    onClose?: () => void;
}

export default function AdminSidebar({ active, isMobileOpen = false, onClose }: Props) {
    const navItem = (tab: AdminActiveTab, href: string, label: string, Icon: React.ComponentType<{ className?: string }>) => {
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

            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col shadow-2xl md:shadow-none flex-shrink-0 transition-transform duration-300 ease-in-out md:sticky md:top-0 md:h-screen md:translate-x-0 ${
                    isMobileOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex-1 min-h-0 overflow-y-auto">
                    {/* Brand Header */}
                    <div className="h-20 flex items-center justify-between px-5 border-b border-slate-100">
                        <Link href={route('admin.dashboard')} className="flex items-center gap-3">
                            <img
                                src={Welltrash_logo}
                                alt="WellTrash Logo"
                                className="h-9 w-9 object-contain"
                            />
                            <div>
                                <span className="font-extrabold text-sm text-slate-900 tracking-tight flex items-center gap-1">
                                    WellTrash
                                    <Sparkles className="w-3 h-3 text-emerald-600" />
                                </span>
                                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest block -mt-0.5">
                                    Admin Console
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

                    {/* Nav Categories */}
                    <nav className="mt-4 px-3 space-y-4 pb-6">
                        <div>
                            <div className="px-3 mb-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                Menu Utama
                            </div>
                            <div className="space-y-1">
                                {navItem('dashboard', route('admin.dashboard'), 'Dasbor Analitik', LayoutDashboard)}
                                {navItem('companies', route('admin.companies.index'), 'Semua Perusahaan', Building2)}
                            </div>
                        </div>

                        <div>
                            <div className="px-3 mb-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                Manajemen
                            </div>
                            <div className="space-y-1">
                                {navItem('accounts', route('admin.accounts.index'), 'Kelola Akun', Users)}
                                {navItem('pending', route('admin.companies.pending'), 'Persetujuan Mitra', Clock)}
                                {navItem('cancellations', route('admin.companies.cancellations'), 'Permintaan Batal', Ban)}
                            </div>
                        </div>

                        <div>
                            <div className="px-3 mb-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                Operasional
                            </div>
                            <div className="space-y-1">
                                {navItem('map', route('admin.monitoring.map'), 'Peta Monitor Mitra', MapPin)}
                                {navItem('cleanups', route('admin.cleanups'), 'Monitor CleanUP', Truck)}
                                {navItem('vehicles', route('admin.vehicles.index'), 'Inventaris Armada', CarFront)}
                                {navItem('attendance', route('admin.attendance.index'), 'Absensi CleanUP', CalendarCheck2)}
                            </div>
                        </div>

                        <div>
                            <div className="px-3 mb-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                Keuangan
                            </div>
                            <div className="space-y-1">
                                {navItem('invoices', route('admin.invoices.index'), 'Invoice Mitra', Receipt)}
                            </div>
                        </div>

                        {/* Akses & Sesi Sistem */}
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
