export type Entity = {
  id: number;
  name: string;
  qty: number;
  week: number;
  retailPct: number;
  ecomPct: number;
  packType: string;
  minQty: number;
  packMixEnabled: boolean;
  prepackPct: number;
  multipackPct: number;
  prepackLargePct: number;
  multipackLargePct: number;
  colors: string[];
  countryGroups: string[];
};

export type CountryGroupAssignments = Record<string, number[]>;
export type EntityColorSelections = Record<number, string[]>;
export type EntityPackTypes = Record<number, string>;

export const availableColors = ["00J", "11M", "22P", "44K"];
export const availableCountryGroups = ["UE", "Non UE", "UE South", "UE Ecom", "UE Ecom South"];
export const biSuggestion = [0.5, 0.25, 0.25];
