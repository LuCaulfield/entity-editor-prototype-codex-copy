import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { availableColors, availableCountryGroups, type EntitySet } from "@/types";
import StepperInput from "@/components/StepperInput";
import WeekDatePicker from "@/components/WeekDatePicker";

type EntityWarning = { type: "warning" | "error"; message: string };

type EntityAssignmentCardProps = {
  id: number;
  name: string;
  week: number;
  weekEditable: boolean;
  onWeekChange: (week: number) => void;
  port: string;
  onUpdatePort: (entityId: number, port: string) => void;
  packType: string;
  onUpdatePackType: (entityId: number, packType: string) => void;
  sets: EntitySet[];
  onAddSet: (entityId: number) => void;
  onRemoveSet: (entityId: number, setId: number) => void;
  onToggleCountryGroup: (entityId: number, setId: number, group: string) => void;
  onToggleColor: (entityId: number, setId: number, color: string) => void;
  minQtyRetail?: number;
  onMinQtyRetailChange?: (v: number) => void;
  compact?: boolean;
  warnings?: EntityWarning[];
  assignmentMode?: "sets" | "matrix";
  matrix?: Record<string, string[]>;
  onToggleMatrix?: (entityId: number, countryGroup: string, color: string) => void;
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
  port,
  onUpdatePort,
  packType,
  onUpdatePackType,
  sets,
  onAddSet,
  onRemoveSet,
  onToggleCountryGroup,
  onToggleColor,
  minQtyRetail,
  onMinQtyRetailChange,
  compact = false,
  warnings = [],
  assignmentMode = "sets",
  matrix = {},
  onToggleMatrix,
}: EntityAssignmentCardProps) {
  const hasError = warnings.some((w) => w.type === "error");
  return (
    <div className={`rounded-xl border bg-white p-4 shadow-oa ${hasError ? "border-rose-300" : "border-oa-border"}`}>
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-start justify-between gap-y-2 gap-x-3">
        <div className="flex items-center gap-2.5 pt-1">
          {id === 1 && (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-bold text-white">
              A
            </div>
          )}
          <div className="text-sm font-bold text-oa-text">{name}</div>
        </div>
        <div className={`flex flex-wrap items-end gap-2 ${compact ? "flex-col" : "flex-row"}`}>
          <div className="space-y-1">
            <p className={`text-xs font-semibold uppercase tracking-wide ${weekEditable ? "text-oa-gray-40" : "text-oa-gray-40/50"}`}>
              Planned delivery date
            </p>
            <div className={!weekEditable ? "pointer-events-none opacity-40" : ""}>
              <WeekDatePicker week={week} onChange={onWeekChange} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-oa-gray-40">Port</p>
            <div className="w-36">
              <Select value={port} onValueChange={(value) => onUpdatePort(id, value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shanghai">Shanghai</SelectItem>
                  <SelectItem value="guangzhou">Guangzhou</SelectItem>
                  <SelectItem value="ho-chi-minh">Ho Chi Minh City</SelectItem>
                  <SelectItem value="istanbul">Istanbul</SelectItem>
                  <SelectItem value="dhaka">Dhaka</SelectItem>
                  <SelectItem value="colombo">Colombo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {!compact && <div className="w-px self-stretch bg-oa-border" />}
          {minQtyRetail !== undefined && onMinQtyRetailChange && (
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-oa-gray-40">Min quantity</p>
              <div className="w-36">
                <StepperInput value={minQtyRetail} onChange={onMinQtyRetailChange} min={0} step={100} />
              </div>
            </div>
          )}
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-oa-gray-40">Pack type</p>
            <div className="w-36">
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
      </div>

      {/* Per-entity warnings */}
      {warnings.length > 0 && (
        <div className="mb-3 space-y-1.5">
          {warnings.map((w, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${
                w.type === "error"
                  ? "border-rose-200 bg-rose-50 text-rose-700"
                  : "border-amber-200 bg-amber-50 text-amber-700"
              }`}
            >
              <span className="shrink-0">{w.type === "error" ? "✕" : "⚠"}</span>
              <span>{w.message}</span>
            </div>
          ))}
        </div>
      )}

      {assignmentMode === "sets" ? (
        <>
          {/* Sets */}
          <div className="flex flex-wrap gap-2">
            {sets.map((set, index) => {
              const groupsInOtherSets = new Set(
                sets.filter((s) => s.id !== set.id).flatMap((s) => s.countryGroups)
              );
              return (
                <div key={set.id} className="flex-1 min-w-[200px] rounded-lg border border-oa-border bg-white p-3">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wide text-oa-gray-70">Set {index + 1}</span>
                      {sets.length > 1 && (
                        <button type="button" onClick={() => onRemoveSet(id, set.id)} className="rounded-md px-2 py-0.5 text-xs text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition">
                          Remove
                        </button>
                      )}
                    </div>
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
                                activeInThis ? "border-primary-50 bg-primary-50 text-white"
                                : takenByOther ? "border-oa-border bg-white text-oa-gray-40 hover:border-primary-50 hover:text-primary-50"
                                : "border-oa-border bg-white text-oa-gray-70 hover:border-primary-50 hover:text-primary-50"
                              }`}
                              title={takenByOther ? "Assigned to another set — click to move here" : undefined}
                            >
                              {group}{takenByOther && !activeInThis && <span className="ml-1 text-oa-gray-40">↩</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <FieldLabel>Colors</FieldLabel>
                      <div className="flex flex-wrap gap-1.5">
                        {availableColors.map((color) => {
                          const active = set.colors.includes(color);
                          return (
                            <button key={color} type="button" onClick={() => onToggleColor(id, set.id, color)}
                              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${active ? "border-oa-gray-70 bg-oa-gray-70 text-white" : "border-oa-border bg-white text-oa-gray-70 hover:border-oa-gray-70"}`}>
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
          <button type="button" onClick={() => onAddSet(id)}
            className="mt-2 w-full rounded-lg border border-dashed border-oa-border py-2 text-sm font-medium text-oa-gray-40 hover:border-primary-50 hover:text-primary-50 transition">
            + Add set
          </button>
        </>
      ) : (
        /* Matrix view — rows = colors, columns = country groups */
        <div className="overflow-x-auto rounded-lg border border-oa-border">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-oa-gray-5">
                <th className="border-b border-oa-border px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-oa-gray-40 w-20">
                  Color
                </th>
                {availableCountryGroups.map((group) => (
                  <th key={group} className="border-b border-l border-oa-border px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-oa-gray-70 min-w-[96px]">
                    {group}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {availableColors.map((color, ci) => (
                <tr key={color} className={ci % 2 === 0 ? "bg-white" : "bg-oa-gray-5/50"}>
                  <td className="border-b border-oa-border px-3 py-2 text-xs font-semibold text-oa-gray-70">
                    {color}
                  </td>
                  {availableCountryGroups.map((group) => {
                    const active = (matrix[group] ?? []).includes(color);
                    return (
                      <td key={group} className="border-b border-l border-oa-border px-2 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => onToggleMatrix?.(id, group, color)}
                          className={`mx-auto flex h-7 w-7 items-center justify-center rounded-md border transition ${
                            active
                              ? "border-primary-50 bg-primary-50 text-white"
                              : "border-oa-border bg-white text-oa-gray-40 hover:border-primary-50 hover:text-primary-50"
                          }`}
                          title={`${color} × ${group}`}
                        >
                          {active ? "✓" : ""}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
