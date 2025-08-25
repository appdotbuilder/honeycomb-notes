// Simple check icon for Checkbox component
import React from 'react';

export function Check({ className, ...props }: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            className={className}
            fill="none"
            height="24"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
            {...props}
        >
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}