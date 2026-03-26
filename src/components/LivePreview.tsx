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
    <Card className="rounded-[2rem] border-0 bg-white shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-2xl font-semibold">
          <Eye className="h-6 w-6" />
          Live preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-3xl bg-slate-50 p-4">
            <div className="text-sm text-slate-500">Total</div>
            <div className="mt-2 text-3xl font-semibold text-slate-900">{totalQty.toLocaleString()}</div>
          </div>
          <div className="rounded-3xl bg-rose-50 p-4">
            <div className="text-sm text-slate-500">Warnings</div>
            <div className="mt-2 text-3xl font-semibold text-rose-600">{warningCount}</div>
          </div>
        </div>

        <div className="space-y-3">
          {previewEntities.map((entity) => (
            <div
              key={`preview-${entity.id}`}
              className={`rounded-3xl border p-4 ${
                entity.belowMin ? "border-rose-300 bg-white" : "border-slate-200 bg-slate-50/50"
              }`}
            >
              {/* Entity header */}
              <div className="flex items-start justify-between gap-4">
                <div className="text-lg font-semibold text-slate-900">{entity.name}</div>
                <div className="text-2xl font-semibold text-slate-900">{entity.qty.toLocaleString()}</div>
              </div>
              <div className="mt-1 text-sm text-slate-500">
                Week {entity.week} · Retail {entity.retailQty.toLocaleString()} / Ecom {entity.ecomQty.toLocaleString()}
              </div>

              {/* Sets */}
              {entity.sets.length > 0 && (
                <div className="mt-3 space-y-2">
                  {entity.sets.map((set, index) => (
                    <div key={set.id} className="rounded-xl bg-white border border-slate-200 px-3 py-2">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Set {index + 1}
                        </span>
                        <span className="text-xs text-slate-500">
                          {PACK_TYPE_LABELS[set.packType] ?? set.packType}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600">
                        <span className="font-medium">Groups: </span>
                        {set.countryGroups.length ? set.countryGroups.join(", ") : <span className="text-slate-400">none</span>}
                      </div>
                      <div className="text-xs text-slate-600">
                        <span className="font-medium">Colors: </span>
                        {set.colors.length ? set.colors.join(", ") : <span className="text-slate-400">none</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {entity.belowMin && (
                <div className="mt-3 flex items-center gap-2 text-sm font-medium text-rose-600">
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
