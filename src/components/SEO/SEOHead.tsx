import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
    title: string;
    description?: string;
    type?: 'website' | 'article' | 'profile';
    image?: string;
    publishedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
    structuredData?: Record<string, any>;
    noIndex?: boolean;
}

const DOMAIN = 'https://atlas-frontend-omega.vercel.app';
const DEFAULT_IMAGE = '/og-image.png'; // Updated to match index.html
const SITE_TITLE = 'Atlas';

export const SEOHead: React.FC<SEOHeadProps> = ({
    title,
    description = "Atlas is a sovereign knowledge platform dedicated to systems thinking, economic literacy, and unbiased intelligence.",
    type = 'website',
    image = DEFAULT_IMAGE,
    publishedTime,
    section,
    tags,
    structuredData,
    noIndex = false,
}) => {
    const location = useLocation();
    const canonicalUrl = `${DOMAIN}${location.pathname}`;
    const fullTitle = `${title} | ${SITE_TITLE}`;
    const imageUrl = image.startsWith('http') ? image : `${DOMAIN}${image}`;

    return (
        <Helmet>
            {/* Basic Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={canonicalUrl} />

            {/* Robots */}
            {noIndex && <meta name="robots" content="noindex, nofollow" />}
            {!noIndex && <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />}

            {/* Open Graph / Facebook */}
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={imageUrl} />
            <meta property="og:site_name" content={SITE_TITLE} />
            <meta property="og:locale" content="en_US" />

            {/* Article Specific OG */}
            {publishedTime && <meta property="article:published_time" content={publishedTime} />}
            {section && <meta property="article:section" content={section} />}
            {tags && tags.map(tag => (
                <meta property="article:tag" content={tag} key={tag} />
            ))}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={imageUrl} />
            <meta name="twitter:creator" content="@atlas" />

            {/* Structured Data (JSON-LD) */}
            <script type="application/ld+json">
                {JSON.stringify(structuredData || {
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    "name": SITE_TITLE,
                    "url": DOMAIN,
                    "potentialAction": {
                        "@type": "SearchAction",
                        "target": {
                            "@type": "EntryPoint",
                            "urlTemplate": `${DOMAIN}/search?q={search_term_string}`
                        },
                        "query-input": "required name=search_term_string"
                    }
                })}
            </script>
        </Helmet>
    );
};
