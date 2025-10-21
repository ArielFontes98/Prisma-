import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  onClose: () => void
}

export function Toast({ message, type = 'success', onClose }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const bgColors = {
    success: 'bg-mint border-green-300',
    error: 'bg-rose border-red-300',
    info: 'bg-blue-50 border-blue-300',
  }

  const textColors = {
    success: 'text-green-800',
    error: 'text-red-800',
    info: 'text-blue-800',
  }

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-2xl border px-4 py-3 shadow-lg",
        bgColors[type]
      )}
      role="alert"
    >
      <p className={cn("text-sm font-medium", textColors[type])}>{message}</p>
      <button
        onClick={onClose}
        className={cn("ml-2", textColors[type])}
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

