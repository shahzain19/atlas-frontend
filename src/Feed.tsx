import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { api } from './api';

interface FeedProps {
    category: string;
    title: string;
    subtitle: string;
}

export const Feed: React.FC<FeedProps> = ({ category, title, subtitle }) => {
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        api.getContent(category).then(setItems);
    }, [category]);

    return (
        <div className="max-w-3xl mx-auto p-10 min-h-screen">
            <header className="mb-20 text-center">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4 block">{category.toUpperCase()} PROTOCOL</span>
                <h1 className="text-6xl font-serif font-black mb-6">{title}</h1>
                <p className="text-lg text-neutral-500 italic max-w-xl mx-auto">{subtitle}</p>
            </header>

            <div className="flex flex-col gap-12">
                {items.length === 0 && (
                    <div className="text-center py-20 text-neutral-400 font-mono text-sm">
                        No knowledge nodes found. Seeding database...
                    </div>
                )}
                {items.map((item) => (
                    <article key={item.id} className="group cursor-default mb-12">
                        <div className="flex items-baseline justify-between mb-6 border-b border-black/5 pb-4">
                            <Link to={`/read/${item.id}`} className="block">
                                <h2 className="text-3xl font-bold font-serif hover:text-neutral-600 transition-colors cursor-pointer">{item.title}</h2>
                            </Link>
                            <span className="text-[10px] uppercase font-mono text-neutral-300">{new Date(item.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="prose prose-neutral max-w-none prose-headings:font-serif prose-headings:font-bold prose-p:font-medium prose-p:text-neutral-600 prose-li:text-neutral-600">
                            <ReactMarkdown>{item.body}</ReactMarkdown>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
};
