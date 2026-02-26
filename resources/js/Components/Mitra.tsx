import React from "react";
import sppg from "@/assets/icon/mitra/sppg_bgn.png";
import dlh from "@/assets/icon/mitra/dlh.png";
import dafam from "@/assets/icon/mitra/dafam.png";
import pemkab from "@/assets/icon/mitra/pemkab.png";

type MitraProps = {
    name: string;
    icon: string;
};

const mitraData: MitraProps[] = [
    { name: "SPPG", icon: sppg },
    { name: "DLH Jember", icon: dlh },
    { name: "DAFAM Hotel", icon: dafam },
    { name: "Pemkab Jember", icon: pemkab },
];

const Mitra: React.FC = () => {
    // Duplicate data for seamless loop (enough items to fill wide screens)
    const doubledData = [...mitraData, ...mitraData, ...mitraData, ...mitraData, ...mitraData, ...mitraData];

    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
                <div className="inline-flex items-center space-x-2 bg-green-50 rounded-full px-4 py-2 border border-green-100 mb-4">
                    <span className="text-sm font-medium text-green-700">
                        Kolaborasi Kami
                    </span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl font-poppins">
                    Mitra Terpercaya Kami
                </h2>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                    Bangga bekerja sama dengan instansi pemerintah dan perusahaan terkemuka untuk mewujudkan pengelolaan limbah yang lebih baik di Jember.
                </p>
            </div>

            <div className="relative flex flex-col gap-4 md:gap-8 overflow-hidden max-w-7xl mx-auto">
                {/* Row 1: Moves Left (Normal Marquee) */}
                <div
                    className="
                        flex gap-4 md:gap-8 whitespace-nowrap
                        animate-marquee
                        will-change-transform
                        [animation-duration:20s]
                        md:[animation-duration:35s]
                        lg:[animation-duration:45s]
                        hover:[animation-play-state:paused]
                    "
                >
                    {doubledData.map((item, index) => (
                        <div
                            key={`row1-${index}`}
                            className="flex-shrink-0 group relative overflow-hidden rounded-xl bg-gray-50 border border-gray-100 p-4 md:p-6 transition-all duration-300 hover:bg-white hover:border-green-200 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)] w-[120px] md:w-[180px] flex items-center justify-center grayscale hover:grayscale-0"
                        >
                            <img
                                src={item.icon}
                                alt={item.name}
                                className="h-10 w-10 md:h-16 md:w-16 object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300 group-hover:scale-110"
                            />
                        </div>
                    ))}
                </div>

                {/* Row 2: Moves Right (Reverse Marquee) */}
                <div
                     className="
                        flex gap-4 md:gap-8 whitespace-nowrap
                        animate-marqueeReverse
                        will-change-transform
                        [animation-duration:20s]
                        md:[animation-duration:35s]
                        lg:[animation-duration:45s]
                        hover:[animation-play-state:paused]
                    "
                >
                    {doubledData.map((item, index) => (
                         <div
                            key={`row2-${index}`}
                             className="flex-shrink-0 group relative overflow-hidden rounded-xl bg-gray-50 border border-gray-100 p-4 md:p-6 transition-all duration-300 hover:bg-white hover:border-emerald-200 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] w-[120px] md:w-[180px] flex items-center justify-center grayscale hover:grayscale-0"
                        >
                            <img
                                src={item.icon}
                                alt={item.name}
                                className="h-10 w-10 md:h-16 md:w-16 object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300 group-hover:scale-110"
                            />
                        </div>
                    ))}
                </div>

                 {/* Gradient Fade */}
                 <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
                <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
            </div>
        </section>
    );
};

export default Mitra;
