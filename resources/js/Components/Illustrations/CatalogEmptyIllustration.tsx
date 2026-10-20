import React from "react";

export const CatalogEmptyIllustration: React.FC<{ className?: string }> = ({ className = "w-48 h-auto" }) => {
    return (
        <svg
            viewBox="0 0 240 140"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="Katalog Produk Olahan Daur Ulang WellTrash"
        >
            <defs>
                <pattern id="cat-grid" width="12" height="12" patternUnits="userSpaceOnUse">
                    <path d="M 12 0 L 0 0 0 12" fill="none" stroke="#164E33" strokeWidth="0.4" strokeOpacity="0.1" />
                </pattern>
            </defs>

            <rect width="240" height="140" fill="url(#cat-grid)" rx="2" />
            <line x1="20" y1="110" x2="220" y2="110" stroke="#0F1713" strokeWidth="1" strokeOpacity="0.2" />

            {/* Product 1: Compost Sack (Left) */}
            <path d="M 35 110 L 40 55 C 40 48 65 48 65 55 L 70 110 Z" fill="#E3ECE5" stroke="#164E33" strokeWidth="1.2" />
            <path d="M 45 52 C 52 48 58 48 65 52" stroke="#0A291A" strokeWidth="1.5" />
            <circle cx="53" cy="78" r="8" fill="#164E33" />
            <path d="M 53 73 C 50 76 50 81 53 83 C 56 81 56 76 53 73 Z" fill="#9EFF00" />
            <text x="53" y="98" fill="#0A291A" fontSize="5.5" fontFamily="DM Mono" fontWeight="bold" textAnchor="middle">KOMPOS</text>

            {/* Product 2: BSF Larvae Feed Canister (Center) */}
            <rect x="85" y="45" width="45" height="65" rx="3" fill="#FFFFFF" stroke="#0A291A" strokeWidth="1.2" />
            <rect x="88" y="40" width="39" height="7" rx="1.5" fill="#0A291A" />
            <rect x="89" y="60" width="37" height="26" fill="#E3ECE5" stroke="#164E33" strokeWidth="0.8" />
            <text x="107" y="72" fill="#164E33" fontSize="6" fontFamily="DM Sans" fontWeight="bold" textAnchor="middle">MAGGOT</text>
            <text x="107" y="80" fill="#526057" fontSize="5" fontFamily="DM Mono" textAnchor="middle">BSF KERING</text>

            {/* Product 3: Recycled Polymer Pellets Flake Bin (Right) */}
            <path d="M 148 110 L 155 60 H 195 L 202 110 Z" fill="#F8FAF8" stroke="#164E33" strokeWidth="1.2" />
            {/* Triangular recycle logo */}
            <polygon points="175,70 183,85 167,85" fill="none" stroke="#9EFF00" strokeWidth="1.5" />
            <circle cx="175" cy="78" r="2" fill="#0A291A" />
            <text x="175" y="100" fill="#0A291A" fontSize="5.5" fontFamily="DM Mono" fontWeight="bold" textAnchor="middle">FLAKE PET</text>

            {/* Circular certification seal */}
            <circle cx="205" cy="35" r="14" fill="#9EFF00" stroke="#0A291A" strokeWidth="1" />
            <text x="205" y="37" fill="#0A291A" fontSize="5.5" fontFamily="DM Mono" fontWeight="bold" textAnchor="middle">CIRCULAR</text>
            <text x="205" y="43" fill="#0A291A" fontSize="4.5" fontFamily="DM Mono" textAnchor="middle">100%</text>
        </svg>
    );
};
