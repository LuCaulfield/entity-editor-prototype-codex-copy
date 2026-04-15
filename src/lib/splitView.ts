import { availableColors, type EntitySet } from "@/types";

export type SplitSidebarEntity = {
  id: number;
  code: string;
  qty: string;
  expanded?: boolean;
  colors: { color: string; qty: string }[];
};

export type SplitMatrixCard = {
  id: number;
  code: string;
  qty: string;
  port: string;
  packType: string;
  transport: string;
  badge?: string;
  tone?: "default" | "teal";
  activeColumn: string;
  matrix: { color: string; values: string[] }[];
};

export type SplitSummaryGroup = {
  group: string;
  share: string;
  qty: string;
};

export type SplitViewData = {
  entityCountLabel: string;
  totalQty: string;
  styleCode: string;
  columns: string[];
  colors: { color: string; qty: string }[];
  countryGroups: SplitSummaryGroup[];
  sidebarEntities: SplitSidebarEntity[];
  entityCards: SplitMatrixCard[];
};

function formatQty(value: number) {
  return value.toLocaleString("en-US").replace(/,/g, " ");
}

function distributeTotal(total: number, buckets: number) {
  if (buckets <= 0) return [];
  const base = Math.floor(total / buckets);
  let remainder = total - base * buckets;
  return Array.from({ length: buckets }, () => {
    const next = base + (remainder > 0 ? 1 : 0);
    if (remainder > 0) remainder -= 1;
    return next;
  });
}

function buildGroupColorMapFromSets(sets: EntitySet[]) {
  const groupMap: Record<string, string[]> = {};

  for (const set of sets) {
    for (const group of set.countryGroups) {
      const current = new Set(groupMap[group] ?? []);
      for (const color of set.colors) current.add(color);
      groupMap[group] = Array.from(current);
    }
  }

  return groupMap;
}

export function buildSplitViewData(params: {
  totalQty: number;
  entities: {
    id: number;
    name: string;
    qty: number;
    port: string;
    packType: string;
    sets: EntitySet[];
  }[];
  styleCode?: string;
}) {
  const { totalQty, entities, styleCode = "277IY" } = params;
  const colorTotals = new Map<string, number>();
  const countryTotals = new Map<string, number>();

  const sidebarEntities: SplitSidebarEntity[] = [];
  const entityCards: SplitMatrixCard[] = [];
  const allColumns = new Set<string>();

  entities.forEach((entity, index) => {
    const groupColorMap = buildGroupColorMapFromSets(entity.sets);
    const groups = Object.keys(groupColorMap);
    const groupAllocations = distributeTotal(entity.qty, groups.length || 1);
    const colorMatrix = new Map<string, Record<string, number>>();

    groups.forEach((group, groupIndex) => {
      allColumns.add(group);
      const colors = groupColorMap[group];
      const qtyForGroup = groupAllocations[groupIndex] ?? 0;
      const colorAllocations = distributeTotal(qtyForGroup, colors.length || 1);

      countryTotals.set(group, (countryTotals.get(group) ?? 0) + qtyForGroup);

      colors.forEach((color, colorIndex) => {
        const next = colorAllocations[colorIndex] ?? 0;
        colorTotals.set(color, (colorTotals.get(color) ?? 0) + next);

        if (!colorMatrix.has(color)) colorMatrix.set(color, {});
        colorMatrix.get(color)![group] = (colorMatrix.get(color)![group] ?? 0) + next;
      });
    });

    const sidebarColors = availableColors
      .map((color) => ({
        color,
        qty: Object.values(colorMatrix.get(color) ?? {}).reduce((sum, value) => sum + value, 0),
      }))
      .filter((item) => item.qty > 0)
      .map((item) => ({ color: item.color, qty: formatQty(item.qty) }));

    const columns = Array.from(new Set(Array.from(countryTotals.keys()).concat(groups)));
    const matrixRows = availableColors
      .filter((color) => colorMatrix.has(color))
      .map((color) => ({
        color,
        values: columns.map((group) => formatQty(colorMatrix.get(color)?.[group] ?? 0)),
      }));

    sidebarEntities.push({
      id: entity.id,
      code: entity.name,
      qty: formatQty(entity.qty),
      expanded: index === 0,
      colors: sidebarColors,
    });

    entityCards.push({
      id: entity.id,
      code: entity.name,
      qty: formatQty(entity.qty),
      port: entity.port,
      packType: entity.packType === "ecom-pack" ? "Ecom Pack" : entity.packType === "display-box" ? "Display Box" : "Retail Pack",
      transport: "SEA",
      badge: index === 1 ? "BOOKED" : "ORDERED",
      tone: entity.packType === "ecom-pack" ? "teal" : "default",
      activeColumn: entity.packType === "ecom-pack" ? "A" : index === 1 ? "R" : "A",
      matrix: matrixRows,
    });
  });

  const colors = availableColors
    .map((color) => ({ color, qty: colorTotals.get(color) ?? 0 }))
    .filter((item) => item.qty > 0)
    .map((item) => ({ color: item.color, qty: formatQty(item.qty) }));

  const countryGroups = Array.from(countryTotals.entries()).map(([group, qty]) => ({
    group,
    qty: formatQty(qty),
    share: `${Math.round((qty / totalQty) * 100)}%`,
  }));

  return {
    entityCountLabel: `${entities.length}/${entities.length}`,
    totalQty: formatQty(totalQty),
    styleCode,
    columns: Array.from(allColumns),
    colors,
    countryGroups,
    sidebarEntities,
    entityCards,
  } satisfies SplitViewData;
}
