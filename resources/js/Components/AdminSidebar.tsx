import { Link } from '@inertiajs/react';
import React from 'react';
// The source image was removed, so we fallback to the built asset path
const Welltrash_logo = "/build/assets/logowelltrash-DkJ1DW_Z.png";

const DashboardIcon = () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>;
const CompanyIcon = () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>;
const PendingIcon = () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>;
const CancelIcon = () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>;
const DriverIcon = () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>;
const LogoutIcon = () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>;

export type AdminActiveTab = 'dashboard' | 'companies' | 'pending' | 'cancellations' | 'drivers';

interface Props {
    active: AdminActiveTab;
    isMobileOpen?: boolean;
    onClose?: () => void;
}

export default function AdminSidebar({ active, isMobileOpen = false, onClose }: Props) {
    const navItem = (tab: AdminActiveTab, href: string, label: string, Icon: React.FC) => {
        const isActive = active === tab;
        return (
            <Link
                href={href}
                className={`flex items-center px-4 py-3 rounded-2xl transition-all ${
                    isActive
                        ? 'text-orange-700 bg-orange-50/90 font-semibold shadow-sm'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-orange-600 font-medium group'
                }`}
            >
                <span className={!isActive ? 'group-hover:text-orange-500 transition-colors' : ''}>
                    <Icon />
                </span>
                {label}
            </Link>
        );
    };

    return (
        <>
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 md:hidden transition-opacity"
                    onClick={onClose}
                />
            )}

            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 flex flex-col justify-between shadow-xl md:shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex-shrink-0 transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div>
                    <div className="h-28 flex items-center justify-between px-6 border-b border-gray-100">
                        <img src={Welltrash_logo} alt="WellTrash Logo" className="h-25 w-auto object-contain" />
                    </div>

                    <nav className="mt-6 px-4 space-y-1">
                        <div className="px-4 mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase">Menu Utama</div>
                        {navItem('dashboard', route('admin.dashboard'), 'Dasbor', DashboardIcon)}
                        {navItem('companies', route('admin.companies.index'), 'Semua Perusahaan', CompanyIcon)}

                        <div className="px-4 pt-4 mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase">Manajemen</div>
                        {navItem('pending', route('admin.companies.pending'), 'Menunggu Persetujuan', PendingIcon)}
                        {navItem('cancellations', route('admin.companies.cancellations'), 'Pembatalan', CancelIcon)}

                        <div className="px-4 pt-4 mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase">Monitoring</div>
                        {navItem('drivers', route('admin.drivers'), 'Monitor Driver', DriverIcon)}
                    </nav>
                </div>

                <div className="p-6 mb-2 border-t border-gray-50">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="flex items-center justify-center w-full px-4 py-3 text-gray-600 border border-gray-200 hover:bg-red-50 hover:border-red-100 hover:text-red-600 rounded-2xl font-semibold transition-all shadow-sm group"
                    >
                        <LogoutIcon /> Keluar
                    </Link>
                </div>
            </aside>
        </>
    );
}
