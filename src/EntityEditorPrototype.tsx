import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import StepperInput from "@/components/StepperInput";
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
  updateSetPackType,
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
  const [packType] = useState(INITIAL_PACK_TYPE);
  const [minQty, setMinQty] = useState(INITIAL_MIN_QTY);
  const [minQtyEcom, setMinQtyEcom] = useState(INITIAL_MIN_QTY);

  const [entitySetsConfig, setEntitySetsConfig] = useState<Record<number, ReturnType<typeof buildDefaultSetsConfig>[number]>>(
    () => buildDefaultSetsConfig(INITIAL_ENTITY_COUNT, INITIAL_PACK_TYPE)
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
      packType: INITIAL_PACK_TYPE,
      minQty: INITIAL_MIN_QTY,
      entitySetsConfig: buildDefaultSetsConfig(INITIAL_ENTITY_COUNT, INITIAL_PACK_TYPE),
    })
  );

  const [message, setMessage] = useState("Entities generated from manual parameters.");
  const [entityLayout, setEntityLayout] = useState<"list" | "grid">("list");

  // Sync setsConfig when entity count changes
  useEffect(() => {
    setEntitySetsConfig((prev) => normalizeSetsConfig(prev, entityCount, packType));
  }, [entityCount, packType]);

  // Sync sets from config into already-generated entities (live update)
  useEffect(() => {
    setEntities((prev) =>
      prev.map((e) => ({
        ...e,
        sets: entitySetsConfig[e.id] ?? e.sets,
      }))
    );
  }, [entitySetsConfig]);

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
        packType,
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
    setEntitySetsConfig((prev) => addSet(prev, entityId, packType));
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

  const handleUpdateSetPackType = (entityId: number, setId: number, nextPackType: string) => {
    setEntitySetsConfig((prev) => updateSetPackType(prev, entityId, setId, nextPackType));
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
          sets,
          allCountryGroups: getAllEntityCountryGroups(sets),
        };
      }),
    [entitySetsConfig, entityCount]
  );

  return (
    <div className="min-h-screen bg-oa-gray-5 text-black">
      {/* Top nav — matches Figma: h-14, primary teal, shadow */}
      <div className="flex h-14 items-center bg-primary-50 px-6 shadow-oa">
        <div className="text-base font-semibold text-white">Ordering Application</div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-6 p-6">
        <div className="col-span-12 space-y-6 lg:col-span-9">
          <Card className="shadow-oa">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Configure entity split before Split View</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mode selector */}
              <div className="flex items-center gap-4">
                <div className="shrink-0">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-oa-gray-40">Working mode</Label>
                  <Tabs value={mode} onValueChange={(v) => setMode(v as "manual" | "bi")} className="mt-2">
                    <TabsList>
                      <TabsTrigger value="manual">Manual</TabsTrigger>
                      <TabsTrigger value="bi">BI recommendations</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-oa-border bg-oa-gray-5 px-4 py-3">
                  {mode === "bi" ? (
                    <Sparkles className="h-5 w-5 shrink-0 text-primary-50" />
                  ) : (
                    <Package2 className="h-5 w-5 shrink-0 text-oa-gray-40" />
                  )}
                  <p className="min-w-0 text-sm text-oa-gray-70">
                    {mode === "manual"
                      ? "Manual mode is the default. No BI recommendations are generated. Entities are created only from the parameters defined by the buyer."
                      : "BI mode proposes an editable starting split. The buyer must explicitly accept or modify the proposal."}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Parameters */}
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-oa-gray-40">Total quantity</Label>
                  <Input type="number" value={totalQty} readOnly disabled aria-readonly="true" className="text-center" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-oa-gray-40">Entities</Label>
                  <StepperInput value={entityCount} onChange={(v) => setEntityCount(Math.max(1, v))} min={1} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-oa-gray-40">Start week</Label>
                  <StepperInput value={startWeek} onChange={setStartWeek} min={1} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-oa-gray-40">Interval (weeks)</Label>
                  <StepperInput value={intervalWeeks} onChange={(v) => setIntervalWeeks(Math.max(1, v))} min={1} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-oa-gray-40">Min qty Retail</Label>
                  <StepperInput value={minQty} onChange={setMinQty} min={0} step={100} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-oa-gray-40">Min qty Ecom</Label>
                  <StepperInput value={minQtyEcom} onChange={setMinQtyEcom} min={0} step={100} />
                </div>
              </div>

              {/* Entity assignment cards */}
              <div className="space-y-4 rounded-2xl border border-oa-border bg-oa-gray-5 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-bold text-black">Assign Country Groups per entity</div>
                    <p className="text-sm text-oa-gray-40">
                      Each entity can have multiple sets — each set groups country groups with their own colors and pack type.
                    </p>
                  </div>
                  <div className="flex shrink-0 rounded-lg border border-oa-border bg-white p-0.5">
                    <button
                      type="button"
                      onClick={() => setEntityLayout("list")}
                      className={`rounded-md p-1.5 transition ${entityLayout === "list" ? "bg-oa-gray-5 text-black" : "text-oa-gray-40 hover:text-oa-gray-70"}`}
                      title="List view"
                    >
                      <LayoutList className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEntityLayout("grid")}
                      className={`rounded-md p-1.5 transition ${entityLayout === "grid" ? "bg-oa-gray-5 text-black" : "text-oa-gray-40 hover:text-oa-gray-70"}`}
                      title="2-column view"
                    >
                      <Columns2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className={entityLayout === "grid" ? "grid grid-cols-2 gap-3" : "grid gap-3"}>
                  {entityCards.map((card) => (
                    <EntityAssignmentCard
                      key={card.id}
                      id={card.id}
                      name={card.name}
                      sets={card.sets}
                      defaultPackType={packType}
                      onAddSet={handleAddSet}
                      onRemoveSet={handleRemoveSet}
                      onToggleCountryGroup={handleToggleCountryGroup}
                      onToggleColor={handleToggleColor}
                      onUpdatePackType={handleUpdateSetPackType}
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
            <SummaryCard
              totalQty={totalQty}
              entityCount={entityCount}
              assignedQty={totals.qty}
              retailPct={retailPct}
              ecomPct={ecomPct}
              validChannel={totals.validChannel}
              minViolation={totals.minViolation}
            />
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
