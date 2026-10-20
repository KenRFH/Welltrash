import React from "react";

export const EditorialPlaceholderIllustration: React.FC<{
    className?: string;
    label?: string;
    dark?: boolean;
}> = ({ className = "w-full h-full", label = "WELLTRASH INSIGHTS", dark = false }) => {
    const strokeColor = dark ? "#9EFF00" : "#164E33";
    const bgColor = dark ? "#0A291A" : "#E3ECE5";
    const textColor = dark ? "#FFFFFF" : "#0A291A";
    const subColor = dark ? "#9EFF00" : "#526057";

    return (
        <svg
            viewBox="0 0 320 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label={label}
        >
            <defs>
                <pattern id={`ed-grid-${dark ? "d" : "l"}`} width="16" height="16" patternUnits="userSpaceOnUse">
                    <path d="M 16 0 L 0 0 0 16" fill="none" stroke={strokeColor} strokeWidth="0.5" strokeOpacity={dark ? 0.15 : 0.12} />
                </pattern>
            </defs>

            <rect width="320" height="200" fill={bgColor} />
            <rect width="320" height="200" fill={`url(#ed-grid-${dark ? "d" : "l"})`} />

            {/* Corner Crosshairs */}
            <g stroke={strokeColor} strokeWidth="1" strokeOpacity="0.4">
                <path d="M 16 16 H 26 M 16 16 V 26" />
                <path d="M 304 16 H 294 M 304 16 V 26" />
                <path d="M 16 184 H 26 M 16 184 V 174" />
                <path d="M 304 184 H 294 M 304 184 V 174" />
            </g>

            {/* Center Editorial Document Silhouette */}
            <g transform="translate(95, 35)">
                <rect width="130" height="130" rx="3" fill={dark ? "#164E33" : "#FFFFFF"} stroke={strokeColor} strokeWidth="1.2" />
                <line x1="15" y1="25" x2="115" y2="25" stroke={strokeColor} strokeWidth="1.5" strokeOpacity="0.6" />
                <line x1="15" y1="35" x2="95" y2="35" stroke={strokeColor} strokeWidth="1.2" strokeOpacity="0.4" />

                {/* Micro Chart / Graphic on Doc */}
                <rect x="15" y="50" width="100" height="42" rx="2" fill={dark ? "#0A291A" : "#F8FAF8"} stroke={strokeColor} strokeWidth="0.8" />
                <path d="M 25 80 L 45 68 L 70 74 L 105 58" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="105" cy="58" r="3" fill="#9EFF00" stroke={strokeColor} strokeWidth="1" />

                {/* Lines below chart */}
                <line x1="15" y1="105" x2="115" y2="105" stroke={strokeColor} strokeWidth="1" strokeOpacity="0.3" strokeDasharray="3 2" />
                <line x1="15" y1="115" x2="85" y2="115" stroke={strokeColor} strokeWidth="1" strokeOpacity="0.3" strokeDasharray="3 2" />
            </g>

            {/* Bottom Label Badge */}
            <g transform="translate(60, 168)">
                <rect width="200" height="20" rx="2" fill={dark ? "#0A291A" : "#FFFFFF"} stroke={strokeColor} strokeWidth="0.8" />
                <text x="100" y="13" fill={subColor} fontSize="7" fontFamily="DM Mono" fontWeight="bold" textAnchor="middle">
                    {label}
                </text>
            </g>
        </svg>
    );
};
