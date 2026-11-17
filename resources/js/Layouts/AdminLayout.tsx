import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';
import AdminSidebar, { AdminActiveTab } from '@/Components/AdminSidebar';
import { Menu, ShieldCheck, Calendar, Sparkles } from 'lucide-react';

interface Props {
    children: React.ReactNode;
    title: string;
    activeTab: AdminActiveTab;
    subtitle?: string;
    headerAction?: React.ReactNode;
}

export default function AdminLayout({ children, title, activeTab, subtitle, headerAction }: Props) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const me = usePage<PageProps>().props.auth.user;
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 8);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const currentDateStr = new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(new Date());

    return (
        <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
            <Head title={`${title} | WellTrash Admin`} />
            
            {/* Sidebar Component */}
            <AdminSidebar 
                active={activeTab} 
                isMobileOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
            />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Subtle Clean Ambient Gradient */}
                
                {/* Header */}
                <header className={`h-18 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30 transition-all duration-200 ${
                    isScrolled
                        ? 'bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-xs'
                        : 'bg-white/60 backdrop-blur-xs border-b border-slate-200/50'
                }`}>
                    <div className="flex items-center gap-3 sm:gap-4">
                        <button 
                            onClick={() => setIsSidebarOpen(true)} 
                            className="p-2 -ml-2 text-slate-600 hover:text-green-deep hover:bg-paper rounded-xl md:hidden transition-all active:scale-95"
                            aria-label="Buka Menu"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg sm:text-xl font-bold text-ink tracking-tight">{title}</h1>
                                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Online
                                </span>
                            </div>
                            {subtitle && <p className="hidden sm:block text-xs text-slate-500 mt-0.5">{subtitle}</p>}
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-100/80 border border-slate-200/60 text-xs font-semibold text-slate-600 whitespace-nowrap">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{currentDateStr}</span>
                        </div>

                        {headerAction}

                        <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-200">
                            <div className="w-8 h-8 rounded-lg bg-green-deep text-lime font-bold text-xs flex items-center justify-center">
                                <ShieldCheck className="w-4 h-4" />
                            </div>
                            <div className="hidden sm:flex flex-col text-left">
                                <span className="max-w-[180px] truncate text-xs font-bold text-slate-900 leading-tight" title={me?.name}>{me?.name}</span>
                                <span className="max-w-[180px] truncate text-[11px] font-medium text-slate-500 leading-tight">{me?.division || me?.role_label}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="adm-main flex-1 relative z-10 p-4 sm:p-8 pt-4 sm:pt-6">
                    {children}
                </main>
                
                {/* Footer */}
                <footer className="px-6 py-4 text-center text-slate-400 text-[11px] font-medium border-t border-slate-200/60 bg-white/40">
                    &copy; {new Date().getFullYear()} WellTrash Waste Management System &bull; Clean Technology Solutions
                </footer>
            </div>
        </div>
    );
}
