import React from "react";
import { ChevronDown, MoreVertical, Package2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type EntitySummary = {
  id: number;
  code: string;
  qty: string;
  expanded?: boolean;
  colors?: { color: string; qty: string }[];
};

type EntityMatrixCard = {
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

const SIDEBAR_ENTITIES: EntitySummary[] = [
  {
    id: 1,
    code: "11230849",
    qty: "24 000",
    expanded: true,
    colors: [
      { color: "00J", qty: "8 000" },
      { color: "11M", qty: "8 000" },
      { color: "22P", qty: "8 000" },
    ],
  },
  { id: 2, code: "11230850", qty: "9 000" },
  { id: 3, code: "11230851", qty: "9 000" },
];

const COUNTRY_COLUMNS = ["UE", "Non UE", "UE Ecom", "UE South", "UE South Ecom", "No-EACU"];

const ENTITY_CARDS: EntityMatrixCard[] = [
  {
    id: 1,
    code: "11230849",
    qty: "24 000",
    port: "Gdynia",
    packType: "Retail Pack",
    transport: "SEA",
    badge: "ORDERED",
    activeColumn: "A",
    matrix: [
      { color: "00J", values: ["2 000", "1 000", "1 000", "2 000", "1 000", "1 000"] },
      { color: "11M", values: ["2 000", "1 000", "1 000", "2 000", "1 000", "1 000"] },
      { color: "22P", values: ["2 000", "1 000", "1 000", "2 000", "1 000", "1 000"] },
    ],
  },
  {
    id: 2,
    code: "11230850",
    qty: "9 000",
    port: "Gdynia",
    packType: "Retail Pack",
    transport: "SEA",
    badge: "BOOKED",
    activeColumn: "R",
    matrix: [
      { color: "00J", values: ["1 500", "1 500", "0", "0", "0", "0"] },
      { color: "11M", values: ["1 500", "1 500", "0", "0", "0", "0"] },
      { color: "22P", values: ["1 500", "1 500", "0", "0", "0", "0"] },
    ],
  },
  {
    id: 3,
    code: "11230851",
    qty: "9 000",
    port: "Constanta",
    packType: "Ecom Pack",
    transport: "SEA",
    badge: "ORDERED",
    tone: "teal",
    activeColumn: "A",
    matrix: [
      { color: "00J", values: ["0", "0", "1 500", "0", "1 500", "0"] },
      { color: "11M", values: ["0", "0", "1 500", "0", "1 500", "0"] },
      { color: "22P", values: ["0", "0", "1 500", "0", "1 500", "0"] },
    ],
  },
];

const SUMMARY_COUNTRY_GROUPS = [
  { group: "UE", share: "25%", qty: "10 500" },
  { group: "Non UE", share: "18%", qty: "7 500" },
  { group: "UE Ecom", share: "18%", qty: "7 500" },
  { group: "UE South", share: "14%", qty: "6 000" },
  { group: "UE South Ecom", share: "18%", qty: "7 500" },
  { group: "No-EACU", share: "7%", qty: "3 000" },
];

function SidebarEntityCard({ entity }: { entity: EntitySummary }) {
  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center border border-white bg-[#ECF5F4] text-xs font-semibold text-[rgba(0,0,0,0.87)]">
            {entity.id}
          </div>
          <button className="border-b-2 border-[#4F4F4F] text-[16px] font-bold leading-4 tracking-[0.1px] text-[#4F4F4F]">
            {entity.code}
          </button>
        </div>
        <div className="text-[16px] font-semibold leading-6 tracking-[0.1px] text-[#4F4F4F]">{entity.qty}</div>
      </div>

      {entity.expanded && entity.colors ? (
        <>
          <div className="space-y-1 pl-8">
            {entity.colors.map((color, index) => (
              <React.Fragment key={color.color}>
                {index > 0 && <Separator className="bg-[#D9D9D9]" />}
                <div className="flex items-center gap-6 text-xs font-semibold tracking-[0.25px] text-[#4F4F4F]">
                  <span className="w-10 text-right">{color.color}</span>
                  <span>{color.qty}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-end">
            <button className="border-b border-[#4F4F4F] text-xs font-semibold tracking-[0.25px] text-[#4F4F4F]">Hide</button>
          </div>
        </>
      ) : (
        <div className="flex justify-end">
          <button className="border-b border-[#4F4F4F] text-xs font-semibold tracking-[0.25px] text-[#4F4F4F]">Show</button>
        </div>
      )}
    </div>
  );
}

function SummarySection({
  title,
  suffix,
  rows,
  collapsible = false,
}: {
  title: string;
  suffix: string;
  rows: React.ReactNode;
  collapsible?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.16),0px_1px_3px_1px_rgba(0,0,0,0.08)]">
      <div className="flex h-[39px] items-center justify-between bg-[#D9D9D9] px-2">
        <div className="flex items-center gap-1">
          <span className="text-base uppercase leading-6 text-black">{title}</span>
          <span className="text-[14px] leading-[14px] tracking-[0.2px] text-[#4F4F4F]">({suffix})</span>
        </div>
        {collapsible && <ChevronDown className="h-5 w-5 text-[#787878]" />}
      </div>
      <div className="space-y-2 px-3 py-5">{rows}</div>
    </div>
  );
}

function SplitEntityCard({ card }: { card: EntityMatrixCard }) {
  const isTeal = card.tone === "teal";

  return (
    <div
      className="overflow-hidden rounded-lg border shadow-[0px_1px_2px_rgba(0,0,0,0.16),0px_1px_3px_1px_rgba(0,0,0,0.08)]"
      style={{
        borderColor: isTeal ? "#4E7F77" : "#D9D9D9",
        backgroundColor: isTeal ? "#4E7F77" : "#FFFFFF",
      }}
    >
      <div className="flex items-start justify-between px-4 py-4">
        <div className="flex items-start gap-4">
          <div className={`flex h-14 w-14 items-center justify-center text-3xl font-bold ${isTeal ? "bg-white/90 text-[#4E7F77]" : "bg-[#ECF5F4] text-[#1C1C1C]"}`}>
            {card.id}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className={`text-[28px] font-bold leading-9 ${isTeal ? "text-white" : "text-[#1C1C1C]"}`}>{card.code}</div>
              {card.badge && (
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-[0.08em] ${isTeal ? "border-white/30 bg-white/10 text-white" : "border-[#B7E9E2] bg-[#ECF5F4] text-[#4E7F77]"}`}>
                  {card.badge}
                </span>
              )}
            </div>
            <div className={`text-sm ${isTeal ? "text-white/90" : "text-[#4F4F4F]"}`}>
              Discharge Port: <span className="font-semibold">{card.port}</span> · <span className="font-semibold">{card.transport}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Trash2 className={`h-4 w-4 ${isTeal ? "text-white/80" : "text-[#4F4F4F]"}`} />
          <MoreVertical className={`h-4 w-4 ${isTeal ? "text-white/80" : "text-[#4F4F4F]"}`} />
        </div>
      </div>

      <div className={`flex items-center justify-between border-y px-4 py-2 text-xs ${isTeal ? "border-white/20 text-white/90" : "border-[#E0E0E0] text-[#787878]"}`}>
        <div className="flex items-center gap-6">
          <span>Planned Delivery Date: 2024-10-09 (S1)</span>
          <span>PO Delivery Date: 2024-10-07 (S1)</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Actual Date: 2024-10-09</span>
          <span>Latest Pickup: 2024-10-09</span>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="mb-3 flex items-center justify-between">
          <div className={`text-center text-sm ${isTeal ? "text-white/90" : "text-[#4F4F4F]"}`}>Total Quantity: <span className="font-bold">{card.qty}</span></div>
          <div className={`rounded px-3 py-1 text-xs font-semibold ${isTeal ? "bg-white text-[#4E7F77]" : "bg-[#F2F2F2] text-[#4F4F4F]"}`}>{card.packType}</div>
        </div>

        <div className="grid grid-cols-[70px_repeat(6,minmax(0,1fr))] gap-1">
          <div />
          {COUNTRY_COLUMNS.map((column) => (
            <div
              key={column}
              className={`rounded-t px-1 py-1 text-center text-[10px] font-semibold ${isTeal ? "bg-white/15 text-white" : "bg-[#F2F2F2] text-[#787878]"}`}
            >
              {column}
            </div>
          ))}

          {card.matrix.map((row) => (
            <React.Fragment key={`${card.id}-${row.color}`}>
              <div className={`flex items-center justify-end pr-2 text-xs font-semibold ${isTeal ? "text-white" : "text-[#4F4F4F]"}`}>
                {row.color} · <span className="ml-1 opacity-70">3 000</span>
              </div>
              {row.values.map((value, index) => (
                <div
                  key={`${row.color}-${COUNTRY_COLUMNS[index]}`}
                  className={`min-h-[56px] rounded border px-1 py-1 ${isTeal ? "border-white/10 bg-white/5 text-white" : "border-[#E8E8E8] bg-white text-[#4F4F4F]"}`}
                >
                  <div className="mb-2 flex items-center justify-between text-[10px]">
                    <span>{value !== "0" ? "↔" : "○"}</span>
                    <span>{value !== "0" ? "✎" : ""}</span>
                  </div>
                  <div className="text-center text-xs font-semibold">{value}</div>
                </div>
              ))}
            </React.Fragment>
          ))}

          <div />
          {COUNTRY_COLUMNS.map((column, index) => (
            <div key={`footer-${card.id}-${column}`} className={`text-center text-[10px] ${isTeal ? "text-white/70" : "text-[#9A9A9A]"}`}>
              {card.matrix.reduce((sum, row) => sum + Number(row.values[index].replace(/\s/g, "")), 0).toLocaleString("en-US").replace(/,/g, " ")}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SplitViewPanel() {
  return (
    <div className="overflow-hidden rounded-2xl bg-[#F2F2F2] shadow-[0px_1px_2px_rgba(0,0,0,0.24),0px_2px_12px_rgba(0,0,0,0.08)]">
      <div className="grid min-h-[1280px] grid-cols-[256px_minmax(0,1fr)_256px]">
        <aside className="border-r border-[#E0E0E0] bg-[#F2F2F2] px-3 py-6">
          <Button className="mb-14 flex h-[54px] w-full items-center gap-2 rounded-lg bg-[#20DFC0] text-[14px] font-normal uppercase tracking-[0.25px] text-[#1C1C1C] hover:bg-[#1bd1b4]">
            <Plus className="h-5 w-5" />
            Add entity
          </Button>

          <div className="rounded-lg bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.16),0px_1px_3px_1px_rgba(0,0,0,0.08)]">
            <div className="flex h-[39px] items-center justify-between bg-[#D9D9D9] px-2">
              <div className="flex items-center gap-1">
                <span className="text-base uppercase leading-6 text-black">Entities</span>
                <span className="text-[14px] leading-[14px] tracking-[0.2px] text-[#4F4F4F]">(psc)</span>
              </div>
              <ChevronDown className="h-5 w-5 text-[#787878]" />
            </div>
            <div className="space-y-4 px-3 py-4">
              {SIDEBAR_ENTITIES.map((entity, index) => (
                <React.Fragment key={entity.id}>
                  {index > 0 && <Separator className="bg-[#D9D9D9]" />}
                  <SidebarEntityCard entity={entity} />
                </React.Fragment>
              ))}
            </div>
          </div>
        </aside>

        <section className="border-r border-[#E0E0E0] bg-white px-4 py-6">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <div className="text-[16px] uppercase leading-[18px] text-[#4F4F4F]">Filters</div>
              <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#4F4F4F]">
                <span>Status</span>
                <span>Entity</span>
                <span>Country Group</span>
                <span>Discharge Port</span>
                <span>Color</span>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-[#787878]" />
          </div>

          <div className="mb-3 flex items-center gap-3">
            <span className="text-[16px] uppercase leading-[18px] text-[#4F4F4F]">Entities</span>
            <span className="text-[18px] font-semibold text-[#4F4F4F]">3/3</span>
          </div>

          <div className="space-y-5">
            {ENTITY_CARDS.map((card) => (
              <SplitEntityCard key={card.id} card={card} />
            ))}
          </div>
        </section>

        <aside className="bg-[#F2F2F2] px-3 py-6">
          <div className="space-y-4">
            <SummarySection
              title="TOtal Quantity"
              suffix="psc"
              rows={
                <div className="flex items-center justify-between text-[16px]">
                  <span className="uppercase text-black">277IY</span>
                  <span className="font-semibold text-[#4F4F4F]">42 000</span>
                </div>
              }
            />

            <SummarySection
              title="Colors"
              suffix="psc"
              collapsible
              rows={
                <>
                  {["00J", "11M", "22P"].map((color) => (
                    <div key={color} className="flex items-center justify-between text-[16px] text-[#4F4F4F]">
                      <span className="font-bold">{color}</span>
                      <span className="font-semibold">14 000</span>
                    </div>
                  ))}
                </>
              }
            />

            <SummarySection
              title="Country Groups"
              suffix="psc"
              collapsible
              rows={
                <>
                  {SUMMARY_COUNTRY_GROUPS.map((item) => (
                    <div key={item.group} className="flex items-center justify-between gap-3 text-[16px] text-[#4F4F4F]">
                      <span className="font-bold">{item.group}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[rgba(0,0,0,0.38)]">({item.share})</span>
                        <span className="font-semibold text-[rgba(0,0,0,0.54)]">{item.qty}</span>
                      </div>
                    </div>
                  ))}
                </>
              }
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
