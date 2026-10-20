import React from "react";

export const Step1AssessmentIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-auto" }) => {
    return (
        <svg
            viewBox="0 0 240 130"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="Langkah 1: Audit & Estimasi Timbulan Sampah"
        >
            <defs>
                <pattern id="wf-grid-1" width="16" height="16" patternUnits="userSpaceOnUse">
                    <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#164E33" strokeWidth="0.5" strokeOpacity="0.1" />
                </pattern>
            </defs>
            <rect width="240" height="130" fill="url(#wf-grid-1)" />

            {/* Audit Clipboard */}
            <rect x="35" y="20" width="75" height="95" rx="3" fill="#FFFFFF" stroke="#0A291A" strokeWidth="1.4" />
            <rect x="58" y="14" width="30" height="12" rx="2" fill="#0A291A" />
            <circle cx="73" cy="18" r="2" fill="#9EFF00" />

            {/* Checklist Lines */}
            <g stroke="#164E33" strokeWidth="1.2">
                <line x1="48" y1="40" x2="62" y2="40" />
                <line x1="68" y1="40" x2="95" y2="40" stroke="#526057" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="48" y1="56" x2="62" y2="56" />
                <line x1="68" y1="56" x2="95" y2="56" stroke="#526057" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="48" y1="72" x2="62" y2="72" />
                <line x1="68" y1="72" x2="95" y2="72" stroke="#526057" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="48" y1="88" x2="62" y2="88" />
                <line x1="68" y1="88" x2="95" y2="88" stroke="#526057" strokeWidth="1" strokeDasharray="2 2" />
            </g>

            {/* Checkmark icons */}
            <path d="M 46 39 L 49 42 L 54 36" stroke="#164E33" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 46 55 L 49 58 L 54 52" stroke="#164E33" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 46 71 L 49 74 L 54 68" stroke="#164E33" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 46 87 L 49 90 L 54 84" stroke="#9EFF00" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />

            {/* Volumetric Caliper & Bin */}
            <g transform="translate(130, 25)">
                <rect x="15" y="30" width="60" height="55" rx="2" fill="#E3ECE5" stroke="#164E33" strokeWidth="1.4" />
                <rect x="10" y="24" width="70" height="8" rx="2" fill="#164E33" stroke="#0A291A" strokeWidth="1" />
                <line x1="82" y1="30" x2="82" y2="85" stroke="#0A291A" strokeWidth="1.2" />
                <line x1="79" y1="30" x2="85" y2="30" stroke="#0A291A" strokeWidth="1.2" />
                <line x1="79" y1="85" x2="85" y2="85" stroke="#0A291A" strokeWidth="1.2" />
                <rect x="22" y="55" width="46" height="24" fill="#9EFF00" fillOpacity="0.4" stroke="#164E33" strokeWidth="1" />
                <text x="45" y="70" fill="#0A291A" fontSize="7" fontFamily="DM Mono" fontWeight="bold" textAnchor="middle">VOL. 660L</text>
                <circle cx="45" cy="42" r="6" fill="none" stroke="#0A291A" strokeWidth="1" strokeDasharray="2 2" />
                <circle cx="45" cy="42" r="2" fill="#9EFF00" />
            </g>

            {/* Bottom Status Tag */}
            <g transform="translate(45, 105)">
                <rect width="145" height="18" rx="2" fill="#0A291A" />
                <text x="72" y="12" fill="#9EFF00" fontSize="7" fontFamily="DM Mono" fontWeight="600" textAnchor="middle">
                    AUDIT TIMBULAN &amp; MATERIAL
                </text>
            </g>
        </svg>
    );
};
export const Step2SchedulingIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-auto" }) => {
    return (
        <svg
            viewBox="0 0 240 130"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="Langkah 2: Penjadwalan & Rute Terpadu"
        >
            <defs>
                <pattern id="wf-grid-2" width="16" height="16" patternUnits="userSpaceOnUse">
                    <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#164E33" strokeWidth="0.5" strokeOpacity="0.1" />
                </pattern>
            </defs>
            <rect width="240" height="130" fill="url(#wf-grid-2)" />

            {/* Calendar Dispatch Grid */}
            <rect x="25" y="20" width="85" height="75" rx="3" fill="#FFFFFF" stroke="#0A291A" strokeWidth="1.4" />
            <rect x="25" y="20" width="85" height="18" rx="2" fill="#164E33" />
            <text x="67" y="32" fill="#FFFFFF" fontSize="7.5" fontFamily="DM Sans" fontWeight="700" textAnchor="middle">
                JADWAL RITASE
            </text>

            <g stroke="#0A291A" strokeWidth="0.8">
                {[45, 60, 75].map((y) => (
                    <line key={y} x1="25" y1={y} x2="110" y2={y} strokeOpacity="0.2" />
                ))}
                {[46, 67, 88].map((x) => (
                    <line key={x} x1={x} y1="38" x2={x} y2="95" strokeOpacity="0.2" />
                ))}
            </g>

            {/* Active Pickup Days */}
            <rect x="49" y="42" width="15" height="14" rx="2" fill="#9EFF00" stroke="#0A291A" strokeWidth="1" />
            <text x="56" y="52" fill="#0A291A" fontSize="7" fontFamily="DM Mono" fontWeight="bold" textAnchor="middle">SEN</text>

            <rect x="91" y="42" width="15" height="14" rx="2" fill="#9EFF00" stroke="#0A291A" strokeWidth="1" />
            <text x="98" y="52" fill="#0A291A" fontSize="7" fontFamily="DM Mono" fontWeight="bold" textAnchor="middle">RAB</text>

            <rect x="70" y="63" width="15" height="14" rx="2" fill="#9EFF00" stroke="#0A291A" strokeWidth="1" />
            <text x="77" y="73" fill="#0A291A" fontSize="7" fontFamily="DM Mono" fontWeight="bold" textAnchor="middle">JUM</text>

            {/* GPS Route Waypoint Diagram */}
            <g transform="translate(130, 20)">
                <path d="M 15 65 C 20 40 40 45 50 20 S 75 15 85 45" fill="none" stroke="#164E33" strokeWidth="2" strokeDasharray="4 3" />
                <circle cx="15" cy="65" r="7" fill="#FFFFFF" stroke="#0A291A" strokeWidth="1.5" />
                <circle cx="15" cy="65" r="3" fill="#164E33" />
                <circle cx="50" cy="20" r="5" fill="#FFFFFF" stroke="#0A291A" strokeWidth="1.2" />
                <circle cx="50" cy="20" r="2" fill="#526057" />
                <circle cx="85" cy="45" r="8" fill="#0A291A" stroke="#9EFF00" strokeWidth="1.5" />
                <path d="M 85 41 L 88 47 L 82 47 Z" fill="#9EFF00" />
                <rect x="30" y="72" width="65" height="18" rx="2" fill="#E3ECE5" stroke="#164E33" strokeWidth="1" />
                <text x="62" y="84" fill="#0A291A" fontSize="6.5" fontFamily="DM Mono" fontWeight="700" textAnchor="middle">GEOFENCE OK</text>
            </g>

            {/* Bottom Status Tag */}
            <g transform="translate(45, 105)">
                <rect width="145" height="18" rx="2" fill="#0A291A" />
                <text x="72" y="12" fill="#9EFF00" fontSize="7" fontFamily="DM Mono" fontWeight="600" textAnchor="middle">
                    RUTE &amp; DISPATCH TEROPTIMASI
                </text>
            </g>
        </svg>
    );
};

