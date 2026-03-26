import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { availableColors, availableCountryGroups } from "@/types";

type EntityAssignmentCardProps = {
  id: number;
  name: string;
  colors: string[];
  packType: string;
  countryGroups: string[];
  onToggleCountryGroup: (entityId: number, group: string) => void;
  onToggleColor: (entityId: number, color: string) => void;
  onUpdatePackType: (entityId: number, packType: string) => void;
};

export default function EntityAssignmentCard({
  id,
  name,
  colors,
  packType,
  countryGroups,
  onToggleCountryGroup,
  onToggleColor,
  onUpdatePackType,
}: EntityAssignmentCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="text-sm font-semibold text-slate-800">{name}</div>
        <div className="text-xs text-slate-500">
          {countryGroups.length ? countryGroups.join(", ") : "No country groups assigned"}
        </div>
      </div>

      <div className="mb-4 space-y-2">
        <Label className="text-sm font-medium text-slate-700">Logistic Pack Type</Label>
        <div className="max-w-[360px]">
          <Select value={packType} onValueChange={(value) => onUpdatePackType(id, value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="prepack">Prepack</SelectItem>
              <SelectItem value="multipack">Multipack</SelectItem>
              <SelectItem value="display">Display</SelectItem>
              <SelectItem value="retail-pack">Retail Pack</SelectItem>
              <SelectItem value="ecom-pack">Ecom Pack</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {availableCountryGroups.map((group) => {
          const active = countryGroups.includes(group);
          return (
            <button
              key={`${id}-${group}`}
              type="button"
              onClick={() => onToggleCountryGroup(id, group)}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                active
                  ? "border-teal-500 bg-teal-500 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
              }`}
            >
              {group}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {availableColors.map((color) => {
          const active = colors.includes(color);
          return (
            <button
              key={`${id}-color-${color}`}
              type="button"
              onClick={() => onToggleColor(id, color)}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                active
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
              }`}
            >
              {color}
            </button>
          );
        })}
      </div>
    </div>
  );
}
