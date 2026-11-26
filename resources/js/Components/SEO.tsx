import React from 'react';
import { usePage } from '@inertiajs/react';
import { Helmet } from 'react-helmet-async';
import { PageProps } from '@/types';

/**
 * Description, canonical, Open Graph and structured data are rendered server-side in app.blade.php
 * from the route's `meta`. This only keeps the tab title right on client-side (Inertia) navigation.
 */
export default function SEO() {
    const { meta } = usePage<PageProps<{ meta?: { title: string } }>>().props;
    return meta ? (
        <Helmet>
            <title>{meta.title}</title>
        </Helmet>
    ) : null;
}
