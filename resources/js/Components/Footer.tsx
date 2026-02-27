import React from "react";
import { Link } from "@inertiajs/react";

const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-900 text-white pt-16 pb-8 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                             {/* Logo Placeholder - You might want to use your actual logo img here if available */}
                            <span className="text-2xl font-bold tracking-tight text-white">
                                Well<span className="text-green-500">Trash</span>
                            </span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Solusi pengelolaan limbah profesional, terpercaya, dan ramah lingkungan untuk masa depan yang lebih bersih.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            {/* Social Icons */}
                            <a href="#" className="text-slate-400 hover:text-green-500 transition-colors">
                                <span className="sr-only">Instagram</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465C9.673 2.013 9.92 2 12.315 2zm-1.025 21.012c4.32-.016 7.155-.06 8.528-5.696.069-.286.136-1.377.127-3.793-.014-4.885-.45-6.732-2.197-8.48C15.998 3.292 14.15 2.857 9.264 2.871c-2.416.009-3.507.075-3.793.127-5.636 1.373-5.68 4.208-5.696 8.528-.013 4.885.344 6.942 3.328 8.01 1.747 1.054 3.753.868 8.187 1.476z" clipRule="evenodd" />
                                    <path fillRule="evenodd" d="M12.315 5.86c-3.468 0-6.282 2.814-6.282 6.282 0 3.468 2.814 6.282 6.282 6.282 3.468 0 6.282-2.814 6.282-6.282 0-3.468-2.814-6.282-6.282-6.282zm0 10.455a4.173 4.173 0 110-8.345 4.173 4.173 0 010 8.345z" clipRule="evenodd" />
                                    <path fillRule="evenodd" d="M18.665 6.641a1.442 1.442 0 11-2.885 0 1.442 1.442 0 012.885 0z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a href="#" className="text-slate-400 hover:text-green-500 transition-colors">
                                <span className="sr-only">LinkedIn</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" clipRule="evenodd" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Links Column */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">Navigasi</h3>
                        <ul className="space-y-3">
                            <li><Link href="/" className="text-slate-400 hover:text-green-500 transition-colors text-sm">Beranda</Link></li>
                            <li><a href="#tentang" className="text-slate-400 hover:text-green-500 transition-colors text-sm">Tentang Kami</a></li>
                            <li><a href="#layanan" className="text-slate-400 hover:text-green-500 transition-colors text-sm">Layanan</a></li>
                            <li><a href="#harga" className="text-slate-400 hover:text-green-500 transition-colors text-sm">Harga</a></li>
                        </ul>
                    </div>

                    {/* Services Column */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">Layanan</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-slate-400 hover:text-green-500 transition-colors text-sm">Pengangkutan Sampah</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-green-500 transition-colors text-sm">Pengelolaan Limbah B3</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-green-500 transition-colors text-sm">Daur Ulang</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-green-500 transition-colors text-sm">Konsultasi Lingkungan</a></li>
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">Hubungi Kami</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3 text-slate-400 text-sm">
                                <svg className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>Baratan Wetan, Baratan, Kec. Patrang, Kabupaten Jember, Jawa Timur 68100</span>
                            </li>
                            <li className="flex items-center space-x-3 text-slate-400 text-sm">
                                <svg className="h-5 w-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>mashudiproject@gmail.com</span>
                            </li>
                             <li className="flex items-center space-x-3 text-slate-400 text-sm">
                                <svg className="h-5 w-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>+62 812-3456-7890</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
                    <p>&copy; {new Date().getFullYear()} PT Sarana Utama Welltrash Farm. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-green-500 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-green-500 transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
