import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { api } from './api';

type Article = {
  id: string;
  title: string;
  body: string;
  category: string;
  created_at: string;
  image?: string;
};

export const Landing: React.FC = () => {
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');

  useEffect(() => {
    api.getContent()
      .then((allArticles: Article[]) => {
        setFeaturedArticles(allArticles.slice(0, 3));
        setRecentArticles(allArticles.slice(3, 9));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setSubscribeStatus('error');
      return;
    }
    setSubscribeStatus('loading');

    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSubscribeStatus('success');
      setEmail('');
    } catch (err) {
      setSubscribeStatus('error');
    } finally {
      setTimeout(() => setSubscribeStatus('idle'), 4000);
    }
  };

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
          <p className="text-sm text-neutral-400 font-mono uppercase tracking-widest">
            Initializing Atlas...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* SEO */}
      <Helmet>
        <title>Atlas — Deep Research on AI, Economics, Psychology & Systems</title>
        <meta
          name="description"
          content="Atlas delivers deep research on AI, economics, psychology, geopolitics and complex systems. Updated continuously with high-quality intelligence."
        />
        <link rel="canonical" href="https://yourdomain.com/" />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-neutral-50 to-white pattern-dots">
        <div className="relative max-w-6xl mx-auto px-6 py-28 md:py-44 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-400">
              Autonomous Research Engine
            </span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <h1 className="text-6xl md:text-8xl font-serif font-black tracking-tighter mb-8 gradient-text leading-[0.9]">
            ATLAS
          </h1>

          <p className="text-lg md:text-2xl font-serif italic text-neutral-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Sovereign intelligence for serious thinkers. Deep research, automation-driven publishing,
            and systems analysis across high-impact domains.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              to="/technology"
              className="group px-7 py-3 bg-emerald-600 text-white font-bold text-sm uppercase tracking-[0.12em] rounded-full hover:bg-emerald-700 hover:scale-105 transition-all duration-300 shadow-xl shadow-emerald-600/20"
            >
              Explore Research
              <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
            </Link>

            <Link
              to="/search"
              className="group px-7 py-3 border-2 border-neutral-200 text-neutral-700 font-bold text-sm uppercase tracking-[0.12em] rounded-full hover:border-neutral-300 hover:bg-neutral-50 transition-all duration-300"
            >
              Search Archive
            </Link>
          </div>

          {/* Email Capture */}
          <div className="max-w-md mx-auto mb-4">
            <form onSubmit={handleSubscribe} className="flex gap-2" aria-label="Subscribe form">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Get weekly intelligence brief..."
                className="flex-1 px-4 py-3 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label="Email address"
                required
              />
              <button
                type="submit"
                disabled={subscribeStatus === 'loading'}
                className="px-5 py-3 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 transition disabled:opacity-60"
              >
                {subscribeStatus === 'loading' ? 'Joining...' : 'Join'}
              </button>
            </form>
            {subscribeStatus === 'success' && (
              <p className="mt-3 text-sm text-emerald-600 font-medium">Thanks — you're subscribed! ✅</p>
            )}
            {subscribeStatus === 'error' && (
              <p className="mt-3 text-sm text-red-600 font-medium">Please enter a valid email address.</p>
            )}
          </div>

          {/* Featured Highlight (subtle overlap) */}
          {featuredArticles[0] && (
            <div className="mt-8 -mb-20">
              <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-6 transform -translate-y-8">
                <div className="md:flex md:items-center md:gap-6">
                  <div className="md:w-1/3 rounded-xl overflow-hidden bg-neutral-100 h-56">
                    {featuredArticles[0].image ? (
                      <img src={featuredArticles[0].image} alt={featuredArticles[0].title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400">No image</div>
                    )}
                  </div>

                  <div className="md:flex-1 mt-4 md:mt-0">
                    <div className="text-xs text-neutral-400 uppercase tracking-wider mb-2">Featured</div>
                    <h3 className="text-2xl md:text-3xl font-serif font-black mb-2 text-neutral-900">{featuredArticles[0].title}</h3>
                    <p className="text-neutral-600 mb-4 line-clamp-2">{featuredArticles[0].body.replace(/[#*`]/g, '').substring(0, 200)}...</p>
                    <div className="flex items-center gap-4">
                      <Link to={`/read/${featuredArticles[0].id}`} className="px-4 py-2 bg-emerald-600 text-white rounded-full font-bold hover:bg-emerald-700">Read</Link>
                      <Link to={`/${featuredArticles[0].category}`} className="text-sm text-neutral-500 font-medium">View category →</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-serif font-black tracking-tighter mb-6 text-neutral-900">
              Intelligence Sectors
            </h2>
            <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
              Structured intelligence across specialized domains.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.slug}
                to={`/${category.slug}`}
                className="group relative p-8 bg-neutral-50 hover:bg-white border border-transparent hover:border-neutral-200 rounded-2xl transition-all duration-500 hover:shadow-xl hover:shadow-black/5"
              >
                <div className={`w-3 h-3 ${category.color} rounded-full mb-6`} />
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
        </div>
      </section>

      {/* Featured */}
      <section className="py-24 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-serif font-black tracking-tighter mb-6 text-neutral-900">
              Featured Research
            </h2>
          </div>

          <div className="space-y-16">
            {featuredArticles.map((article, index) => (
              <article key={article.id} className="group">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-[10px] uppercase font-mono text-emerald-600 font-bold">
                    Featured #{String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="h-px flex-1 bg-black/[0.05]" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                    {new Date(article.created_at).toLocaleDateString()}
                  </span>
                </div>

                <Link to={`/read/${article.id}`} className="group block">
                  <div className="mb-6 overflow-hidden rounded-2xl bg-neutral-100">
                    {article.image ? (
                      <img src={article.image} alt={article.title} className="w-full h-56 object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-56 flex items-center justify-center text-neutral-400">
                        No image
                      </div>
                    )}
                  </div>
                  <h3 className="text-3xl md:text-4xl font-serif font-black group-hover:text-emerald-600 transition-all duration-500 leading-tight tracking-tight">
                    {article.title}
                  </h3>
                </Link>

                <p className="text-neutral-600 leading-relaxed text-lg mt-4">
                  {article.body.replace(/[#*`]/g, '').substring(0, 220)}...
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Recent */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentArticles.map((article) => (
              <Link
                key={article.id}
                to={`/read/${article.id}`}
                className="group block p-6 bg-neutral-50 hover:bg-white border border-transparent hover:border-neutral-200 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-black/5"
              >
                {article.image && (
                  <div className="mb-4 rounded-lg overflow-hidden h-40">
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                )}

                <div className="text-xs text-neutral-400 mb-2">
                  {article.category} · {new Date(article.created_at).toLocaleDateString()}
                </div>

                <h3 className="text-xl font-serif font-bold mb-3 text-neutral-900 group-hover:text-emerald-600 transition-colors leading-tight">
                  {article.title}
                </h3>

                <p className="text-sm text-neutral-500 leading-relaxed line-clamp-3">
                  {article.body.replace(/[#*`]/g, '').substring(0, 120)}...
                </p>
              </Link>
            ))}
          </div>

          {/* Monetization Placeholder */}
          <div className="mt-20 text-center text-xs text-neutral-400">
            Sponsored Intelligence Slots — Coming Soon
          </div>
        </div>
      </section>

      {/* Hidden SEO Crawl Links */}
      <section className="sr-only">
        <h2>Atlas Categories</h2>
        <ul>
          {categories.map(cat => (
            <li key={cat.slug}>
              <Link to={`/${cat.slug}`}>{cat.name} Research</Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
