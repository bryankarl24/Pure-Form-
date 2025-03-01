"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, children, variant = "default", size = "default", asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none ring-offset-background focus-visible:ring-offset-0",
        variant === "ghost"
          ? "bg-transparent hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground"
          : variant === "outline"
            ? "bg-transparent border border-input hover:bg-background hover:text-foreground focus-visible:bg-background focus-visible:text-foreground"
            : variant === "secondary"
              ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              : variant === "destructive"
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/80"
                : "bg-primary text-primary-foreground hover:bg-primary/80",
        size === "icon" ? "h-8 w-8" : size === "sm" ? "h-9 px-3" : size === "lg" ? "h-11 px-8" : "h-10 px-4",
        className,
      )}
      ref={ref}
      {...props}
    >
      {children}
    </Comp>
  )
})
Button.displayName = "Button"

export { Button }

