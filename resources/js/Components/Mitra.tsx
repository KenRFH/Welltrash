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
    const doubledData = [
        ...mitraData, ...mitraData,
        ...mitraData, ...mitraData,
        ...mitraData, ...mitraData,
    ];

    return (
        <section className="bg-white overflow-hidden md:min-h-screen flex flex-col justify-center gap-6 sm:gap-8 md:gap-12 py-10 sm:py-14 md:py-20">

            {/* Header */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 font-poppins leading-tight">
                    Mitra Terpercaya Kami
                </h2>
                <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-600 max-w-xs sm:max-w-xl md:max-w-2xl mx-auto leading-relaxed">
                    Bangga bekerja sama dengan instansi pemerintah dan perusahaan yang peduli lingkungan untuk mewujudkan pengelolaan limbah yang lebih baik di Jember.
                </p>
            </div>

            {/* Marquee Rows */}
            <div className="relative flex flex-col gap-4 md:gap-8 overflow-hidden">

                {/* Row 1: Moves Left */}
                <div className="flex gap-4 md:gap-8 whitespace-nowrap animate-marquee will-change-transform [animation-duration:20s] md:[animation-duration:35s] lg:[animation-duration:45s] hover:[animation-play-state:paused]">
                    {doubledData.map((item, index) => (
                        <div
                            key={`row1-${index}`}
                            className="flex-shrink-0 group relative overflow-hidden rounded-xl bg-gray-50 border border-gray-100 p-4 md:p-6 transition-all duration-300 hover:bg-white hover:border-green-200 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)] w-[120px] md:w-[180px] flex items-center justify-center"
                        >
                            <img
                                src={item.icon}
                                alt={item.name}
                                className="h-10 w-10 md:h-16 md:w-16 object-contain opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110"
                            />
                        </div>
                    ))}
                </div>

                {/* Row 2: Moves Right */}
                <div className="flex gap-4 md:gap-8 whitespace-nowrap animate-marqueeReverse will-change-transform [animation-duration:20s] md:[animation-duration:35s] lg:[animation-duration:45s] hover:[animation-play-state:paused]">
                    {doubledData.map((item, index) => (
                        <div
                            key={`row2-${index}`}
                            className="flex-shrink-0 group relative overflow-hidden rounded-xl bg-gray-50 border border-gray-100 p-4 md:p-6 transition-all duration-300 hover:bg-white hover:border-emerald-200 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] w-[120px] md:w-[180px] flex items-center justify-center"
                        >
                            <img
                                src={item.icon}
                                alt={item.name}
                                className="h-10 w-10 md:h-16 md:w-16 object-contain opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110"
                            />
                        </div>
                    ))}
                </div>

            </div>

        </section>
    );
};

export default Mitra;