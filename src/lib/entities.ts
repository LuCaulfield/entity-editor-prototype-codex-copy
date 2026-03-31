import {
  type Entity,
  type EntitySet,
  availableCountryGroups,
  biSuggestion,
} from "@/types";

function round(n: number) {
  return Math.round(n);
}

export function buildRatios(mode: "manual" | "bi", entityCount: number): number[] {
  if (mode === "manual") {
    return Array.from({ length: entityCount }, () => 1 / entityCount);
  }
  const base = biSuggestion.slice(0, entityCount);
  if (entityCount > biSuggestion.length) {
    const extra = Array.from({ length: entityCount - biSuggestion.length }, () => 1 / entityCount);
    return [...base, ...extra];
  }
  return base;
}

function defaultColorsForEntity(entityId: number): string[] {
  if (entityId === 1) return ["00J", "11M", "22P"];
  if (entityId === 2) return ["00J", "11M"];
  if (entityId === 3) return ["22P"];
  return ["00J"];
}

function defaultCountryGroupsForEntity(entityId: number, entityCount: number): string[] {
  if (entityCount <= 1) return [...availableCountryGroups];

  if (entityCount === 2) {
    if (entityId === 1) return ["UE", "Non UE", "UE South"];
    if (entityId === 2) return ["UE Ecom", "UE Ecom South"];
    return [];
  }

  const assignments: Record<string, number[]> = {
    UE: [1, 3],
    "Non UE": [1],
    "UE South": [1, 3],
    "UE Ecom": [1, 2],
    "UE Ecom South": [2, 3],
  };

  return availableCountryGroups.filter((g) => (assignments[g] ?? []).includes(entityId));
}

export function createDefaultSet(entityId: number, entityCount: number): EntitySet {
  return {
    id: 1,
    countryGroups: defaultCountryGroupsForEntity(entityId, entityCount),
    colors: defaultColorsForEntity(entityId),
  };
}

export function makeGeneratedEntities(params: {
  mode: "manual" | "bi";
  totalQty: number;
  entityCount: number;
  startWeek: number;
  intervalWeeks: number;
  retailPct: number;
  ecomPct: number;
  entityPackTypes: Record<number, string>;
  defaultPackType: string;
  minQty: number;
  entitySetsConfig: Record<number, EntitySet[]>;
}): Entity[] {
  const {
    mode, totalQty, entityCount, startWeek, intervalWeeks,
    retailPct, ecomPct, entityPackTypes, defaultPackType, minQty, entitySetsConfig,
  } = params;

  const ratios = buildRatios(mode, entityCount);
  const ratioSum = ratios.reduce((a, b) => a + b, 0);

  let assigned = 0;
  return ratios.map((ratio, i) => {
    const entityId = i + 1;
    const qty = i === entityCount - 1 ? totalQty - assigned : round((totalQty * ratio) / ratioSum);
    assigned += qty;

    return {
      id: entityId,
      name: `Entity ${entityId}`,
      qty,
      week: startWeek + i * intervalWeeks,
      retailPct,
      ecomPct,
      minQty,
      packType: entityPackTypes[entityId] ?? defaultPackType,
      packMixEnabled: true,
      prepackPct: 100,
      multipackPct: 0,
      prepackLargePct: 100,
      multipackLargePct: 0,
      sets: entitySetsConfig[entityId] ?? [createDefaultSet(entityId, entityCount)],
    };
  });
}

// --- EntitySetsConfig helpers ---

export function buildDefaultSetsConfig(entityCount: number): Record<number, EntitySet[]> {
  return Object.fromEntries(
    Array.from({ length: entityCount }, (_, i) => {
      const entityId = i + 1;
      return [entityId, [createDefaultSet(entityId, entityCount)]];
    })
  );
}

export function normalizeSetsConfig(
  prev: Record<number, EntitySet[]>,
  entityCount: number
): Record<number, EntitySet[]> {
  const next: Record<number, EntitySet[]> = {};
  for (let i = 1; i <= entityCount; i++) {
    next[i] = prev[i] ?? [createDefaultSet(i, entityCount)];
  }
  return next;
}

// --- Set mutation helpers ---

export function addSet(
  config: Record<number, EntitySet[]>,
  entityId: number
): Record<number, EntitySet[]> {
  const current = config[entityId] ?? [];
  const newId = current.length > 0 ? Math.max(...current.map((s) => s.id)) + 1 : 1;
  return {
    ...config,
    [entityId]: [...current, { id: newId, countryGroups: [], colors: [] }],
  };
}

export function removeSet(
  config: Record<number, EntitySet[]>,
  entityId: number,
  setId: number
): Record<number, EntitySet[]> {
  const current = config[entityId] ?? [];
  if (current.length <= 1) return config;
  return { ...config, [entityId]: current.filter((s) => s.id !== setId) };
}

export function toggleSetCountryGroup(
  config: Record<number, EntitySet[]>,
  entityId: number,
  setId: number,
  group: string
): Record<number, EntitySet[]> {
  const current = config[entityId] ?? [];
  const targetSet = current.find((s) => s.id === setId);
  if (!targetSet) return config;

  const isActiveInTarget = targetSet.countryGroups.includes(group);

  const updated = current.map((s) => {
    if (s.id === setId) {
      return {
        ...s,
        countryGroups: isActiveInTarget
          ? s.countryGroups.filter((g) => g !== group)
          : [...s.countryGroups, group],
      };
    }
    // Remove from other sets (a group can only belong to one set per entity)
    return { ...s, countryGroups: s.countryGroups.filter((g) => g !== group) };
  });

  return { ...config, [entityId]: updated };
}

export function toggleSetColor(
  config: Record<number, EntitySet[]>,
  entityId: number,
  setId: number,
  color: string
): Record<number, EntitySet[]> {
  const current = config[entityId] ?? [];
  const updated = current.map((s) => {
    if (s.id !== setId) return s;
    const has = s.colors.includes(color);
    return { ...s, colors: has ? s.colors.filter((c) => c !== color) : [...s.colors, color] };
  });
  return { ...config, [entityId]: updated };
}

export function getAllEntityCountryGroups(sets: EntitySet[]): string[] {
  return [...new Set(sets.flatMap((s) => s.countryGroups))];
}
