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
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="Search knowledge..."
                    className="w-full px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:border-black transition-colors text-sm"
                />
            </form>

            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white border border-black/10 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                    {suggestions.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleSuggestionClick(item.id)}
                            className="w-full p-3 text-left hover:bg-neutral-50 transition-colors border-b border-black/5 last:border-0"
                        >
                            <div className="font-medium text-sm">{item.title}</div>
                            <div className="text-xs text-neutral-500 uppercase font-mono mt-1">{item.category}</div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
