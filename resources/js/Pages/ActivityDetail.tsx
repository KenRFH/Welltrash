import BlogArticle from '@/Components/BlogArticle';
import SEO from '@/Components/SEO';
import { blogExcerpt } from '@/utils/blogContent';
import React from 'react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';

interface Activity {
    id: number;
    title: string;
    description: string;
    image_path: string | null;
    date: string | null;
    views?: number;
}

interface Props {
    activity: Activity;
    canLogin: boolean;
    canRegister: boolean;
}

export default function ActivityDetail({ activity, canLogin, canRegister }: Props) {
    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 flex flex-col justify-between">
            <SEO 
                title={`${activity.title} | Aktivitas Welltrash`}
                description={blogExcerpt(activity.description || '', 160)}
                image={activity.image_path ? `${window.location.origin}/storage/${activity.image_path}` : undefined}
                type="article"
            />
            
            <Navbar />

            <BlogArticle
                label="Aktivitas"
                title={activity.title}
                date={activity.date}
                image={activity.image_path}
                body={activity.description || ''}
                backHref={route('activity')}
                backLabel="Kembali ke Daftar Aktivitas"
                views={activity.views}
            />

            <Footer />
        </div>
    );
}
