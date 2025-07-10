import { useToast } from './use-toast';
import { Toast, ToastClose, ToastProvider, ToastViewport, ToastTitle, ToastDescription } from './toast';

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function (toast: any) {
        const { id, title, description, action, ...props } = toast;
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
