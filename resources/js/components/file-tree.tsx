import React from 'react';
import { router } from '@inertiajs/react';
import { Note } from '@/types/note';

interface Props {
    notes: Note[];
    folders: string[];
    selectedNote: Note | null;
    onNoteSelect: (note: Note) => void;
    currentFolder?: string;
}

export function FileTree({ notes, folders, selectedNote, onNoteSelect, currentFolder }: Props) {
    const handleFolderClick = (folder: string) => {
        const url = new URL(window.location.href);
        if (currentFolder === folder) {
            url.searchParams.delete('folder');
        } else {
            url.searchParams.set('folder', folder);
        }
        router.visit(url.toString(), { preserveState: true });
    };

    const handleShowAllNotes = () => {
        const url = new URL(window.location.href);
        url.searchParams.delete('folder');
        url.searchParams.delete('tag');
        url.searchParams.delete('favorites');
        router.visit(url.toString(), { preserveState: true });
    };

    const handleShowFavorites = () => {
        const url = new URL(window.location.href);
        url.searchParams.set('favorites', '1');
        url.searchParams.delete('folder');
        url.searchParams.delete('tag');
        router.visit(url.toString(), { preserveState: true });
    };

    // Group notes by folder
    const notesByFolder = notes.reduce((acc, note) => {
        const folder = note.folder || 'Unfiled';
        if (!acc[folder]) acc[folder] = [];
        acc[folder].push(note);
        return acc;
    }, {} as Record<string, Note[]>);

    const favoriteNotes = notes.filter(note => note.is_favorite);

    return (
        <div className="file-tree text-sidebar-foreground">
            <div className="space-y-1 mb-4">
                <button
                    onClick={handleShowAllNotes}
                    className={`file-tree-item w-full text-left ${!currentFolder ? 'active' : ''}`}
                >
                    <span>📄</span>
                    <span>All Notes ({notes.length})</span>
                </button>
                
                {favoriteNotes.length > 0 && (
                    <button
                        onClick={handleShowFavorites}
                        className="file-tree-item w-full text-left"
                    >
                        <span>⭐</span>
                        <span>Favorites ({favoriteNotes.length})</span>
                    </button>
                )}
            </div>

            {folders.length > 0 && (
                <div className="mb-4">
                    <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                        Folders
                    </div>
                    {folders.map(folder => (
                        <button
                            key={folder}
                            onClick={() => handleFolderClick(folder)}
                            className={`file-tree-item w-full text-left ${currentFolder === folder ? 'active' : ''}`}
                        >
                            <span>📁</span>
                            <span className="file-tree-folder">{folder}</span>
                            <span className="text-muted-foreground text-xs ml-auto">
                                ({notesByFolder[folder]?.length || 0})
                            </span>
                        </button>
                    ))}
                </div>
            )}

            <div>
                <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                    Notes
                </div>
                <div className="space-y-1">
                    {notes.map(note => (
                        <button
                            key={note.id}
                            onClick={() => onNoteSelect(note)}
                            className={`file-tree-item w-full text-left ${
                                selectedNote?.id === note.id ? 'active' : ''
                            }`}
                        >
                            <span>📄</span>
                            <div className="flex-1 min-w-0">
                                <div className="file-tree-file truncate flex items-center gap-1">
                                    {note.title}
                                    {note.is_favorite && <span className="text-yellow-500 text-xs">⭐</span>}
                                </div>
                                {note.folder && (
                                    <div className="text-xs text-muted-foreground truncate">
                                        📁 {note.folder}
                                    </div>
                                )}
                            </div>
                        </button>
                    ))}
                    
                    {notes.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            <div className="text-2xl mb-2">📝</div>
                            <div className="text-sm">No notes found</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}