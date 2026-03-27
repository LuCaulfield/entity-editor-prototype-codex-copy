import * as React from "react";

import { cn } from "@/lib/utils";

type TabsContextValue = {
  value?: string;
  onValueChange?: (value: string) => void;
};

const TabsContext = React.createContext<TabsContextValue>({});

type TabsProps = React.HTMLAttributes<HTMLDivElement> & {
  value?: string;
  onValueChange?: (value: string) => void;
};

function Tabs({ className, value, onValueChange, children, ...props }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="tablist"
      className={cn("inline-flex rounded-xl bg-oa-gray-5 p-1 text-oa-gray-70", className)}
      {...props}
    />
  )
);
TabsList.displayName = "TabsList";

type TabsTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string;
};

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, onClick, ...props }, ref) => {
    const context = React.useContext(TabsContext);
    const active = context.value === value;

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={active}
        data-state={active ? "active" : "inactive"}
        className={cn(
          "rounded-lg px-3 py-1.5 text-sm font-semibold transition",
          active ? "bg-white text-black shadow-sm" : "text-oa-gray-40 hover:text-oa-gray-70",
          className
        )}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) {
            context.onValueChange?.(value);
          }
        }}
        {...props}
      />
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";

export { Tabs, TabsList, TabsTrigger };
