import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import StepperInput from "@/components/StepperInput";
import WeekDatePicker from "@/components/WeekDatePicker";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Sparkles, Package2, LayoutList, Columns2 } from "lucide-react";

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
import SummaryCard from "@/components/SummaryCard";
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

export default function EntityEditorPrototype() {
  const [mode, setMode] = useState<"manual" | "bi">("manual");
  const [totalQty] = useState(INITIAL_TOTAL_QTY);
  const [entityCount, setEntityCount] = useState(INITIAL_ENTITY_COUNT);
  const [startWeek, setStartWeek] = useState(INITIAL_START_WEEK);
  const [intervalWeeks, setIntervalWeeks] = useState(INITIAL_INTERVAL_WEEKS);
  const [retailPct, setRetailPct] = useState(INITIAL_RETAIL_PCT);
  const [ecomPct, setEcomPct] = useState(INITIAL_ECOM_PCT);
  const [minQty, setMinQty] = useState(INITIAL_MIN_QTY);

  const [entityPackTypes, setEntityPackTypes] = useState<Record<number, string>>(() =>
    Object.fromEntries(
      Array.from({ length: INITIAL_ENTITY_COUNT }, (_, i) => [i + 1, INITIAL_PACK_TYPE])
    )
  );

  const [entitySetsConfig, setEntitySetsConfig] = useState<Record<number, ReturnType<typeof buildDefaultSetsConfig>[number]>>(
    () => buildDefaultSetsConfig(INITIAL_ENTITY_COUNT)
  );

  const [entityWeeks, setEntityWeeks] = useState<Record<number, number>>(() =>
    Object.fromEntries(
      Array.from({ length: INITIAL_ENTITY_COUNT }, (_, i) => [i + 1, INITIAL_START_WEEK + i * INITIAL_INTERVAL_WEEKS])
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

  // Sync setsConfig and packTypes when entity count changes
  useEffect(() => {
    setEntitySetsConfig((prev) => normalizeSetsConfig(prev, entityCount));
    setEntityPackTypes((prev) => {
      const next: Record<number, string> = {};
      for (let i = 1; i <= entityCount; i++) {
        next[i] = prev[i] ?? INITIAL_PACK_TYPE;
      }
      return next;
    });
  }, [entityCount]);

  // Recalculate entity weeks when global params change (interval mode) or entity count changes
  useEffect(() => {
    if (weekScheduleMode === "interval") {
      setEntityWeeks(
        Object.fromEntries(
          Array.from({ length: entityCount }, (_, i) => [i + 1, startWeek + i * intervalWeeks])
        )
      );
    } else {
      // In individual mode, only add/remove entries for entity count changes, keep existing weeks
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
    // Entity 1 drives the global "Planned delivery date" in individual mode
    if (entityId === 1) setStartWeek(week);
  };

  // Sync sets from config into already-generated entities (live update)
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

  // --- Set handlers ---
  const handleAddSet = (entityId: number) => {
    setEntitySetsConfig((prev) => addSet(prev, entityId));
  };

  const handleRemoveSet = (entityId: number, setId: number) => {
    setEntitySetsConfig((prev) => removeSet(prev, entityId, setId));
  };

  const handleToggleCountryGroup = (entityId: number, setId: number, group: string) => {
    setEntitySetsConfig((prev) => toggleSetCountryGroup(prev, entityId, setId, group));
  };

  const handleToggleColor = (entityId: number, setId: number, color: string) => {
    setEntitySetsConfig((prev) => toggleSetColor(prev, entityId, setId, color));
  };

  const handleUpdateEntityPackType = (entityId: number, packType: string) => {
    setEntityPackTypes((prev) => ({ ...prev, [entityId]: packType }));
  };

  // Build display cards from setsConfig (independent of generated entities)
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
    <div className="min-h-screen bg-white text-oa-text">
      {/* Top nav — matches Figma: h-14, primary teal, shadow */}
      <div className="flex h-14 items-center bg-primary-50 px-6 shadow-oa">
        <div className="text-base font-semibold text-white">Ordering Application</div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-6 p-6">
        <div className="col-span-12 space-y-6 lg:col-span-9">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Configure entity split before Split View</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

              <Separator />

              {/* Parameters — single compact row */}
              <div className="flex flex-wrap items-start gap-3">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-oa-gray-40">Total quantity</span>
                  <div className="w-32">
                    <Input type="number" value={totalQty} readOnly disabled aria-readonly="true" className="text-center" />
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-oa-gray-40">Entities</span>
                  <div className="w-32">
                    <StepperInput value={entityCount} onChange={(v) => setEntityCount(Math.max(1, v))} min={1} />
                  </div>
                </div>
                <div className="w-px self-stretch bg-oa-border" />
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-oa-gray-40">Delivery dates</span>
                  <div className="flex h-9 items-center rounded-xl border border-oa-border bg-white p-0.5 text-xs shadow-sm">
                    <button
                      type="button"
                      onClick={() => setWeekScheduleMode("interval")}
                      className={`h-full rounded-lg px-3 font-semibold transition ${weekScheduleMode === "interval" ? "bg-primary-50 text-white" : "text-oa-gray-40 hover:text-oa-gray-70"}`}
                    >
                      Default
                    </button>
                    <button
                      type="button"
                      onClick={() => setWeekScheduleMode("individual")}
                      className={`h-full rounded-lg px-3 font-semibold transition ${weekScheduleMode === "individual" ? "bg-primary-50 text-white" : "text-oa-gray-40 hover:text-oa-gray-70"}`}
                    >
                      Individual
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-oa-gray-40">First planned delivery</span>
                  <WeekDatePicker week={startWeek} onChange={setStartWeek} />
                </div>
                <div className="space-y-1">
                  <span className={`text-xs font-semibold ${weekScheduleMode === "individual" ? "text-oa-gray-40/40" : "text-oa-gray-40"}`}>Weeks between</span>
                  <div className="w-32">
                    {weekScheduleMode === "individual" ? (
                      <div className="flex items-stretch overflow-hidden rounded-xl border border-oa-border bg-white shadow-sm">
                        <span className="flex flex-1 items-center justify-center py-2 text-sm font-semibold text-primary-80">~</span>
                      </div>
                    ) : (
                      <StepperInput value={intervalWeeks} onChange={(v) => setIntervalWeeks(Math.max(1, v))} min={1} />
                    )}
                  </div>
                </div>
              </div>

              {/* Entity assignment cards */}
              <div className="space-y-4 rounded-2xl border border-oa-border bg-oa-gray-5 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-bold text-oa-text">Assign Country Groups per entity</div>
                    <p className="text-sm text-oa-gray-40">
                      Each entity can have multiple sets — each set groups country groups with their own colors.
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <div className="flex rounded-lg border border-oa-border bg-white p-0.5">
                      <button
                        type="button"
                        onClick={() => setEntityLayout("list")}
                        className={`rounded-md p-1.5 transition ${entityLayout === "list" ? "bg-oa-gray-5 text-oa-text" : "text-oa-gray-40 hover:text-oa-gray-70"}`}
                        title="List view"
                      >
                        <LayoutList className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEntityLayout("grid")}
                        className={`rounded-md p-1.5 transition ${entityLayout === "grid" ? "bg-oa-gray-5 text-oa-text" : "text-oa-gray-40 hover:text-oa-gray-70"}`}
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
                      {...(card.id === 1 ? {
                        minQtyRetail: minQty,
                        onMinQtyRetailChange: setMinQty,
                      } : {})}
                    />
                  ))}
                </div>
              </div>

              {/* Generate button */}
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => generateEntities(mode)}>
                  {mode === "bi" ? "Generate BI proposal" : "Generate entities"}
                </Button>
              </div>

              {message && (
                <div className="flex items-start gap-2 rounded-xl border border-oa-border bg-white p-3 text-sm text-oa-gray-70">
                  <AlertCircle className="mt-0.5 h-4 w-4 text-oa-gray-40" />
                  <span>{message}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right panel */}
        <div className="col-span-12 lg:col-span-3">
          <div className="sticky top-6 space-y-4">
            <LivePreview
              totalQty={totalQty}
              warningCount={warningCount}
              previewEntities={previewEntities}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
