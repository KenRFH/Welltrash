import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Eye } from 'lucide-react';
import { BlogContent, blogExcerpt } from '@/utils/blogContent';

interface Props {
    label: string;
    title: string;
    date: string | null;
    image: string | null;
    body: string;
    backHref: string;
    backLabel: string;
    views?: number;
}

/** Public News/Activity detail. Hero, meta and body all share one reading column so edges line up. */
export default function BlogArticle({ label, title, date, image, body, backHref, backLabel, views }: Props) {
    const dateText = date && new Date(date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    const minutes = Math.max(1, Math.round(blogExcerpt(body).split(' ').length / 200));
    const column = 'w-full max-w-3xl mx-auto px-6';
    const onImage = !!image;

    const back = (
        <Link
            href={backHref}
            className={`inline-flex items-center gap-2 text-sm font-medium transition-colors group ${
                onImage ? 'text-white/75 hover:text-white' : 'text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
        >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            {backLabel}
        </Link>
    );

    const heading = (
        <div>
            <div className={`flex flex-wrap items-center gap-x-3 gap-y-2 text-sm mb-5 ${onImage ? 'text-white/80' : 'text-zinc-500 dark:text-zinc-400'}`}>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                    onImage ? 'bg-white/15 text-white backdrop-blur-sm ring-1 ring-white/20' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                }`}>
                    {label}
                </span>
                {dateText && <time dateTime={date!}>{dateText}</time>}
                <span aria-hidden>·</span>
                <span>{minutes} menit baca</span>
                {views != null && (
                    <>
                        <span aria-hidden>·</span>
                        <span className="inline-flex items-center gap-1.5"><Eye className="w-4 h-4" />{views.toLocaleString('id-ID')} kali dilihat</span>
                    </>
                )}
            </div>
            <h1 className={`text-[2rem] leading-[1.15] md:text-5xl md:leading-[1.1] font-extrabold tracking-tight [text-wrap:balance] ${
                onImage ? 'text-white' : 'text-zinc-900 dark:text-white'
            }`}>
                {title}
            </h1>
        </div>
    );

    return (
        <main className="flex-1 w-full">
            {image ? (
                <header className="relative isolate overflow-hidden bg-zinc-900">
                    <img src={`/storage/${image}`} alt="" className="absolute inset-0 -z-20 w-full h-full object-cover" />
                    {/* Darker at the top (navbar) and bottom (title), lighter in the middle so the photo still reads */}
                    <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/25 to-black/85" />
                    <div className={`${column} flex flex-col justify-between gap-16 min-h-[460px] md:min-h-[560px] pt-28 md:pt-32 pb-12 md:pb-16`}>
                        {back}
                        {heading}
                    </div>
                </header>
            ) : (
                <header className={`${column} pt-28 md:pt-32 space-y-10`}>
                    {back}
                    {heading}
                </header>
            )}

            <article className={`${column} py-12 md:py-16`}>
                <BlogContent text={body} />
            </article>

            <div className={`${column} pb-20`}>
                <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800">
                    <Link
                        href={backHref}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 group"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                        {backLabel}
                    </Link>
                </div>
            </div>
        </main>
    );
}
