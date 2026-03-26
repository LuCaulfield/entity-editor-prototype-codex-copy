import * as React from "react";

import { cn } from "@/lib/utils";

type SelectContextValue = {
  value?: string;
  onValueChange?: (value: string) => void;
};

type SelectOption = {
  value: string;
  label: React.ReactNode;
};

const SelectContext = React.createContext<SelectContextValue>({});
const SelectValueContext = React.createContext<React.ReactNode>(null);

type SelectProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
};

type SelectItemProps = {
  value: string;
  children: React.ReactNode;
};

function extractOptions(children: React.ReactNode): SelectOption[] {
  const options: SelectOption[] = [];

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      return;
    }

    if ((child.type as { displayName?: string }).displayName === "SelectItem") {
      const props = child.props as SelectItemProps;
      options.push({ value: props.value, label: props.children });
      return;
    }

    if ("children" in child.props) {
      options.push(...extractOptions(child.props.children));
    }
  });

  return options;
}

function Select({ value, onValueChange, children }: SelectProps) {
  const options = React.useMemo(() => extractOptions(children), [children]);
  const selectedLabel = options.find((option) => option.value === value)?.label ?? null;

  return (
    <SelectContext.Provider value={{ value, onValueChange }}>
      <SelectValueContext.Provider value={selectedLabel}>{children}</SelectValueContext.Provider>
    </SelectContext.Provider>
  );
}

const SelectTrigger = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(SelectContext);
    const options = extractOptions(children);

    return (
      <select
        ref={ref}
        className={cn(
          "flex h-11 w-full appearance-none rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200",
          className
        )}
        value={context.value}
        onChange={(event) => context.onValueChange?.(event.target.value)}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {typeof option.label === "string" ? option.label : option.value}
          </option>
        ))}
      </select>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

function SelectValue({ children }: { children?: React.ReactNode }) {
  const selectedLabel = React.useContext(SelectValueContext);
  return <>{children ?? selectedLabel}</>;
}
SelectValue.displayName = "SelectValue";

function SelectContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
SelectContent.displayName = "SelectContent";

function SelectItem(_props: SelectItemProps) {
  return null;
}
SelectItem.displayName = "SelectItem";

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };
