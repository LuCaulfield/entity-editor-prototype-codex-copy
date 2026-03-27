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
    <Card className="shadow-oa">
      <CardHeader>
        <CardTitle className="text-lg">Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-oa-gray-70">Total order</span>
          <strong>{totalQty.toLocaleString()}</strong>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-oa-gray-70">Entities</span>
          <strong>{entityCount}</strong>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-oa-gray-70">Assigned qty</span>
          <strong>{assignedQty.toLocaleString()}</strong>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-oa-gray-70">Retail / E-com</span>
          <strong>
            {retailPct}% / {ecomPct}%
          </strong>
        </div>
        <Separator />
        <div
          className={`rounded-xl p-3 text-sm font-medium ${
            assignedQty === totalQty
              ? "bg-primary-10 text-primary-80"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {assignedQty === totalQty
            ? "Entity quantities match total order."
            : `Difference vs total: ${(totalQty - assignedQty).toLocaleString()} pcs`}
        </div>
        {!validChannel && (
          <div className="rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-700">
            Retail + E-commerce must equal 100%.
          </div>
        )}
        {minViolation && (
          <div className="rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-700">
            At least one entity is below the minimum quantity.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
