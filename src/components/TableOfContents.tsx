import React, { useEffect, useState } from 'react';

interface TOCItem {
    id: string;
    text: string;
    level: number;
}

interface TableOfContentsProps {
    content: string;
    className?: string;
}

/**
 * TableOfContents Component
 * Auto-generates a table of contents from markdown headings
 * Improves SEO through better content structure and dwell time
 */
export const TableOfContents: React.FC<TableOfContentsProps> = ({ content, className = '' }) => {
    const [tocItems, setTocItems] = useState<TOCItem[]>([]);
    const [activeId, setActiveId] = useState<string>('');
    const [isExpanded, setIsExpanded] = useState(true);

    useEffect(() => {
        // Parse headings from markdown content
        const headingRegex = /^(#{2,4})\s+(.+)$/gm;
        const items: TOCItem[] = [];
        let match;

        while ((match = headingRegex.exec(content)) !== null) {
            const level = match[1].length;
            const text = match[2].replace(/[#*`]/g, '').trim();
            const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

            items.push({ id, text, level });
        }

        setTocItems(items);
    }, [content]);

    useEffect(() => {
        // Intersection Observer for active section highlighting
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-20% 0px -35% 0px' }
        );

        tocItems.forEach((item) => {
            const element = document.getElementById(item.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [tocItems]);

    const scrollToHeading = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    if (tocItems.length < 2) return null;

    return (
        <nav
            className={`toc-container bg-neutral-50/50 border border-black/5 rounded-lg p-6 mb-12 ${className}`}
            aria-label="Table of Contents"
        >
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-between w-full text-left"
            >
                <div className="flex items-center gap-3">
                    <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400">
                        Contents
                    </h2>
                    <span className="text-[9px] font-mono text-neutral-300">
                        {tocItems.length} sections
                    </span>
                </div>
                <span className={`text-neutral-300 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                    ▾
                </span>
            </button>

            <div className={`overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-[500px] mt-6' : 'max-h-0'}`}>
                <ol className="space-y-2 list-none p-0 m-0">
                    {tocItems.map((item, index) => {
                        const isActive = activeId === item.id;
                        const indent = (item.level - 2) * 16;

                        return (
                            <li
                                key={`${item.id}-${index}`}
                                style={{ paddingLeft: `${indent}px` }}
                            >
                                <button
                                    onClick={() => scrollToHeading(item.id)}
                                    className={`
                                        text-left w-full py-1.5 text-sm font-medium transition-all duration-300
                                        border-l-2 pl-3
                                        ${isActive
                                            ? 'text-emerald-600 border-emerald-500'
                                            : 'text-neutral-500 border-transparent hover:text-neutral-900 hover:border-neutral-200'
                                        }
                                    `}
                                >
                                    {item.text}
                                </button>
                            </li>
                        );
                    })}
                </ol>
            </div>

            {/* Schema.org structured data for TOC */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "ItemList",
                    "name": "Table of Contents",
                    "numberOfItems": tocItems.length,
                    "itemListElement": tocItems.map((item, index) => ({
                        "@type": "ListItem",
                        "position": index + 1,
                        "name": item.text,
                        "url": `#${item.id}`
                    }))
                })
            }} />
        </nav>
    );
};

export default TableOfContents;
