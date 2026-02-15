import React from "react";
import murah from "@/assets/icon/murah.png";
import akuntabel from "@/assets/icon/akuntable.png";
import jadwal from "@/assets/icon/jadwal.png";
import mitra from "@/assets/icon/mitra.png";

type WhyProps = {
    name: string;
    icon: string;
    description: string;
};

const whyData: WhyProps[] = [
    {
        name: "Terjadwal",
        icon: jadwal,
        description: "Bersih, Pasti, Terjadwal",
    },
    {
        name: "Murah",
        icon: murah,
        description: "Harga Kompetitif & Transparan",
    },
    {
        name: "Akuntabel",
        icon: akuntabel,
        description: "Laporan Real-Time & Riwayat Lengkap",
    },
    {
        name: "Mitra",
        icon: mitra,
        description: "Tim Profesional Siap Membantu Anda Kapan Saja",
    },
];

const Why = () => {
    return (
        <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">Kenapa Memilih Kami</h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        Solusi Pengelolaan Sampah Terbaik
                    </p>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                        Kami menawarkan layanan yang profesional, transparan, dan terpercaya untuk kebutuhan perusahaan Anda.
                    </p>
                </div>

                {/* Grid 4 Columns */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                    {whyData.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-5 md:p-8 border border-gray-100 group flex flex-col items-center text-center md:items-start md:text-left"
                        >
                            {/* Icon Wrapper */}
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-green-50 flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                                <img
                                    src={item.icon}
                                    alt={item.name}
                                    className="w-6 h-6 md:w-10 md:h-10 object-contain"
                                />
                            </div>

                            {/* Title */}
                            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 group-hover:text-green-600 transition-colors">
                                {item.name}
                            </h3>

                            {/* Description */}
                            <p className="text-gray-600 leading-snug md:leading-relaxed text-xs md:text-sm">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Why;
