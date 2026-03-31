import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { availableColors, availableCountryGroups, type EntitySet } from "@/types";
import StepperInput from "@/components/StepperInput";
import WeekDatePicker from "@/components/WeekDatePicker";

type EntityAssignmentCardProps = {
  id: number;
  name: string;
  week: number;
  weekEditable: boolean;
  onWeekChange: (week: number) => void;
  packType: string;
  onUpdatePackType: (entityId: number, packType: string) => void;
  sets: EntitySet[];
  onAddSet: (entityId: number) => void;
  onRemoveSet: (entityId: number, setId: number) => void;
  onToggleCountryGroup: (entityId: number, setId: number, group: string) => void;
  onToggleColor: (entityId: number, setId: number, color: string) => void;
  minQtyRetail?: number;
  onMinQtyRetailChange?: (v: number) => void;
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wide text-oa-gray-40">{children}</p>
  );
}

export default function EntityAssignmentCard({
  id,
  name,
  week,
  weekEditable,
  onWeekChange,
  packType,
  onUpdatePackType,
  sets,
  onAddSet,
  onRemoveSet,
  onToggleCountryGroup,
  onToggleColor,
  minQtyRetail,
  onMinQtyRetailChange,
}: EntityAssignmentCardProps) {
  return (
    <div className="rounded-2xl border border-oa-border bg-white p-4 shadow-oa">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {id === 1 && (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-bold text-white">
              A
            </div>
          )}
          <div className="text-sm font-bold text-black">{name}</div>
        </div>
        <div className="flex flex-wrap justify-end items-end gap-3">
          {minQtyRetail !== undefined && onMinQtyRetailChange && (
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-oa-gray-40">Min quantity</p>
              <div className="w-36">
                <StepperInput value={minQtyRetail} onChange={onMinQtyRetailChange} min={0} step={100} />
              </div>
            </div>
          )}
          <div className="space-y-1">
            <p className={`text-xs font-semibold uppercase tracking-wide ${weekEditable ? "text-oa-gray-40" : "text-oa-gray-40/50"}`}>
              Planned delivery date
            </p>
            <div className={!weekEditable ? "pointer-events-none opacity-40" : ""}>
              <WeekDatePicker week={week} onChange={onWeekChange} />
            </div>
          </div>
        </div>
      </div>
      {/* Sets */}
      <div className="flex flex-wrap gap-2">
        {sets.map((set, index) => {
          const groupsInOtherSets = new Set(
            sets.filter((s) => s.id !== set.id).flatMap((s) => s.countryGroups)
          );

          return (
            <div key={set.id} className="flex-1 min-w-[200px] rounded-xl border border-oa-border bg-white p-3">
              <div className="space-y-3">
                {/* Set header */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wide text-oa-gray-70">
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
                          className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                            activeInThis
                              ? "border-primary-50 bg-primary-50 text-white"
                              : takenByOther
                              ? "border-oa-border bg-white text-oa-gray-40 hover:border-primary-50 hover:text-primary-50"
                              : "border-oa-border bg-white text-oa-gray-70 hover:border-primary-50 hover:text-primary-50"
                          }`}
                          title={takenByOther ? "Assigned to another set — click to move here" : undefined}
                        >
                          {group}
                          {takenByOther && !activeInThis && (
                            <span className="ml-1 text-oa-gray-40">↩</span>
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
                          className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                            active
                              ? "border-oa-gray-70 bg-oa-gray-70 text-white"
                              : "border-oa-border bg-white text-oa-gray-70 hover:border-oa-gray-70"
                          }`}
                        >
                          {color}
                        </button>
                      );
                    })}
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
        className="mt-2 w-full rounded-xl border border-dashed border-oa-border py-2 text-sm font-medium text-oa-gray-40 hover:border-primary-50 hover:text-primary-50 transition"
      >
        + Add set
      </button>

      {/* Pack type — entity level */}
      <div className="mt-3 space-y-1.5">
        <p className="text-xs font-semibold uppercase tracking-wide text-oa-gray-40">Pack type</p>
        <div className="max-w-[280px]">
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
    </div>
  );
}
