import BlogArticle from '@/Components/BlogArticle';
import SEO from '@/Components/SEO';
import { blogExcerpt } from '@/utils/blogContent';
import React from 'react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

interface NewsItem {
    id: number;
    title: string;
    content: string;
    image_path: string | null;
    published_date: string | null;
    views?: number;
}

interface Props {
    newsItem: NewsItem;
    canLogin: boolean;
    canRegister: boolean;
}

export default function NewsDetail({ newsItem, canLogin, canRegister }: Props) {
    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 flex flex-col justify-between">
            <SEO 
                title={`${newsItem.title} | Berita Welltrash`}
                description={blogExcerpt(newsItem.content || '', 160)}
                image={newsItem.image_path ? `https://welltrash.id/storage/${newsItem.image_path}` : undefined}
                type="article"
            />
            
            <Navbar />

            <BlogArticle
                label="Berita"
                title={newsItem.title}
                date={newsItem.published_date}
                image={newsItem.image_path}
                body={newsItem.content || ''}
                backHref={route('news')}
                backLabel="Kembali ke Daftar Berita"
                views={newsItem.views}
            />

            <Footer />
        </div>
    );
}
