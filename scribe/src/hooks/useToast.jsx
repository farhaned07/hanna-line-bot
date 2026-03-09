import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((toast) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, ...toast }]);
        
        // Auto-dismiss after 4 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 space-y-2">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        {...toast}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

function Toast({ title, description, variant = 'default', onClose }) {
    const variants = {
        default: 'bg-card border-border',
        success: 'bg-success/10 border-success/20 text-success',
        destructive: 'bg-critical/10 border-critical/20 text-critical',
    };

    return (
        <div
            className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg min-w-[300px] max-w-md ${variants[variant]}`}
        >
            <div className="flex-1">
                {title && <p className="font-semibold text-sm">{title}</p>}
                {description && <p className="text-xs mt-1 opacity-90">{description}</p>}
            </div>
            <button
                onClick={onClose}
                className="text-xs opacity-50 hover:opacity-100"
            >
                ×
            </button>
        </div>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    
    const { addToast } = context;
    
    return {
        toast: addToast,
    };
}

export default useToast;
