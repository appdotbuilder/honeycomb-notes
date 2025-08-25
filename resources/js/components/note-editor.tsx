import React, { useState, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Note } from '@/types/note';

interface Props {
    note: Note;
    readonly?: boolean;
    onChange?: (content: string) => void;
}

export function NoteEditor({ note, readonly = false, onChange }: Props) {
    const [content, setContent] = useState(note.content);

    const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        setContent(newContent);
        onChange?.(newContent);
    }, [onChange]);

    const processLinks = (text: string) => {
        // Convert [[Note Name]] to clickable links
        return text.replace(/\[\[([^\]]+)\]\]/g, (match, linkText) => {
            return `<span class="note-link">${linkText}</span>`;
        });
    };

    if (readonly) {
        return (
            <div className="h-full p-6 bg-card overflow-y-auto">
                <div 
                    className="markdown-editor font-mono text-sm text-card-foreground whitespace-pre-wrap leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                        __html: processLinks(content.replace(/\n/g, '<br/>'))
                    }}
                />
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-card">
            <Textarea
                value={content}
                onChange={handleContentChange}
                className="flex-1 markdown-editor resize-none border-0 focus:ring-0 font-mono text-sm leading-relaxed"
                placeholder="Start writing your note... Use [[Note Name]] to link to other notes."
            />
            
            {/* Editor status bar */}
            <div className="border-t border-border p-2 bg-muted/50">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                        {content.length} characters • {content.split('\n').length} lines
                    </span>
                    <span>
                        Markdown • Auto-save enabled
                    </span>
                </div>
            </div>
        </div>
    );
}