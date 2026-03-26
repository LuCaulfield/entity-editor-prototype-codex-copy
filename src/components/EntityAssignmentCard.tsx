import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { availableColors, availableCountryGroups, type EntitySet } from "@/types";
import { getAllEntityCountryGroups } from "@/lib/entities";

type EntityAssignmentCardProps = {
  id: number;
  name: string;
  sets: EntitySet[];
  defaultPackType: string;
  onAddSet: (entityId: number) => void;
  onRemoveSet: (entityId: number, setId: number) => void;
  onToggleCountryGroup: (entityId: number, setId: number, group: string) => void;
  onToggleColor: (entityId: number, setId: number, color: string) => void;
  onUpdatePackType: (entityId: number, setId: number, packType: string) => void;
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{children}</p>
  );
}

export default function EntityAssignmentCard({
  id,
  name,
  sets,
  defaultPackType,
  onAddSet,
  onRemoveSet,
  onToggleCountryGroup,
  onToggleColor,
  onUpdatePackType,
}: EntityAssignmentCardProps) {
  const allAssignedGroups = getAllEntityCountryGroups(sets);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      {/* Header */}
      <div className="mb-3 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <div className="text-sm font-semibold text-slate-800">{name}</div>
        <div className="text-xs text-slate-500">
          {allAssignedGroups.length ? allAssignedGroups.join(", ") : "No country groups assigned"}
        </div>
      </div>

      {/* Sets */}
      <div className="space-y-2">
        {sets.map((set, index) => {
          const groupsInOtherSets = new Set(
            sets.filter((s) => s.id !== set.id).flatMap((s) => s.countryGroups)
          );

          return (
            <div key={set.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="space-y-3">
                {/* Set header */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Set {index + 1}
                  </span>
                  {sets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRemoveSet(id, set.id)}
                      className="rounded-md px-2 py-0.5 text-xs text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Country groups */}
                <div className="space-y-1.5">
                  <FieldLabel>Country Groups</FieldLabel>
                  <div className="flex flex-wrap gap-1.5">
                    {availableCountryGroups.map((group) => {
                      const activeInThis = set.countryGroups.includes(group);
                      const takenByOther = groupsInOtherSets.has(group);

                      return (
                        <button
                          key={group}
                          type="button"
                          onClick={() => onToggleCountryGroup(id, set.id, group)}
                          className={`rounded-full border px-3 py-1.5 text-sm transition ${
                            activeInThis
                              ? "border-teal-500 bg-teal-500 text-white"
                              : takenByOther
                              ? "border-slate-200 bg-slate-100 text-slate-400 hover:border-amber-400 hover:text-amber-600"
                              : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                          }`}
                          title={takenByOther ? "Assigned to another set — click to move here" : undefined}
                        >
                          {group}
                          {takenByOther && !activeInThis && (
                            <span className="ml-1 text-amber-500">↩</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Colors */}
                <div className="space-y-1.5">
                  <FieldLabel>Colors</FieldLabel>
                  <div className="flex flex-wrap gap-1.5">
                    {availableColors.map((color) => {
                      const active = set.colors.includes(color);
                      return (
                        <button
                          key={color}
                          type="button"
                          onClick={() => onToggleColor(id, set.id, color)}
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

                {/* Pack type */}
                <div className="space-y-1.5">
                  <FieldLabel>Logistic Pack Type</FieldLabel>
                  <div className="max-w-[280px]">
                    <Select value={set.packType} onValueChange={(value) => onUpdatePackType(id, set.id, value)}>
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
              </div>
            </div>
          );
        })}
      </div>

      {/* Add set */}
      <button
        type="button"
        onClick={() => onAddSet(id)}
        className="mt-2 w-full rounded-xl border border-dashed border-slate-300 py-2 text-sm text-slate-500 hover:border-teal-400 hover:text-teal-600 transition"
      >
        + Add set
      </button>
    </div>
  );
}
