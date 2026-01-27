import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { SEOHead } from './components/SEO/SEOHead';
import { api } from './api';
import { formatBody } from './utils/format';

const calculateReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
};

export const Article: React.FC = () => {
    const { id } = useParams();
    const [article, setArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            api.getArticle(id)
                .then(data => {
                    setArticle(data);
                    setLoading(false);
                    // Increment view count
                    api.incrementView(id);
                })
                .catch(() => setLoading(false));
        }
    }, [id]);

    if (loading) return <div className="p-20 text-center text-sm text-neutral-400 font-medium">Loading knowledge node...</div>;
    if (!article) return <div className="p-20 text-center text-sm text-neutral-400 font-medium">Node not found.</div>;

    // Prepare Structured Data for Article
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": article.title,
        "description": article.body.substring(0, 160).replace(/[#*`]/g, ''),
        "author": {
            "@type": "Person",
            "name": article.author_name || "Atlas Contributor"
        },
        "datePublished": article.created_at,
        "dateModified": article.updated_at || article.created_at,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://atlas.com/read/${article.id}`
        },
        "publisher": {
            "@type": "Organization",
            "name": "Atlas",
            "logo": {
                "@type": "ImageObject",
                "url": "https://atlas.com/logo.png"
            }
        },
        "articleSection": article.category,
        "keywords": article.tags ? article.tags.map((t: any) => t.name).join(", ") : ""
    };

    return (
        <div className="max-w-2xl mx-auto px-6 py-16 md:py-24 min-h-screen">
            <SEOHead
                title={article.title}
                description={article.body.substring(0, 160).replace(/[#*`]/g, '')}
                type="article"
                publishedTime={article.created_at}
                author={article.author_name}
                section={article.category}
                tags={article.tags ? article.tags.map((t: any) => t.name) : []}
                structuredData={structuredData}
            />

            <Link to={`/${article.category}`} className="group text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 hover:text-black mb-12 inline-flex items-center gap-2 transition-all">
                <span className="group-hover:-translate-x-1 transition-transform">←</span> {article.category}
            </Link>

            <article className="animate-in fade-in slide-in-from-bottom-2 duration-1000">
                <header className="mb-16">
                    <div className="flex items-center gap-4 mb-8">
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-600 border border-emerald-600/20 px-2 py-0.5 rounded">
                            {article.category} Protocol
                        </span>
                        <div className="h-px flex-1 bg-black/[0.03]"></div>
                        <span className="text-[10px] uppercase font-mono text-neutral-300">
                            {new Date(article.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                        <span className="text-[10px] uppercase font-mono text-neutral-300">
                            • {calculateReadingTime(article.body)} min read
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-serif font-black leading-[1.1] tracking-tight mb-8">{article.title}</h1>

                    {article.author_name && (
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-[10px] font-bold text-neutral-400">
                                {article.author_name[0].toUpperCase()}
                            </div>
                            <p className="text-sm text-neutral-500">
                                <span className="text-neutral-300 mr-1">Collected by</span>
                                <span className="font-bold text-neutral-900">{article.author_name}</span>
                            </p>
                        </div>
                    )}
                </header>

                <div className="prose prose-neutral max-w-none 
                    prose-headings:font-serif prose-headings:font-black prose-headings:tracking-tight prose-headings:mt-16 prose-headings:mb-8
                    prose-p:text-neutral-800 prose-p:leading-[1.95] prose-p:text-[1.1rem] prose-p:mb-10 prose-p:tracking-tight
                    prose-li:text-neutral-800 prose-li:leading-[1.9] prose-li:mb-4
                    prose-blockquote:border-l-2 prose-blockquote:border-emerald-500 prose-blockquote:italic prose-blockquote:my-12 prose-blockquote:pl-8 prose-blockquote:text-neutral-500 prose-blockquote:text-xl
                    prose-img:rounded-2xl prose-img:my-16 prose-img:shadow-2xl">
                    <ReactMarkdown>{formatBody(article.body)}</ReactMarkdown>
                </div>

                {/* Footer Metadata */}
                <footer className="mt-20 pt-12 border-t border-black/5 space-y-12">
                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 mb-6">Taxonomy</p>
                            <div className="flex flex-wrap gap-2">
                                {article.tags.map((tag: any) => (
                                    <span
                                        key={tag.id}
                                        className="px-3 py-1 bg-neutral-50 border border-black/5 rounded text-[11px] font-bold uppercase tracking-wider text-neutral-500 hover:bg-black hover:text-white transition-all cursor-pointer"
                                    >
                                        #{tag.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sources */}
                    {article.sources && article.sources.length > 0 && (
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 mb-6">Intelligence Sources</p>
                            <div className="grid gap-4">
                                {article.sources.map((source: any) => (
                                    <div key={source.id} className="p-4 bg-neutral-50/50 border border-black/5 group hover:border-black/10 transition-colors">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="font-bold text-sm mb-1">{source.title}</div>
                                                {source.author && (
                                                    <div className="text-xs text-neutral-500 mb-2 uppercase tracking-wide font-medium">Source: {source.author}</div>
                                                )}
                                                {source.url && (
                                                    <a
                                                        href={source.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-[11px] text-blue-500 hover:text-blue-700 transition-colors break-all font-mono"
                                                    >
                                                        {source.url}
                                                    </a>
                                                )}
                                            </div>
                                            {source.verified && (
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5" title="Verified Source"></div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* View Count & ID */}
                    <div className="flex justify-between items-center text-[9px] uppercase tracking-[0.2em] font-mono text-neutral-300">
                        <span>Archive Node: {String(article.id).split('-')[0]}</span>
                        <span>Retrievals: {article.view_count || 0}</span>
                    </div>
                </footer>
            </article>
        </div>
    );
};

