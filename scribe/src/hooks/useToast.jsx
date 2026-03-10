import * as React from 'react';

const ToastContext = React.createContext(null);

/**
 * Toast Provider Component
 * Wraps your app to provide toast functionality
 * 
 * @example
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);

  const addToast = React.useCallback(({ title, description, variant = 'default', duration = 4000 }) => {
    const id = Math.random().toString(36).substr(2, 9);
    
    setToasts((prev) => [...prev, { id, title, description, variant }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);

    return id;
  }, []);

  const removeToast = React.useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, toasts }}>
      {children}
    </ToastContext.Provider>
  );
}

/**
 * useToast Hook
 * 
 * @example
 * const { toast } = useToast();
 * 
 * toast({
 *   title: "Success",
 *   description: "Your note has been saved",
 *   variant: "success",
 * });
 */
export function useToast() {
  const context = React.useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const { addToast, removeToast, toasts } = context;

  return {
    toast: addToast,
    dismiss: removeToast,
    toasts,
  };
}

export default useToast;