export const Step3CollectionIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-auto" }) => {
    return (
        <svg
            viewBox="0 0 240 130"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="Langkah 3: Pengangkutan Higienis & Berkala"
        >
            <defs>
                <pattern id="wf-grid-3" width="16" height="16" patternUnits="userSpaceOnUse">
                    <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#164E33" strokeWidth="0.5" strokeOpacity="0.1" />
                </pattern>
            </defs>
            <rect width="240" height="130" fill="url(#wf-grid-3)" />

            <line x1="20" y1="98" x2="220" y2="98" stroke="#0F1713" strokeWidth="1.2" strokeOpacity="0.25" />

            {/* Truck Cargo Box */}
            <rect x="35" y="38" width="85" height="48" rx="2" fill="#164E33" stroke="#0A291A" strokeWidth="1.5" />
            <circle cx="58" cy="56" r="8" fill="#9EFF00" />
            <path d="M 58 50 C 53 54 53 60 58 62 C 63 60 63 54 58 50 Z" fill="#0A291A" />
            <text x="70" y="59" fill="#FFFFFF" fontSize="8" fontFamily="DM Sans" fontWeight="bold">welltrash</text>

            {/* Truck Cab */}
            <path d="M 120 48 H 145 L 158 66 V 86 H 120 Z" fill="#FFFFFF" stroke="#0A291A" strokeWidth="1.5" />
            <path d="M 124 52 H 142 L 150 66 H 124 Z" fill="#E3ECE5" stroke="#164E33" strokeWidth="1" />
            <rect x="154" y="74" width="4" height="6" fill="#9EFF00" stroke="#0A291A" strokeWidth="1" />

            {/* Wheels */}
            <circle cx="58" cy="88" r="11" fill="#0A291A" />
            <circle cx="58" cy="88" r="5" fill="#E3ECE5" stroke="#0A291A" strokeWidth="1.2" />
            <circle cx="102" cy="88" r="11" fill="#0A291A" />
            <circle cx="102" cy="88" r="5" fill="#E3ECE5" stroke="#0A291A" strokeWidth="1.2" />
            <circle cx="140" cy="88" r="11" fill="#0A291A" />
            <circle cx="140" cy="88" r="5" fill="#E3ECE5" stroke="#0A291A" strokeWidth="1.2" />

            {/* PPE Badge */}
            <g transform="translate(170, 22)">
                <rect width="52" height="42" rx="2" fill="#FFFFFF" stroke="#164E33" strokeWidth="1.2" />
                <circle cx="26" cy="16" r="8" fill="#9EFF00" stroke="#0A291A" strokeWidth="1" />
                <path d="M 22 16 L 25 19 L 30 13" stroke="#0A291A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                <text x="26" y="34" fill="#0A291A" fontSize="6.5" fontFamily="DM Mono" fontWeight="bold" textAnchor="middle">
                    APD &amp; SOP OK
                </text>
            </g>

            {/* Bottom Status Tag */}
            <g transform="translate(45, 105)">
                <rect width="145" height="18" rx="2" fill="#0A291A" />
                <text x="72" y="12" fill="#9EFF00" fontSize="7" fontFamily="DM Mono" fontWeight="600" textAnchor="middle">
                    PENJEMPUTAN TEPAT WAKTU
                </text>
            </g>
        </svg>
    );
};

