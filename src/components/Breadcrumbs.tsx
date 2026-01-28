import React from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbsProps {
    items: {
        label: string;
        path?: string;
    }[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
    return (
        <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-neutral-400">
                <li>
                    <Link to="/" className="hover:text-black transition-colors">Index</Link>
                </li>

                {items.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                        <span className="text-neutral-200">/</span>
                        {item.path ? (
                            <Link to={item.path} className="hover:text-black transition-colors">
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-emerald-600 block max-w-[200px] truncate" title={item.label}>
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>

            {/* Schema.org BreadcrumbList */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Index",
                            "item": "https://atlas-frontend-omega.vercel.app/"
                        },
                        ...items.map((item, idx) => ({
                            "@type": "ListItem",
                            "position": idx + 2,
                            "name": item.label,
                            "item": item.path ? `https://atlas-frontend-omega.vercel.app${item.path}` : undefined
                        }))
                    ]
                })
            }} />
        </nav>
    );
};
