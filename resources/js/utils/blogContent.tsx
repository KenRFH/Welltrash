import React from 'react';

/**
 * Blog-style body for Activity, stored as plain text:
 *   ## Subjudul
 *   **tebal**
 *   ![keterangan](/storage/content/foto.jpg)   ← on its own line
 * Blank line = new paragraph. Old plain-text posts render unchanged.
 * Rendered as React elements (no HTML injection).
 */

const IMAGE_LINE = /^!\[([^\]]*)\]\(([^)\s]+)\)$/;
const SAFE_SRC = /^(\/storage\/|https?:\/\/)/;

type Block =
    | { type: 'heading'; text: string }
    | { type: 'image'; alt: string; src: string }
    | { type: 'paragraph'; text: string };

export function parseBlog(text: string): Block[] {
    const blocks: Block[] = [];
    let para: string[] = [];
    const flush = () => {
        if (para.length) blocks.push({ type: 'paragraph', text: para.join('\n') });
        para = [];
    };

    for (const raw of (text || '').split(/\r?\n/)) {
        const line = raw.trim();
        const img = line.match(IMAGE_LINE);
        if (!line) flush();
        else if (line.startsWith('## ')) { flush(); blocks.push({ type: 'heading', text: line.slice(3) }); }
        else if (img && SAFE_SRC.test(img[2])) { flush(); blocks.push({ type: 'image', alt: img[1], src: img[2] }); }
        else para.push(raw);
    }
    flush();
    return blocks;
}

function inline(text: string) {
    return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith('**') && part.endsWith('**') && part.length > 4
            ? <strong key={i} className="font-semibold text-zinc-900 dark:text-white">{part.slice(2, -2)}</strong>
            : part
    );
}

/** Plain text for excerpts, line-clamps and SEO descriptions. */
export function blogExcerpt(text: string, max?: number): string {
    const plain = parseBlog(text)
        .filter((b) => b.type !== 'image')
        .map((b) => (b as { text: string }).text.replace(/\*\*/g, ''))
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
    return max ? plain.substring(0, max) : plain;
}

export function BlogContent({ text }: { text: string }) {
    return (
        <div className="text-[1.0625rem] md:text-lg leading-[1.8] text-zinc-700 dark:text-zinc-300 [&>*:first-child]:mt-0">
            {parseBlog(text).map((b, i) => {
                if (b.type === 'heading') {
                    return <h2 key={i} className="mt-12 mb-4 text-2xl md:text-[1.75rem] font-bold tracking-tight leading-snug text-zinc-900 dark:text-white">{b.text}</h2>;
                }
                if (b.type === 'image') {
                    return (
                        <figure key={i} className="my-10">
                            <img src={b.src} alt={b.alt} loading="lazy" className="w-full rounded-xl bg-zinc-100 dark:bg-zinc-800" />
                            {b.alt && <figcaption className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">{b.alt}</figcaption>}
                        </figure>
                    );
                }
                return <p key={i} className="mt-6 whitespace-pre-wrap">{inline(b.text)}</p>;
            })}
        </div>
    );
}
