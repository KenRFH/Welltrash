import React from "react";

export const CtaBackgroundIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => {
    return (
        <svg
            viewBox="0 0 1440 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            preserveAspectRatio="none"
            aria-hidden="true"
        >
            <defs>
                <pattern id="cta-dots" width="30" height="30" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1.2" fill="#0A291A" fillOpacity="0.12" />
                </pattern>
            </defs>

            <rect width="1440" height="400" fill="url(#cta-dots)" />

            {/* Subtle Topographic & Circular Sustainability Contours */}
            <g stroke="#0A291A" strokeWidth="1" strokeOpacity="0.08">
                <circle cx="720" cy="200" r="180" strokeDasharray="6 4" />
                <circle cx="720" cy="200" r="280" />
                <circle cx="720" cy="200" r="380" strokeDasharray="3 3" />
                <circle cx="720" cy="200" r="480" />

                <circle cx="120" cy="320" r="140" strokeDasharray="4 4" />
                <circle cx="1320" cy="80" r="160" strokeDasharray="4 4" />

                {/* Coordinate Crosshairs */}
                <line x1="720" y1="0" x2="720" y2="400" strokeDasharray="2 4" />
                <line x1="0" y1="200" x2="1440" y2="200" strokeDasharray="2 4" />
            </g>

            {/* Corner Technical Coordinate Marks */}
            <g stroke="#0A291A" strokeWidth="1.2" strokeOpacity="0.2">
                {/* Top Left */}
                <path d="M 40 40 H 60 M 40 40 V 60" />
                {/* Top Right */}
                <path d="M 1400 40 H 1380 M 1400 40 V 60" />
                {/* Bottom Left */}
                <path d="M 40 360 H 60 M 40 360 V 340" />
                {/* Bottom Right */}
                <path d="M 1400 360 H 1380 M 1400 360 V 340" />
            </g>
        </svg>
    );
};
