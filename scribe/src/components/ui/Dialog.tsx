import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'

interface DialogContextType {
  open: boolean
  setOpen: (open: boolean) => void
}

const DialogContext = createContext<DialogContextType | null>(null)

export function Dialog({
  children,
  open: controlledOpen,
  onOpenChange,
}: {
  children: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen

  const setOpen = useCallback(
    (newOpen: boolean) => {
      if (isControlled) {
        onOpenChange?.(newOpen)
      } else {
        setUncontrolledOpen(newOpen)
      }
    },
    [isControlled, onOpenChange]
  )

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  )
}

export function DialogTrigger({
  children,
  asChild,
}: {
  children: ReactNode
  asChild?: boolean
}) {
  const context = useContext(DialogContext)
  if (!context) throw new Error('DialogTrigger must be used within Dialog')

  if (asChild) {
    return (
      <span onClick={() => context.setOpen(true)} className="cursor-pointer">
        {children}
      </span>
    )
  }

  return (
    <button onClick={() => context.setOpen(true)} type="button">
      {children}
    </button>
  )
}

export function DialogContent({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const context = useContext(DialogContext)
  if (!context) throw new Error('DialogContent must be used within Dialog')

  if (!context.open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={() => context.setOpen(false)}
      />
      {/* Content */}
      <div
        className={cn(
          'relative w-full max-w-lg bg-[hsl(var(--card))] rounded-t-2xl sm:rounded-2xl shadow-2xl animate-slide-up',
          'max-h-[85vh] overflow-y-auto',
          className
        )}
      >
        <button
          onClick={() => context.setOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[hsl(var(--accent))] transition-colors z-10"
        >
          <X className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
        </button>
        {children}
      </div>
    </div>
  )
}

export function DialogHeader({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('p-6 pb-0', className)}>
      {children}
    </div>
  )
}

export function DialogTitle({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <h2 className={cn('text-xl font-semibold text-[hsl(var(--foreground))]', className)}>
      {children}
    </h2>
  )
}

export function DialogDescription({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <p className={cn('text-sm text-[hsl(var(--muted-foreground))] mt-1.5', className)}>
      {children}
    </p>
  )
}

export function DialogBody({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn('p-6', className)}>{children}</div>
}

export function DialogFooter({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('p-6 pt-0 flex items-center justify-end gap-3', className)}>
      {children}
    </div>
  )
}

export function DialogClose({ children }: { children: ReactNode }) {
  const context = useContext(DialogContext)
  if (!context) throw new Error('DialogClose must be used within Dialog')

  return (
    <span onClick={() => context.setOpen(false)} className="cursor-pointer">
      {children}
    </span>
  )
}
