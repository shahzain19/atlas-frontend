import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { SEOHead } from './components/SEO/SEOHead';
import { TableOfContents } from './components/TableOfContents';
import { RelatedPosts } from './components/RelatedPosts';
import { Breadcrumbs } from './components/Breadcrumbs';
import { ReadingProgress } from './components/ReadingProgress';
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
    const [copyStatus, setCopyStatus] = useState<'idle'|'copied'|'error'>('idle');

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
            "@id": `https://atlas-frontend-omega.vercel.app/read/${article.id}`
        },
        "publisher": {
            "@type": "Organization",
            "name": "Atlas",
            "logo": {
                "@type": "ImageObject",
                "url": "https://atlas-frontend-omega.vercel.app/og-image.png"
            }
        },
        "articleSection": article.category,
        "keywords": article.tags ? article.tags.map((t: any) => t.name).join(", ") : "",
        "wordCount": article.body.split(/\s+/).length,
        "timeRequired": `PT${calculateReadingTime(article.body)}M`
    };

    const breadcrumbItems = [
        { label: article.category, path: `/${article.category}` },
        { label: article.title }
    ];

    return (
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 min-h-screen">
            <ReadingProgress />
            <SEOHead
                title={article.title}
                description={article.body.substring(0, 160).replace(/[#*`]/g, '')}
                image={article.og_image || article.image || '/og-image.png'}
                type="article"
                publishedTime={article.created_at}
                author={article.author_name}
                section={article.category}
                tags={article.tags ? article.tags.map((t: any) => t.name) : []}
                structuredData={structuredData}
            />

            {/* Breadcrumbs */}
            <Breadcrumbs items={breadcrumbItems} />

            <article className="animate-in fade-in slide-in-from-bottom-2 duration-1000">
                <header className="mb-16">
                    <div className="flex items-center gap-4 mb-8">
                        <span className={`text-[10px] font-bold uppercase tracking-[0.3em] px-2 py-0.5 rounded
    ${article.type === 'knowledge' 
        ? 'text-indigo-600 border border-indigo-600/30' 
        : 'text-emerald-600 border border-emerald-600/20'}
`}>
    {article.type === 'knowledge' ? 'Knowledge Node' : `${article.category} Protocol`}
</span>
                        <div className="h-px flex-1 bg-black/[0.03]"></div>
                        <time 
                            dateTime={article.created_at}
                            className="text-[10px] uppercase font-mono text-neutral-300"
                        >
                            {new Date(article.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </time>
                        {article.updated_at && article.updated_at !== article.created_at && (
                            <span className="text-[10px] uppercase font-mono text-emerald-600">
                                • Updated {new Date(article.updated_at).toLocaleDateString()}
                            </span>
                        )}
                    </div>

                    <h1 className="text-4xl md:text-6xl font-serif font-black leading-[1.1] tracking-tight mb-6">{article.title}</h1>

                    {/* Share / Actions */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => {
                                    const url = typeof window !== 'undefined' ? window.location.href : '';
                                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(url)}`, '_blank', 'noopener');
                                }}
                                className="px-3 py-2 bg-neutral-50 border rounded hover:bg-neutral-100 text-sm"
                                aria-label="Share on Twitter"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 inline-block mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M22 5.92c-.7.31-1.46.52-2.26.61.81-.48 1.43-1.24 1.72-2.15-.75.45-1.58.78-2.47.96a4.1 4.1 0 0 0-7 3.74A11.62 11.62 0 0 1 3.16 4.9a4.1 4.1 0 0 0 1.27 5.48c-.6-.02-1.17-.18-1.66-.46v.05c0 1.97 1.4 3.61 3.25 3.98-.34.09-.7.14-1.07.14-.26 0-.52-.03-.77-.07.52 1.59 2.03 2.75 3.82 2.78A8.23 8.23 0 0 1 2 19.54a11.63 11.63 0 0 0 6.29 1.84c7.55 0 11.68-6.26 11.68-11.69v-.53c.8-.58 1.47-1.3 2.01-2.12-.73.33-1.52.55-2.34.65z"/></svg>
                                Twitter
                            </button>

                            <button
                                onClick={() => {
                                    const url = typeof window !== 'undefined' ? window.location.href : '';
                                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank', 'noopener');
                                }}
                                className="px-3 py-2 bg-neutral-50 border rounded hover:bg-neutral-100 text-sm"
                                aria-label="Share on LinkedIn"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 inline-block mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 11.001 5.001 2.5 2.5 0 01-.001-5.001zM3 8.98h3.96V21H3V8.98zM9.5 8.98H13v1.62h.05c.5-.95 1.76-1.95 3.63-1.95 3.88 0 4.6 2.56 4.6 5.89V21h-3.96v-5.09c0-1.22-.02-2.78-1.7-2.78-1.7 0-1.96 1.33-1.96 2.68V21H9.5V8.98z"/></svg>
                                LinkedIn
                            </button>

                            <button
                                onClick={async () => {
                                    try {
                                        const url = typeof window !== 'undefined' ? window.location.href : '';
                                        await navigator.clipboard.writeText(url);
                                        setCopyStatus('copied');
                                        setTimeout(() => setCopyStatus('idle'), 2500);
                                    } catch (e) {
                                        setCopyStatus('error');
                                        setTimeout(() => setCopyStatus('idle'), 2500);
                                    }
                                }}
                                className="px-3 py-2 bg-neutral-50 border rounded hover:bg-neutral-100 text-sm flex items-center gap-2"
                                aria-label="Copy link"
                            >
                                Copy Link
                                {copyStatus === 'copied' && <span className="text-emerald-600 text-xs">Copied</span>}
                                {copyStatus === 'error' && <span className="text-red-600 text-xs">Error</span>}
                            </button>
                        </div>

                        <div className="text-sm text-neutral-500">
                            <span className="font-mono uppercase tracking-wide">•</span> {calculateReadingTime(article.body)} min read
                        </div>
                    </div>

                    {article.author_name && (
                        <div className="flex items-center gap-3 mb-8">
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

                {/* Table of Contents */}
                <TableOfContents content={article.body} />

                {/* Article Content */}
                <div className="prose prose-neutral max-w-none 
                    prose-headings:font-serif prose-headings:font-black prose-headings:tracking-tight prose-headings:mt-16 prose-headings:mb-8 prose-headings:scroll-mt-24
                    prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl
                    prose-p:mb-8 prose-p:tracking-tight prose-p:max-w-[75ch]
                    prose-li:mb-3
                    prose-blockquote:border-l-2 prose-blockquote:border-emerald-500 prose-blockquote:italic prose-blockquote:my-12 prose-blockquote:pl-8 prose-blockquote:text-xl prose-blockquote:leading-relaxed
                    prose-img:rounded-2xl prose-img:my-16 prose-img:shadow-2xl prose-img:w-full
                    prose-code:bg-neutral-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
                    prose-pre:bg-neutral-900 prose-pre:text-neutral-100 prose-pre:rounded-xl prose-pre:p-6 prose-pre:overflow-x-auto
                    prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                    prose-strong:text-neutral-900 prose-strong:font-bold
                    prose-em:text-neutral-700 prose-em:italic
                    prose-hr:border-black/10 prose-hr:my-16
                    prose-table:border-collapse prose-table:w-full prose-table:my-8
                    prose-th:border prose-th:border-neutral-200 prose-th:bg-neutral-50 prose-th:p-3 prose-th:text-left prose-th:font-bold
                    prose-td:border prose-td:border-neutral-200 prose-td:p-3
                    ">
                    <ReactMarkdown
                        components={{
                            h2: ({ children, ...props }) => (
                                <h2 id={String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')} {...props}>
                                    {children}
                                </h2>
                            ),
                            h3: ({ children, ...props }) => (
                                <h3 id={String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')} {...props}>
                                    {children}
                                </h3>
                            ),
                            h4: ({ children, ...props }) => (
                                <h4 id={String(children).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')} {...props}>
                                    {children}
                                </h4>
                            ),
                        }}
                    >
                        {formatBody(article.body)}
                    </ReactMarkdown>
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

                {/* Related Posts */}
                <RelatedPosts 
                    currentArticleId={String(article.id)} 
                    category={article.category}
                    tags={article.tags}
                />
            </article>
        </div>
    );
};

