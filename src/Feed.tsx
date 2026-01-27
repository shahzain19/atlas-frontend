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
        <div className="max-w-2xl mx-auto px-6 py-24 min-h-screen">
            <header className="mb-32">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-400">Sector Architecture // {category}</span>
                </div>
                <h1 className="text-6xl md:text-8xl font-serif font-black tracking-tighter mb-10 text-neutral-900 leading-[0.9]">{title}</h1>
                <p className="text-lg text-neutral-500 font-serif italic max-w-md leading-relaxed border-l-2 border-black/5 pl-6">{subtitle}</p>
            </header>

            <div className="space-y-24">
                {items.length === 0 && (
                    <div className="text-center py-20 border border-dashed border-black/5 rounded-xl">
                        <p className="text-neutral-400 font-mono text-xs uppercase tracking-widest">No knowledge nodes found in this sector.</p>
                    </div>
                )}
                {items.map((item) => (
                    <article key={item.id} className="group transition-all duration-700">
                        <div className="flex items-center gap-4 mb-8">
                            <span className="text-[10px] uppercase font-mono text-neutral-300">
                                Archive Node {String(item.id).split('-')[0]}
                            </span>
                            <div className="h-px flex-1 bg-black/[0.03]"></div>
                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                                {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>

                        <Link to={`/read/${item.id}`} className="block mb-6 relative">
                            <h2 className="text-4xl md:text-5xl font-serif font-black group-hover:text-emerald-600 transition-all duration-500 cursor-pointer leading-[1.1] tracking-tighter">
                                {item.title}
                            </h2>
                        </Link>

                        <div className="prose prose-neutral max-w-none line-clamp-2 
                            prose-p:text-neutral-500 prose-p:leading-relaxed prose-p:text-base prose-p:font-serif mb-10 opacity-70 group-hover:opacity-100 transition-opacity duration-500">
                            <ReactMarkdown>{formatBody(item.body)}</ReactMarkdown>
                        </div>

                        <Link
                            to={`/read/${item.id}`}
                            className="inline-flex items-center gap-4 py-2 border-b border-black/5 group-hover:border-emerald-500 transition-all duration-500 overflow-hidden"
                        >
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 group-hover:text-black transition-colors whitespace-nowrap">Access Protocol</span>
                            <div className="w-12 h-px bg-black/5 group-hover:bg-emerald-500 transition-all"></div>
                            <span className="text-base translate-y-px text-neutral-300 group-hover:text-emerald-500 group-hover:translate-x-2 transition-all">→</span>
                        </Link>
                    </article>
                ))}
            </div>
        </div>
    );
};
