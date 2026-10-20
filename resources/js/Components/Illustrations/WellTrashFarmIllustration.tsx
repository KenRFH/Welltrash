import React from "react";

export const WellTrashFarmIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-auto" }) => {
    return (
        <svg
            viewBox="0 0 760 240"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="Diagram Arsitektur Fasilitas Pengolahan WellTrash Farm Jember"
        >
            <defs>
                <pattern id="farm-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#164E33" strokeWidth="0.5" strokeOpacity="0.1" />
                </pattern>
                <linearGradient id="farm-zone-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#F8FAF8" stopOpacity="0.6" />
                </linearGradient>
            </defs>

            <rect width="760" height="240" fill="url(#farm-grid)" rx="4" />
            <path d="M 60 170 H 700" stroke="#164E33" strokeWidth="2" strokeDasharray="6 4" strokeOpacity="0.3" />

            {/* ZONE 1: PENERIMAAN */}
            <g transform="translate(30, 30)">
                <rect width="155" height="180" rx="3" fill="url(#farm-zone-grad)" stroke="#0A291A" strokeWidth="1.2" />
                <rect x="0" y="0" width="155" height="24" rx="2" fill="#0A291A" />
                <text x="12" y="16" fill="#9EFF00" fontSize="8" fontFamily="DM Mono" fontWeight="bold">01. INFLOW &amp; WEIGHING</text>

                <rect x="15" y="40" width="125" height="60" fill="#E3ECE5" stroke="#164E33" strokeWidth="1" />
                <rect x="25" y="55" width="45" height="45" fill="#FFFFFF" stroke="#164E33" strokeWidth="1" strokeDasharray="2 2" />
                <rect x="78" y="65" width="50" height="28" rx="2" fill="#164E33" />
                <circle cx="88" cy="94" r="5" fill="#0A291A" />
                <circle cx="118" cy="94" r="5" fill="#0A291A" />

                <rect x="15" y="112" width="125" height="22" rx="2" fill="#FFFFFF" stroke="#164E33" strokeWidth="1" />
                <text x="25" y="126" fill="#0A291A" fontSize="7.5" fontFamily="DM Mono" fontWeight="700">SCALE: DIGITAL VERIFIED</text>
                <text x="12" y="152" fill="#526057" fontSize="7" fontFamily="DM Sans">Penerimaan &amp; penimbangan</text>
                <text x="12" y="163" fill="#526057" fontSize="7" fontFamily="DM Sans">tonase resmi komersial.</text>
            </g>

            <g transform="translate(195, 115)">
                <circle cx="10" cy="0" r="9" fill="#0A291A" />
                <path d="M 7 -3 L 13 0 L 7 3" stroke="#9EFF00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>

            {/* ZONE 2: PEMILAHAN */}
            <g transform="translate(225, 30)">
                <rect width="155" height="180" rx="3" fill="url(#farm-zone-grad)" stroke="#0A291A" strokeWidth="1.2" />
                <rect x="0" y="0" width="155" height="24" rx="2" fill="#164E33" />
                <text x="12" y="16" fill="#FFFFFF" fontSize="8" fontFamily="DM Mono" fontWeight="bold">02. SORTING CONVEYOR</text>

                <rect x="15" y="45" width="125" height="20" rx="2" fill="#E3ECE5" stroke="#164E33" strokeWidth="1" />
                <line x1="25" y1="45" x2="130" y2="45" stroke="#0A291A" strokeWidth="1" strokeDasharray="3 3" />
                <path d="M 35 65 L 30 95 H 55 L 50 65 Z" fill="#9EFF00" fillOpacity="0.3" stroke="#164E33" strokeWidth="1" />
                <path d="M 68 65 L 63 95 H 88 L 83 65 Z" fill="#FFFFFF" stroke="#164E33" strokeWidth="1" />
                <path d="M 100 65 L 95 95 H 120 L 115 65 Z" fill="#E3ECE5" stroke="#164E33" strokeWidth="1" />

                <text x="42" y="112" fill="#164E33" fontSize="6" fontFamily="DM Mono" fontWeight="bold" textAnchor="middle">ORG</text>
                <text x="75" y="112" fill="#0A291A" fontSize="6" fontFamily="DM Mono" fontWeight="bold" textAnchor="middle">PLASTIK</text>
                <text x="108" y="112" fill="#526057" fontSize="6" fontFamily="DM Mono" fontWeight="bold" textAnchor="middle">KERTAS</text>

                <text x="12" y="152" fill="#526057" fontSize="7" fontFamily="DM Sans">Pemisahan mekanis &amp; manual</text>
                <text x="12" y="163" fill="#526057" fontSize="7" fontFamily="DM Sans">ke dalam 3 aliran material.</text>
            </g>

            <g transform="translate(390, 115)">
                <circle cx="10" cy="0" r="9" fill="#0A291A" />
                <path d="M 7 -3 L 13 0 L 7 3" stroke="#9EFF00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>

            {/* ZONE 3: BIOKONVERSI BSF */}
            <g transform="translate(420, 30)">
                <rect width="155" height="180" rx="3" fill="url(#farm-zone-grad)" stroke="#0A291A" strokeWidth="1.2" />
                <rect x="0" y="0" width="155" height="24" rx="2" fill="#164E33" />
                <text x="12" y="16" fill="#9EFF00" fontSize="8" fontFamily="DM Mono" fontWeight="bold">03. BIOKONVERSI BSF</text>

                <rect x="15" y="40" width="125" height="55" rx="2" fill="#FFFFFF" stroke="#164E33" strokeWidth="1" />
                <rect x="25" y="48" width="48" height="8" rx="1" fill="#9EFF00" fillOpacity="0.4" stroke="#164E33" strokeWidth="0.8" />
                <rect x="25" y="60" width="48" height="8" rx="1" fill="#9EFF00" fillOpacity="0.4" stroke="#164E33" strokeWidth="0.8" />
                <rect x="25" y="72" width="48" height="8" rx="1" fill="#9EFF00" fillOpacity="0.4" stroke="#164E33" strokeWidth="0.8" />
                <text x="49" y="88" fill="#164E33" fontSize="6" fontFamily="DM Mono" textAnchor="middle">MAGGOT RACKS</text>

                <path d="M 85 80 L 105 52 L 125 80 Z" fill="#E3ECE5" stroke="#164E33" strokeWidth="1" />
                <text x="105" y="92" fill="#0A291A" fontSize="6" fontFamily="DM Mono" textAnchor="middle">KOMPOS</text>

                <text x="12" y="152" fill="#526057" fontSize="7" fontFamily="DM Sans">Pengolahan sisa organik</text>
                <text x="12" y="163" fill="#526057" fontSize="7" fontFamily="DM Sans">menjadi pakan BSF &amp; pupuk.</text>
            </g>

            <g transform="translate(585, 115)">
                <circle cx="10" cy="0" r="9" fill="#0A291A" />
                <path d="M 7 -3 L 13 0 L 7 3" stroke="#9EFF00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>

            {/* ZONE 4: BALER & RECOVERY */}
            <g transform="translate(615, 30)">
                <rect width="115" height="180" rx="3" fill="url(#farm-zone-grad)" stroke="#0A291A" strokeWidth="1.2" />
                <rect x="0" y="0" width="115" height="24" rx="2" fill="#0A291A" />
                <text x="10" y="16" fill="#9EFF00" fontSize="8" fontFamily="DM Mono" fontWeight="bold">04. RECOVERY</text>

                <rect x="15" y="42" width="85" height="52" rx="2" fill="#FFFFFF" stroke="#0A291A" strokeWidth="1" />
                <rect x="25" y="55" width="28" height="28" fill="#164E33" stroke="#9EFF00" strokeWidth="1" />
                <line x1="25" y1="69" x2="53" y2="69" stroke="#9EFF00" strokeWidth="0.8" />
                <line x1="39" y1="55" x2="39" y2="83" stroke="#9EFF00" strokeWidth="0.8" />

                <circle cx="75" cy="62" r="5" fill="#E3ECE5" stroke="#164E33" />
                <circle cx="85" cy="74" r="5" fill="#E3ECE5" stroke="#164E33" />

                <rect x="15" y="105" width="85" height="20" rx="2" fill="#9EFF00" />
                <text x="57" y="118" fill="#0A291A" fontSize="6.5" fontFamily="DM Mono" fontWeight="bold" textAnchor="middle">
                    RAW MATERIAL OK
                </text>

                <text x="10" y="152" fill="#526057" fontSize="7" fontFamily="DM Sans">Bahan baku industri &amp;</text>
                <text x="10" y="163" fill="#526057" fontSize="7" fontFamily="DM Sans">daur ulang sirkular.</text>
            </g>
        </svg>
    );
};
