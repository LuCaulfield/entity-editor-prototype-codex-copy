import React from "react";

type StepperInputProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
};

export default function StepperInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  disabled = false,
}: StepperInputProps) {
  const decrement = () => {
    const next = value - step;
    if (min !== undefined && next < min) return;
    onChange(next);
  };

  const increment = () => {
    const next = value + step;
    if (max !== undefined && next > max) return;
    onChange(next);
  };

  return (
    <div className="flex items-stretch rounded-xl border border-slate-300 bg-white shadow-sm overflow-hidden focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-200 transition">
      <button
        type="button"
        onClick={decrement}
        disabled={disabled || (min !== undefined && value <= min)}
        className="px-2.5 text-slate-400 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-30 transition text-base select-none"
        tabIndex={-1}
      >
        −
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="flex-1 min-w-0 w-full text-center text-sm text-slate-900 bg-transparent outline-none py-2 disabled:text-slate-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={increment}
        disabled={disabled || (max !== undefined && value >= max)}
        className="px-2.5 text-slate-400 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-30 transition text-base select-none"
        tabIndex={-1}
      >
        +
      </button>
    </div>
  );
}
