import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api';

interface SearchBarProps {
    className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ className = '' }) => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        if (query.length < 2) {
            setSuggestions([]);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                const results = await api.searchSuggestions(query);
                setSuggestions(results);
            } catch (error) {
                console.error('Failed to fetch suggestions:', error);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query)}`);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (id: number) => {
        navigate(`/read/${id}`);
        setQuery('');
        setShowSuggestions(false);
    };

    return (
        <div className={`relative ${className}`}>
            <form onSubmit={handleSearch}>
                <div className="relative group">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        placeholder="Search base..."
                        className="w-full px-4 py-1.5 bg-black/[0.02] border border-black/5 rounded-full focus:outline-none focus:bg-white focus:border-black/20 focus:ring-4 focus:ring-black/[0.02] transition-all text-[11px] font-mono placeholder:text-neutral-400"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <span className="text-[10px] font-mono text-neutral-300 group-focus-within:opacity-0 transition-opacity">⌘K</span>
                    </div>
                </div>
            </form>

            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full mt-3 w-64 right-0 bg-white/80 backdrop-blur-xl border border-black/5 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="p-2 border-b border-black/[0.03] bg-black/[0.02]">
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-400 px-2 leading-none">Intelligence Feed</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        {suggestions.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleSuggestionClick(item.id)}
                                className="w-full p-4 text-left hover:bg-black hover:text-white group transition-all border-b border-black/[0.03] last:border-0"
                            >
                                <div className="font-serif font-bold text-sm leading-snug">{item.title}</div>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-[9px] uppercase tracking-wider font-mono opacity-50 group-hover:opacity-80 transition-opacity">{item.category}</span>
                                    <div className="h-1 w-1 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                            </button>
                        ))}
                    </div>
                    <div className="p-2 border-t border-black/[0.03] bg-black/[0.01] text-center">
                        <span className="text-[9px] font-mono text-neutral-300">Enter to view all results</span>
                    </div>
                </div>
            )}
        </div>
    );
};
