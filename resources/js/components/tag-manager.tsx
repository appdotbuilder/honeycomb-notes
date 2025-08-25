import React from 'react';
import { router } from '@inertiajs/react';

interface Props {
    tags: string[];
    selectedTag?: string;
}

export function TagManager({ tags, selectedTag }: Props) {
    const handleTagClick = (tag: string) => {
        const url = new URL(window.location.href);
        if (selectedTag === tag) {
            url.searchParams.delete('tag');
        } else {
            url.searchParams.set('tag', tag);
            url.searchParams.delete('folder');
        }
        router.visit(url.toString(), { preserveState: true });
    };

    const handleClearFilters = () => {
        const url = new URL(window.location.href);
        url.searchParams.delete('tag');
        url.searchParams.delete('folder');
        url.searchParams.delete('favorites');
        router.visit(url.toString(), { preserveState: true });
    };

    return (
        <div className="text-sidebar-foreground">
            <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium flex items-center gap-2">
                    🏷️ Tags
                </h4>
                {(selectedTag) && (
                    <button
                        onClick={handleClearFilters}
                        className="text-xs text-muted-foreground hover:text-sidebar-foreground"
                    >
                        Clear
                    </button>
                )}
            </div>
            
            {tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => handleTagClick(tag)}
                            className={`tag transition-colors ${
                                selectedTag === tag 
                                    ? 'bg-primary text-primary-foreground' 
                                    : 'hover:bg-sidebar-accent'
                            }`}
                        >
                            #{tag}
                        </button>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">
                    No tags yet. Add tags to your notes to organize them better.
                </p>
            )}
        </div>
    );
}