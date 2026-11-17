import React from 'react';

/** Validated with dataviz/scripts/validate_palette.js (light surface, all checks pass). */
export const CHART = {
    green: '#1f7a4d', // organik, lunas, aktif, single-hue rankings
    blue: '#2a78d6', // anorganik, verifikasi pembayaran
    brown: '#b8652a', // residu ke TPA
    amber: '#d9a400', // menunggu (below 3:1: always shipped with a printed label)
    red: '#d4453f', // belum lunas
    gray: '#94a3b8', // nonaktif
} as const;

export interface Part {
    label: string;
    value: number;
    color: string;
    /** Formatted figure, e.g. "255 kg" or "Rp 1.200.000". Defaults to the number. */
    display?: string;
    /** Text colour printed on the block; light colours (amber) need dark ink. */
    ink?: 'light' | 'dark';
}

const share = (v: number, total: number) => (total > 0 ? (v / total) * 100 : 0);
export const fmtShare = (p: number) => `${p > 0 && p < 10 ? p.toFixed(1).replace('.', ',') : Math.round(p)}%`;

/**
 * Tall segmented bar: how one whole splits, read at a glance. Each part prints its share when the block is wide
 * enough; the legend underneath carries every name, figure and share (so it doubles as the table view).
 * Brackets group neighbouring parts (e.g. "diverted from landfill").
 */
export function SegmentedBar({ parts, label, emptyText, brackets = [] }: {
    parts: Part[];
    label: string;
    emptyText: string;
    brackets?: { from: number; to: number; text: string }[];
}) {
    const total = parts.reduce((a, p) => a + p.value, 0);
    if (total <= 0) {
        return <p className="rounded-md border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">{emptyText}</p>;
    }
    const shares = parts.map((p) => share(p.value, total));
    const starts = shares.map((_, i) => shares.slice(0, i).reduce((a, s) => a + s, 0));

    return (
        <figure aria-label={label}>
            {brackets.length > 0 && (
                <div className="relative mb-2 h-6" aria-hidden="true">
                    {brackets.map((b) => {
                        const left = starts[b.from];
                        const width = starts[b.to] + shares[b.to] - left;
                        if (width <= 0) return null;
                        return (
                            <div key={b.text} className="absolute bottom-0 h-full" style={{ left: `${left}%`, width: `${width}%` }}>
                                <div className="absolute inset-x-0 bottom-0 h-2 rounded-t border-x border-t border-slate-300" />
                                <span className="absolute bottom-2.5 left-0 right-0 truncate px-1 text-center text-xs font-semibold text-ink">{b.text}</span>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="flex h-10 w-full gap-[2px]">
                {parts.map((p, i) => shares[i] > 0 && (
                    <div
                        key={p.label}
                        tabIndex={0}
                        className="adm-bar-grow group relative flex min-w-[6px] items-center justify-center first:rounded-l last:rounded-r outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2"
                        style={{ width: `${shares[i]}%`, backgroundColor: p.color, animationDelay: `${i * 80}ms` }}
                        aria-label={`${p.label}: ${p.display ?? p.value} (${fmtShare(shares[i])})`}
                    >
                        {shares[i] >= 8 && (
                            <span className={`text-xs font-semibold tabular-nums ${p.ink === 'dark' ? 'text-ink' : 'text-white'}`}>{fmtShare(shares[i])}</span>
                        )}
                        <span role="tooltip" className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1.5 text-xs text-white shadow-lg group-hover:block group-focus-visible:block">
                            <span className="font-semibold">{p.label}</span> · {p.display ?? p.value} · {fmtShare(shares[i])}
                        </span>
                    </div>
                ))}
            </div>

            <figcaption className="mt-3 grid gap-x-6 gap-y-1.5 sm:grid-cols-3">
                {parts.map((p, i) => (
                    <div key={p.label} className="flex items-baseline gap-2 text-sm">
                        <span className="h-2.5 w-2.5 shrink-0 translate-y-[1px] rounded-sm" style={{ backgroundColor: p.color }} aria-hidden="true" />
                        <span className="text-slate-600">{p.label}</span>
                        <span className="ml-auto font-semibold tabular-nums text-ink sm:ml-0">{p.display ?? p.value}</span>
                        <span className="tabular-nums text-slate-500">{fmtShare(shares[i])}</span>
                    </div>
                ))}
            </figcaption>
        </figure>
    );
}

export interface MeterRow {
    label: string;
    value: number;
    color?: string;
    hint?: string;
    onClick?: () => void;
    active?: boolean;
}

/** Meter list: one row per part (name, bar against the whole, figure), bars on one baseline so they compare exactly. */
export function MeterList({ rows, total, unit, label }: { rows: MeterRow[]; total: number; unit: string; label: string }) {
    return (
        <ul className="space-y-2.5" aria-label={label}>
            {rows.map((r, i) => {
                const s = share(r.value, total);
                const body = (
                    <>
                        <span className="min-w-0 truncate text-left text-sm text-slate-700 sm:w-40 sm:shrink-0" title={r.hint}>{r.label}</span>
                        <span className="relative h-2.5 flex-1 rounded-full bg-slate-100" aria-hidden="true">
                            {s > 0 && (
                                <span
                                    className="adm-bar-grow absolute inset-y-0 left-0 rounded-full"
                                    style={{ width: `${Math.max(s, 1.5)}%`, backgroundColor: r.color ?? CHART.green, animationDelay: `${i * 60}ms` }}
                                />
                            )}
                        </span>
                        <span className="w-24 shrink-0 text-right text-sm tabular-nums">
                            <span className="font-semibold text-ink">{r.value}</span>
                            <span className="text-slate-500"> {unit} · {fmtShare(s)}</span>
                        </span>
                    </>
                );
                return (
                    <li key={r.label}>
                        {r.onClick ? (
                            <button type="button" onClick={r.onClick} aria-pressed={r.active}
                                className={`-mx-2 flex w-[calc(100%+1rem)] items-center gap-3 rounded-lg px-2 py-1 transition-colors hover:bg-paper ${r.active ? 'bg-paper ring-1 ring-green-deep/30' : ''}`}>
                                {body}
                            </button>
                        ) : (
                            <div className="flex items-center gap-3">{body}</div>
                        )}
                    </li>
                );
            })}
        </ul>
    );
}
