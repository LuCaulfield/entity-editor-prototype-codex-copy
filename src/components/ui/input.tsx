import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-9 w-full rounded border border-oa-control bg-white px-3 py-1.5 text-sm text-oa-text shadow-sm outline-none transition placeholder:text-oa-text-mid focus:border-primary-50 focus:ring-2 focus:ring-primary-10 disabled:cursor-not-allowed disabled:bg-oa-gray-5 disabled:text-oa-text-mid",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
