export type EntitySet = {
  id: number;
  countryGroups: string[];
  colors: string[];
};

export type Entity = {
  id: number;
  name: string;
  qty: number;
  week: number;
  retailPct: number;
  ecomPct: number;
  minQty: number;
  packType: string;
  packMixEnabled: boolean;
  prepackPct: number;
  multipackPct: number;
  prepackLargePct: number;
  multipackLargePct: number;
  sets: EntitySet[];
};

export const availableColors = ["00J", "11M", "22P", "44K"];
export const availableCountryGroups = ["UE", "Non UE", "UE South", "UE Ecom", "UE Ecom South", "No-EACU"];
export const biSuggestion = [0.5, 0.25, 0.25];

export type Brand = "sinsay" | "other";

export const BRANDS: { id: Brand; label: string }[] = [
  { id: "sinsay", label: "Sinsay" },
  { id: "other", label: "Other brands" },
];

export const BRAND_COUNTRY_GROUPS: Record<Brand, string[]> = {
  sinsay: ["UE", "Non UE", "UE South", "UE Ecom", "UE Ecom South", "No-EACU"],
  other: ["UE", "Non UE", "UE Ecom"],
};

export const BRAND_DEFAULT_ENTITY_COUNT: Record<Brand, number> = {
  sinsay: 5,
  other: 2,
};

// Default country groups per entity index, per brand
export const BRAND_DEFAULT_COUNTRY_GROUPS_PER_ENTITY: Record<Brand, Record<number, string[]>> = {
  sinsay: {
    1: ["Non UE"],
    2: ["UE"],
    3: ["UE Ecom"],
    4: ["UE South"],
    5: ["UE Ecom South"],
  },
  other: {
    1: ["UE", "Non UE"],
    2: ["UE Ecom"],
  },
};
