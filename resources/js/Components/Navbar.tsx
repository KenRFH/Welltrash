import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import Welltrash_logo from "../assets/img/logowelltrash.webp";
import PwaInstallButton from "./PwaInstallButton";
import { Menu, X, User, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NavbarProps {
    dark?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ dark = false }) => {
    const { props, url } = usePage();
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const canLogin = props.canLogin !== undefined ? (props.canLogin as boolean) : true;
    const canRegister = props.canRegister !== undefined ? (props.canRegister as boolean) : true;
    const user = (props.auth as any)?.user;

    useEffect(() => {
        const onScroll = () => {
            setIsScrolled(window.scrollY > 15);
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const menuItems = [
        { label: "Beranda", route: "beranda" },
        { label: "Tentang Kami", route: "about" },
        { label: "Layanan", route: "services" },
        { label: "Aktivitas", route: "activity" },
        { label: "Berita", route: "news" },
        { label: "Katalog", route: "katalog" },
    ];

    const isRouteActive = (routeName: string) => {
        try {
            return typeof route === "function" && route().current && route().current(routeName);
        } catch {
            return false;
        }
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full ${
                isScrolled
                    ? "bg-white/90 backdrop-blur-md border-b border-zinc-200/80 py-3.5 shadow-xs"
                    : "bg-white/75 backdrop-blur-sm border-b border-zinc-100 py-4"
            }`}
        >
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center justify-between">
                {/* Brand Logo */}
                <Link
                    href={route("beranda")}
                    className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg transition-transform hover:opacity-90"
                    aria-label="WellTrash - Beranda"
                >
                    <img
                        src={Welltrash_logo}
                        alt="WellTrash Logo"
                        className="h-9 sm:h-10 w-auto object-contain pointer-events-none transition-all"
                    />
                </Link>

                {/* Desktop Menu */}
                <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-sans font-medium">
                    {menuItems.map((item) => {
                        const active = isRouteActive(item.route);
                        return (
                            <Link
                                key={item.route}
                                href={route(item.route)}
                                className={`transition-colors duration-150 py-1 relative ${
                                    active
                                        ? "text-emerald-700 font-semibold"
                                        : "text-zinc-600 hover:text-zinc-950"
                                }`}
                            >
                                {item.label}
                                {active && (
                                    <motion.span
                                        layoutId="activeNavIndicator"
                                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-600 rounded-full"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Desktop Action Buttons */}
                <div className="hidden md:flex items-center gap-3">
                    <PwaInstallButton
                        variant="header"
                        label="Pasang Aplikasi"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium text-xs transition-all border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 hover:text-zinc-900 shadow-xs"
                    />

                    {user ? (
                        <Link
                            href="/dashboard"
                            className="bg-zinc-900 text-white hover:bg-zinc-800 font-sans font-medium text-xs px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2 shadow-xs"
                        >
                            <LayoutDashboard className="w-3.5 h-3.5" />
                            <span>Dashboard</span>
                        </Link>
                    ) : (
                        <div className="flex items-center gap-2">
                            {canRegister && (
                                <Link
                                    href="/register"
                                    className="text-zinc-700 hover:text-zinc-950 font-sans font-medium text-xs px-3.5 py-2 rounded-lg border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 transition-colors"
                                >
                                    Daftar
                                </Link>
                            )}
                            {canLogin && (
                                <Link
                                    href="/login"
                                    className="bg-zinc-900 text-white hover:bg-zinc-800 font-sans font-medium text-xs px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-xs"
                                >
                                    <User className="w-3.5 h-3.5" />
                                    <span>Masuk</span>
                                </Link>
                            )}
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="flex items-center gap-2 md:hidden">
                    <PwaInstallButton
                        variant="header"
                        label="Pasang"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full font-medium text-[11px] transition-all border border-zinc-200 bg-zinc-50 text-zinc-700"
                    />

                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-zinc-700 hover:text-zinc-950 p-2 focus:outline-none rounded-lg hover:bg-zinc-100 transition-colors"
                        aria-label={isOpen ? "Tutup Menu" : "Buka Menu"}
                    >
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu with Animation */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="md:hidden bg-white/95 backdrop-blur-lg border-b border-zinc-200 px-6 py-5 shadow-lg overflow-hidden"
                    >
                        <nav className="flex flex-col gap-1 text-sm font-sans font-medium text-zinc-700">
                            {menuItems.map((item) => {
                                const active = isRouteActive(item.route);
                                return (
                                    <Link
                                        key={item.route}
                                        href={route(item.route)}
                                        onClick={() => setIsOpen(false)}
                                        className={`py-2.5 px-3 rounded-lg transition-colors flex items-center justify-between ${
                                            active
                                                ? "bg-emerald-50 text-emerald-800 font-semibold"
                                                : "hover:bg-zinc-50 text-zinc-700 hover:text-zinc-950"
                                        }`}
                                    >
                                        <span>{item.label}</span>
                                        {active && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
                                    </Link>
                                );
                            })}
                            <div className="pt-4 mt-2 border-t border-zinc-100 flex flex-col gap-2.5">
                                {user ? (
                                    <Link
                                        href="/dashboard"
                                        onClick={() => setIsOpen(false)}
                                        className="bg-zinc-900 text-white hover:bg-zinc-800 text-center font-sans font-medium py-2.5 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                                    >
                                        <LayoutDashboard className="w-4 h-4" />
                                        <span>Dashboard</span>
                                    </Link>
                                ) : (
                                    <>
                                        {canLogin && (
                                            <Link
                                                href="/login"
                                                onClick={() => setIsOpen(false)}
                                                className="bg-zinc-900 text-white hover:bg-zinc-800 text-center font-sans font-medium py-2.5 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                                            >
                                                <User className="w-4 h-4" />
                                                <span>Masuk Akun</span>
                                            </Link>
                                        )}
                                        {canRegister && (
                                            <Link
                                                href="/register"
                                                onClick={() => setIsOpen(false)}
                                                className="text-center text-zinc-700 hover:text-zinc-950 py-2.5 text-sm font-sans font-medium border border-zinc-200 hover:bg-zinc-50 rounded-lg transition-colors"
                                            >
                                                Daftar Kemitraan
                                            </Link>
                                        )}
                                    </>
                                )}
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
