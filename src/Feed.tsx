import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { api } from './api';
import { formatBody } from './utils/format';

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
        <div className="max-w-2xl mx-auto px-6 py-20 min-h-screen">
            <header className="mb-24 text-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 mb-6 block">Atlas Archive // {category}</span>
                <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tight mb-8 text-neutral-900">{title}</h1>
                <p className="text-base text-neutral-500 font-medium max-w-md mx-auto leading-relaxed">{subtitle}</p>
            </header>

            <div className="space-y-24">
                {items.length === 0 && (
                    <div className="text-center py-20 border border-dashed border-black/5 rounded-xl">
                        <p className="text-neutral-400 font-mono text-xs uppercase tracking-widest">No knowledge nodes found in this sector.</p>
                    </div>
                )}
                {items.map((item) => (
                    <article key={item.id} className="group transition-all duration-500">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-300 font-mono">
                                {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            <div className="h-px flex-1 bg-black/[0.03]"></div>
                        </div>

                        <Link to={`/read/${item.id}`} className="block mb-6">
                            <h2 className="text-3xl md:text-4xl font-bold font-serif group-hover:text-emerald-700 transition-colors cursor-pointer leading-tight tracking-tight">
                                {item.title}
                            </h2>
                        </Link>

                        <div className="prose prose-neutral max-w-none line-clamp-3 
                            prose-p:text-neutral-500 prose-p:leading-relaxed prose-p:text-base mb-8">
                            <ReactMarkdown>{formatBody(item.body)}</ReactMarkdown>
                        </div>

                        <Link
                            to={`/read/${item.id}`}
                            className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 group-hover:text-black transition-all flex items-center gap-2"
                        >
                            Open Research <span className="translate-y-px opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                        </Link>
                    </article>
                ))}
            </div>
        </div>
    );
};
