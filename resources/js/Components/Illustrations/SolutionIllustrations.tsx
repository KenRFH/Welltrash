import React from "react";

export const CorporateWasteIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-auto" }) => {
    return (
        <svg
            viewBox="0 0 360 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="Ilustrasi Pengelolaan Limbah Gedung Perkantoran"
        >
            <defs>
                <pattern id="sol-grid-corp" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#164E33" strokeWidth="0.5" strokeOpacity="0.12" />
                </pattern>
            </defs>

            <rect width="360" height="180" fill="url(#sol-grid-corp)" />
            <line x1="20" y1="150" x2="340" y2="150" stroke="#0F1713" strokeWidth="1.5" strokeOpacity="0.2" />

            {/* Tower 1 */}
            <rect x="40" y="55" width="45" height="95" fill="#E3ECE5" stroke="#164E33" strokeWidth="1.2" />
            <g stroke="#164E33" strokeWidth="1" strokeOpacity="0.4">
                <line x1="50" y1="70" x2="56" y2="70" />
                <line x1="68" y1="70" x2="74" y2="70" />
                <line x1="50" y1="88" x2="56" y2="88" />
                <line x1="68" y1="88" x2="74" y2="88" />
                <line x1="50" y1="106" x2="56" y2="106" />
                <line x1="68" y1="106" x2="74" y2="106" />
                <line x1="50" y1="124" x2="56" y2="124" />
                <line x1="68" y1="124" x2="74" y2="124" />
            </g>

            {/* Tower 2 */}
            <rect x="95" y="30" width="70" height="120" fill="#FFFFFF" stroke="#0A291A" strokeWidth="1.5" />
            <g stroke="#164E33" strokeWidth="0.9" strokeOpacity="0.45">
                {[45, 62, 79, 96, 113, 130].map((y) => (
                    <React.Fragment key={y}>
                        <rect x="105" y={y} width="12" height="9" fill="#F8FAF8" />
                        <rect x="124" y={y} width="12" height="9" fill="#F8FAF8" />
                        <rect x="143" y={y} width="12" height="9" fill="#9EFF00" fillOpacity="0.25" stroke="#164E33" />
                    </React.Fragment>
                ))}
            </g>
            <line x1="130" y1="30" x2="130" y2="18" stroke="#0A291A" strokeWidth="1.5" />
            <circle cx="130" cy="18" r="2.5" fill="#9EFF00" stroke="#0A291A" strokeWidth="1" />

            {/* Commercial Wing */}
            <rect x="175" y="80" width="80" height="70" fill="#F8FAF8" stroke="#164E33" strokeWidth="1.2" />
            <path d="M 175 80 L 215 65 L 255 80 Z" fill="#E3ECE5" stroke="#164E33" strokeWidth="1.2" />
            <rect x="190" y="100" width="50" height="50" fill="#FFFFFF" stroke="#164E33" strokeWidth="1" strokeDasharray="2 2" />
            <text x="215" y="128" fill="#526057" fontSize="8" fontFamily="DM Sans" textAnchor="middle" fontWeight="600">
                LOBBY / RETAIL
            </text>

            {/* Segregated Waste Bins */}
            <rect x="270" y="118" width="16" height="32" rx="2" fill="#164E33" stroke="#0A291A" strokeWidth="1.2" />
            <rect x="268" y="115" width="20" height="4" rx="1" fill="#0A291A" />
            <circle cx="278" cy="130" r="3" fill="#9EFF00" />
            <text x="278" y="144" fill="#FFFFFF" fontSize="6" fontFamily="DM Mono" textAnchor="middle">ORG</text>

            <rect x="292" y="118" width="16" height="32" rx="2" fill="#FFFFFF" stroke="#164E33" strokeWidth="1.2" />
            <rect x="290" y="115" width="20" height="4" rx="1" fill="#164E33" />
            <circle cx="300" cy="130" r="3" fill="#164E33" />
            <text x="300" y="144" fill="#164E33" fontSize="6" fontFamily="DM Mono" textAnchor="middle" fontWeight="bold">REC</text>

            <rect x="314" y="122" width="16" height="28" rx="2" fill="#E3ECE5" stroke="#526057" strokeWidth="1.2" />
            <rect x="312" y="119" width="20" height="4" rx="1" fill="#526057" />
            <text x="322" y="142" fill="#526057" fontSize="6" fontFamily="DM Mono" textAnchor="middle">RES</text>

            {/* Scheduled Dispatch Badge */}
            <g transform="translate(180, 20)">
                <rect width="135" height="32" rx="3" fill="#0A291A" stroke="#9EFF00" strokeWidth="1" />
                <circle cx="16" cy="16" r="5" fill="#9EFF00" />
                <path d="M 14 16 L 16 18 L 19 14" stroke="#0A291A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                <text x="28" y="15" fill="#FFFFFF" fontSize="8" fontFamily="DM Sans" fontWeight="700">
                    JADWAL TERATUR
                </text>
                <text x="28" y="24" fill="#9EFF00" fontSize="7.5" fontFamily="DM Mono">
                    06:00 &amp; 19:00 WIB
                </text>
            </g>

            {/* Logistics Route Path */}
            <path d="M 40 162 H 180 Q 220 162 240 152 T 340 152" fill="none" stroke="#9EFF00" strokeWidth="2" strokeDasharray="4 3" />
            <circle cx="40" cy="162" r="3.5" fill="#0A291A" stroke="#9EFF00" strokeWidth="1.5" />
            <circle cx="340" cy="152" r="3.5" fill="#0A291A" stroke="#9EFF00" strokeWidth="1.5" />
        </svg>
    );
};

