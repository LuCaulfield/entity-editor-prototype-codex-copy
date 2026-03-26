import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type SummaryCardProps = {
  totalQty: number;
  entityCount: number;
  assignedQty: number;
  retailPct: number;
  ecomPct: number;
  validChannel: boolean;
  minViolation: boolean;
};

export default function SummaryCard({
  totalQty,
  entityCount,
  assignedQty,
  retailPct,
  ecomPct,
  validChannel,
  minViolation,
}: SummaryCardProps) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="flex items-center justify-between">
          <span>Total order</span>
          <strong>{totalQty.toLocaleString()}</strong>
        </div>
        <div className="flex items-center justify-between">
          <span>Entities</span>
          <strong>{entityCount}</strong>
        </div>
        <div className="flex items-center justify-between">
          <span>Assigned qty</span>
          <strong>{assignedQty.toLocaleString()}</strong>
        </div>
        <div className="flex items-center justify-between">
          <span>Retail / E-com</span>
          <strong>
            {retailPct}% / {ecomPct}%
          </strong>
        </div>
        <Separator />
        <div
          className={`rounded-xl p-3 ${
            assignedQty === totalQty ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
          }`}
        >
          {assignedQty === totalQty
            ? "Entity quantities match total order."
            : `Difference vs total: ${(totalQty - assignedQty).toLocaleString()} pcs`}
        </div>
        {!validChannel && (
          <div className="rounded-xl bg-rose-50 p-3 text-rose-700">
            Retail + E-commerce must equal 100%.
          </div>
        )}
        {minViolation && (
          <div className="rounded-xl bg-rose-50 p-3 text-rose-700">
            At least one entity is below the minimum quantity.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
