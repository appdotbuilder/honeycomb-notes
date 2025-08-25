import React, { useEffect, useRef } from 'react';
import { Note } from '@/types/note';

interface Props {
    notes: Note[];
    selectedNote: Note | null;
}

export function GraphView({ notes, selectedNote }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        // Clear canvas
        ctx.clearRect(0, 0, rect.width, rect.height);

        if (notes.length === 0) {
            // Show empty state
            ctx.fillStyle = '#9CA3AF';
            ctx.font = '14px ui-sans-serif, system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('No notes to visualize', rect.width / 2, rect.height / 2);
            return;
        }

        // Create nodes
        const nodeRadius = 8;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const maxRadius = Math.min(rect.width, rect.height) / 3;

        const nodes = notes.map((note, index) => {
            const angle = (index / notes.length) * 2 * Math.PI;
            const radius = notes.length > 1 ? maxRadius : 0;
            
            return {
                id: note.id,
                title: note.title,
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius,
                isSelected: selectedNote?.id === note.id,
                connections: (note.links_from?.length || 0) + (note.links_to?.length || 0)
            };
        });

        // Draw connections first (so they appear behind nodes)
        notes.forEach(note => {
            if (note.links_from) {
                note.links_from.forEach((link) => {
                    const fromNode = nodes.find(n => n.id === note.id);
                    const toNode = nodes.find(n => n.id === link.to_note_id);
                    
                    if (fromNode && toNode) {
                        ctx.beginPath();
                        ctx.moveTo(fromNode.x, fromNode.y);
                        ctx.lineTo(toNode.x, toNode.y);
                        ctx.strokeStyle = '#D1D5DB';
                        ctx.lineWidth = 1;
                        ctx.stroke();

                        // Draw arrow
                        const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);
                        const arrowLength = 8;
                        const arrowAngle = Math.PI / 6;
                        
                        ctx.beginPath();
                        ctx.moveTo(
                            toNode.x - arrowLength * Math.cos(angle - arrowAngle),
                            toNode.y - arrowLength * Math.sin(angle - arrowAngle)
                        );
                        ctx.lineTo(toNode.x, toNode.y);
                        ctx.lineTo(
                            toNode.x - arrowLength * Math.cos(angle + arrowAngle),
                            toNode.y - arrowLength * Math.sin(angle + arrowAngle)
                        );
                        ctx.strokeStyle = '#6B7280';
                        ctx.lineWidth = 1.5;
                        ctx.stroke();
                    }
                });
            }
        });

        // Draw nodes
        nodes.forEach(node => {
            // Node circle
            ctx.beginPath();
            ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI);
            
            if (node.isSelected) {
                ctx.fillStyle = '#F59E0B'; // honey-flower-500
                ctx.strokeStyle = '#D97706'; // honey-flower-600
                ctx.lineWidth = 2;
            } else {
                ctx.fillStyle = node.connections > 0 ? '#FEF3C7' : '#F3F4F6'; // honey-flower-100 or gray-100
                ctx.strokeStyle = '#E5E7EB';
                ctx.lineWidth = 1;
            }
            
            ctx.fill();
            ctx.stroke();

            // Node label
            ctx.fillStyle = '#1F2937';
            ctx.font = '10px ui-sans-serif, system-ui, sans-serif';
            ctx.textAlign = 'center';
            let displayTitle = node.title;
            
            // Truncate long titles
            if (displayTitle.length > 12) {
                displayTitle = displayTitle.substring(0, 12) + '...';
            }
            
            ctx.fillText(displayTitle, node.x, node.y + nodeRadius + 14);
        });

    }, [notes, selectedNote]);

    const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Check if click is on a node (simplified hit detection)
        // In a real implementation, you'd calculate the exact node positions
        console.log('Graph clicked at:', { x, y });
    };

    return (
        <div className="text-sidebar-foreground">
            <h4 className="font-medium mb-3 flex items-center gap-2">
                🕸️ Graph View
            </h4>
            <div className="bg-sidebar-accent/30 rounded-lg border border-sidebar-border overflow-hidden">
                <canvas
                    ref={canvasRef}
                    onClick={handleCanvasClick}
                    className="w-full h-48 cursor-pointer"
                    style={{ width: '100%', height: '192px' }}
                />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
                {notes.length} notes • Click nodes to navigate
            </div>
        </div>
    );
}