export const IndustrialWasteIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-auto" }) => {
    return (
        <svg
            viewBox="0 0 360 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="Ilustrasi Pengelolaan Limbah Industri Non-B3"
        >
            <defs>
                <pattern id="sol-grid-ind" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#164E33" strokeWidth="0.5" strokeOpacity="0.12" />
                </pattern>
            </defs>

            <rect width="360" height="180" fill="url(#sol-grid-ind)" />
            <line x1="20" y1="150" x2="340" y2="150" stroke="#0F1713" strokeWidth="1.5" strokeOpacity="0.2" />

            {/* Factory Architecture */}
            <path d="M 30 150 V 90 L 60 70 V 90 L 90 70 V 90 L 120 70 V 150 Z" fill="#F8FAF8" stroke="#164E33" strokeWidth="1.4" />
            <rect x="45" y="105" width="20" height="30" fill="#E3ECE5" stroke="#164E33" strokeWidth="1" />
            <rect x="80" y="105" width="25" height="45" fill="#FFFFFF" stroke="#164E33" strokeWidth="1" />
            <line x1="84" y1="115" x2="101" y2="115" stroke="#164E33" strokeWidth="1" />
            <line x1="84" y1="122" x2="101" y2="122" stroke="#164E33" strokeWidth="1" />
            <line x1="84" y1="129" x2="101" y2="129" stroke="#164E33" strokeWidth="1" />

            {/* Industrial Storage Silo */}
            <rect x="130" y="55" width="30" height="95" rx="3" fill="#E3ECE5" stroke="#0A291A" strokeWidth="1.4" />
            <ellipse cx="145" cy="55" rx="15" ry="6" fill="#164E33" stroke="#0A291A" strokeWidth="1.2" />
            <line x1="130" y1="85" x2="160" y2="85" stroke="#0A291A" strokeWidth="1" strokeOpacity="0.3" />
            <line x1="130" y1="115" x2="160" y2="115" stroke="#0A291A" strokeWidth="1" strokeOpacity="0.3" />

            {/* Industrial Roll-off Skip Container */}
            <path d="M 180 150 L 195 105 H 285 L 298 150 Z" fill="#164E33" stroke="#0A291A" strokeWidth="1.6" />
            <line x1="210" y1="105" x2="204" y2="150" stroke="#0A291A" strokeWidth="1.8" />
            <line x1="240" y1="105" x2="240" y2="150" stroke="#0A291A" strokeWidth="1.8" />
            <line x1="270" y1="105" x2="276" y2="150" stroke="#0A291A" strokeWidth="1.8" />
            <rect x="192" y="101" width="96" height="5" rx="1" fill="#0A291A" />

            {/* Certified Non-B3 Badge */}
            <g transform="translate(185, 25)">
                <rect width="130" height="34" rx="2" fill="#FFFFFF" stroke="#0A291A" strokeWidth="1.2" />
                <rect x="0" y="0" width="5" height="34" fill="#9EFF00" />
                <text x="14" y="16" fill="#0A291A" fontSize="8" fontFamily="DM Sans" fontWeight="800">
                    NON-B3 INDUSTRI RESMI
                </text>
                <text x="14" y="26" fill="#526057" fontSize="7" fontFamily="DM Mono">
                    SOP &amp; MANIFEST RESMI
                </text>
            </g>

            {/* Digital Scale Platform */}
            <g transform="translate(225, 68)">
                <rect width="100" height="24" rx="2" fill="#0A291A" stroke="#164E33" strokeWidth="1" />
                <circle cx="10" cy="12" r="3" fill="#9EFF00" />
                <text x="20" y="16" fill="#9EFF00" fontSize="8.5" fontFamily="DM Mono" fontWeight="700">
                    2.450 KG NETTO
                </text>
            </g>

            {/* Crane Hook Line */}
            <path d="M 240 20 V 45" stroke="#526057" strokeWidth="1.5" strokeDasharray="2 2" />
            <circle cx="240" cy="48" r="3" fill="none" stroke="#526057" strokeWidth="1.5" />
        </svg>
    );
};
export const RecyclableRecoveryIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-auto" }) => {
    return (
        <svg
            viewBox="0 0 360 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="Ilustrasi Pemulihan Sirkular dan Pengolahan Daur Ulang"
        >
            <defs>
                <pattern id="sol-grid-rec" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#164E33" strokeWidth="0.5" strokeOpacity="0.12" />
                </pattern>
            </defs>

            <rect width="360" height="180" fill="url(#sol-grid-rec)" />

            {/* Circular Orbit & Leaf Center */}
            <g transform="translate(180, 85)">
                <circle cx="0" cy="0" r="54" stroke="#164E33" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.4" />
                <path d="M 0 -54 A 54 54 0 0 1 50 18" stroke="#164E33" strokeWidth="2.5" strokeLinecap="round" />
                <polygon points="52,24 45,16 57,14" fill="#164E33" />

                <path d="M 50 18 A 54 54 0 0 1 -44 32" stroke="#9EFF00" strokeWidth="2.5" strokeLinecap="round" />
                <polygon points="-50,28 -41,31 -46,39" fill="#9EFF00" />

                <path d="M -44 32 A 54 54 0 0 1 0 -54" stroke="#0A291A" strokeWidth="2.5" strokeLinecap="round" />
                <polygon points="-3,-55 5,-48 3,-60" fill="#0A291A" />

                {/* Eco Leaf Center */}
                <circle cx="0" cy="0" r="24" fill="#0A291A" stroke="#9EFF00" strokeWidth="1.5" />
                <path d="M 0 -12 C -8 -2 -6 8 0 12 C 6 8 8 -2 0 -12 Z" fill="#9EFF00" />
            </g>

            {/* Stream 1: Organik */}
            <g transform="translate(25, 25)">
                <rect width="105" height="40" rx="2" fill="#FFFFFF" stroke="#164E33" strokeWidth="1.2" />
                <circle cx="16" cy="20" r="6" fill="#E3ECE5" stroke="#164E33" strokeWidth="1" />
                <text x="28" y="17" fill="#0A291A" fontSize="7.5" fontFamily="DM Sans" fontWeight="700">FRAKSI ORGANIK</text>
                <text x="28" y="27" fill="#526057" fontSize="7" fontFamily="DM Mono">BSF &amp; Kompos</text>
            </g>

            {/* Stream 2: Plastik */}
            <g transform="translate(25, 115)">
                <rect width="105" height="40" rx="2" fill="#FFFFFF" stroke="#164E33" strokeWidth="1.2" />
                <circle cx="16" cy="20" r="6" fill="#E3ECE5" stroke="#164E33" strokeWidth="1" />
                <text x="28" y="17" fill="#0A291A" fontSize="7.5" fontFamily="DM Sans" fontWeight="700">POLYMER / PLASTIK</text>
                <text x="28" y="27" fill="#526057" fontSize="7" fontFamily="DM Mono">Flake &amp; Pelet</text>
            </g>

            {/* Stream 3: Kertas */}
            <g transform="translate(230, 70)">
                <rect width="105" height="40" rx="2" fill="#FFFFFF" stroke="#164E33" strokeWidth="1.2" />
                <circle cx="16" cy="20" r="6" fill="#9EFF00" stroke="#0A291A" strokeWidth="1" />
                <text x="28" y="17" fill="#0A291A" fontSize="7.5" fontFamily="DM Sans" fontWeight="700">KERTAS &amp; KARTON</text>
                <text x="28" y="27" fill="#526057" fontSize="7" fontFamily="DM Mono">Baling Paper</text>
            </g>

            {/* Bottom Tag */}
            <g transform="translate(105, 150)">
                <rect width="150" height="22" rx="2" fill="#0A291A" stroke="#9EFF00" strokeWidth="0.8" />
                <text x="75" y="14" fill="#9EFF00" fontSize="7.5" fontFamily="DM Mono" fontWeight="700" textAnchor="middle">
                    REDUKSI RESIDU HINGGA 85%
                </text>
            </g>
        </svg>
    );
};

