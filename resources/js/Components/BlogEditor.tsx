import React, { useLayoutEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Heading2, Bold, ImagePlus, Loader2 } from 'lucide-react';
import { compressImage } from '@/utils/compressImage';
import { BlogContent, blogExcerpt } from '@/utils/blogContent';

interface Props {
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
}

/** Grow a textarea with its content (CSS field-sizing isn't in Safari/Firefox yet). */
export function useAutoGrow(ref: React.RefObject<HTMLTextAreaElement>, value: string) {
    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = `${el.scrollHeight}px`;
    }, [ref, value]);
}

/** Writing area for Activity bodies, stored in the format of utils/blogContent. */
export default function BlogEditor({ value, onChange, required }: Props) {
    const ref = useRef<HTMLTextAreaElement>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState(false);
    const [uploading, setUploading] = useState(0);
    const [dragging, setDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    useAutoGrow(ref, preview ? '' : value);

    // Replace the selection with before+selected+after and put the cursor after it.
    const insert = (before: string, after = '', fallback = '') => {
        const el = ref.current;
        const current = el?.value ?? value;
        const start = el?.selectionStart ?? current.length;
        const end = el?.selectionEnd ?? current.length;
        const selected = current.slice(start, end) || fallback;
        onChange(current.slice(0, start) + before + selected + after + current.slice(end));
        requestAnimationFrame(() => {
            const pos = start + before.length + selected.length + after.length;
            el?.focus();
            el?.setSelectionRange(pos, pos);
        });
    };

    const uploadImages = async (files: FileList | File[] | null) => {
        const images = Array.from(files ?? []).filter((f) => f.type.startsWith('image/'));
        if (!images.length) return;
        setUploading(images.length);
        setError(null);
        let markdown = '';
        try {
            for (const file of images) {
                const form = new FormData();
                form.append('image', await compressImage(file));
                const { data } = await axios.post(route('webadmin.content-images.store'), form);
                markdown += `\n\n![](${data.url})\n\n`;
                setUploading((n) => n - 1);
            }
        } catch (e: any) {
            setError(e?.response?.data?.message ?? 'Gagal mengunggah gambar.');
        } finally {
            if (markdown) insert(markdown);
            setUploading(0);
            if (fileRef.current) fileRef.current.value = '';
        }
    };

    const words = blogExcerpt(value).split(' ').filter(Boolean).length;
    const tool = 'inline-flex items-center gap-1.5 h-8 px-2.5 text-[13px] font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900 disabled:opacity-40 disabled:hover:bg-transparent transition-colors';
    const tab = (on: boolean) => `px-3 h-7 text-[13px] font-medium rounded-md transition-colors ${on ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`;

    return (
        <div>
            {/* Toolbar sticks to the top of the scrolling canvas while writing long posts */}
            <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 px-4 sm:px-10 py-2 bg-white/95 backdrop-blur border-y border-gray-100">
                <button type="button" className={tool} disabled={preview} onClick={() => insert('\n\n## ', '\n\n', 'Subjudul')} title="Subjudul">
                    <Heading2 className="w-4 h-4" /> <span className="hidden sm:inline">Subjudul</span>
                </button>
                <button type="button" className={tool} disabled={preview} onClick={() => insert('**', '**', 'teks tebal')} title="Tebal">
                    <Bold className="w-4 h-4" /> <span className="hidden sm:inline">Tebal</span>
                </button>
                <span className="w-px h-5 bg-gray-200 mx-1" />
                <button type="button" className={tool} disabled={preview || uploading > 0} onClick={() => fileRef.current?.click()}>
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
                    {uploading ? `Mengunggah ${uploading} foto…` : 'Sisipkan Foto'}
                </button>
                <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => uploadImages(e.target.files)} />

                <div className="ml-auto flex items-center p-0.5 rounded-lg bg-gray-100">
                    <button type="button" className={tab(!preview)} onClick={() => setPreview(false)}>Tulis</button>
                    <button type="button" className={tab(preview)} onClick={() => setPreview(true)}>Pratinjau</button>
                </div>
            </div>

            {preview ? (
                <div className="px-6 sm:px-12 py-10 min-h-[32rem]">
                    {value.trim() ? <BlogContent text={value} /> : <p className="text-gray-400">Belum ada isi untuk ditampilkan.</p>}
                </div>
            ) : (
                <div
                    className={`relative transition-colors ${dragging ? 'bg-emerald-50/60' : ''}`}
                    onDragOver={(e) => { if (e.dataTransfer.types.includes('Files')) { e.preventDefault(); setDragging(true); } }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => {
                        if (!e.dataTransfer.files.length) return;
                        e.preventDefault();
                        setDragging(false);
                        uploadImages(e.dataTransfer.files);
                    }}
                >
                    <textarea
                        ref={ref}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onPaste={(e) => {
                            if (e.clipboardData.files.length) { e.preventDefault(); uploadImages(e.clipboardData.files); }
                        }}
                        required={required}
                        aria-label="Isi tulisan"
                        placeholder="Mulai menulis cerita di sini…"
                        className="block w-full min-h-[32rem] resize-none overflow-hidden border-0 px-6 sm:px-12 py-8 focus:ring-0 outline-none bg-transparent text-[17px] leading-8 text-gray-800 placeholder:text-gray-300"
                    />
                    {dragging && (
                        <div className="pointer-events-none absolute inset-3 rounded-xl border-2 border-dashed border-emerald-400 flex items-center justify-center text-sm font-semibold text-emerald-700">
                            Lepaskan untuk menyisipkan foto
                        </div>
                    )}
                </div>
            )}

            <div className="flex items-center justify-between gap-4 px-6 sm:px-12 py-3 border-t border-gray-100 text-xs text-gray-400">
                {error ? <span className="font-medium text-red-600">{error}</span> : <span>Foto otomatis dikompres sebelum diunggah.</span>}
                <span className="tabular-nums shrink-0">{words} kata</span>
            </div>
        </div>
    );
}
