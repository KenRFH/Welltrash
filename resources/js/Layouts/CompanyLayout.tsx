import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import CompanySidebar, { CompanyActiveTab } from '@/Components/CompanySidebar';
import PwaInstallButton from '@/Components/PwaInstallButton';
import { Menu, Calendar, Building2 } from 'lucide-react';

interface Props {
    children: React.ReactNode;
    title: string;
    activeTab: CompanyActiveTab;
    subtitle?: string;
    company: {
        id?: number;
        company_name: string;
        subscription_plan?: string;
        subscription_status?: string;
    };
    userName?: string;
    headerAction?: React.ReactNode;
}

export default function CompanyLayout({
    children,
    title,
    activeTab,
    subtitle,
    company,
    userName,
    headerAction,
}: Props) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 8);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const currentDateStr = new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(new Date());

    const initials = company?.company_name
        ? company.company_name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
        : 'WT';

    return (
        <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
            <Head title={`${title} | Portal Perusahaan WellTrash`} />

            <CompanySidebar
                active={activeTab}
                isMobileOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                plan={company?.subscription_plan}
            />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <div className="fixed top-0 right-0 w-96 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none z-0" />

                <header
                    className={`h-16 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30 transition-all duration-200 ${
                        isScrolled
                            ? 'bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs'
                            : 'bg-white/60 backdrop-blur-xs border-b border-slate-200/50'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-xl md:hidden transition-all"
                            aria-label="Menu"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                                    {title}
                                </h1>
                                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100/80 text-emerald-800 border border-emerald-200">
                                    <Building2 className="w-3 h-3 text-emerald-600" />
                                    Portal Mitra
                                </span>
                            </div>
                            {subtitle && (
                                <p className="hidden sm:block text-[11px] font-medium text-slate-400">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/80 border border-slate-200/60 text-xs font-semibold text-slate-600">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{currentDateStr}</span>
                        </div>

                        <div className="hidden sm:block">
                            <PwaInstallButton variant="header" label="Pasang App" />
                        </div>

                        {headerAction}

                        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                                {initials}
                            </div>
                            <div className="hidden sm:flex flex-col text-left">
                                <span className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[130px]">
                                    {company?.company_name || 'Mitra'}
                                </span>
                                <span className="text-[10px] font-medium text-emerald-600 leading-tight truncate max-w-[130px]">
                                    {userName || company?.subscription_plan || 'Mitra Bisnis'}
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 relative z-10 p-4 sm:p-8 pt-4 sm:pt-6">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {children}
                    </div>
                </main>

                <footer className="px-6 py-4 text-center text-slate-400 text-[11px] font-medium border-t border-slate-200/60 bg-white/40">
                    &copy; {new Date().getFullYear()} WellTrash Waste Management System &bull; Clean Technology Solutions
                </footer>
            </div>
        </div>
    );
}
