import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Sparkles, Package2 } from "lucide-react";

import {
  type Entity,
  type CountryGroupAssignments,
  type EntityColorSelections,
  type EntityPackTypes,
} from "@/types";
import {
  createCountryGroupAssignments,
  createEntityColorSelections,
  createEntityPackTypes,
  normalizeCountryGroupAssignments,
  normalizeEntityColorSelections,
  normalizeEntityPackTypes,
  applyCountryGroupAssignments,
  applyEntityColorSelections,
  applyEntityPackTypes,
  buildAssignmentsFromEntities,
  makeGeneratedEntities,
} from "@/lib/entities";
import EntityAssignmentCard from "@/components/EntityAssignmentCard";
import SummaryCard from "@/components/SummaryCard";
import LivePreview, { type PreviewEntity } from "@/components/LivePreview";

function round(n: number) {
  return Math.round(n);
}

export default function EntityEditorPrototype() {
  const [mode, setMode] = useState<"manual" | "bi">("manual");
  const [totalQty, setTotalQty] = useState(39000);
  const [entityCount, setEntityCount] = useState(3);
  const [startWeek, setStartWeek] = useState(41);
  const [intervalWeeks, setIntervalWeeks] = useState(2);
  const [retailPct, setRetailPct] = useState(62);
  const [ecomPct, setEcomPct] = useState(38);
  const [packType, setPackType] = useState("retail-pack");
  const [minQty, setMinQty] = useState(9000);
  const [minQtyEcom, setMinQtyEcom] = useState(9000);
  const [countryGroupAssignments, setCountryGroupAssignments] = useState<CountryGroupAssignments>(
    () => createCountryGroupAssignments(3)
  );
  const [entityColorSelections, setEntityColorSelections] = useState<EntityColorSelections>(
    () => createEntityColorSelections(3)
  );
  const [entityPackTypes, setEntityPackTypes] = useState<EntityPackTypes>(
    () => createEntityPackTypes(3, "retail-pack")
  );
  const previousEntityCountRef = useRef(3);
  const [entities, setEntities] = useState<Entity[]>(() =>
    applyEntityPackTypes(
      applyEntityColorSelections(
        applyCountryGroupAssignments(
          makeGeneratedEntities({
            mode: "manual",
            totalQty: 39000,
            entityCount: 3,
            startWeek: 41,
            intervalWeeks: 2,
            retailPct: 62,
            ecomPct: 38,
            packType: "retail-pack",
            minQty: 9000,
          }),
          createCountryGroupAssignments(3)
        ),
        createEntityColorSelections(3)
      ),
      createEntityPackTypes(3, "retail-pack")
    )
  );
  const [message, setMessage] = useState<string>("Entities generated from manual parameters.");

  useEffect(() => {
    setCountryGroupAssignments((prev) => {
      if (entityCount === 1) return createCountryGroupAssignments(1);
      if (previousEntityCountRef.current === 1 && entityCount === 2) return createCountryGroupAssignments(2);
      return normalizeCountryGroupAssignments(prev, entityCount);
    });
    previousEntityCountRef.current = entityCount;
  }, [entityCount]);

  useEffect(() => {
    setEntityColorSelections((prev) => normalizeEntityColorSelections(prev, entityCount));
  }, [entityCount]);

  useEffect(() => {
    setEntityPackTypes((prev) => normalizeEntityPackTypes(prev, entityCount, packType));
  }, [entityCount, packType]);

  useEffect(() => {
    setEntities((prev) =>
      applyCountryGroupAssignments(prev, normalizeCountryGroupAssignments(countryGroupAssignments, entityCount))
    );
  }, [countryGroupAssignments, entityCount]);

  useEffect(() => {
    setEntities((prev) =>
      applyEntityColorSelections(prev, normalizeEntityColorSelections(entityColorSelections, entityCount))
    );
  }, [entityColorSelections, entityCount]);

  useEffect(() => {
    setEntities((prev) =>
      applyEntityPackTypes(prev, normalizeEntityPackTypes(entityPackTypes, entityCount, packType))
    );
  }, [entityPackTypes, entityCount, packType]);

  const totals = useMemo(() => {
    const qty = entities.reduce((a, e) => a + Number(e.qty || 0), 0);
    const validChannel = retailPct + ecomPct === 100;
    const minViolation = entities.some((e) => e.qty < e.minQty);
    return { qty, validChannel, minViolation };
  }, [entities, retailPct, ecomPct]);

  const entityAssignmentCards = useMemo(
    () =>
      Array.from({ length: entityCount }, (_, index) => {
        const entityId = index + 1;
        return {
          id: entityId,
          name: `Entity ${entityId}`,
          colors: entityColorSelections[entityId] ?? [],
          packType: entityPackTypes[entityId] ?? packType,
          countryGroups: (Object.entries(countryGroupAssignments) as [string, number[]][])
            .filter(([, ids]) => ids.includes(entityId))
            .map(([group]) => group),
        };
      }),
    [countryGroupAssignments, entityColorSelections, entityPackTypes, entityCount, packType]
  );

  const previewEntities = useMemo<PreviewEntity[]>(
    () =>
      entityAssignmentCards.map((entityCard, index) => {
        const existingEntity = entities.find((entity) => entity.id === entityCard.id);
        return {
          id: entityCard.id,
          name: entityCard.name,
          qty: existingEntity?.qty ?? 0,
          week: existingEntity?.week ?? startWeek + index * intervalWeeks,
          packType: existingEntity?.packType ?? packType,
          colors: existingEntity?.colors ?? [],
          countryGroups: entityCard.countryGroups,
          retailQty: round(((existingEntity?.qty ?? 0) * retailPct) / 100),
          ecomQty: round(((existingEntity?.qty ?? 0) * ecomPct) / 100),
          belowMin: (existingEntity?.qty ?? 0) < minQty,
        };
      }),
    [entities, entityAssignmentCards, startWeek, intervalWeeks, packType, retailPct, ecomPct, minQty]
  );

  const warningCount = useMemo(
    () => previewEntities.filter((entity) => entity.belowMin).length + (totals.validChannel ? 0 : 1),
    [previewEntities, totals.validChannel]
  );

  const generateEntities = (sourceMode = mode) => {
    if (retailPct + ecomPct !== 100) {
      setMessage("Retail + E-commerce must equal 100%.");
      return;
    }
    const next = applyCountryGroupAssignments(
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
      }),
      normalizeCountryGroupAssignments(countryGroupAssignments, entityCount)
    );
    setEntities(
      applyEntityPackTypes(
        applyEntityColorSelections(next, normalizeEntityColorSelections(entityColorSelections, entityCount)),
        normalizeEntityPackTypes(entityPackTypes, entityCount, packType)
      )
    );
    setMessage(
      sourceMode === "bi"
        ? "BI recommendation loaded as editable starting point."
        : "Entities generated from manual parameters."
    );
  };

  const updateAllEntities = (patch: Partial<Entity>) => {
    setEntities((prev) => prev.map((e) => ({ ...e, ...patch })));
  };

  const toggleEntityCountryGroup = (entityId: number, group: string) => {
    setEntities((prev) => {
      const next = prev.map((entity) => {
        if (entity.id !== entityId) return entity;
        const nextGroups = entity.countryGroups.includes(group)
          ? entity.countryGroups.filter((item) => item !== group)
          : [...entity.countryGroups, group];
        return { ...entity, countryGroups: nextGroups };
      });
      setCountryGroupAssignments(buildAssignmentsFromEntities(next));
      return next;
    });
  };

  const toggleEntityColor = (entityId: number, color: string) => {
    setEntityColorSelections((prev) => {
      const current = prev[entityId] ?? [];
      const nextColors = current.includes(color)
        ? current.filter((item) => item !== color)
        : [...current, color];
      return { ...prev, [entityId]: nextColors };
    });
  };

  const updateEntityPackType = (entityId: number, nextPackType: string) => {
    setEntityPackTypes((prev) => ({ ...prev, [entityId]: nextPackType }));
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="bg-teal-500 px-6 py-4 text-white shadow-sm">
        <div className="text-lg font-semibold">Ordering Application · Entity Editor Prototype</div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-6 p-6">
        <div className="col-span-12 space-y-6 lg:col-span-9">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Configure entity split before Split View</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <Label className="text-sm font-medium">Working mode</Label>
                  <Tabs value={mode} onValueChange={(v) => setMode(v as "manual" | "bi")} className="mt-2">
                    <TabsList>
                      <TabsTrigger value="manual">Manual</TabsTrigger>
                      <TabsTrigger value="bi">BI recommendations</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div className="flex items-center gap-3 rounded-xl border bg-slate-50 px-4 py-3">
                  {mode === "bi" ? (
                    <Sparkles className="h-5 w-5 text-teal-600" />
                  ) : (
                    <Package2 className="h-5 w-5 text-slate-500" />
                  )}
                  <p className="max-w-xl text-sm text-slate-600">
                    {mode === "manual"
                      ? "Manual mode is the default. No BI recommendations are generated. Entities are created only from the parameters defined by the buyer."
                      : "BI mode proposes an editable starting split. The buyer must explicitly accept or modify the proposal."}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="space-y-2">
                  <Label className="block min-h-[3rem]">Total quantity</Label>
                  <Input type="number" value={totalQty} readOnly disabled aria-readonly="true" />
                </div>
                <div className="space-y-2">
                  <Label className="block min-h-[3rem]">Number of entities</Label>
                  <Input
                    type="number"
                    min={1}
                    value={entityCount}
                    onChange={(e) => setEntityCount(Math.max(1, Number(e.target.value)))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="block min-h-[3rem]">Start week</Label>
                  <Input
                    type="number"
                    value={startWeek}
                    onChange={(e) => setStartWeek(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="block min-h-[3rem]">Interval between entities (weeks)</Label>
                  <Input
                    type="number"
                    value={intervalWeeks}
                    onChange={(e) => setIntervalWeeks(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Minimum qty per entity Retail</Label>
                  <Input
                    type="number"
                    value={minQty}
                    onChange={(e) => {
                      const next = Number(e.target.value);
                      setMinQty(next);
                      updateAllEntities({ minQty: next });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Minimum qty per entity Ecom</Label>
                  <Input
                    type="number"
                    value={minQtyEcom}
                    onChange={(e) => setMinQtyEcom(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div>
                  <div className="text-sm font-semibold text-slate-900">Assign Country Groups per entity</div>
                  <p className="text-sm text-slate-500">
                    Combine country groups as much as possible to minimize the total number of orders.
                  </p>
                </div>
                <div className="grid gap-3">
                  {entityAssignmentCards.map((entity) => (
                    <EntityAssignmentCard
                      key={entity.id}
                      id={entity.id}
                      name={entity.name}
                      colors={entity.colors}
                      packType={entity.packType}
                      countryGroups={entity.countryGroups}
                      onToggleCountryGroup={toggleEntityCountryGroup}
                      onToggleColor={toggleEntityColor}
                      onUpdatePackType={updateEntityPackType}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button onClick={() => generateEntities(mode)}>
                  {mode === "bi" ? "Generate BI proposal" : "Generate entities"}
                </Button>
              </div>

              {message && (
                <div className="flex items-start gap-2 rounded-xl border bg-amber-50 p-3 text-sm text-slate-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 text-amber-600" />
                  <span>{message}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

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