export const Step4ReportingIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-auto" }) => {
    return (
        <svg
            viewBox="0 0 240 130"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="Langkah 4: Laporan Digital & Sertifikasi ESG"
        >
            <defs>
                <pattern id="wf-grid-4" width="16" height="16" patternUnits="userSpaceOnUse">
                    <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#164E33" strokeWidth="0.5" strokeOpacity="0.1" />
                </pattern>
            </defs>
            <rect width="240" height="130" fill="url(#wf-grid-4)" />

            {/* ESG Report Document */}
            <rect x="30" y="18" width="80" height="95" rx="2" fill="#FFFFFF" stroke="#0A291A" strokeWidth="1.4" />
            <rect x="30" y="18" width="80" height="14" fill="#0A291A" />
            <text x="70" y="28" fill="#9EFF00" fontSize="7" fontFamily="DM Sans" fontWeight="bold" textAnchor="middle">
                ESG REPORT 2026
            </text>

            {/* Document Content Chart */}
            <rect x="42" y="48" width="8" height="24" fill="#164E33" />
            <rect x="54" y="40" width="8" height="32" fill="#164E33" />
            <rect x="66" y="36" width="8" height="36" fill="#9EFF00" stroke="#0A291A" strokeWidth="0.8" />
            <rect x="78" y="44" width="8" height="28" fill="#164E33" />
            <line x1="38" y1="72" x2="92" y2="72" stroke="#0A291A" strokeWidth="1" />

            <text x="42" y="84" fill="#0A291A" fontSize="6.5" fontFamily="DM Mono" fontWeight="bold">8.420 KG</text>
            <text x="42" y="92" fill="#526057" fontSize="5.5" fontFamily="DM Mono">92.4% TERPILIH</text>

            {/* Verified Digital Seal */}
            <g transform="translate(135, 25)">
                <circle cx="45" cy="40" r="32" fill="#E3ECE5" stroke="#164E33" strokeWidth="1.2" strokeDasharray="3 2" />
                <circle cx="45" cy="40" r="26" fill="#FFFFFF" stroke="#0A291A" strokeWidth="1.4" />
                <circle cx="45" cy="40" r="18" fill="#0A291A" />
                <path d="M 40 40 L 43 43 L 50 36" stroke="#9EFF00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <text x="45" y="62" fill="#164E33" fontSize="6" fontFamily="DM Mono" fontWeight="bold" textAnchor="middle">
                    AUDITED
                </text>

                <rect x="25" y="72" width="40" height="16" rx="2" fill="#FFFFFF" stroke="#0A291A" strokeWidth="1" />
                <text x="45" y="83" fill="#0A291A" fontSize="6.5" fontFamily="DM Mono" fontWeight="bold" textAnchor="middle">
                    QR VERIFIED
                </text>
            </g>

            {/* Bottom Status Tag */}
            <g transform="translate(45, 105)">
                <rect width="145" height="18" rx="2" fill="#0A291A" />
                <text x="72" y="12" fill="#9EFF00" fontSize="7" fontFamily="DM Mono" fontWeight="600" textAnchor="middle">
                    REKAPITULASI SIAP AUDIT
                </text>
            </g>
        </svg>
    );
};

