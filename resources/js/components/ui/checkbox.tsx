import * as React from 'react';
import { Check } from './lucide-react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, onCheckedChange, onChange, ...props }, ref) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange?.(e);
            onCheckedChange?.(e.target.checked);
        };

        return (
            <div className="relative inline-flex items-center">
                <input
                    type="checkbox"
                    ref={ref}
                    className={cn(
                        'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none',
                        'checked:bg-primary checked:text-primary-foreground',
                        className
                    )}
                    onChange={handleChange}
                    {...props}
                />
                <Check className="absolute h-4 w-4 text-primary-foreground opacity-0 peer-checked:opacity-100 pointer-events-none" />
            </div>
        );
    }
);

Checkbox.displayName = 'Checkbox';