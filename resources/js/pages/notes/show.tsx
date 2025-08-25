import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NotePreview } from '@/components/note-preview';
import { GraphView } from '@/components/graph-view';
import { Note } from '@/types/note';

interface Props {
    note: Note;
    [key: string]: unknown;
}

export default function ShowNote({ note }: Props) {
    const [activeTab, setActiveTab] = useState<'content' | 'backlinks' | 'graph'>('content');

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
            router.delete(route('notes.destroy', note.id), {
                onSuccess: () => router.visit(route('home'))
            });
        }
    };

    const handleToggleFavorite = () => {
        router.put(route('notes.update', note.id), {
            title: note.title,
            content: note.content,
            tags: note.tags,
            folder: note.folder,
            is_favorite: !note.is_favorite
        }, {
            preserveState: true,
            only: ['note']
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AppShell>
            <div className="min-h-screen bg-background">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-4 gap-6 p-6">
                        {/* Main Content */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Header */}
                            <div className="bg-card rounded-lg border border-border p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h1 className="text-3xl font-bold text-card-foreground">
                                                {note.title}
                                            </h1>
                                            {note.is_favorite && (
                                                <span className="text-2xl">⭐</span>
                                            )}
                                        </div>
                                        
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                            <span>📅 Created {formatDate(note.created_at)}</span>
                                            {note.updated_at !== note.created_at && (
                                                <span>✏️ Updated {formatDate(note.updated_at)}</span>
                                            )}
                                            {note.folder && (
                                                <span>📁 {note.folder}</span>
                                            )}
                                        </div>

                                        {note.tags && note.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {note.tags.map(tag => (
                                                    <Badge key={tag} variant="secondary">
                                                        #{tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleToggleFavorite}
                                        >
                                            {note.is_favorite ? '⭐' : '☆'}
                                        </Button>
                                        <Link href={route('notes.edit', note.id)}>
                                            <Button variant="outline" size="sm">
                                                ✏️ Edit
                                            </Button>
                                        </Link>
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={handleDelete}
                                        >
                                            🗑️
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 border-t border-border pt-4">
                                    <Button
                                        variant="ghost"
                                        onClick={() => router.visit(route('home'))}
                                    >
                                        ← Back to Notes
                                    </Button>
                                </div>
                            </div>

                            {/* Content Tabs */}
                            <div className="bg-card rounded-lg border border-border">
                                <div className="border-b border-border">
                                    <nav className="flex gap-1 p-4">
                                        {[
                                            { key: 'content' as const, label: '📄 Content', count: null },
                                            { 
                                                key: 'backlinks' as const, 
                                                label: '🔗 Backlinks', 
                                                count: note.backlinked_notes?.length || 0 
                                            },
                                            { key: 'graph' as const, label: '🕸️ Graph', count: null }
                                        ].map(({ key, label, count }) => (
                                            <button
                                                key={key}
                                                onClick={() => setActiveTab(key)}
                                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                                    activeTab === key
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                                }`}
                                            >
                                                {label}
                                                {count !== null && count > 0 && (
                                                    <span className="ml-2 px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded-full">
                                                        {count}
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                    </nav>
                                </div>

                                <div className="p-6">
                                    {activeTab === 'content' && (
                                        <div className="max-w-none">
                                            <NotePreview content={note.content} />
                                        </div>
                                    )}

                                    {activeTab === 'backlinks' && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-4">🔗 Notes that link to this note</h3>
                                            {note.backlinked_notes && note.backlinked_notes.length > 0 ? (
                                                <div className="space-y-4">
                                                    {note.backlinked_notes.map(backlinkNote => (
                                                        <div key={backlinkNote.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <Link 
                                                                        href={route('notes.show', backlinkNote.id)}
                                                                        className="text-lg font-medium text-primary hover:underline"
                                                                    >
                                                                        {backlinkNote.title}
                                                                    </Link>
                                                                    {backlinkNote.folder && (
                                                                        <p className="text-sm text-muted-foreground mt-1">
                                                                            📁 {backlinkNote.folder}
                                                                        </p>
                                                                    )}
                                                                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                                                        {backlinkNote.content.substring(0, 200)}...
                                                                    </p>
                                                                </div>
                                                                {backlinkNote.is_favorite && (
                                                                    <span className="text-yellow-500 ml-2">⭐</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-12 text-muted-foreground">
                                                    <div className="text-4xl mb-4">🔗</div>
                                                    <h4 className="text-lg font-medium mb-2">No backlinks yet</h4>
                                                    <p>This note hasn't been referenced by other notes yet.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'graph' && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-4">🕸️ Knowledge Graph</h3>
                                            <div className="bg-muted/20 rounded-lg p-6 min-h-[400px]">
                                                <GraphView 
                                                    notes={[
                                                        note, 
                                                        ...(note.linked_notes || []), 
                                                        ...(note.backlinked_notes || [])
                                                    ]} 
                                                    selectedNote={note} 
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Stats */}
                            <div className="bg-card rounded-lg border border-border p-6">
                                <h3 className="font-semibold mb-4">📊 Note Stats</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Characters:</span>
                                        <span>{note.content.length.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Words:</span>
                                        <span>{note.content.split(/\s+/).filter(w => w.length > 0).length.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Lines:</span>
                                        <span>{note.content.split('\n').length.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Outbound Links:</span>
                                        <span>{note.linked_notes?.length || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Backlinks:</span>
                                        <span>{note.backlinked_notes?.length || 0}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Linked Notes */}
                            {note.linked_notes && note.linked_notes.length > 0 && (
                                <div className="bg-card rounded-lg border border-border p-6">
                                    <h3 className="font-semibold mb-4">🔗 Linked Notes</h3>
                                    <div className="space-y-2">
                                        {note.linked_notes.map(linkedNote => (
                                            <Link
                                                key={linkedNote.id}
                                                href={route('notes.show', linkedNote.id)}
                                                className="block p-2 text-sm hover:bg-muted rounded-md transition-colors"
                                            >
                                                <div className="font-medium text-primary hover:underline">
                                                    {linkedNote.title}
                                                </div>
                                                {linkedNote.folder && (
                                                    <div className="text-xs text-muted-foreground">
                                                        📁 {linkedNote.folder}
                                                    </div>
                                                )}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quick Actions */}
                            <div className="bg-card rounded-lg border border-border p-6">
                                <h3 className="font-semibold mb-4">⚡ Quick Actions</h3>
                                <div className="space-y-2">
                                    <Link href={route('notes.create')} className="block">
                                        <Button variant="outline" size="sm" className="w-full justify-start">
                                            ✨ Create New Note
                                        </Button>
                                    </Link>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="w-full justify-start"
                                        onClick={() => navigator.clipboard.writeText(window.location.href)}
                                    >
                                        📋 Copy Link
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="w-full justify-start"
                                        onClick={() => router.visit(route('home'))}
                                    >
                                        📄 All Notes
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}