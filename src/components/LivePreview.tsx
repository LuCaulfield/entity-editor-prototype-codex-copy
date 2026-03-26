import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Eye } from "lucide-react";

export type PreviewEntity = {
  id: number;
  name: string;
  qty: number;
  week: number;
  retailQty: number;
  ecomQty: number;
  countryGroups: string[];
  belowMin: boolean;
};

type LivePreviewProps = {
  totalQty: number;
  warningCount: number;
  previewEntities: PreviewEntity[];
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
              <div className="flex items-start justify-between gap-4">
                <div className="text-lg font-semibold text-slate-900">{entity.name}</div>
                <div className="text-2xl font-semibold text-slate-900">{entity.qty.toLocaleString()}</div>
              </div>
              <div className="mt-2 text-sm text-slate-500">
                Week {entity.week} · Retail {entity.retailQty} / Ecom {entity.ecomQty}
              </div>
              <div className="mt-1 text-sm text-slate-500">
                Country groups: {entity.countryGroups.length ? entity.countryGroups.join(", ") : "none"}
              </div>
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
