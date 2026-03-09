import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900",
  {
    variants: {
      variant: {
        default: "border-transparent bg-blue-400 text-white hover:bg-blue-400/80",
        secondary: "border-transparent bg-slate-800 text-white hover:bg-slate-800/80",
        destructive: "border-transparent bg-red-500 text-white hover:bg-red-500/80",
        outline: "border-slate-700 text-white",
        success: "border-transparent bg-green-500 text-white hover:bg-green-500/80",
        warning: "border-transparent bg-amber-500 text-white hover:bg-amber-500/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
