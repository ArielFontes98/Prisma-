import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./Button"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export function Modal({ isOpen, onClose, children, className }: ModalProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          "relative z-50 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-background p-6 shadow-lg",
          className
        )}
        role="dialog"
        aria-modal="true"
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </Button>
        {children}
      </div>
    </div>
  )
}

export function ModalHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mb-4 pr-8", className)}>
      {children}
    </div>
  )
}

export function ModalTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn("text-2xl font-semibold", className)}>
      {children}
    </h2>
  )
}

export function ModalContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      {children}
    </div>
  )
}

