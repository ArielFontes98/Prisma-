import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variantClasses = {
    default: 'bg-nuPurple/10 text-nuPurple border-transparent',
    secondary: 'bg-secondary text-secondary-foreground border-transparent',
    success: 'bg-mint text-green-800 border-transparent',
    warning: 'bg-yellow-100 text-yellow-800 border-transparent',
    destructive: 'bg-rose text-red-800 border-transparent',
    outline: 'text-foreground border-current',
  }

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }

