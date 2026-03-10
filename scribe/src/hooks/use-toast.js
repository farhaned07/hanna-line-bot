import { useToast as useToastPrimitive, ToastProvider, ToastViewport } from './Toast';

// Re-export Toast components
export { ToastProvider, ToastViewport } from './Toast';

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

function useToast() {
  const [toasts, setToasts] = React.useState([]);

  const toast = React.useCallback(({ title, description, variant = 'default', duration = 4000 }) => {
    const id = Math.random().toString(36).substr(2, 9);
    
    setToasts((prev) => [...prev, { id, title, description, variant }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);

    return id;
  }, []);

  const dismiss = React.useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return {
    toast,
    dismiss,
    toasts,
  };
}

export { useToast };
