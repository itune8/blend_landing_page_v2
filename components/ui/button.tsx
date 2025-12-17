import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default:
                    "bg-gray-90 text-white hover:bg-gray-80 dark:bg-white dark:text-gray-100 dark:hover:bg-gray-20",
                light:
                    "bg-black/[0.04] text-black/[0.64] hover:bg-black/[0.64] hover:text-white dark:bg-white/[0.08] dark:text-white/[0.64] dark:hover:bg-white/[0.64] dark:hover:text-gray-100",
                brand:
                    "bg-cranberry text-white hover:bg-[#d5176d]",
                ghost:
                    "hover:bg-accent hover:text-accent-foreground",
                link:
                    "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-8 rounded-md px-3 text-sm",
                lg: "h-12 rounded-md px-6 text-lg",
                icon: "h-10 w-10",
            },
            rounded: {
                default: "rounded-md",
                full: "rounded-full",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
            rounded: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, rounded, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, rounded, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
