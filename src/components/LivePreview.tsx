import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Eye } from "lucide-react";
import { type EntitySet } from "@/types";

export type PreviewEntity = {
  id: number;
  name: string;
  qty: number;
  week: number;
  retailQty: number;
  ecomQty: number;
  sets: EntitySet[];
  packType: string;
  belowMin: boolean;
};

type LivePreviewProps = {
  totalQty: number;
  warningCount: number;
  previewEntities: PreviewEntity[];
};

const PACK_TYPE_LABELS: Record<string, string> = {
  single: "Single",
  prepack: "Prepack",
  multipack: "Multipack",
  display: "Display",
  "retail-pack": "Retail Pack",
  "ecom-pack": "Ecom Pack",
};

export default function LivePreview({ totalQty, warningCount, previewEntities }: LivePreviewProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-2xl font-bold">
          <Eye className="h-6 w-6 text-primary-50" />
          Live preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2 rounded-xl bg-oa-gray-5 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-oa-gray-40">Total</div>
            <div className="mt-2 text-3xl font-bold text-oa-text">{totalQty.toLocaleString()}</div>
          </div>
          <div className="col-span-1 rounded-xl bg-rose-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-oa-gray-40">Warn</div>
            <div className="mt-2 text-3xl font-bold text-rose-600">{warningCount}</div>
          </div>
        </div>

        <div className="space-y-3">
          {previewEntities.map((entity) => (
            <div
              key={`preview-${entity.id}`}
              className={`rounded-xl border p-4 ${
                entity.belowMin ? "border-rose-300 bg-white" : "border-oa-border bg-oa-gray-5"
              }`}
            >
              {/* Entity header */}
              <div className="flex items-start justify-between gap-4">
                <div className="text-sm font-bold text-oa-text">{entity.name}</div>
                <div className="text-xl font-bold text-oa-text">{entity.qty.toLocaleString()}</div>
              </div>
              <div className="mt-1 text-xs text-oa-gray-40">
                Week {entity.week} · {PACK_TYPE_LABELS[entity.packType] ?? entity.packType} · Retail {entity.retailQty.toLocaleString()} / Ecom {entity.ecomQty.toLocaleString()}
              </div>

              {/* Sets */}
              {entity.sets.length > 0 && (
                <div className="mt-3 space-y-2">
                  {entity.sets.map((set, index) => (
                    <div key={set.id} className="rounded-lg border border-oa-border bg-white px-3 py-2">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wide text-oa-gray-70">
                          Set {index + 1}
                        </span>
                      </div>
                      <div className="text-xs text-oa-gray-70">
                        <span className="font-semibold">Groups: </span>
                        {set.countryGroups.length ? set.countryGroups.join(", ") : <span className="text-oa-gray-40">none</span>}
                      </div>
                      <div className="text-xs text-oa-gray-70">
                        <span className="font-semibold">Colors: </span>
                        {set.colors.length ? (() => {
                          const totalColors = entity.sets.reduce((sum, s) => sum + s.colors.length, 0);
                          const qtyPerColor = totalColors > 0 ? Math.round(entity.qty / totalColors) : 0;
                          return set.colors.map((c) => `${c} (${qtyPerColor.toLocaleString()})`).join(", ");
                        })() : <span className="text-oa-gray-40">none</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {entity.belowMin && (
                <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-rose-600">
                  <AlertCircle className="h-4 w-4" />
                  Below minimum ({entity.qty.toLocaleString()} &lt; min)
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
