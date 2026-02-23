import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";


const Navbar = () => {
  const { props } = usePage();

  const canLogin = props.canLogin as boolean;
  const canRegister = props.canRegister as boolean;

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Detect scroll
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md border-b border-black/5 py-4"
          : "bg-white/60 backdrop-blur-md py-6"
      }`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between font-outfit">

        {/* Logo */}
        <div className="text-2xl md:text-3xl font-extrabold">
          WellTrash
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10 text-lg font-medium">
          <Link href={route('beranda')} className="hover:text-black/70 transition">
            Beranda
          </Link>
          <Link href={route('about')} className="hover:text-black/70 transition">
            Tentang Kami
          </Link>
          <Link href={route('services')} className="hover:text-black/70 transition">
            Layanan
          </Link>
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-6 text-lg font-medium">
          {canRegister && (
            <Link href="/register" className="hover:text-black/70 transition">
              Daftar
            </Link>
          )}

          {canLogin && (
            <Link
              href="/login"
              className="px-6 py-2 rounded-full border border-green-700 hover:bg-green-700 hover:text-white transition"
            >Masuk
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={`w-6 h-0.5 bg-black transition ${isOpen ? "rotate-45 translate-y-1.5" : ""}`}></span>
          <span className={`w-6 h-0.5 bg-black transition ${isOpen ? "opacity-0" : ""}`}></span>
          <span className={`w-6 h-0.5 bg-black transition ${isOpen ? "-rotate-45 -translate-y-1.5" : ""}`}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-[#e9e9e9] shadow-md transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-96 py-6" : "max-h-0"
        }`}
      >
        <div className="flex flex-col items-center gap-6 text-lg font-medium">
          <a href="#beranda" onClick={() => setIsOpen(false)}>
            Beranda
          </a>
          <Link href={route('about')} onClick={() => setIsOpen(false)}>
            Tentang Kami
          </Link>
          <Link href={route('services')} onClick={() => setIsOpen(false)}>
            Layanan
          </Link>

          {canRegister && (
            <Link href="/register" onClick={() => setIsOpen(false)}>
              Daftar
            </Link>
          )}

          {canLogin && (
            <Link
              href="/login"
              className="px-6 py-2 rounded-full border border-green-700"
              onClick={() => setIsOpen(false)}
            >
              Masuk
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
