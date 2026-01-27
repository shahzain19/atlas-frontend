import React, { useState, useEffect } from 'react';
import { api } from '../../api';

interface TagManagerProps {
    selectedTags: string[];
    onChange: (tags: string[]) => void;
}

export const TagManager: React.FC<TagManagerProps> = ({ selectedTags, onChange }) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        if (inputValue.length < 2) {
            setSuggestions([]);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                const results = await api.tags.autocomplete(inputValue);
                setSuggestions(results);
            } catch (error) {
                console.error('Failed to fetch tag suggestions:', error);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [inputValue]);

    const handleAddTag = (tagName: string) => {
        if (!selectedTags.includes(tagName)) {
            onChange([...selectedTags, tagName]);
        }
        setInputValue('');
        setShowSuggestions(false);
    };

    const handleRemoveTag = (tagName: string) => {
        onChange(selectedTags.filter((t) => t !== tagName));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (inputValue.trim()) {
                handleAddTag(inputValue.trim());
            }
        }
    };

    return (
        <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-neutral-700 mb-2">
                Tags
            </label>

            {/* Selected tags */}
            {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {selectedTags.map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 border border-black/10 rounded-full text-sm"
                        >
                            {tag}
                            <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="text-neutral-500 hover:text-black transition-colors"
                                aria-label="Remove tag"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {/* Tag input with autocomplete */}
            <div className="relative">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="Add tags... (press Enter)"
                    className="w-full p-3 border border-black/10 rounded-lg focus:outline-none focus:border-black transition-colors"
                />

                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full mt-2 w-full bg-white border border-black/10 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                        {suggestions.map((tag) => (
                            <button
                                key={tag.id}
                                type="button"
                                onClick={() => handleAddTag(tag.name)}
                                className="w-full p-3 text-left hover:bg-neutral-50 transition-colors border-b border-black/5 last:border-0"
                            >
                                <div className="font-medium text-sm">{tag.name}</div>
                                {tag.description && (
                                    <div className="text-xs text-neutral-500 mt-1">{tag.description}</div>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <p className="text-xs text-neutral-500 mt-2 font-mono">
                Type and press Enter to add custom tags
            </p>
        </div>
    );
};
