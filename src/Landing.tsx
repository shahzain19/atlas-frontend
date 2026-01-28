import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from './api';

export const Landing: React.FC = () => {
    const [featuredArticles, setFeaturedArticles] = useState<any[]>([]);
    const [recentArticles, setRecentArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            // Get recent articles across all categories for both featured and recent sections
            api.getContent().then(data => data.slice(0, 12))
        ]).then(([allArticles]) => {
            // Use first 6 as featured, next 6 as recent
            setFeaturedArticles(allArticles.slice(0, 6));
            setRecentArticles(allArticles.slice(6, 12));
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }, []);

    const categories = [
        { slug: 'technology', name: 'Technology', description: 'AI, automation, and digital systems', color: 'bg-blue-500' },
        { slug: 'economics', name: 'Economics', description: 'Markets, incentives, and resource allocation', color: 'bg-emerald-500' },
        { slug: 'psychology', name: 'Psychology', description: 'Cognitive science and mental models', color: 'bg-purple-500' },
        { slug: 'geopolitics', name: 'Geopolitics', description: 'Power dynamics and international relations', color: 'bg-red-500' },
        { slug: 'history', name: 'History', description: 'Pattern recognition and systemic cycles', color: 'bg-amber-500' },
        { slug: 'philosophy', name: 'Philosophy', description: 'First principles and reasoning frameworks', color: 'bg-indigo-500' },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-sm text-neutral-400 font-mono uppercase tracking-widest">Initializing Atlas...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-neutral-50 to-white">
                <div className="absolute inset-0 opacity-40" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
                
                <div className="relative max-w-6xl mx-auto px-6 py-32 md:py-48">
                    <div className="text-center mb-20">
                        <div className="flex items-center justify-center gap-3 mb-8">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-400">
                                Deep Research Platform
                            </span>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        </div>
                        
                        <h1 className="text-7xl md:text-9xl font-serif font-black tracking-tighter mb-12 text-neutral-900 leading-[0.85]">
                            ATLAS
                        </h1>
                        
                        <p className="text-2xl md:text-3xl font-serif italic text-neutral-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                            Sovereign knowledge for serious thinkers. Deep research, systems analysis, and first-principles reasoning across 24 intelligence sectors.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
                            <Link
                                to="/technology"
                                className="group px-8 py-4 bg-emerald-600 text-white font-bold text-sm uppercase tracking-[0.2em] rounded-full hover:bg-emerald-700 hover:scale-105 transition-all duration-300 shadow-xl shadow-emerald-600/20"
                            >
                                Explore Research
                                <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
                            </Link>
                            
                            <Link
                                to="/search"
                                className="group px-8 py-4 border-2 border-neutral-200 text-neutral-700 font-bold text-sm uppercase tracking-[0.2em] rounded-full hover:border-neutral-300 hover:bg-neutral-50 transition-all duration-300"
                            >
                                Search Archive
                            </Link>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center max-w-2xl mx-auto">
                            <div>
                                <div className="text-3xl font-serif font-black text-emerald-600 mb-2">24</div>
                                <div className="text-xs uppercase tracking-widest text-neutral-400 font-bold">Intelligence Sectors</div>
                            </div>
                            <div>
                                <div className="text-3xl font-serif font-black text-emerald-600 mb-2">{recentArticles.length}+</div>
                                <div className="text-xs uppercase tracking-widest text-neutral-400 font-bold">Research Articles</div>
                            </div>
                            <div>
                                <div className="text-3xl font-serif font-black text-emerald-600 mb-2">∞</div>
                                <div className="text-xs uppercase tracking-widest text-neutral-400 font-bold">Depth of Analysis</div>
                            </div>
                            <div>
                                <div className="text-3xl font-serif font-black text-emerald-600 mb-2">1st</div>
                                <div className="text-xs uppercase tracking-widest text-neutral-400 font-bold">Principles Focus</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Categories */}
            <section className="py-24 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-5xl md:text-6xl font-serif font-black tracking-tighter mb-6 text-neutral-900">
                            Intelligence Sectors
                        </h2>
                        <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
                            Explore our comprehensive research across 24 specialized domains of knowledge and analysis.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categories.map((category) => (
                            <Link
                                key={category.slug}
                                to={`/${category.slug}`}
                                className="group relative p-8 bg-neutral-50 hover:bg-white border border-transparent hover:border-neutral-200 rounded-2xl transition-all duration-500 hover:shadow-xl hover:shadow-black/5"
                            >
                                <div className={`w-3 h-3 ${category.color} rounded-full mb-6 group-hover:scale-125 transition-transform duration-300`}></div>
                                
                                <h3 className="text-2xl font-serif font-bold mb-4 text-neutral-900 group-hover:text-emerald-600 transition-colors">
                                    {category.name}
                                </h3>
                                
                                <p className="text-neutral-500 mb-6 leading-relaxed">
                                    {category.description}
                                </p>
                                
                                <div className="flex items-center text-sm font-bold uppercase tracking-wider text-neutral-400 group-hover:text-emerald-600 transition-colors">
                                    <span>Explore Sector</span>
                                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                    
                    <div className="text-center mt-16">
                        <Link
                            to="/money"
                            className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] text-neutral-400 hover:text-emerald-600 transition-colors"
                        >
                            <span>View All 24 Sectors</span>
                            <div className="w-8 h-px bg-neutral-200"></div>
                            <span>→</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Research */}
            <section className="py-24 bg-neutral-50">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-5xl md:text-6xl font-serif font-black tracking-tighter mb-6 text-neutral-900">
                            Featured Research
                        </h2>
                        <p className="text-lg text-neutral-500">
                            Deep analysis and systematic reasoning on the most critical topics.
                        </p>
                    </div>
                    
                    <div className="space-y-16">
                        {featuredArticles.slice(0, 3).map((article, index) => (
                            <article key={article.id} className="group">
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="text-[10px] uppercase font-mono text-emerald-600 font-bold">
                                        Featured Research #{String(index + 1).padStart(2, '0')}
                                    </span>
                                    <div className="h-px flex-1 bg-black/[0.05]"></div>
                                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                                        {new Date(article.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>

                                <Link to={`/read/${article.id}`} className="block mb-6">
                                    <h3 className="text-3xl md:text-4xl font-serif font-black group-hover:text-emerald-600 transition-all duration-500 leading-tight tracking-tight">
                                        {article.title}
                                    </h3>
                                </Link>

                                <div className="prose prose-neutral max-w-none mb-8 opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                                    <p className="text-neutral-600 leading-relaxed text-lg">
                                        {article.body.replace(/[#*`]/g, '').substring(0, 200)}...
                                    </p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <Link
                                        to={`/read/${article.id}`}
                                        className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] text-neutral-400 group-hover:text-emerald-600 transition-colors"
                                    >
                                        <span>Read Analysis</span>
                                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </Link>
                                    
                                    <Link
                                        to={`/${article.category}`}
                                        className="px-3 py-1 bg-neutral-100 text-neutral-500 text-xs font-bold uppercase tracking-wider rounded hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
                                    >
                                        {article.category}
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Recent Articles */}
            <section className="py-24 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex items-center justify-between mb-16">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-serif font-black tracking-tighter mb-4 text-neutral-900">
                                Latest Intelligence
                            </h2>
                            <p className="text-neutral-500">
                                Recent additions to the Atlas research archive.
                            </p>
                        </div>
                        
                        <Link
                            to="/search"
                            className="hidden md:inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] text-neutral-400 hover:text-emerald-600 transition-colors"
                        >
                            <span>View Archive</span>
                            <span>→</span>
                        </Link>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recentArticles.map((article) => (
                            <Link
                                key={article.id}
                                to={`/read/${article.id}`}
                                className="group block p-6 bg-neutral-50 hover:bg-white border border-transparent hover:border-neutral-200 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-black/5"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded">
                                        {article.category}
                                    </span>
                                    <span className="text-xs text-neutral-400 font-mono">
                                        {new Date(article.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                
                                <h3 className="text-xl font-serif font-bold mb-3 text-neutral-900 group-hover:text-emerald-600 transition-colors leading-tight">
                                    {article.title}
                                </h3>
                                
                                <p className="text-sm text-neutral-500 leading-relaxed mb-4 line-clamp-3">
                                    {article.body.replace(/[#*`]/g, '').substring(0, 120)}...
                                </p>
                                
                                <div className="flex items-center text-xs font-bold uppercase tracking-wider text-neutral-400 group-hover:text-emerald-600 transition-colors">
                                    <span>Read More</span>
                                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-24 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-5xl md:text-6xl font-serif font-black tracking-tighter mb-8">
                        Ready to Think Deeper?
                    </h2>
                    
                    <p className="text-xl md:text-2xl font-serif italic mb-12 opacity-90 max-w-2xl mx-auto leading-relaxed">
                        Join the Atlas community of researchers, analysts, and independent thinkers exploring the frontiers of knowledge.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link
                            to="/register"
                            className="group px-8 py-4 bg-white text-emerald-700 font-bold text-sm uppercase tracking-[0.2em] rounded-full hover:bg-neutral-50 hover:scale-105 transition-all duration-300 shadow-xl"
                        >
                            Join Atlas
                            <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
                        </Link>
                        
                        <Link
                            to="/technology"
                            className="group px-8 py-4 border-2 border-white/30 text-white font-bold text-sm uppercase tracking-[0.2em] rounded-full hover:border-white/50 hover:bg-white/10 transition-all duration-300"
                        >
                            Start Exploring
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};