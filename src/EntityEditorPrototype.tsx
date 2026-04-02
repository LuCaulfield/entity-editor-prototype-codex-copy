import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StepperInput from "@/components/StepperInput";
import WeekDatePicker from "@/components/WeekDatePicker";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  LayoutList,
  Columns2,
  Check,
  ChevronRight,
  User,
  Bell,
} from "lucide-react";

import { type Entity } from "@/types";
import {
  buildDefaultSetsConfig,
  normalizeSetsConfig,
  makeGeneratedEntities,
  addSet,
  removeSet,
  toggleSetCountryGroup,
  toggleSetColor,
  getAllEntityCountryGroups,
} from "@/lib/entities";
import EntityAssignmentCard from "@/components/EntityAssignmentCard";
import LivePreview, { type PreviewEntity } from "@/components/LivePreview";

function round(n: number) {
  return Math.round(n);
}

const INITIAL_ENTITY_COUNT = 3;
const INITIAL_PACK_TYPE = "retail-pack";
const INITIAL_TOTAL_QTY = 39000;
const INITIAL_START_WEEK = 41;
const INITIAL_INTERVAL_WEEKS = 2;
const INITIAL_RETAIL_PCT = 62;
const INITIAL_ECOM_PCT = 38;
const INITIAL_MIN_QTY = 9000;

const STEPS = [
  { label: "Style details" },
  { label: "Supplier" },
  { label: "Transport" },
  { label: "Pricing" },
  { label: "Quantity" },
  { label: "Summary" },
];
const ACTIVE_STEP = 4; // 0-indexed → "Quantity"

