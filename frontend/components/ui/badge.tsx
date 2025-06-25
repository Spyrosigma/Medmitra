import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-medical",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-medical-lg",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:shadow-medical-lg",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-medical-lg",
        success:
          "border-transparent bg-accent text-accent-foreground hover:bg-accent/90 hover:shadow-medical-lg",
        outline: 
          "border-border bg-background text-foreground hover:bg-muted hover:text-muted-foreground",
        medical:
          "border-transparent bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90 shadow-medical-lg",
        muted:
          "border-transparent bg-muted text-muted-foreground hover:bg-muted/80",
        warning:
          "border-transparent bg-yellow-500 text-white hover:bg-yellow-500/90 hover:shadow-medical-lg",
        info:
          "border-transparent bg-blue-500 text-white hover:bg-blue-500/90 hover:shadow-medical-lg",
        soft:
          "border-border bg-card text-card-foreground hover:bg-card/80 shadow-sm",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-[10px]",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div 
      className={cn(badgeVariants({ variant, size }), className)} 
      {...props} 
    />
  );
}

export { Badge, badgeVariants };
