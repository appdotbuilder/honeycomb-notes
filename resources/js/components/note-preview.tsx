import React from 'react';

interface Props {
    content: string;
}

export function NotePreview({ content }: Props) {
    const parseMarkdown = (text: string): string => {
        let html = text;

        // Headers
        html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
        html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
        html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

        // Bold and italic
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

        // Code
        html = html.replace(/`(.+?)`/g, '<code>$1</code>');

        // Links - [[Note Name]] syntax
        html = html.replace(/\[\[([^\]]+)\]\]/g, '<span class="note-link">$1</span>');

        // Regular links
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>');

        // Lists
        html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');

        // Blockquotes
        html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');

        // Line breaks
        html = html.replace(/\n/g, '<br>');

        return html;
    };

    return (
        <div className="text-sidebar-foreground">
            <h4 className="font-medium mb-3 flex items-center gap-2">
                👁️ Preview
            </h4>
            <div 
                className="markdown-preview"
                dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
            />
        </div>
    );
}