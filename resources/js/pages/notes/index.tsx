import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NoteEditor } from '@/components/note-editor';
import { NotePreview } from '@/components/note-preview';
import { FileTree } from '@/components/file-tree';
import { SearchBar } from '@/components/search-bar';
import { TagManager } from '@/components/tag-manager';
import { GraphView } from '@/components/graph-view';
import { Note } from '@/types/note';

interface Props {
    notes: {
        data: Note[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{url?: string; label: string; active: boolean}>;
    };
    folders: string[];
    tags: string[];
    filters: {
        search?: string;
        folder?: string;
        tag?: string;
        favorites?: boolean;
    };
    [key: string]: unknown;
}

export default function NotesIndex({ notes, folders, tags, filters }: Props) {
    const [selectedNote, setSelectedNote] = useState<Note | null>(
        notes.data.length > 0 ? notes.data[0] : null
    );
    const [rightPanelView, setRightPanelView] = useState<'preview' | 'outline' | 'backlinks' | 'graph'>('preview');

    const handleNoteSelect = (note: Note) => {
        setSelectedNote(note);
    };

    const handleCreateNote = () => {
        router.visit(route('notes.create'));
    };

    const handleDeleteNote = (note: Note) => {
        if (confirm('Are you sure you want to delete this note?')) {
            router.delete(route('notes.destroy', note.id), {
                preserveState: true,
                onSuccess: () => {
                    if (selectedNote?.id === note.id) {
                        setSelectedNote(notes.data.length > 1 ? notes.data[0] : null);
                    }
                }
            });
        }
    };

    return (
        <AppShell>
            <div className="note-app">
                {/* Left Sidebar */}
                <div className="note-sidebar">
                    <div className="p-4 border-b border-sidebar-border">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold text-sidebar-foreground">📝 Notes</h2>
                            <Button 
                                size="sm" 
                                onClick={handleCreateNote}
                                className="bg-primary hover:bg-primary/90"
                            >
                                ✨ New
                            </Button>
                        </div>
                        <SearchBar 
                            defaultValue={filters.search || ''} 
                            placeholder="Search notes..." 
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <div className="p-4">
                            <FileTree 
                                notes={notes.data} 
                                folders={folders}
                                selectedNote={selectedNote}
                                onNoteSelect={handleNoteSelect}
                                currentFolder={filters.folder}
                            />
                        </div>
                        
                        <div className="border-t border-sidebar-border p-4">
                            <TagManager 
                                tags={tags} 
                                selectedTag={filters.tag}
                            />
                        </div>
                    </div>
                </div>

                {/* Main Editor */}
                <div className="note-content">
                    {selectedNote ? (
                        <div className="flex flex-col h-full">
                            {/* Editor Header */}
                            <div className="border-b border-border p-4 bg-card">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-xl font-semibold text-card-foreground">
                                            {selectedNote.title}
                                        </h1>
                                        {selectedNote.is_favorite && (
                                            <span className="text-yellow-500">⭐</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link href={route('notes.edit', selectedNote.id)}>
                                            <Button variant="outline" size="sm">
                                                ✏️ Edit
                                            </Button>
                                        </Link>
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => handleDeleteNote(selectedNote)}
                                        >
                                            🗑️
                                        </Button>
                                    </div>
                                </div>
                                {selectedNote.tags && selectedNote.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {selectedNote.tags.map(tag => (
                                            <Badge key={tag} variant="secondary" className="text-xs">
                                                #{tag}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Editor Content */}
                            <div className="flex-1 overflow-hidden">
                                <NoteEditor 
                                    note={selectedNote} 
                                    readonly={true}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center bg-card">
                            <div className="text-center">
                                <div className="text-6xl mb-4">📝</div>
                                <h2 className="text-xl font-semibold text-card-foreground mb-2">
                                    No notes yet
                                </h2>
                                <p className="text-muted-foreground mb-4">
                                    Create your first note to get started
                                </p>
                                <Button onClick={handleCreateNote}>
                                    ✨ Create Note
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Sidebar */}
                <div className="note-right-panel">
                    <div className="border-b border-sidebar-border p-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-sidebar-foreground">Panel</h3>
                        </div>
                        <div className="flex gap-1">
                            {[
                                { key: 'preview' as const, label: '👁️', title: 'Preview' },
                                { key: 'outline' as const, label: '📋', title: 'Outline' },
                                { key: 'backlinks' as const, label: '🔗', title: 'Backlinks' },
                                { key: 'graph' as const, label: '🕸️', title: 'Graph' }
                            ].map(({ key, label, title }) => (
                                <button
                                    key={key}
                                    onClick={() => setRightPanelView(key)}
                                    className={`px-2 py-1 text-xs rounded transition-colors ${
                                        rightPanelView === key
                                            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                                            : 'hover:bg-sidebar-accent/50'
                                    }`}
                                    title={title}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        {selectedNote && (
                            <>
                                {rightPanelView === 'preview' && (
                                    <NotePreview content={selectedNote.content} />
                                )}
                                {rightPanelView === 'outline' && (
                                    <div className="text-sidebar-foreground">
                                        <h4 className="font-medium mb-2">📋 Outline</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Outline view coming soon...
                                        </p>
                                    </div>
                                )}
                                {rightPanelView === 'backlinks' && (
                                    <div className="text-sidebar-foreground">
                                        <h4 className="font-medium mb-2">🔗 Backlinks</h4>
                                        {selectedNote.links_to && selectedNote.links_to.length > 0 ? (
                                            <div className="space-y-2">
                                                {selectedNote.links_to.map((link, index: number) => (
                                                    <div key={index} className="p-2 bg-sidebar-accent rounded text-sm">
                                                        Note ID: {link.from_note_id}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">
                                                No backlinks yet
                                            </p>
                                        )}
                                    </div>
                                )}
                                {rightPanelView === 'graph' && (
                                    <GraphView 
                                        notes={notes.data} 
                                        selectedNote={selectedNote}
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AppShell>
    );
}