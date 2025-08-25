import React, { useState, useRef, useCallback } from 'react';
import { router } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';

interface Props {
    defaultValue?: string;
    placeholder?: string;
}

interface SearchResult {
    id: number;
    title: string;
    folder?: string | null;
    tags?: string[] | null;
}

export function SearchBar({ defaultValue = '', placeholder = 'Search...' }: Props) {
    const [query, setQuery] = useState(defaultValue);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const debouncedQuery = useDebounce(query, 300);

    const searchNotes = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        try {
            const response = await fetch(route('notes.search', { q: searchQuery }));
            const data = await response.json();
            setResults(data);
            setIsOpen(data.length > 0);
            setSelectedIndex(-1);
        } catch (error) {
            console.error('Search error:', error);
            setResults([]);
            setIsOpen(false);
        }
    }, []);

    React.useEffect(() => {
        searchNotes(debouncedQuery);
    }, [debouncedQuery, searchNotes]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            const url = new URL(window.location.href);
            url.searchParams.set('search', query);
            router.visit(url.toString(), { preserveState: true });
            setIsOpen(false);
        }
    };

    const handleResultClick = (result: SearchResult) => {
        router.visit(route('notes.show', result.id));
        setIsOpen(false);
        setQuery('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen || results.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => 
                    prev < results.length - 1 ? prev + 1 : 0
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => 
                    prev > 0 ? prev - 1 : results.length - 1
                );
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0) {
                    handleResultClick(results[selectedIndex]);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                setSelectedIndex(-1);
                inputRef.current?.blur();
                break;
        }
    };

    const handleBlur = () => {
        // Delay closing to allow for click events
        setTimeout(() => setIsOpen(false), 150);
    };

    return (
        <div className="relative">
            <form onSubmit={handleSubmit}>
                <div className="relative">
                    <Input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => results.length > 0 && setIsOpen(true)}
                        onBlur={handleBlur}
                        placeholder={placeholder}
                        className="pr-8"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        🔍
                    </div>
                </div>
            </form>

            {isOpen && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
                    {results.map((result, index) => (
                        <button
                            key={result.id}
                            onClick={() => handleResultClick(result)}
                            className={`search-result w-full text-left ${
                                index === selectedIndex ? 'active' : ''
                            }`}
                        >
                            <div className="font-medium text-popover-foreground">
                                {result.title}
                            </div>
                            {result.folder && (
                                <div className="text-xs text-muted-foreground">
                                    📁 {result.folder}
                                </div>
                            )}
                            {result.tags && result.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {result.tags.slice(0, 3).map(tag => (
                                        <span key={tag} className="text-xs bg-secondary text-secondary-foreground px-1 rounded">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}