import * as React from 'react';
import { ToastProvider as RadixToastProvider, ToastViewport } from '@radix-ui/react-toast';
import { useToast } from '@/hooks/useToast';
import { Toast, ToastClose, ToastDescription, ToastTitle } from './Toast';

/**
 * Toaster Component
 * Renders all active toasts
 * 
 * Must be used inside ToastProvider
 */
export function Toaster() {
  const { toasts } = useToast();

  return (
    <RadixToastProvider>
      {toasts.map(function ({ id, title, description, variant }) {
        return (
          <Toast key={id} variant={variant}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport className="fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]" />
    </RadixToastProvider>
  );
}

export default Toaster;
