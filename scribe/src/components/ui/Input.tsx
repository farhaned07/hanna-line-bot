import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[hsl(var(--foreground))]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full h-12 px-4 rounded-xl border bg-[hsl(var(--background))] text-[hsl(var(--foreground))] text-base transition-all duration-200',
            'border-[hsl(var(--input))] placeholder:text-[hsl(var(--muted-foreground))]',
            'focus:outline-none focus:border-[hsl(var(--ring))] focus:ring-2 focus:ring-[hsl(var(--ring)/0.2)]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-[hsl(var(--destructive))] focus:border-[hsl(var(--destructive))] focus:ring-[hsl(var(--destructive)/0.2)]',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-[hsl(var(--destructive))]">{error}</p>
        )}
        {hint && !error && (
          <p className="text-sm text-[hsl(var(--muted-foreground))]">{hint}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
