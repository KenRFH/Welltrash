import { Link } from '@inertiajs/react';
import React from 'react';

const HistoryIcon = () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const CalendarIcon = () => <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>;
const LogoutIcon = () => <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>;

interface Props {
    active: 'dashboard' | 'history';
    isMobileOpen?: boolean;
    onClose?: () => void;
}

export default function DriverSidebar({ active, isMobileOpen = false, onClose }: Props) {
    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div 
                    className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 md:hidden transition-opacity"
                    onClick={onClose}
                ></div>
            )}

            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 flex flex-col justify-between shadow-xl md:shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex-shrink-0 transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div>
                    <div className="h-24 flex items-center justify-between px-8 border-b border-gray-50">
                        <div className="flex items-center">
                            <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500 tracking-tight">Welltrash</span>
                            <span className="ml-2 text-[10px] font-bold text-white bg-green-500 px-2 py-0.5 rounded-full uppercase tracking-wider hidden sm:inline-block">Driver</span>
                        </div>
                        <button onClick={onClose} className="md:hidden text-gray-400 hover:text-gray-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                
                <nav className="mt-8 px-4 space-y-2">
                    <div className="px-4 mb-2 text-xs font-bold tracking-wider text-gray-400 uppercase">Aktivitas Utama</div>
                    
                    <Link href={route('driver.dashboard')} className={`flex items-center px-4 py-3 rounded-2xl transition-all ${active === 'dashboard' ? 'text-green-700 bg-green-50/80 font-semibold shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-green-600 font-medium group'}`}>
                        <span className={active !== 'dashboard' ? 'group-hover:text-green-500 transition-colors' : ''}><CalendarIcon /></span> Jadwal & Tugas
                    </Link>
                    
                    <Link href={route('driver.history')} className={`flex items-center px-4 py-3 rounded-2xl transition-all ${active === 'history' ? 'text-green-700 bg-green-50/80 font-semibold shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-green-600 font-medium group'}`}>
                        <span className={active !== 'history' ? 'group-hover:text-green-500 transition-colors' : ''}><HistoryIcon /></span> Riwayat
                    </Link>
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
