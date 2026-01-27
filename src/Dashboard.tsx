import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { api } from './api';
import { TagManager } from './components/Tags/TagManager';
import { useAuthStore } from './store/authStore';
import { useNavigate } from 'react-router-dom';
import { SEOHead } from './components/SEO/SEOHead';
import { APIKeyManager } from './components/Settings/APIKeyManager';

interface Source {
    title: string;
    url: string;
    type: string;
    author: string;
}

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('money');
    const [body, setBody] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [sources, setSources] = useState<Source[]>([]);
    const [status, setStatus] = useState('');
    const [previewMode, setPreviewMode] = useState(false);
    const [publishStatus, setPublishStatus] = useState<'draft' | 'published'>('published');

    // New source input
    const [newSource, setNewSource] = useState<Source>({ title: '', url: '', type: 'article', author: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.createContent({
                title,
                body,
                category,
                status: publishStatus,
                tags,
                sources: sources.filter(s => s.title), // Only include sources with titles
            });
            setStatus('Published successfully.');
            setTitle('');
            setBody('');
            setTags([]);
            setSources([]);
        } catch (err: any) {
            setStatus(err.response?.data?.error || 'Error publishing.');
        }
    };

    const handleSeed = async () => {
        await api.seed();
        setStatus('Database seeded.');
    };

    const addSource = () => {
        if (newSource.title) {
            setSources([...sources, newSource]);
            setNewSource({ title: '', url: '', type: 'article', author: '' });
        }
    };

    const removeSource = (index: number) => {
        setSources(sources.filter((_, i) => i !== index));
    };

    return (
        <div className="max-w-6xl mx-auto p-10 h-[calc(100vh-64px)] flex flex-col">
            <SEOHead title="Creator Studio" noIndex={true} />
            <header className="mb-8 flex justify-between items-center shrink-0">
                <div>
                    <h1 className="text-3xl font-black">Creator Studio</h1>
                    <p className="text-sm text-neutral-400 mt-1">
                        WRITE_MODE // USER: {user?.username || 'Unknown'}
                    </p>
                </div>
                <div className="flex gap-4">
                    <button onClick={handleSeed} className="text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-black">
                        Reset DB
                    </button>
                    <button
                        onClick={() => setPreviewMode(!previewMode)}
                        className="px-6 py-3 border border-black rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-neutral-50"
                    >
                        {previewMode ? 'Edit Mode' : 'Preview'}
                    </button>
                    <button onClick={handleSubmit} className="px-8 py-3 bg-black text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-neutral-800">
                        {publishStatus === 'draft' ? 'Save Draft' : 'Publish'}
                    </button>
                </div>
            </header>

            <div className="flex-1 flex gap-8 overflow-hidden">
                {/* Editor Column */}
                <div className={`flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar ${previewMode ? 'hidden md:flex' : 'flex'}`}>
                    <div className="flex gap-4">
                        <input
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Article Title"
                            className="flex-1 p-4 text-2xl font-bold border-b border-black/10 focus:outline-none focus:border-black bg-transparent placeholder:text-neutral-300 transition-colors"
                        />
                        <select
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            className="w-40 p-2 text-xs font-bold uppercase tracking-widest border-b border-black/10 focus:outline-none bg-transparent"
                        >
                            <option value="money">Money</option>
                            <option value="business">Business</option>
                        </select>
                    </div>

                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="radio"
                                checked={publishStatus === 'published'}
                                onChange={() => setPublishStatus('published')}
                                className="w-4 h-4"
                            />
                            <span className="uppercase text-xs">Publish</span>
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="radio"
                                checked={publishStatus === 'draft'}
                                onChange={() => setPublishStatus('draft')}
                                className="w-4 h-4"
                            />
                            <span className="font-mono uppercase text-xs">Save as Draft</span>
                        </label>
                    </div>

                    <textarea
                        value={body}
                        onChange={e => setBody(e.target.value)}
                        placeholder="# Write your lesson here...&#10;&#10;Use **Markdown** for formatting."
                        className="flex-1 resize-none p-6 bg-white border border-black/5 rounded-xl focus:outline-none focus:shadow-xl transition-shadow font-mono text-sm leading-relaxed custom-scrollbar"
                    />

                    {/* Tag Manager */}
                    <TagManager selectedTags={tags} onChange={setTags} />

                    {/* Source/Citation Manager */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-700 mb-2">
                            Sources & Citations
                        </label>

                        {sources.length > 0 && (
                            <div className="space-y-2 mb-4">
                                {sources.map((source, idx) => (
                                    <div key={idx} className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg border border-black/5">
                                        <div className="flex-1">
                                            <div className="font-medium text-sm">{source.title}</div>
                                            {source.url && (
                                                <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                                                    {source.url}
                                                </a>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeSource(idx)}
                                            className="text-neutral-500 hover:text-red-600 transition-colors"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="text"
                                value={newSource.title}
                                onChange={e => setNewSource({ ...newSource, title: e.target.value })}
                                placeholder="Source title"
                                className="p-2 border border-black/10 rounded-lg focus:outline-none focus:border-black text-sm"
                            />
                            <input
                                type="text"
                                value={newSource.url}
                                onChange={e => setNewSource({ ...newSource, url: e.target.value })}
                                placeholder="URL (optional)"
                                className="p-2 border border-black/10 rounded-lg focus:outline-none focus:border-black text-sm"
                            />
                            <input
                                type="text"
                                value={newSource.author}
                                onChange={e => setNewSource({ ...newSource, author: e.target.value })}
                                placeholder="Author (optional)"
                                className="p-2 border border-black/10 rounded-lg focus:outline-none focus:border-black text-sm"
                            />
                            <button
                                type="button"
                                onClick={addSource}
                                className="px-4 py-2 border border-black rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
                            >
                                Add Source
                            </button>
                        </div>
                    </div>
                </div>

                {/* Preview Column */}
                <div className={`flex-1 bg-neutral-50 rounded-xl border border-black/5 p-8 overflow-y-auto custom-scrollbar ${previewMode ? 'flex' : 'hidden md:flex'}`}>
                    {body ? (
                        <div className="prose prose-sm prose-neutral max-w-none">
                            <h1 className="mb-8">{title || 'Untitled Article'}</h1>
                            <ReactMarkdown>{body}</ReactMarkdown>

                            {tags.length > 0 && (
                                <div className="mt-8 pt-6 border-t border-black/10">
                                    <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3">Tags</p>
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map((tag) => (
                                            <span key={tag} className="px-3 py-1 bg-neutral-200 rounded-full text-sm">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {sources.length > 0 && (
                                <div className="mt-6">
                                    <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3">Sources</p>
                                    <ul className="text-sm space-y-1">
                                        {sources.map((source, idx) => (
                                            <li key={idx}>
                                                {source.url ? (
                                                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                        {source.title}
                                                    </a>
                                                ) : (
                                                    source.title
                                                )}
                                                {source.author && ` - ${source.author}`}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-neutral-300 text-xs uppercase tracking-widest">
                            Live Preview Area
                        </div>
                    )}
                </div>
            </div>

            {/* API Key Modal / Section - Simple integration at bottom of left panel for now */}
            <div className="mt-8 pt-8 border-t border-black/10">
                <APIKeyManager />
            </div>

            {status && <div className="absolute bottom-10 left-10 text-emerald-600 text-xs">{status}</div>}
        </div>
    );
};

