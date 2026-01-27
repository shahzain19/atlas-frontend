import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { api } from './api';
import { TagManager } from './components/Tags/TagManager';
import { useAuthStore } from './store/authStore';
import { SEOHead } from './components/SEO/SEOHead';
import { APIKeyManager } from './components/Settings/APIKeyManager';
import { formatBody } from './utils/format';

interface Source {
    title: string;
    url: string;
    type: string;
    author: string;
}

export const Dashboard: React.FC = () => {
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
        <div className="max-w-[1400px] mx-auto px-8 py-8 h-screen flex flex-col gap-8 bg-[#fafafa]">
            <SEOHead title="Intelligence Studio" noIndex={true} />

            <header className="flex justify-between items-end shrink-0">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <h1 className="text-sm font-bold uppercase tracking-[0.3em] text-neutral-400">Intelligence Studio</h1>
                    </div>
                    <p className="text-[10px] font-mono text-neutral-300 uppercase tracking-widest">Operator: {user?.username} // Session: {new Date().toLocaleTimeString()}</p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex bg-neutral-100 p-1 rounded-full border border-black/[0.03]">
                        <button
                            onClick={() => setPreviewMode(false)}
                            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${!previewMode ? 'bg-white text-black shadow-sm' : 'text-neutral-400 hover:text-neutral-600'}`}
                        >
                            Draft
                        </button>
                        <button
                            onClick={() => setPreviewMode(true)}
                            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${previewMode ? 'bg-white text-black shadow-sm' : 'text-neutral-400 hover:text-neutral-600'}`}
                        >
                            Preview
                        </button>
                    </div>
                    <button onClick={handleSubmit} className="px-8 py-2.5 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all active:scale-95">
                        {publishStatus === 'draft' ? 'Archive Draft' : 'Index Record'}
                    </button>
                </div>
            </header>

            <div className="flex-1 flex gap-12 overflow-hidden">
                {/* Editor Column */}
                <div className={`flex-1 flex flex-col gap-8 overflow-y-auto pr-4 custom-scrollbar ${previewMode ? 'hidden xl:flex' : 'flex'}`}>
                    <div className="space-y-4">
                        <input
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Enter Classification Title..."
                            className="w-full text-4xl font-serif font-black bg-transparent border-none focus:outline-none placeholder:text-neutral-200"
                        />
                        <div className="flex items-center gap-6 pb-4 border-b border-black/[0.03]">
                            <select
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                className="bg-transparent text-[10px] font-bold uppercase tracking-[0.2em] focus:outline-none cursor-pointer text-emerald-600"
                            >
                                <option value="money">Sector: Money</option>
                                <option value="business">Sector: Business</option>
                                <option value="intelligence">Sector: Intel</option>
                                <option value="technology">Sector: Tech</option>
                                <option value="health">Sector: Health</option>
                                <option value="culture">Sector: Culture</option>
                            </select>
                            <div className="h-3 w-px bg-black/10"></div>
                            <div className="flex gap-4">
                                <button onClick={() => setPublishStatus('published')} className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${publishStatus === 'published' ? 'text-black' : 'text-neutral-300'}`}>Public</button>
                                <button onClick={() => setPublishStatus('draft')} className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${publishStatus === 'draft' ? 'text-black' : 'text-neutral-300'}`}>Hidden</button>
                            </div>
                        </div>
                    </div>

                    <textarea
                        value={body}
                        onChange={e => setBody(e.target.value)}
                        placeholder="Begin documenting... (Markdown supported)"
                        className="flex-1 resize-none bg-transparent focus:outline-none font-sans text-lg leading-relaxed placeholder:text-neutral-200 custom-scrollbar"
                    />

                    <div className="space-y-8 pt-8 border-t border-black/[0.03]">
                        <TagManager selectedTags={tags} onChange={setTags} />

                        <div className="bg-white p-6 rounded-2xl border border-black/[0.03] space-y-6">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400">Source Documentation</h3>

                            {sources.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {sources.map((source, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-neutral-50 border border-black/[0.03] rounded-xl hover:border-black/10 transition-colors">
                                            <div className="overflow-hidden">
                                                <div className="font-bold text-xs truncate">{source.title}</div>
                                                <div className="text-[10px] text-neutral-400 truncate font-mono">{source.url || 'Internal Record'}</div>
                                            </div>
                                            <button onClick={() => removeSource(idx)} className="ml-4 text-neutral-300 hover:text-black transition-colors font-bold flex-shrink-0">×</button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex flex-col gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        value={newSource.title}
                                        onChange={e => setNewSource({ ...newSource, title: e.target.value })}
                                        placeholder="Intelligence Source Title"
                                        className="bg-neutral-50 px-4 py-2 rounded-xl border border-transparent focus:bg-white focus:border-black/5 outline-none text-xs transition-all"
                                    />
                                    <input
                                        type="text"
                                        value={newSource.url}
                                        onChange={e => setNewSource({ ...newSource, url: e.target.value })}
                                        placeholder="Reference URL"
                                        className="bg-neutral-50 px-4 py-2 rounded-xl border border-transparent focus:bg-white focus:border-black/5 outline-none text-xs transition-all"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={addSource}
                                    className="w-full py-2.5 border border-black/5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all active:scale-95"
                                >
                                    Attach Source
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview Column */}
                <div className={`flex-1 flex flex-col gap-8 overflow-y-auto transition-all duration-700 ${previewMode ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none hidden xl:flex'}`}>
                    <div className="bg-white p-12 md:p-20 rounded-[2.5rem] border border-black/[0.03] shadow-2xl shadow-black/[0.02]">
                        {body ? (
                            <div className="prose prose-neutral max-w-none 
                                prose-headings:font-serif prose-headings:font-black prose-headings:tracking-tight prose-headings:mt-16 prose-headings:mb-8
                                prose-p:text-neutral-800 prose-p:leading-[1.95] prose-p:text-[1.1rem] prose-p:mb-10 prose-p:tracking-tight
                                prose-li:text-neutral-800 prose-li:leading-[1.9] prose-li:mb-4
                                prose-blockquote:border-l-2 prose-blockquote:border-emerald-500 prose-blockquote:italic prose-blockquote:my-12 prose-blockquote:pl-8 prose-blockquote:text-neutral-500 prose-blockquote:text-xl">
                                <h1 className="text-4xl md:text-6xl font-serif font-black leading-[1.1] mb-12">{title || 'Untitled Node'}</h1>
                                <ReactMarkdown>{formatBody(body)}</ReactMarkdown>

                                <footer className="mt-20 pt-12 border-t border-black/5 space-y-8">
                                    <div className="flex justify-between items-center text-[9px] uppercase tracking-[0.2em] font-mono text-neutral-300">
                                        <span>Preview Buffer</span>
                                        <span>Sector: {category}</span>
                                    </div>
                                </footer>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center min-h-[400px] text-neutral-200 text-[10px] uppercase tracking-[0.3em] font-bold">
                                Awaiting data input for visualization...
                            </div>
                        )}
                    </div>

                    <div className="px-12 py-8 bg-neutral-100 rounded-3xl border border-black/[0.03] space-y-6 self-start w-full">
                        <APIKeyManager />
                        <div className="flex justify-center pt-4 border-t border-black/[0.03]">
                            <button onClick={handleSeed} className="text-[9px] font-mono text-neutral-300 hover:text-red-500 uppercase tracking-widest transition-colors">
                                Danger: Factory Reset Baseline
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {status && (
                <div className="fixed bottom-8 right-8 z-[60] bg-black text-white px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-2xl animate-in fade-in slide-in-from-bottom-4">
                    {status}
                </div>
            )}
        </div>
    );
};

