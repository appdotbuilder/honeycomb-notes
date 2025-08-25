import React, { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { NotePreview } from '@/components/note-preview';

interface Props {
    folders: string[];
    tags: string[];
    [key: string]: unknown;
}

interface NoteFormData {
    title: string;
    content: string;
    tags: string[];
    folder: string;
    is_favorite: boolean;
    [key: string]: string | boolean | string[];
}

export default function CreateNote({ folders, tags }: Props) {
    const { data, setData, post, processing, errors } = useForm<NoteFormData>({
        title: '',
        content: '# New Note\n\nStart writing your note here...\n\nUse [[Note Name]] to link to other notes.',
        tags: [],
        folder: '',
        is_favorite: false
    });

    const [showPreview, setShowPreview] = useState(false);
    const [tagInput, setTagInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('notes.store'));
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !data.tags.includes(tagInput.trim())) {
            setData('tags', [...data.tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setData('tags', data.tags.filter(tag => tag !== tagToRemove));
    };

    const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            handleAddTag();
        }
    };

    return (
        <AppShell>
            <div className="min-h-screen bg-background">
                <div className="max-w-7xl mx-auto p-6">
                    <div className="mb-6">
                        <div className="flex items-center gap-4 mb-2">
                            <Button
                                variant="outline"
                                onClick={() => router.visit(route('home'))}
                            >
                                ← Back to Notes
                            </Button>
                            <h1 className="text-2xl font-bold text-foreground">✨ Create New Note</h1>
                        </div>
                        <p className="text-muted-foreground">
                            Create a new note and start building your knowledge base.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid lg:grid-cols-2 gap-6">
                            {/* Editor Section */}
                            <div className="space-y-6">
                                <div className="bg-card rounded-lg border border-border p-6">
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="title" className="text-sm font-medium">
                                                📄 Note Title
                                            </Label>
                                            <Input
                                                id="title"
                                                type="text"
                                                value={data.title}
                                                onChange={(e) => setData('title', e.target.value)}
                                                placeholder="Enter note title..."
                                                className="mt-1"
                                                required
                                            />
                                            {errors.title && (
                                                <p className="text-sm text-destructive mt-1">{errors.title}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="content" className="text-sm font-medium">
                                                ✍️ Content
                                            </Label>
                                            <Textarea
                                                id="content"
                                                value={data.content}
                                                onChange={(e) => setData('content', e.target.value)}
                                                className="mt-1 font-mono text-sm h-96 resize-none"
                                                placeholder="Start writing your note..."
                                                required
                                            />
                                            {errors.content && (
                                                <p className="text-sm text-destructive mt-1">{errors.content}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-card rounded-lg border border-border p-6">
                                    <h3 className="font-medium mb-4">📋 Organization</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="folder" className="text-sm font-medium">
                                                📁 Folder (optional)
                                            </Label>
                                            <Input
                                                id="folder"
                                                type="text"
                                                value={data.folder}
                                                onChange={(e) => setData('folder', e.target.value)}
                                                placeholder="Enter folder name or leave empty"
                                                className="mt-1"
                                                list="folder-suggestions"
                                            />
                                            <datalist id="folder-suggestions">
                                                {folders.map(folder => (
                                                    <option key={folder} value={folder} />
                                                ))}
                                            </datalist>
                                        </div>

                                        <div>
                                            <Label className="text-sm font-medium">
                                                🏷️ Tags
                                            </Label>
                                            <div className="mt-1 space-y-2">
                                                <div className="flex gap-2">
                                                    <Input
                                                        type="text"
                                                        value={tagInput}
                                                        onChange={(e) => setTagInput(e.target.value)}
                                                        onKeyDown={handleTagInputKeyDown}
                                                        placeholder="Add a tag and press Enter"
                                                        className="flex-1"
                                                        list="tag-suggestions"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={handleAddTag}
                                                        disabled={!tagInput.trim()}
                                                    >
                                                        Add
                                                    </Button>
                                                </div>
                                                <datalist id="tag-suggestions">
                                                    {tags.map(tag => (
                                                        <option key={tag} value={tag} />
                                                    ))}
                                                </datalist>
                                                
                                                {data.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {data.tags.map(tag => (
                                                            <span
                                                                key={tag}
                                                                className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground text-sm rounded-full"
                                                            >
                                                                #{tag}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveTag(tag)}
                                                                    className="text-muted-foreground hover:text-foreground ml-1"
                                                                >
                                                                    ×
                                                                </button>
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="is_favorite"
                                                checked={data.is_favorite}
                                                onCheckedChange={(checked) => setData('is_favorite', checked as boolean)}
                                            />
                                            <Label 
                                                htmlFor="is_favorite" 
                                                className="text-sm font-medium flex items-center gap-1"
                                            >
                                                ⭐ Add to favorites
                                            </Label>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Button type="submit" disabled={processing} size="lg">
                                        {processing ? 'Creating...' : '✨ Create Note'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.visit(route('home'))}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>

                            {/* Preview Section */}
                            <div className="space-y-6">
                                <div className="bg-card rounded-lg border border-border">
                                    <div className="border-b border-border p-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-medium">👁️ Live Preview</h3>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setShowPreview(!showPreview)}
                                            >
                                                {showPreview ? 'Hide' : 'Show'} Preview
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        {showPreview ? (
                                            <NotePreview content={data.content} />
                                        ) : (
                                            <div className="text-center text-muted-foreground py-8">
                                                Click "Show Preview" to see how your note will look
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-card rounded-lg border border-border p-6">
                                    <h3 className="font-medium mb-3">💡 Tips</h3>
                                    <div className="space-y-2 text-sm text-muted-foreground">
                                        <p>• Use <code>[[Note Name]]</code> to create links to other notes</p>
                                        <p>• Notes are automatically saved as you type</p>
                                        <p>• Use <code># Headers</code> to structure your content</p>
                                        <p>• Add tags to organize and find notes easily</p>
                                        <p>• Use **bold** and *italic* for emphasis</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppShell>
    );
}