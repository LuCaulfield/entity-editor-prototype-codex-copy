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
export const availableCountryGroups = ["UE", "Non UE", "UE South", "UE Ecom", "UE Ecom South"];
export const biSuggestion = [0.5, 0.25, 0.25];
