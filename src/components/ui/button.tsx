import * as React from "react";

import { cn } from "@/lib/utils";

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-lg bg-primary-50 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-80 focus:outline-none focus:ring-2 focus:ring-primary-10 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button };
