import React from "react";

export const EcosystemArchitectureIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-auto" }) => {
    return (
        <svg
            viewBox="0 0 460 480"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="Arsitektur Ekosistem Pengelolaan Sampah Terpadu WellTrash"
        >
            <defs>
                <pattern id="eco-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#164E33" strokeWidth="0.5" strokeOpacity="0.1" />
                </pattern>
                <linearGradient id="eco-box-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#F8FAF8" />
                </linearGradient>
            </defs>

            <rect width="460" height="480" fill="url(#eco-grid)" rx="4" />
            <rect width="460" height="480" fill="none" stroke="#164E33" strokeWidth="1" strokeOpacity="0.15" rx="4" />

            {/* Header Badge */}
            <g transform="translate(24, 20)">
                <rect width="180" height="26" rx="2" fill="#0A291A" />
                <circle cx="14" cy="13" r="3" fill="#9EFF00" />
                <text x="24" y="17" fill="#FFFFFF" fontSize="8" fontFamily="DM Mono" fontWeight="bold">
                    WELLTRASH CLOSED-LOOP
                </text>
            </g>

            {/* NODE 1: MITRA BISNIS */}
            <g transform="translate(40, 60)">
                <rect width="380" height="74" rx="3" fill="url(#eco-box-grad)" stroke="#0A291A" strokeWidth="1.3" />
                <rect x="0" y="0" width="6" height="74" fill="#164E33" />
                <circle cx="30" cy="37" r="14" fill="#E3ECE5" stroke="#164E33" strokeWidth="1" />
                <rect x="23" y="28" width="14" height="18" fill="#164E33" />
                <rect x="26" y="31" width="3" height="3" fill="#FFFFFF" />
                <rect x="31" y="31" width="3" height="3" fill="#FFFFFF" />
                <rect x="26" y="37" width="3" height="3" fill="#FFFFFF" />
                <rect x="31" y="37" width="3" height="3" fill="#FFFFFF" />

                <text x="56" y="30" fill="#0A291A" fontSize="11" fontFamily="DM Sans" fontWeight="bold">
                    1. Mitra Bisnis &amp; Komersial
                </text>
                <text x="56" y="44" fill="#526057" fontSize="8" fontFamily="DM Sans">
                    Hotel, Gedung Kantor, F&amp;B, Rumah Sakit &amp; Fasilitas Manufaktur
                </text>
                <text x="56" y="58" fill="#164E33" fontSize="7.5" fontFamily="DM Mono" fontWeight="600">
                    STATUS: Pemilahan Terpisah Di Sumber
                </text>
            </g>

            <g transform="translate(225, 134)">
                <line x1="0" y1="0" x2="0" y2="34" stroke="#164E33" strokeWidth="2" strokeDasharray="4 3" />
                <polygon points="-4,28 0,36 4,28" fill="#164E33" />
            </g>

            {/* NODE 2: ARMADA KHUSUS */}
            <g transform="translate(40, 170)">
                <rect width="380" height="74" rx="3" fill="url(#eco-box-grad)" stroke="#0A291A" strokeWidth="1.3" />
                <rect x="0" y="0" width="6" height="74" fill="#9EFF00" />
                <circle cx="30" cy="37" r="14" fill="#0A291A" />
                <rect x="20" y="31" width="13" height="11" fill="#9EFF00" rx="1" />
                <rect x="33" y="34" width="7" height="8" fill="#FFFFFF" />
                <circle cx="24" cy="43" r="2" fill="#0A291A" />
                <circle cx="37" cy="43" r="2" fill="#0A291A" />

                <text x="56" y="30" fill="#0A291A" fontSize="11" fontFamily="DM Sans" fontWeight="bold">
                    2. Pengangkutan Terjadwal &amp; Tervalidasi
                </text>
                <text x="56" y="44" fill="#526057" fontSize="8" fontFamily="DM Sans">
                    Armada tertutup, tim APD lengkap, &amp; manifest tonase digital
                </text>
                <text x="56" y="58" fill="#164E33" fontSize="7.5" fontFamily="DM Mono" fontWeight="600">
                    RITASE: Sesuai Kontrak SLA Bisnis
                </text>
            </g>

            <g transform="translate(225, 244)">
                <line x1="0" y1="0" x2="0" y2="34" stroke="#164E33" strokeWidth="2" strokeDasharray="4 3" />
                <polygon points="-4,28 0,36 4,28" fill="#164E33" />
            </g>

            {/* NODE 3: WELLTRASH FARM MRF */}
            <g transform="translate(40, 280)">
                <rect width="380" height="84" rx="3" fill="#0A291A" stroke="#164E33" strokeWidth="1.3" />
                <rect x="0" y="0" width="6" height="84" fill="#9EFF00" />
                <circle cx="30" cy="42" r="14" fill="#164E33" stroke="#9EFF00" strokeWidth="1" />
                <path d="M 30 33 C 25 38 26 47 30 50 C 34 47 35 38 30 33 Z" fill="#9EFF00" />

                <text x="56" y="30" fill="#FFFFFF" fontSize="11" fontFamily="DM Sans" fontWeight="bold">
                    3. Pengolahan di WellTrash Farm MRF
                </text>
                <text x="56" y="44" fill="rgba(255,255,255,0.75)" fontSize="8" fontFamily="DM Sans">
                    Biokonversi Maggot BSF &bull; Kompos Matang &bull; Baler Plastik &amp; Kertas
                </text>
                <g transform="translate(56, 54)">
                    <rect width="145" height="18" rx="2" fill="#164E33" />
                    <text x="72" y="12" fill="#9EFF00" fontSize="7" fontFamily="DM Mono" fontWeight="bold" textAnchor="middle">
                        REDUKSI TPA PAKUSARI &gt;85%
                    </text>
                </g>
            </g>

            {/* FEEDBACK LOOP TO NODE 1 */}
            <path d="M 420 322 H 440 V 97 H 420" fill="none" stroke="#9EFF00" strokeWidth="2" strokeDasharray="4 3" />
            <polygon points="426,93 418,97 426,101" fill="#0A291A" />
            <g transform="translate(365, 395)">
                <rect width="75" height="18" rx="2" fill="#0A291A" stroke="#9EFF00" strokeWidth="1" />
                <text x="37" y="12" fill="#9EFF00" fontSize="6.5" fontFamily="DM Mono" fontWeight="bold" textAnchor="middle">
                    ESG LOOP OK
                </text>
            </g>

            {/* NODE 4: ESG DASHBOARD AUDIT */}
            <g transform="translate(40, 385)">
                <rect width="315" height="74" rx="3" fill="url(#eco-box-grad)" stroke="#0A291A" strokeWidth="1.3" />
                <rect x="0" y="0" width="6" height="74" fill="#0A291A" />
                <circle cx="30" cy="37" r="14" fill="#E3ECE5" stroke="#0A291A" strokeWidth="1" />
                <path d="M 24 37 L 28 41 L 36 32" stroke="#0A291A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

                <text x="56" y="30" fill="#0A291A" fontSize="11" fontFamily="DM Sans" fontWeight="bold">
                    4. Sertifikat &amp; Laporan ESG Bulanan
                </text>
                <text x="56" y="44" fill="#526057" fontSize="8" fontFamily="DM Sans">
                    Dokumen resmi siap audit DLH &amp; penilaian kepatuhan regulasi
                </text>
                <text x="56" y="58" fill="#164E33" fontSize="7.5" fontFamily="DM Mono" fontWeight="bold">
                    VERIFIED EMISSION &amp; TONNAGE DATA
                </text>
            </g>
        </svg>
    );
};
