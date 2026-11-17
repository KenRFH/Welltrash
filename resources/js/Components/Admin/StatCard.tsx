import React from 'react';
import { Link } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';

export type StatTone = 'brand' | 'neutral' | 'ok' | 'warn' | 'bad' | 'info';

interface Props {
    icon: LucideIcon;
    label: string;
    value: React.ReactNode;
    unit?: string;
    note?: React.ReactNode;
    /** "brand" is the page's headline figure (deep green card); others tint only the icon. */
    tone?: StatTone;
    href?: string;
    /** Position in its row, for the entrance stagger. */
    index?: number;
}

// Literal class names so Tailwind's content scan keeps them (a template like `tone-${tone}` would be purged).
const TONE_CLASS: Record<StatTone, string> = {
    brand: 'tone-brand', neutral: 'tone-neutral', ok: 'tone-ok', warn: 'tone-warn', bad: 'tone-bad', info: 'tone-info',
};

/** The one stat card used across the admin panel. */
export default function StatCard({ icon: Icon, label, value, unit, note, tone = 'neutral', href, index = 0 }: Props) {
    const body = (
        <>
            <div className="flex items-start justify-between gap-3">
                <p className="adm-stat-label">{label}</p>
                <span className={`adm-stat-icon ${TONE_CLASS[tone]}`}>
                    <Icon className="w-[18px] h-[18px]" aria-hidden="true" />
                </span>
            </div>
            <p className="adm-stat-value">
                {value}
                {unit && <span className="adm-stat-unit">{unit}</span>}
            </p>
            {note && <div className="adm-stat-note">{note}</div>}
        </>
    );
    const className = `adm-stat ${tone === 'brand' ? 'adm-stat-brand' : ''}`;
    const style = { '--i': index } as React.CSSProperties;

    return href ? (
        <Link href={href} className={className} style={style}>{body}</Link>
    ) : (
        <div className={className} style={style}>{body}</div>
    );
}