function AppStepper() {
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, i) => {
        const done = i < ACTIVE_STEP;
        const active = i === ACTIVE_STEP;
        return (
          <React.Fragment key={step.label}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  done
                    ? "bg-primary-50 text-white"
                    : active
                    ? "bg-primary-50 text-white ring-2 ring-primary-50 ring-offset-2"
                    : "bg-oa-gray-5 text-oa-gray-40 border border-oa-border"
                }`}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : <span>{i + 1}</span>}
              </div>
              <span
                className={`text-[10px] font-semibold whitespace-nowrap ${
                  active ? "text-primary-80" : done ? "text-oa-gray-70" : "text-oa-gray-40"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`mb-4 h-px w-8 shrink-0 ${i < ACTIVE_STEP ? "bg-primary-50" : "bg-oa-border"}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function EntityEditorPrototype() {
  const [mode] = useState<"manual" | "bi">("manual");
  const [totalQty] = useState(INITIAL_TOTAL_QTY);
  const [entityCount, setEntityCount] = useState(INITIAL_ENTITY_COUNT);
  const [startWeek, setStartWeek] = useState(INITIAL_START_WEEK);
  const [intervalWeeks, setIntervalWeeks] = useState(INITIAL_INTERVAL_WEEKS);
  const [retailPct] = useState(INITIAL_RETAIL_PCT);
  const [ecomPct] = useState(INITIAL_ECOM_PCT);
  const [minQty, setMinQty] = useState(INITIAL_MIN_QTY);

  const [entityPackTypes, setEntityPackTypes] = useState<Record<number, string>>(() =>
    Object.fromEntries(
      Array.from({ length: INITIAL_ENTITY_COUNT }, (_, i) => [i + 1, INITIAL_PACK_TYPE])
    )
  );

  const [entitySetsConfig, setEntitySetsConfig] = useState<
    Record<number, ReturnType<typeof buildDefaultSetsConfig>[number]>
  >(() => buildDefaultSetsConfig(INITIAL_ENTITY_COUNT));

  const [entityWeeks, setEntityWeeks] = useState<Record<number, number>>(() =>
    Object.fromEntries(
      Array.from({ length: INITIAL_ENTITY_COUNT }, (_, i) => [
        i + 1,
        INITIAL_START_WEEK + i * INITIAL_INTERVAL_WEEKS,
      ])
    )
  );

  const [entities, setEntities] = useState<Entity[]>(() =>
    makeGeneratedEntities({
      mode: "manual",
      totalQty: INITIAL_TOTAL_QTY,
      entityCount: INITIAL_ENTITY_COUNT,
      startWeek: INITIAL_START_WEEK,
      intervalWeeks: INITIAL_INTERVAL_WEEKS,
      retailPct: INITIAL_RETAIL_PCT,
      ecomPct: INITIAL_ECOM_PCT,
      entityPackTypes: Object.fromEntries(
        Array.from({ length: INITIAL_ENTITY_COUNT }, (_, i) => [i + 1, INITIAL_PACK_TYPE])
      ),
      defaultPackType: INITIAL_PACK_TYPE,
      minQty: INITIAL_MIN_QTY,
      entitySetsConfig: buildDefaultSetsConfig(INITIAL_ENTITY_COUNT),
    })
  );

  const [message, setMessage] = useState("Entities generated from manual parameters.");
  const [entityLayout, setEntityLayout] = useState<"list" | "grid">("list");
  const [weekScheduleMode, setWeekScheduleMode] = useState<"interval" | "individual">("interval");

  useEffect(() => {
    setEntitySetsConfig((prev) => normalizeSetsConfig(prev, entityCount));
    setEntityPackTypes((prev) => {
      const next: Record<number, string> = {};
      for (let i = 1; i <= entityCount; i++) next[i] = prev[i] ?? INITIAL_PACK_TYPE;
      return next;
    });
  }, [entityCount]);

  useEffect(() => {
    if (weekScheduleMode === "interval") {
      setEntityWeeks(
        Object.fromEntries(
          Array.from({ length: entityCount }, (_, i) => [i + 1, startWeek + i * intervalWeeks])
        )
      );
    } else {
      setEntityWeeks((prev) => {
        const next: Record<number, number> = {};
        for (let i = 1; i <= entityCount; i++) {
          next[i] = prev[i] ?? startWeek + (i - 1) * intervalWeeks;
        }
        return next;
      });
    }
  }, [startWeek, intervalWeeks, entityCount, weekScheduleMode]);

  const handleSetEntityWeek = (entityId: number, week: number) => {
    setEntityWeeks((prev) => ({ ...prev, [entityId]: week }));
    if (entityId === 1) setStartWeek(week);
  };

  useEffect(() => {
    setEntities((prev) =>
      prev.map((e) => ({
        ...e,
        sets: entitySetsConfig[e.id] ?? e.sets,
        packType: entityPackTypes[e.id] ?? e.packType,
      }))
    );
  }, [entitySetsConfig, entityPackTypes]);

  const totals = useMemo(() => {
    const qty = entities.reduce((a, e) => a + Number(e.qty || 0), 0);
    const validChannel = retailPct + ecomPct === 100;
    const minViolation = entities.some((e) => e.qty < e.minQty);
    return { qty, validChannel, minViolation };
  }, [entities, retailPct, ecomPct]);

  const previewEntities = useMemo<PreviewEntity[]>(
    () =>
      entities.map((entity) => ({
        id: entity.id,
        name: entity.name,
        qty: entity.qty,
        week: entity.week,
        retailQty: round((entity.qty * retailPct) / 100),
        ecomQty: round((entity.qty * ecomPct) / 100),
        sets: entity.sets,
        packType: entity.packType,
        belowMin: entity.qty < minQty,
      })),
    [entities, retailPct, ecomPct, minQty]
  );

  const warningCount = useMemo(
    () => previewEntities.filter((e) => e.belowMin).length + (totals.validChannel ? 0 : 1),
    [previewEntities, totals.validChannel]
  );

  const generateEntities = (sourceMode = mode) => {
    if (retailPct + ecomPct !== 100) {
      setMessage("Retail + E-commerce must equal 100%.");
      return;
    }
    setEntities(
      makeGeneratedEntities({
        mode: sourceMode,
        totalQty,
        entityCount,
        startWeek,
        intervalWeeks,
        retailPct,
        ecomPct,
        entityPackTypes,
        defaultPackType: INITIAL_PACK_TYPE,
        minQty,
        entitySetsConfig,
      })
    );
    setMessage(
      sourceMode === "bi"
        ? "BI recommendation loaded as editable starting point."
        : "Entities generated from manual parameters."
    );
  };

  const handleAddSet = (entityId: number) => setEntitySetsConfig((prev) => addSet(prev, entityId));
  const handleRemoveSet = (entityId: number, setId: number) =>
    setEntitySetsConfig((prev) => removeSet(prev, entityId, setId));
  const handleToggleCountryGroup = (entityId: number, setId: number, group: string) =>
    setEntitySetsConfig((prev) => toggleSetCountryGroup(prev, entityId, setId, group));
  const handleToggleColor = (entityId: number, setId: number, color: string) =>
    setEntitySetsConfig((prev) => toggleSetColor(prev, entityId, setId, color));
  const handleUpdateEntityPackType = (entityId: number, packType: string) =>
    setEntityPackTypes((prev) => ({ ...prev, [entityId]: packType }));

  const entityCards = useMemo(
    () =>
      Array.from({ length: entityCount }, (_, i) => {
        const entityId = i + 1;
        const sets = entitySetsConfig[entityId] ?? [];
        return {
          id: entityId,
          name: `Entity ${entityId}`,
          week: entityWeeks[entityId] ?? startWeek + i * intervalWeeks,
          packType: entityPackTypes[entityId] ?? INITIAL_PACK_TYPE,
          sets,
          allCountryGroups: getAllEntityCountryGroups(sets),
        };
      }),
    [entitySetsConfig, entityPackTypes, entityCount, entityWeeks, startWeek, intervalWeeks]
  );

  return (
    <div className="min-h-screen bg-oa-gray-5 text-black flex flex-col">

      {/* ── Top navigation bar ── */}
      <header className="flex h-14 shrink-0 items-center justify-between bg-primary-50 px-6 shadow-oa">
        <div className="flex items-center gap-3">
          {/* LPP badge */}
          <div className="flex h-8 w-10 items-center justify-center rounded bg-primary-80 text-xs font-bold text-white tracking-wider">
            LPP
          </div>
          <span className="text-sm font-semibold text-white">Ordering Application</span>
        </div>
        <div className="flex items-center gap-4">
          <button type="button" className="text-white/80 hover:text-white transition">
            <Bell className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-80">
              <User className="h-4 w-4" />
            </div>
            <span className="text-xs font-medium hidden sm:block">Supplier (login)</span>
          </div>
        </div>
      </header>

      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-1.5 bg-white px-6 py-2 text-xs text-oa-gray-40 border-b border-oa-border">
        <span className="hover:text-primary-50 cursor-pointer transition">Home</span>
        <ChevronRight className="h-3 w-3" />
        <span className="hover:text-primary-50 cursor-pointer transition">Orders List</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-oa-gray-70 font-medium">Edit Current Order</span>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-screen-xl px-6 pt-6 pb-24">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-9 space-y-4">

              {/* Page heading + stepper */}
              <div className="flex flex-col gap-4 rounded-2xl border border-oa-border bg-white p-5 shadow-oa">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-extrabold tracking-tight text-black">EDIT ORDER</h1>
                    <p className="mt-0.5 text-xs text-oa-gray-40">Configure entity split before Split View</p>
                  </div>
                  <AppStepper />
                </div>
              </div>

              {/* ── Product / style info panel ── */}
              <div className="rounded-2xl border border-oa-border bg-white shadow-oa overflow-hidden">
                <div className="flex items-stretch gap-0">
                  {/* Product image placeholder */}
                  <div className="w-20 shrink-0 bg-oa-gray-5 flex items-center justify-center border-r border-oa-border">
                    <div className="flex flex-col items-center gap-1 py-4 px-2">
                      <div className="h-12 w-12 rounded bg-oa-gray-5 border border-oa-border flex items-center justify-center text-oa-gray-40">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Style parameters */}
                  <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-oa-gray-5 border-b border-oa-border">
                          {["Style", "Season", "Delivery", "Supplier", "Transport", "WHS Price", "RRP", "Retail %", "Ecom %", "Min Qty", "Total Qty", "Delivery Date"].map((h) => (
                            <th key={h} className="px-3 py-2 text-left font-semibold text-oa-gray-40 whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-oa-border">
                          <td className="px-3 py-2 font-semibold text-oa-gray-70 whitespace-nowrap">11_PREPACK_24</td>
                          <td className="px-3 py-2 text-oa-gray-70">AW25</td>
                          <td className="px-3 py-2 text-oa-gray-70">On-Time</td>
                          <td className="px-3 py-2 text-oa-gray-70 whitespace-nowrap">Salona</td>
                          <td className="px-3 py-2 text-oa-gray-70">Sea</td>
                          <td className="px-3 py-2 text-oa-gray-70">42,00</td>
                          <td className="px-3 py-2 text-oa-gray-70">89,99</td>
                          <td className="px-3 py-2 text-oa-gray-70">{retailPct}%</td>
                          <td className="px-3 py-2 text-oa-gray-70">{ecomPct}%</td>
                          <td className="px-3 py-2 text-oa-gray-70">{minQty.toLocaleString()}</td>
                          <td className="px-3 py-2 font-semibold text-primary-80">{totalQty.toLocaleString()}</td>
                          <td className="px-3 py-2">
                            <WeekDatePicker week={startWeek} onChange={setStartWeek} />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* ── Parameters row ── */}
              <div className="rounded-2xl border border-oa-border bg-white p-4 shadow-oa">
                <div className="flex flex-wrap items-end gap-3">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-oa-gray-40">Total quantity</span>
                    <div className="w-28">
                      <Input
                        type="number"
                        value={totalQty}
                        readOnly
                        disabled
                        className="text-center font-semibold"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-oa-gray-40">Entities</span>
                    <div className="w-28">
                      <StepperInput
                        value={entityCount}
                        onChange={(v) => setEntityCount(Math.max(1, v))}
                        min={1}
                      />
                    </div>
                  </div>
                  <div className="w-px self-stretch bg-oa-border" />
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-oa-gray-40">Delivery dates</span>
                    <div className="flex h-9 items-center rounded-xl border border-oa-border bg-white p-0.5 text-xs shadow-sm">
                      <button
                        type="button"
                        onClick={() => setWeekScheduleMode("interval")}
                        className={`h-full rounded-lg px-3 font-semibold transition ${
                          weekScheduleMode === "interval"
                            ? "bg-primary-50 text-white"
                            : "text-oa-gray-40 hover:text-oa-gray-70"
                        }`}
                      >
                        Default
                      </button>
                      <button
                        type="button"
                        onClick={() => setWeekScheduleMode("individual")}
                        className={`h-full rounded-lg px-3 font-semibold transition ${
                          weekScheduleMode === "individual"
                            ? "bg-primary-50 text-white"
                            : "text-oa-gray-40 hover:text-oa-gray-70"
                        }`}
                      >
                        Individual
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span
                      className={`text-xs font-semibold ${
                        weekScheduleMode === "individual" ? "text-oa-gray-40/40" : "text-oa-gray-40"
                      }`}
                    >
                      Weeks between
                    </span>
                    <div className="w-28">
                      {weekScheduleMode === "individual" ? (
                        <div className="flex items-stretch overflow-hidden rounded-xl border border-oa-border bg-white shadow-sm">
                          <span className="flex flex-1 items-center justify-center py-2 text-sm font-semibold text-primary-80">
                            ~
                          </span>
                        </div>
                      ) : (
                        <StepperInput
                          value={intervalWeeks}
                          onChange={(v) => setIntervalWeeks(Math.max(1, v))}
                          min={1}
                        />
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-oa-gray-40">Min Logistic Qty</span>
                    <div className="w-32">
                      <StepperInput value={minQty} onChange={setMinQty} min={0} step={100} />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Entity assignment cards ── */}
              <div className="rounded-2xl border border-oa-border bg-oa-gray-5 p-4 shadow-oa">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-black">Assign Country Groups per entity</div>
                    <p className="text-xs text-oa-gray-40 mt-0.5">
                      Each entity can have multiple sets — each set groups country groups with their own colors.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex rounded-lg border border-oa-border bg-white p-0.5">
                      <button
                        type="button"
                        onClick={() => setEntityLayout("list")}
                        className={`rounded-md p-1.5 transition ${
                          entityLayout === "list"
                            ? "bg-oa-gray-5 text-black"
                            : "text-oa-gray-40 hover:text-oa-gray-70"
                        }`}
                        title="List view"
                      >
                        <LayoutList className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEntityLayout("grid")}
                        className={`rounded-md p-1.5 transition ${
                          entityLayout === "grid"
                            ? "bg-oa-gray-5 text-black"
                            : "text-oa-gray-40 hover:text-oa-gray-70"
                        }`}
                        title="2-column view"
                      >
                        <Columns2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className={entityLayout === "grid" ? "grid grid-cols-2 gap-3" : "grid gap-3"}>
                  {entityCards.map((card) => (
                    <EntityAssignmentCard
                      key={card.id}
                      id={card.id}
                      name={card.name}
                      week={card.week}
                      weekEditable={weekScheduleMode === "individual"}
                      onWeekChange={(w) => handleSetEntityWeek(card.id, w)}
                      packType={card.packType}
                      onUpdatePackType={handleUpdateEntityPackType}
                      sets={card.sets}
                      onAddSet={handleAddSet}
                      onRemoveSet={handleRemoveSet}
                      onToggleCountryGroup={handleToggleCountryGroup}
                      onToggleColor={handleToggleColor}
                      compact={entityLayout === "grid"}
                      {...(card.id === 1
                        ? {
                            minQtyRetail: minQty,
                            onMinQtyRetailChange: setMinQty,
                          }
                        : {})}
                    />
                  ))}
                </div>
              </div>

              {message && (
                <div className="flex items-start gap-2 rounded-xl border border-oa-border bg-white p-3 text-sm text-oa-gray-70">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-oa-gray-40" />
                  <span>{message}</span>
                </div>
              )}
            </div>

            {/* ── Right panel: Live preview ── */}
            <div className="col-span-12 lg:col-span-3">
              <div className="sticky top-6">
                <LivePreview
                  totalQty={totalQty}
                  warningCount={warningCount}
                  previewEntities={previewEntities}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky bottom action bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-10 flex items-center justify-between border-t border-oa-border bg-white px-6 py-3 shadow-[0_-2px_8px_rgba(0,0,0,0.08)]">
        <Button variant="outline" className="min-w-[100px]">
          BACK
        </Button>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => generateEntities(mode)} className="min-w-[120px]">
            RECALCULATE
          </Button>
          <Button
            onClick={() => generateEntities(mode)}
            className="min-w-[100px] bg-primary-50 hover:bg-primary-80 text-white font-semibold"
          >
            SAVE
          </Button>
        </div>
      </div>
    </div>
  );
}
