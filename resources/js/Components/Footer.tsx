import React from "react";
import { Link } from "@inertiajs/react";
import logowelltrash from "../../../public/build/assets/logowelltrash.png";

interface FooterProps {
    dark?: boolean;
}

const navLinks = [
    { label: 'Beranda', route: 'beranda' },
    { label: 'Tentang Kami', route: 'about' },
    { label: 'Layanan', route: 'services' },
    { label: 'Aktivitas', route: 'activity' },
    { label: 'Berita', route: 'news' },
    { label: 'Katalog', route: 'katalog' },
];

const Footer: React.FC<FooterProps> = ({ dark = false }) => {
    const bg = dark ? '#0A1020' : '#0F172A';
    const borderColor = dark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.07)';
    const accentColor = dark ? '#FE961C' : '#7CC13B';
    const subtleTextColor = dark ? 'rgba(240,244,255,0.35)' : 'rgba(240,244,255,0.4)';
    const linkHoverColor = dark ? '#FE961C' : '#7CC13B';

    return (
        <footer style={{ backgroundColor: bg, color: '#F0F4FF' }} className="font-sans">
            <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">

                {/* Top section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12" style={{ borderBottom: `1px solid ${borderColor}` }}>

                    {/* Brand */}
                    <div className="md:col-span-1">
                        <img
                            src={logowelltrash}
                            alt="Welltrash Logo"
                            className="h-16 w-auto object-contain object-left mb-5"
                            style={{ filter: 'brightness(0) invert(1)' }}
                        />
                        <p className="text-sm leading-relaxed mb-6" style={{ color: subtleTextColor }}>
                            Solusi pengelolaan limbah profesional, terpercaya, dan ramah lingkungan untuk masa depan yang lebih bersih.
                        </p>
                        {/* Social */}
                        <div className="flex items-center gap-4">
                            <a href="#" aria-label="Instagram"
                                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                                style={{ backgroundColor: borderColor }}
                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = accentColor}
                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = borderColor as string}
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.45 2.525c.636-.247 1.363-.416 2.427-.465C9.673 2.013 9.92 2 12.315 2zm0 2.162c-2.372 0-2.703.01-3.7.055-.893.041-1.378.19-1.7.315a2.822 2.822 0 00-1.045.68 2.822 2.822 0 00-.68 1.045c-.125.322-.274.807-.315 1.7-.045.997-.055 1.328-.055 3.7s.01 2.703.055 3.7c.041.893.19 1.378.315 1.7.163.42.38.72.68 1.045.325.3.625.517 1.045.68.322.125.807.274 1.7.315.997.045 1.328.055 3.7.055s2.703-.01 3.7-.055c.893-.041 1.378-.19 1.7-.315a2.822 2.822 0 001.045-.68 2.822 2.822 0 00.68-1.045c.125-.322.274-.807.315-1.7.045-.997.055-1.328.055-3.7s-.01-2.703-.055-3.7c-.041-.893-.19-1.378-.315-1.7a2.822 2.822 0 00-.68-1.045 2.822 2.822 0 00-1.045-.68c-.322-.125-.807-.274-1.7-.315-.997-.045-1.328-.055-3.7-.055zm0 3.838a4.162 4.162 0 110 8.325 4.162 4.162 0 010-8.325zm0 2.162a2 2 0 100 4 2 2 0 000-4zm3.965-3.405a.972.972 0 110 1.944.972.972 0 010-1.944z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a href="#" aria-label="WhatsApp"
                                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                                style={{ backgroundColor: borderColor }}
                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = accentColor}
                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = borderColor as string}
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Nav Links */}
                    <div>
                        <h4 className="text-xs font-bold tracking-[0.3em] uppercase mb-6" style={{ color: accentColor }}>Navigasi</h4>
                        <ul className="space-y-3">
                            {navLinks.map(link => (
                                <li key={link.route}>
                                    <Link
                                        href={route(link.route)}
                                        className="text-sm transition-colors duration-200"
                                        style={{ color: subtleTextColor }}
                                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = linkHoverColor}
                                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = subtleTextColor as string}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-xs font-bold tracking-[0.3em] uppercase mb-6" style={{ color: accentColor }}>Hubungi Kami</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-sm" style={{ color: subtleTextColor }}>
                                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: accentColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>Baratan Wetan, Baratan, Kec. Patrang, Kabupaten Jember, Jawa Timur 68100</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm" style={{ color: subtleTextColor }}>
                                <svg className="w-5 h-5 flex-shrink-0" style={{ color: accentColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <a href="mailto:mashudiproject@gmail.com" className="hover:text-white transition-colors">mashudiproject@gmail.com</a>
                            </li>
                            <li className="flex items-center gap-3 text-sm" style={{ color: subtleTextColor }}>
                                <svg className="w-5 h-5 flex-shrink-0" style={{ color: accentColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <a href="https://wa.me/6281336104254" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">+62 813-3610-4254</a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs" style={{ color: subtleTextColor }}>
                    <p>© {new Date().getFullYear()} PT Sarana Utama Welltrash Farm. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
