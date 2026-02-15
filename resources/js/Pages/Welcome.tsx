import Navbar from "@/Components/Navbar";
import imgHero from "@/assets/img/imgHero.png";
import React from "react";
import Why from "@/Components/Why";
import Mitra from "@/Components/Mitra";
import WasteFlow from "@/Components/WasteFlow";

const Welcome = () => {
    return (
        <>
            <Navbar />
            <section className="relative w-full min-h-screen flex items-center bg-white mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center space-x-2 bg-lime-50 rounded-full px-4 py-2 border border-green-100">
                                <span className="flex h-2 w-2 rounded-full bg-lime-500"></span>
                                <span className="text-sm font-medium text-green-700">
                                    Solusi Sampah Jember
                                </span>
                            </div>

                            <div className="space-y-4 font-poppins">
                                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
                                    Profesional{" "}
                                    <span className="bg-clip-text text-transparent bg-gradient-to-br from-green-500 to-green-600">
                                        Solusi Manajemen
                                    </span>{" "}
                                    Sampah
                                </h1>
                                <p className="text-lg text-gray-600 max-w-lg">
                                    Welltrash is a simple, professional, and
                                    scheduled platform for companies to manage
                                    their waste efficiently. Transforming waste
                                    management across Indonesia.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <button className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full transition-all shadow-lg shadow-green-600/30 flex items-center gap-2 group duration-500">
                                    Mulai Berlangganan
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 group-hover:translate-x-1 transition-transform"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                                        />
                                    </svg>
                                </button>

                                <button className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-full border border-gray-200 transition-all shadow-sm">
                                    Lihat Detail
                                </button>
                            </div>

                            <div className="pt-8 flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex -space-x-3">
                                    <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                        SPPG
                                    </div>
                                    <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">
                                        Daf
                                    </div>
                                    <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-400 flex items-center justify-center text-xs font-bold text-gray-600">
                                        Res
                                    </div>
                                </div>
                                <p>
                                    Dipercaya{" "}
                                    <span className="font-bold text-gray-800">
                                        10+ Perusahaan
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="relative w-full max-w-md mx-auto lg:max-w-lg">
                            <div className="absolute inset-0 -z-10 flex items-center justify-center">
                                <div className="w-[110%] h-[110%] bg-gradient-to-tr from-blue-200/40 to-purple-300/40 rounded-full blur-3xl"></div>
                            </div>

                            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white border border-gray-200">
                                <div className="aspect-[4/5] overflow-hidden">
                                    <img
                                        src={imgHero}
                                        alt="Hero"
                                        className="w-full h-full object-cover transition-transform duration-700"
                                    />
                                </div>

                                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md px-5 py-4 rounded-2xl shadow-lg border border-gray-200 max-w-[220px]">
                                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                                        Efisensi
                                    </p>
                                    <h4 className="text-2xl font-bold text-gray-900">
                                        Up to 20x
                                    </h4>
                                    <p className="text-xs text-gray-600 mt-1">
                                        Bersih, Pasti, Terjadwal
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Why />
            <WasteFlow />
            <Mitra />
        </>
    );
};

export default Welcome;
