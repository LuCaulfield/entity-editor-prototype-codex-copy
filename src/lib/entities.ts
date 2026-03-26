import {
  type Entity,
  type CountryGroupAssignments,
  type EntityColorSelections,
  type EntityPackTypes,
  availableCountryGroups,
  biSuggestion,
} from "@/types";

function round(n: number) {
  return Math.round(n);
}

export function createCountryGroupAssignments(count: number): CountryGroupAssignments {
  if (count <= 1) {
    return Object.fromEntries(availableCountryGroups.map((group) => [group, [1]]));
  }

  if (count === 2) {
    return {
      UE: [1],
      "Non UE": [1],
      "UE South": [1],
      "UE Ecom": [1, 2],
      "UE Ecom South": [1, 2],
    };
  }

  return {
    UE: [1, 3],
    "Non UE": [1],
    "UE South": [1, 3],
    "UE Ecom": [1, 2],
    "UE Ecom South": [2, 3],
  };
}

export function createEntityColorSelections(count: number): EntityColorSelections {
  return Object.fromEntries(
    Array.from({ length: count }, (_, index) => {
      const entityId = index + 1;

      if (entityId === 1) return [entityId, ["00J", "11M", "22P"]];
      if (entityId === 2) return [entityId, ["00J", "11M"]];
      if (entityId === 3) return [entityId, ["22P"]];
      return [entityId, ["00J"]];
    })
  );
}

export function createEntityPackTypes(count: number, defaultPackType: string): EntityPackTypes {
  return Object.fromEntries(
    Array.from({ length: count }, (_, index) => {
      const entityId = index + 1;
      return [entityId, defaultPackType];
    })
  );
}

export function normalizeCountryGroupAssignments(
  assignments: CountryGroupAssignments,
  count: number
): CountryGroupAssignments {
  return Object.fromEntries(
    availableCountryGroups.map((group) => [
      group,
      (assignments[group] ?? []).filter((entityId) => entityId >= 1 && entityId <= count),
    ])
  );
}

export function normalizeEntityColorSelections(
  selections: EntityColorSelections,
  count: number
): EntityColorSelections {
  return Object.fromEntries(
    Array.from({ length: count }, (_, index) => {
      const entityId = index + 1;
      const current = selections[entityId];
      return [entityId, current ?? createEntityColorSelections(count)[entityId] ?? ["00J"]];
    })
  );
}

export function normalizeEntityPackTypes(
  packTypes: EntityPackTypes,
  count: number,
  defaultPackType: string
): EntityPackTypes {
  return Object.fromEntries(
    Array.from({ length: count }, (_, index) => {
      const entityId = index + 1;
      return [entityId, packTypes[entityId] ?? defaultPackType];
    })
  );
}

export function applyCountryGroupAssignments(
  entities: Entity[],
  assignments: CountryGroupAssignments
): Entity[] {
  return entities.map((entity) => ({
    ...entity,
    countryGroups: availableCountryGroups.filter((group) =>
      (assignments[group] ?? []).includes(entity.id)
    ),
  }));
}

export function applyEntityColorSelections(
  entities: Entity[],
  selections: EntityColorSelections
): Entity[] {
  return entities.map((entity) => ({
    ...entity,
    colors: selections[entity.id] ?? entity.colors,
  }));
}

export function applyEntityPackTypes(entities: Entity[], packTypes: EntityPackTypes): Entity[] {
  return entities.map((entity) => ({
    ...entity,
    packType: packTypes[entity.id] ?? entity.packType,
  }));
}

export function buildAssignmentsFromEntities(entities: Entity[]): CountryGroupAssignments {
  return Object.fromEntries(
    availableCountryGroups.map((group) => [
      group,
      entities.filter((entity) => entity.countryGroups.includes(group)).map((entity) => entity.id),
    ])
  );
}

export function buildRatios(mode: "manual" | "bi", entityCount: number): number[] {
  if (mode === "manual") {
    return Array.from({ length: entityCount }, () => 1 / entityCount);
  }

  const base = biSuggestion.slice(0, entityCount);
  if (entityCount > biSuggestion.length) {
    const extra = Array.from(
      { length: entityCount - biSuggestion.length },
      () => 1 / entityCount
    );
    return [...base, ...extra];
  }
  return base;
}

export function makeGeneratedEntities(params: {
  mode: "manual" | "bi";
  totalQty: number;
  entityCount: number;
  startWeek: number;
  intervalWeeks: number;
  retailPct: number;
  ecomPct: number;
  packType: string;
  minQty: number;
}): Entity[] {
  const { mode, totalQty, entityCount, startWeek, intervalWeeks, retailPct, ecomPct, packType, minQty } = params;
  const ratios = buildRatios(mode, entityCount);
  const ratioSum = ratios.reduce((a, b) => a + b, 0);

  let assigned = 0;
  return ratios.map((ratio, i) => {
    const qty = i === entityCount - 1 ? totalQty - assigned : round((totalQty * ratio) / ratioSum);
    assigned += qty;

    return {
      id: i + 1,
      name: `Entity ${i + 1}`,
      qty,
      week: startWeek + i * intervalWeeks,
      retailPct,
      ecomPct,
      packType,
      minQty,
      packMixEnabled: true,
      prepackPct: 100,
      multipackPct: 0,
      prepackLargePct: 100,
      multipackLargePct: 0,
      colors: i === 0 ? ["00J", "11M", "22P"] : i === 1 ? ["00J", "11M"] : ["22P"],
      countryGroups: [],
    };
  });
}
