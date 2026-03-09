import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '../../lib/utils'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  type: ToastType
  title: string
  description?: string
}

interface ToastContextType {
  toast: (options: Omit<Toast, 'id'>) => void
  success: (title: string, description?: string) => void
  error: (title: string, description?: string) => void
  info: (title: string, description?: string) => void
  warning: (title: string, description?: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  }

  const colors = {
    success: 'border-[hsl(var(--success))] bg-[hsl(var(--success)/0.1)]',
    error: 'border-[hsl(var(--destructive))] bg-[hsl(var(--destructive)/0.1)]',
    info: 'border-[hsl(var(--info))] bg-[hsl(var(--info)/0.1)]',
    warning: 'border-[hsl(var(--warning))] bg-[hsl(var(--warning)/0.1)]',
  }

  const iconColors = {
    success: 'text-[hsl(var(--success))]',
    error: 'text-[hsl(var(--destructive))]',
    info: 'text-[hsl(var(--info))]',
    warning: 'text-[hsl(var(--warning))]',
  }

  const Icon = icons[toast.type]

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm animate-slide-up',
        colors[toast.type]
      )}
    >
      <Icon className={cn('w-5 h-5 shrink-0 mt-0.5', iconColors[toast.type])} />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-[hsl(var(--foreground))]">{toast.title}</p>
        {toast.description && (
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">
            {toast.description}
          </p>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="shrink-0 p-1 rounded-lg hover:bg-[hsl(var(--accent))] transition-colors"
      >
        <X className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
      </button>
    </div>
  )
}

export function Toaster({ children }: { children?: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((options: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2)
    setToasts((prev) => [...prev, { ...options, id }])

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const contextValue: ToastContextType = {
    toast: addToast,
    success: (title, description) => addToast({ type: 'success', title, description }),
    error: (title, description) => addToast({ type: 'error', title, description }),
    info: (title, description) => addToast({ type: 'info', title, description }),
    warning: (title, description) => addToast({ type: 'warning', title, description }),
  }

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="fixed bottom-20 left-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onDismiss={() => dismissToast(toast.id)} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
