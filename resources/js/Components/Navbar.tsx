import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import logowelltrash from "../../../public/build/assets/logowelltrash.png";

interface NavbarProps {
    dark?: boolean;
}

const Navbar = ({ dark = false }: NavbarProps) => {
  const { props } = usePage();

  const canLogin = props.canLogin as boolean;
  const canRegister = props.canRegister as boolean;

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Theme tokens
  const bg = dark
    ? isScrolled
      ? "rgba(14,23,42,0.92)"
      : "rgba(14,23,42,0.7)"
    : isScrolled
      ? "rgba(255,255,255,0.85)"
      : "rgba(255,255,255,0.65)";

  const borderColor = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
  const linkColor = dark ? "rgba(240,244,255,0.7)" : undefined;
  const linkHoverColor = dark ? "#FE961C" : undefined;
  const logoFilter = dark ? "brightness(0) invert(1)" : undefined;
  const hamburgerColor = dark ? "#F0F4FF" : "#111827";
  const mobileBg = dark ? "#0E172A" : "#f0f0f0";
  const mobileLinkColor = dark ? "rgba(240,244,255,0.8)" : "#111827";

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full backdrop-blur-md"
      style={{
        backgroundColor: bg,
        borderBottom: `1px solid ${borderColor}`,
        paddingTop: isScrolled ? '12px' : '20px',
        paddingBottom: isScrolled ? '12px' : '20px',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* Logo */}
        <div className="flex-shrink-0 relative w-32 md:w-48 h-10 md:h-12 flex items-center">
          <Link href={route('beranda')} className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center">
            <img
              src={logowelltrash}
              alt="WellTrash Logo"
              className="h-20 md:h-28 w-auto object-contain object-left pointer-events-none transition-all"
              style={logoFilter ? { filter: logoFilter } : {}}
            />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
          {[
            { label: 'Beranda', route: 'beranda' },
            { label: 'Tentang Kami', route: 'about' },
            { label: 'Layanan', route: 'services' },
            { label: 'Aktivitas', route: 'activity' },
            { label: 'Berita', route: 'news' },
            { label: 'Katalog', route: 'katalog' },
          ].map(item => (
            <Link
              key={item.route}
              href={route(item.route)}
              className="transition-colors duration-200"
              style={{ color: linkColor }}
              onMouseEnter={e => { if (linkHoverColor) (e.currentTarget as HTMLElement).style.color = linkHoverColor; }}
              onMouseLeave={e => { if (linkColor) (e.currentTarget as HTMLElement).style.color = linkColor; }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-4 text-sm font-semibold">
          {canRegister && (
            <Link
              href="/register"
              className="transition-colors duration-200"
              style={{ color: linkColor }}
              onMouseEnter={e => { if (linkHoverColor) (e.currentTarget as HTMLElement).style.color = linkHoverColor; }}
              onMouseLeave={e => { if (linkColor) (e.currentTarget as HTMLElement).style.color = linkColor; }}
            >
              Daftar
            </Link>
          )}
          {canLogin && (
            <Link
              href="/login"
              className="px-5 py-2 rounded-full text-sm font-bold transition-all duration-200"
              style={dark
                ? { border: '1px solid rgba(254,150,28,0.5)', color: '#FE961C' }
                : { border: '1px solid #15803d', color: '#15803d' }
              }
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.backgroundColor = dark ? '#FE961C' : '#15803d';
                el.style.color = '#fff';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.backgroundColor = 'transparent';
                el.style.color = dark ? '#FE961C' : '#15803d';
              }}
            >
              Masuk
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={`w-6 h-0.5 transition-all duration-300 ${isOpen ? "rotate-45 translate-y-2" : ""}`} style={{ backgroundColor: hamburgerColor }}></span>
          <span className={`w-6 h-0.5 transition-all duration-300 ${isOpen ? "opacity-0" : ""}`} style={{ backgroundColor: hamburgerColor }}></span>
          <span className={`w-6 h-0.5 transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} style={{ backgroundColor: hamburgerColor }}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 w-full shadow-lg transition-all duration-300 overflow-hidden ${isOpen ? "max-h-96 py-6" : "max-h-0"}`}
        style={{ backgroundColor: mobileBg }}
      >
        <div className="flex flex-col items-center gap-5 text-base font-medium">
          {[
            { label: 'Beranda', route: 'beranda' },
            { label: 'Tentang Kami', route: 'about' },
            { label: 'Layanan', route: 'services' },
            { label: 'Aktivitas', route: 'activity' },
            { label: 'Berita', route: 'news' },
            { label: 'Katalog', route: 'katalog' },
          ].map(item => (
            <Link key={item.route} href={route(item.route)} onClick={() => setIsOpen(false)} style={{ color: mobileLinkColor }}>
              {item.label}
            </Link>
          ))}
          {canRegister && (
            <Link href="/register" onClick={() => setIsOpen(false)} style={{ color: mobileLinkColor }}>Daftar</Link>
          )}
          {canLogin && (
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="px-6 py-2 rounded-full font-bold"
              style={dark
                ? { border: '1px solid #FE961C', color: '#FE961C' }
                : { border: '1px solid #15803d', color: '#15803d' }
              }
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
