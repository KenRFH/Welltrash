import React from "react";
import { Milk, CupSoda, Newspaper, Leaf, Apple, Package, Recycle, Battery } from "lucide-react";

// Waste items drifting up and fading out (sorted & collected), behind the CTA text.
const ITEMS = [
    { Icon: Milk, left: "4%", size: 30, dur: 14, delay: 0, rot: 40 },
    { Icon: Leaf, left: "12%", size: 22, dur: 11, delay: 5, rot: -60 },
    { Icon: Newspaper, left: "21%", size: 26, dur: 16, delay: 2, rot: 25 },
    { Icon: CupSoda, left: "30%", size: 24, dur: 13, delay: 8, rot: -35 },
    { Icon: Apple, left: "40%", size: 20, dur: 12, delay: 4, rot: 50 },
    { Icon: Package, left: "58%", size: 28, dur: 15, delay: 7, rot: -20 },
    { Icon: Battery, left: "67%", size: 20, dur: 12, delay: 1, rot: 70 },
    { Icon: Leaf, left: "76%", size: 26, dur: 14, delay: 9, rot: 45 },
    { Icon: Milk, left: "85%", size: 22, dur: 11, delay: 3, rot: -50 },
    { Icon: Newspaper, left: "94%", size: 24, dur: 16, delay: 6, rot: 30 },
];

export const CtaWasteAnimation: React.FC = () => (
    <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden text-green-deep dark:text-emerald-400 motion-reduce:hidden"
    >
        {/* Slow-turning recycle mark: the loop that the items feed into */}
        <Recycle
            className="absolute -right-16 -bottom-16 w-72 h-72 opacity-[0.07] animate-[spin_40s_linear_infinite]"
            strokeWidth={1}
        />
        <Recycle
            className="absolute -left-12 -top-12 w-48 h-48 opacity-[0.05] animate-[spin_55s_linear_infinite_reverse]"
            strokeWidth={1}
        />

        {ITEMS.map(({ Icon, left, size, dur, delay, rot }, i) => (
            <Icon
                key={i}
                className="absolute -bottom-10 opacity-0 animate-waste-rise"
                strokeWidth={1.5}
                style={
                    {
                        left,
                        width: size,
                        height: size,
                        animationDuration: `${dur}s`,
                        animationDelay: `${delay}s`,
                        "--waste-rot": `${rot}deg`,
                    } as React.CSSProperties
                }
            />
        ))}
    </div>
);
