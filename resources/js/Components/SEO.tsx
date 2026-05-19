import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
}

export default function SEO({ 
    title = "Jasa Penjemputan & Pengelolaan Sampah se Jember | Welltrash", 
    description = "Layanan jasa pengangkutan sampah profesional dan terpercaya di Jember. Solusi kebersihan hemat & cepat untuk rumah tangga hingga bisnis. Pesan WellTrash sekarang!",
    image = "https://welltrash.id/build/assets/logowelltrash-DkJ1DW_Z.png", // Replace with your actual OG image URL if different
    url = "https://welltrash.id",
    type = "website"
}: SEOProps) {
    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            
            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />
        </Helmet>
    );
}
