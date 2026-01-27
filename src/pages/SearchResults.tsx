import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../api';
import { SEOHead } from '../components/SEO/SEOHead';

export const SearchResults: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [results, setResults] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || undefined;
    const tags = searchParams.get('tags') || undefined;

    useEffect(() => {
        if (!query) {
            setLoading(false);
            return;
        }

        const performSearch = async () => {
            setLoading(true);
            try {
                const data = await api.search({ q: query, category, tags });
                setResults(data);
            } catch (error) {
                console.error('Search failed:', error);
            } finally {
                setLoading(false);
            }
        };

        performSearch();
    }, [query, category, tags]);

    if (!query) {
        return (
            <div className="max-w-3xl mx-auto p-10 min-h-screen">
                <SEOHead
                    title="Search Atlas"
                    description="Search the Atlas knowledge base."
                    noIndex={true}
                />
                <div className="text-center py-20">
                    <h1 className="text-4xl font-serif font-black mb-4">Search Atlas</h1>
                    <p className="text-neutral-500">Enter a search query to begin</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto p-10 min-h-screen">
                <div className="text-center py-20 text-neutral-400 font-mono text-sm">
                    Searching...
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-10 min-h-screen">
            <SEOHead
                title={`Search: ${query}`}
                description={`Search results for "${query}" on Atlas.`}
                noIndex={true}
            />
            <header className="mb-12">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4 block">
                    SEARCH RESULTS
                </span>
                <h1 className="text-5xl font-serif font-black mb-4">"{query}"</h1>
                <p className="text-neutral-500">
                    Found <span className="font-bold">{results?.count || 0}</span> results
                </p>
            </header>

            {results?.results?.length === 0 ? (
                <div className="text-center py-20 text-neutral-400">
                    No results found. Try different keywords.
                </div>
            ) : (
                <div className="flex flex-col gap-8">
                    {results?.results?.map((item: any) => (
                        <article key={item.id} className="border-b border-black/5 pb-8">
                            <div className="flex items-baseline justify-between mb-4">
                                <Link to={`/read/${item.id}`}>
                                    <h2
                                        className="text-2xl font-bold font-serif hover:text-neutral-600 transition-colors"
                                        dangerouslySetInnerHTML={{ __html: item.title_snippet || item.title }}
                                    />
                                </Link>
                                <span className="text-[10px] uppercase font-mono text-neutral-300">
                                    {item.category}
                                </span>
                            </div>

                            {item.author_name && (
                                <p className="text-xs text-neutral-500 mb-3">
                                    By <span className="font-bold">{item.author_name}</span>
                                </p>
                            )}

                            <div
                                className="text-sm text-neutral-600 line-clamp-3"
                                dangerouslySetInnerHTML={{ __html: item.body_snippet || item.body.substring(0, 200) + '...' }}
                            />

                            {item.tags && item.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {item.tags.map((tag: any) => (
                                        <span
                                            key={tag.id}
                                            className="text-xs px-2 py-1 bg-neutral-100 rounded-full text-neutral-600"
                                        >
                                            {tag.name}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
};
