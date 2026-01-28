import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

interface RelatedPostsProps {
    currentArticleId: string;
    category: string;
    tags?: any[];
}

export const RelatedPosts: React.FC<RelatedPostsProps> = ({ currentArticleId, category }) => {
    const [posts, setPosts] = useState<any[]>([]);

    useEffect(() => {
        // Fetch posts from the same category
        api.getContent(category)
            .then(data => {
                // Filter out current post and take top 3
                const related = data
                    .filter((post: any) => post.id !== currentArticleId && String(post.id) !== currentArticleId)
                    .slice(0, 3);
                setPosts(related);
            })
            .catch(err => console.error('Failed to load related posts', err));
    }, [category, currentArticleId]);

    if (posts.length === 0) return null;

    return (
        <section className="mt-24 pt-16 border-t border-black/5">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 mb-12">
                Related Research
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {posts.map(post => (
                    <Link
                        key={post.id}
                        to={`/read/${post.id}`}
                        className="group flex flex-col h-full bg-neutral-50/30 hover:bg-neutral-50 rounded-xl p-6 transition-all duration-300 border border-transparent hover:border-black/5"
                    >
                        <span className="text-[9px] font-mono text-emerald-600 mb-4 block">
                            {new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>

                        <h4 className="font-serif font-bold text-xl mb-4 group-hover:text-emerald-700 transition-colors leading-tight">
                            {post.title}
                        </h4>

                        <p className="text-sm text-neutral-500 line-clamp-3 mb-6 flex-1 opacity-80 leading-relaxed">
                            {post.body.replace(/[#*`]/g, '')}
                        </p>

                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400 group-hover:text-emerald-600 transition-colors mt-auto">
                            <span>Read Protocol</span>
                            <span>→</span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};
