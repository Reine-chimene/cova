import { useToast } from '../../hooks/useToast'

export function ToastContainer() {
  const { toasts, dismissToast } = useToast()

  return (
    <div
      className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-2"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto rounded-lg px-4 py-3 text-sm shadow-lg ${
            toast.variant === 'success'
              ? 'bg-emerald-600 text-white'
              : toast.variant === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-slate-800 text-white'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <p>{toast.message}</p>
            <button
              type="button"
              className="text-white/90 hover:text-white"
              onClick={() => dismissToast(toast.id)}
              aria-label="Fermer la notification"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
