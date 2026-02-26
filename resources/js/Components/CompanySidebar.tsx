import { Link } from '@inertiajs/react';
import React from 'react';

const HomeIcon = () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>;
const HistoryIcon = () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>;
const CalendarIcon = () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>;
const BillingIcon = () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>;
const PartnersIcon = () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>;

interface Props {
    active: 'dashboard' | 'history' | 'schedule' | 'billing' | 'mitra';
    theme?: 'indigo' | 'green';
    isLocked?: boolean;
}

export default function CompanySidebar({ active, theme = 'indigo', isLocked = false }: Props) {
    // Theme configurations
    const t = {
        title: theme === 'green' ? 'from-green-600 to-emerald-500' : 'from-indigo-600 to-blue-500',
        activeText: theme === 'green' ? 'text-green-700' : 'text-indigo-700',
        activeBg: theme === 'green' ? 'bg-green-50/80' : 'bg-indigo-50/80',
        hoverText: theme === 'green' ? 'hover:text-green-600' : 'hover:text-gray-900',
        groupHoverText: theme === 'green' ? 'group-hover:text-green-500' : 'group-hover:text-indigo-500',
        logoutHoverBg: theme === 'green' ? 'hover:bg-red-50 hover:border-red-100' : 'hover:bg-gray-50',
    };

    return (
        <aside className="w-72 bg-white border-r border-gray-100 flex flex-col justify-between hidden md:flex shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 flex-shrink-0">
            <div>
                <div className="h-24 flex items-center px-8 border-b border-gray-50">
                    <span className={`text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r ${t.title} tracking-tight`}>
                        WellMaggot
                    </span>
                </div>
                
                <nav className="mt-8 px-4 space-y-2">
                    <div className="px-4 mb-2 text-xs font-bold tracking-wider text-gray-400 uppercase">Menu Utama</div>
                    
                    {isLocked ? (
                        <>
                            <div className="flex items-center px-4 py-3 text-gray-400 cursor-not-allowed rounded-2xl font-medium transition-all group">
                                <span className=""><HomeIcon /></span> Beranda
                            </div>
                            <div className="flex items-center px-4 py-3 text-gray-400 cursor-not-allowed rounded-2xl font-medium transition-all group">
                                <span className=""><HistoryIcon /></span> Riwayat
                            </div>
                            <div className="flex items-center px-4 py-3 text-gray-400 cursor-not-allowed rounded-2xl font-medium transition-all group">
                                <span className=""><CalendarIcon /></span> Jadwal & Agenda
                            </div>
                            <div className="flex items-center px-4 py-3 text-gray-400 cursor-not-allowed rounded-2xl font-medium transition-all group">
                                <span className=""><BillingIcon /></span> Tagihan
                            </div>
                            <div className={`flex items-center px-4 py-3 rounded-2xl transition-all ${active === 'mitra' ? `${t.activeText} ${t.activeBg} font-semibold shadow-sm` : `text-gray-500 hover:bg-gray-50 ${t.hoverText} font-medium group`}`}>
                                <span className={active !== 'mitra' ? t.groupHoverText : ''}><PartnersIcon /></span> Mitra
                            </div>
                        </>
                    ) : (
                        <>
                            <Link href={route('company.dashboard')} className={`flex items-center px-4 py-3 rounded-2xl transition-all ${active === 'dashboard' ? `${t.activeText} ${t.activeBg} font-semibold shadow-sm` : `text-gray-500 hover:bg-gray-50 ${t.hoverText} font-medium group`}`}>
                                <span className={active !== 'dashboard' ? t.groupHoverText : ''}><HomeIcon /></span> Beranda
                            </Link>
                            
                            <Link href={route('company.history')} className={`flex items-center px-4 py-3 rounded-2xl transition-all ${active === 'history' ? `${t.activeText} ${t.activeBg} font-semibold shadow-sm` : `text-gray-500 hover:bg-gray-50 ${t.hoverText} font-medium group`}`}>
                                <span className={active !== 'history' ? t.groupHoverText : ''}><HistoryIcon /></span> Riwayat
                            </Link>
                            
                            <Link href={route('company.schedule')} className={`flex items-center px-4 py-3 rounded-2xl transition-all ${active === 'schedule' ? `${t.activeText} ${t.activeBg} font-semibold shadow-sm` : `text-gray-500 hover:bg-gray-50 ${t.hoverText} font-medium group`}`}>
                                <span className={active !== 'schedule' ? t.groupHoverText : ''}><CalendarIcon /></span> Jadwal & Agenda
                            </Link>
                            
                            <Link href="#" className="flex items-center px-4 py-3 text-gray-400 cursor-not-allowed rounded-2xl font-medium transition-all group">
                                <span className=""><BillingIcon /></span> Tagihan
                            </Link>
                            
                            <Link href="#" className="flex items-center px-4 py-3 text-gray-400 cursor-not-allowed rounded-2xl font-medium transition-all group">
                                <span className=""><PartnersIcon /></span> Mitra
                            </Link>
                        </>
                    )}
                </nav>
            </div>

            <div className="p-6 mb-2 border-t border-gray-50">
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className={`flex items-center justify-center w-full px-4 py-3 text-gray-600 border border-gray-200 hover:text-red-600 rounded-2xl font-semibold transition-all shadow-sm group ${t.logoutHoverBg}`}
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    Keluar
                </Link>
            </div>
        </aside>
    );
}
