import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { SEOHead } from './components/SEO/SEOHead';
import { api } from './api';

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
        <div className="max-w-3xl mx-auto p-10 min-h-screen">
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

            <Link to={`/${article.category}`} className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-black mb-8 block transition-colors">
                ← Back to {article.category}
            </Link>

            <article className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <header className="mb-12 border-b border-black/5 pb-8">
                    <div className="flex justify-between items-start mb-6">
                        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                            {article.category} Protocol
                        </span>
                        <span className="text-[10px] uppercase font-mono text-neutral-300">
                            ID: {article.id} • {new Date(article.created_at).toLocaleDateString()}
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-serif font-black leading-tight mb-6">{article.title}</h1>

                    {article.author_name && (
                        <p className="text-sm text-neutral-500">
                            By <span className="font-bold">{article.author_name}</span>
                        </p>
                    )}
                </header>

                <div className="prose prose-lg prose-neutral max-w-none prose-headings:font-serif prose-headings:font-bold prose-p:font-medium prose-p:text-neutral-600 prose-li:text-neutral-600 leading-relaxed">
                    <ReactMarkdown>{article.body}</ReactMarkdown>
                </div>

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-black/10">
                        <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">Tags</p>
                        <div className="flex flex-wrap gap-2">
                            {article.tags.map((tag: any) => (
                                <span
                                    key={tag.id}
                                    className="px-3 py-1 bg-neutral-100 border border-black/10 rounded-full text-sm hover:bg-black hover:text-white transition-colors cursor-pointer"
                                >
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Sources */}
                {article.sources && article.sources.length > 0 && (
                    <div className="mt-8">
                        <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">Sources & Citations</p>
                        <div className="space-y-3">
                            {article.sources.map((source: any) => (
                                <div key={source.id} className="p-4 bg-neutral-50 rounded-lg border border-black/5">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="font-medium text-sm mb-1">{source.title}</div>
                                            {source.author && (
                                                <div className="text-xs text-neutral-500 mb-1">by {source.author}</div>
                                            )}
                                            {source.url && (
                                                <a
                                                    href={source.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-blue-600 hover:underline break-all"
                                                >
                                                    {source.url}
                                                </a>
                                            )}
                                        </div>
                                        {source.verified && (
                                            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full ml-3">
                                                Verified
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* View Count */}
                <div className="mt-8 pt-6 border-t border-black/10">
                    <p className="text-xs font-mono text-neutral-400">
                        Views: {article.view_count || 0}
                    </p>
                </div>
            </article>
        </div>
    );
};

