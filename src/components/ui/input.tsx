import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-xl border border-oa-border bg-white px-3 py-2 text-sm text-black shadow-sm outline-none transition placeholder:text-oa-gray-40 focus:border-primary-50 focus:ring-2 focus:ring-primary-10 disabled:cursor-not-allowed disabled:bg-oa-gray-5 disabled:text-oa-gray-40",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
