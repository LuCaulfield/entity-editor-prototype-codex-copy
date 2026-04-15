import React, { useState } from "react";
import { ChevronDown, ChevronRight, MoreVertical, Check, Pencil } from "lucide-react";
import EntityEditorPrototype from "./EntityEditorPrototype";

// ── Stepper ─────────────────────────────────────────────────────────────────
const STEP_LABELS = ["Style details", "Supplier", "Transport", "Pricing", "Quantity", "Summary"];
const ACTIVE_STEP = 5;

function StepCircle({ num }: { num: number }) {
  const done = num < ACTIVE_STEP;
  const active = num === ACTIVE_STEP;
  const bg = done || active ? "#00D7B9" : "rgba(0,0,0,0.38)";
  return (
    <div
      className="flex items-center justify-center rounded-full shrink-0"
      style={{ width: 36, height: 36, backgroundColor: bg }}
    >
      {done ? (
        <Check strokeWidth={2.5} className="w-[18px] h-[18px] text-white" />
      ) : (
        <span className="text-[16px] leading-none" style={{ color: "rgba(255,255,255,0.87)" }}>
          {num}
        </span>
      )}
    </div>
  );
}

function Stepper() {
  return (
    <div className="flex items-start flex-1">
      {STEP_LABELS.map((label, i) => {
        const num = i + 1;
        const inactive = num > ACTIVE_STEP;
        return (
          <React.Fragment key={num}>
            {i > 0 && (
              <div
                className="flex-1 h-px mt-[18px] shrink"
                style={{ backgroundColor: "rgba(0,0,0,0.24)" }}
              />
            )}
            <div className="flex flex-col items-center gap-2 shrink-0" style={{ minWidth: 82 }}>
              <StepCircle num={num} />
              <span
                className="text-[14px] leading-[1.571em] text-center"
                style={{ color: inactive ? "rgba(0,0,0,0.54)" : "rgba(0,0,0,0.87)" }}
              >
                {label}
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ── Style card fields ────────────────────────────────────────────────────────
const STYLE_FIELDS = [
  { label: "Style", value: "277IY" },
  { label: "Department", value: "ladies' garment SI" },
  { label: "Class", value: "L_t-shirts_l_s" },
  { label: "Subclass", value: "L_t-shirts_l_s" },
  { label: "Line", value: "LADY" },
  { label: "Fashion level", value: "Standard" },
  { label: "Product type", value: "RG - Regular" },
  { label: "Collection", value: "Ski Collection" },
  { label: "Model season", value: "AW 2024" },
  { label: "Model intake", value: "10" },
  { label: "RFID", value: "no RFID" },
  { label: "VPN", value: "LADIE'S BLOUSE BODY" },
  { label: "Supplier name", value: "Shanghai Office" },
  { label: "Company", value: "LPP" },
];

// ── Entity sub-row data ──────────────────────────────────────────────────────
const ENTITIES = [
  { qty: "3 500", share: "20 %", country: "UE" },
  { qty: "1 000", share: "20 %", country: "Non UE" },
  { qty: "2 500", share: "20 %", country: "UE Ecom" },
  { qty: "2 000", share: "20 %", country: "UE South" },
  { qty: "2 000", share: "20 %", country: "UE Ecom South" },
];

// ── Input-style cell (underline, editable appearance) ───────────────────────
function InputCell({ value, align = "left" }: { value: string; align?: "left" | "right" | "center" }) {
  return (
    <div
      className="inline-flex items-end pb-0.5"
      style={{
        borderBottom: "1px solid rgba(0,0,0,0.42)",
        textAlign: align,
        minWidth: 40,
      }}
    >
      <span className="text-[14px] leading-[1.571em]" style={{ color: "rgba(0,0,0,0.87)" }}>
        {value}
      </span>
    </div>
  );
}

// ── Column widths (total = 1392px) ───────────────────────────────────────────
// 0:48 1:48 2:78 3:64 4:73 5:130 6:64 7:196 8:90 9:78 10:87 11:137 12:78 13:74 14:78 15:69
const COL_WIDTHS = [48, 48, 78, 64, 73, 130, 64, 196, 90, 78, 87, 137, 78, 74, 78, 69];

const BORDER_ROW = { borderBottom: "1px solid #E0E0E0" } as const;
const TD_BASE = { color: "rgba(0,0,0,0.87)", fontSize: 14, padding: "6px 8px", verticalAlign: "middle" } as const;
const TD_MID = { color: "rgba(0,0,0,0.54)", fontSize: 14, padding: "6px 8px", verticalAlign: "middle" } as const;
const TD_MINQTY = {
  backgroundColor: "#F2F2F2",
  color: "rgba(0,0,0,0.54)",
  fontSize: 14,
  padding: "6px 8px",
  verticalAlign: "middle",
  textAlign: "right" as const,
} as const;
const TD_ACTIONS = {
  position: "sticky" as const,
  right: 0,
  backgroundColor: "#FFFFFF",
  borderLeft: "1px solid #E0E0E0",
  padding: "6px 8px",
  verticalAlign: "middle" as const,
  textAlign: "center" as const,
} as const;

// ── Main component ───────────────────────────────────────────────────────────
export default function QuantityScreen() {
  const [expanded, setExpanded] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">

      {/* ── Top Nav (56px, teal) ─────────────────────────────────── */}
      <header
        className="flex shrink-0 items-center justify-between px-6 z-30"
        style={{ height: 56, backgroundColor: "#00D7B9", boxShadow: "0px 1px 2px rgba(0,0,0,0.24), 0px 2px 12px rgba(0,0,0,0.08)" }}
      >
        <div className="flex items-center gap-6">
          {/* LPP logo placeholder */}
          <div
            className="flex items-center justify-center rounded"
            style={{ width: 62, height: 40, backgroundColor: "rgba(255,255,255,0.15)" }}
          >
            <span className="text-white font-bold text-sm tracking-widest">LPP</span>
          </div>
          <span style={{ color: "#FFFFFF", fontSize: 16, fontWeight: 600, lineHeight: "24px" }}>
            Ordering Application
          </span>
        </div>

        {/* Profile button */}
        <button
          className="flex items-center gap-2 rounded-lg px-4 py-2"
          style={{ backgroundColor: "rgba(0,86,74,0.35)" }}
        >
          <span style={{ color: "rgba(255,255,255,0.87)", fontSize: 14 }}>supplier15-uat</span>
          <svg viewBox="0 0 24 24" className="w-6 h-6" style={{ fill: "rgba(255,255,255,0.87)" }}>
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        </button>
      </header>

      {/* ── Breadcrumbs bar ──────────────────────────────────────── */}
      <div
        className="flex shrink-0 items-center justify-between px-6"
        style={{ borderBottom: "1px solid #E0E0E0", backgroundColor: "#FFFFFF" }}
      >
        <div className="flex items-center gap-1 py-4" style={{ fontSize: 14 }}>
          <span className="cursor-pointer hover:underline" style={{ color: "rgba(0,0,0,0.54)" }}>Orders</span>
          <ChevronRight className="w-4 h-4" style={{ color: "rgba(0,0,0,0.54)" }} />
          <span className="cursor-pointer hover:underline" style={{ color: "rgba(0,0,0,0.54)" }}>Orders List</span>
          <ChevronRight className="w-4 h-4" style={{ color: "rgba(0,0,0,0.54)" }} />
          <span style={{ color: "rgba(0,0,0,0.87)" }}>Edit Garment Order</span>
        </div>
        <button className="p-2 rounded hover:bg-gray-100">
          <MoreVertical className="w-5 h-5" style={{ color: "rgba(0,0,0,0.54)" }} />
        </button>
      </div>

      {/* ── Content area ─────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto pb-[60px]">
        <div className="px-6 pt-8 flex flex-col" style={{ gap: 24 }}>

          {/* ── Header + Stepper row ──────────────────────────────── */}
          <div className="flex items-start gap-12">
            {/* EDIT ORDER heading */}
            <div className="shrink-0 pt-1">
              <h1
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  lineHeight: "36px",
                  letterSpacing: "0.3px",
                  color: "rgba(0,0,0,0.87)",
                }}
              >
                EDIT ORDER
              </h1>
            </div>
            {/* Stepper */}
            <Stepper />
          </div>

          {/* ── Style card (always-visible horizontal strip) ──────── */}
          <div
            className="flex items-stretch overflow-hidden"
            style={{ border: "1px solid rgba(0,0,0,0.42)", borderRadius: 4, height: 71 }}
          >
            {/* Thumbnail */}
            <div
              className="shrink-0 flex items-center justify-center m-1.5 rounded overflow-hidden"
              style={{ width: 56, height: 56, border: "2px solid #4A4A4A", backgroundColor: "#f0f0f0" }}
            >
              <svg viewBox="0 0 24 24" className="w-7 h-7" style={{ fill: "#bbb" }}>
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
              </svg>
            </div>

            {/* Scrollable fields */}
            <div className="flex items-stretch overflow-x-auto flex-1 border-l" style={{ borderColor: "rgba(0,0,0,0.12)" }}>
              {STYLE_FIELDS.map((f) => (
                <div
                  key={f.label}
                  className="flex flex-col justify-between shrink-0 border-r px-2 py-1.5"
                  style={{ borderColor: "#E0E0E0", minWidth: 68 }}
                >
                  <span
                    style={{ fontSize: 10, fontWeight: 700, lineHeight: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(0,0,0,0.87)" }}
                  >
                    {f.label}
                  </span>
                  <span style={{ fontSize: 10, lineHeight: "10px", color: "rgba(0,0,0,0.87)" }}>
                    {f.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Order select */}
            <div
              className="flex flex-col justify-between shrink-0 self-center mx-2 px-2 py-1 rounded"
              style={{ border: "1px solid rgba(0,0,0,0.42)", minWidth: 180, height: 40 }}
            >
              <span style={{ fontSize: 10, lineHeight: "10px", color: "#949494" }}>
                Order Group | Order Season | Supplier Name
              </span>
              <div className="flex items-center gap-1">
                <span className="flex-1 truncate" style={{ fontSize: 12, color: "rgba(0,0,0,0.87)" }}>
                  2604348 | AW 2024 | Shanghai Office
                </span>
                <ChevronDown className="w-4 h-4 shrink-0" style={{ color: "rgba(0,0,0,0.54)" }} />
              </div>
            </div>

            {/* PREORDER */}
            <div
              className="flex items-center justify-center shrink-0 px-4"
              style={{ borderLeft: "1px solid rgba(0,0,0,0.42)" }}
            >
              <span style={{ fontSize: 10, fontWeight: 400, color: "#000000" }}>PREORDER</span>
            </div>
          </div>

          {/* ── Table ─────────────────────────────────────────────── */}
          <div
            className="overflow-hidden"
            style={{ borderRadius: 16, boxShadow: "0px 1px 2px rgba(0,0,0,0.24), 0px 2px 12px rgba(0,0,0,0.08)" }}
          >
            <div className="overflow-x-auto">
              <table style={{ tableLayout: "fixed", width: 1392, borderCollapse: "collapse" }}>
                <colgroup>
                  {COL_WIDTHS.map((w, i) => <col key={i} style={{ width: w }} />)}
                </colgroup>

                {/* ── Table header ─────────────────────────────── */}
                <thead>
                  <tr style={{ backgroundColor: "#FFFFFF", ...BORDER_ROW }}>
                    {/* expand */}
                    <th style={{ height: 78, padding: "6px 8px", verticalAlign: "middle" }} />
                    {/* spacer */}
                    <th style={{ height: 78, padding: "6px 8px", verticalAlign: "middle" }} />
                    {(["Color","Store Group","Eligibility","Size Curve"] as const).map(h => (
                      <th key={h} style={{ height: 78, padding: "6px 8px", verticalAlign: "middle", textAlign: "left", fontSize: 14, fontWeight: 400, color: "rgba(0,0,0,0.87)" }}>{h}</th>
                    ))}
                    <th style={{ height: 78, padding: "6px 8px", verticalAlign: "middle", textAlign: "center", fontSize: 14, fontWeight: 400, color: "rgba(0,0,0,0.87)" }}>PPack &amp; Xdock</th>
                    <th style={{ height: 78, padding: "6px 8px", verticalAlign: "middle", textAlign: "left", fontSize: 14, fontWeight: 400, color: "rgba(0,0,0,0.87)" }}>Packing Curve</th>
                    <th style={{ height: 78, padding: "6px 8px", verticalAlign: "middle", textAlign: "right", fontSize: 14, fontWeight: 400, color: "rgba(0,0,0,0.87)" }}>Min Log Qty</th>
                    <th style={{ height: 78, padding: "6px 8px", verticalAlign: "middle", textAlign: "right", fontSize: 14, fontWeight: 400, color: "rgba(0,0,0,0.87)" }}>Quantity</th>
                    <th style={{ height: 78, padding: "6px 8px", verticalAlign: "middle", textAlign: "left", fontSize: 14, fontWeight: 400, color: "rgba(0,0,0,0.87)" }}>Share</th>
                    <th style={{ height: 78, padding: "6px 8px", verticalAlign: "middle", textAlign: "left", fontSize: 14, fontWeight: 400, color: "rgba(0,0,0,0.87)" }}>Country Group</th>
                    <th style={{ height: 78, padding: "6px 8px", verticalAlign: "middle", textAlign: "left", fontSize: 14, fontWeight: 400, color: "rgba(0,0,0,0.87)" }}>SOS Type</th>
                    <th style={{ height: 78, padding: "6px 8px", verticalAlign: "middle", textAlign: "center", fontSize: 14, fontWeight: 400, color: "rgba(0,0,0,0.87)" }}>Weeks on Stock</th>
                    <th style={{ height: 78, padding: "6px 8px", verticalAlign: "middle", textAlign: "left", fontSize: 14, fontWeight: 400, color: "rgba(0,0,0,0.87)" }}>Seasonality</th>
                    {/* Actions – pinned right */}
                    <th style={{ height: 78, padding: "6px 8px", verticalAlign: "middle", textAlign: "center", fontSize: 14, fontWeight: 400, color: "rgba(0,0,0,0.87)", position: "sticky", right: 0, backgroundColor: "#FFFFFF", borderLeft: "1px solid #E0E0E0" }}>
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {/* ── Row 00J ──────────────────────────────────── */}
                  <tr style={{ backgroundColor: "#FFFFFF", ...BORDER_ROW }}>
                    {/* expand toggle */}
                    <td style={{ height: 78, padding: "6px 8px", verticalAlign: "middle", textAlign: "center" }}>
                      <button onClick={() => setExpanded(e => !e)} className="flex items-center justify-center w-full">
                        {expanded
                          ? <ChevronDown className="w-5 h-5" style={{ color: "rgba(0,0,0,0.54)" }} />
                          : <ChevronRight className="w-5 h-5" style={{ color: "rgba(0,0,0,0.54)" }} />}
                      </button>
                    </td>
                    <td style={{ height: 78 }} />
                    <td style={TD_BASE}>00J</td>
                    <td style={TD_BASE}>N/A</td>
                    <td style={TD_BASE}>XL-XS</td>
                    <td style={TD_BASE}>TA_PRECAPCK_2/4</td>
                    <td style={{ ...TD_BASE, textAlign: "center" }}>~</td>
                    <td style={TD_BASE}><InputCell value="P01 (4,5,2,3) + 3,5,2,4" /></td>
                    <td style={TD_MINQTY}>9 400</td>
                    <td style={{ ...TD_BASE, textAlign: "right", fontWeight: 500 }}>13 000</td>
                    <td style={TD_BASE}>100%</td>
                    <td style={TD_MID}>~</td>
                    <td style={TD_BASE}><InputCell value="OB3W" /></td>
                    <td style={{ ...TD_BASE, textAlign: "center" }}><InputCell value="41" align="center" /></td>
                    <td style={TD_BASE}><InputCell value="Winter" /></td>
                    {/* Actions */}
                    <td style={{ ...TD_ACTIONS, height: 78 }}>
                      <button
                        onClick={() => setEditorOpen(true)}
                        className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap mx-auto"
                        style={{ backgroundColor: "#00D7B9", color: "rgba(0,0,0,0.87)" }}
                      >
                        <Pencil className="w-3 h-3" />
                        Manual
                      </button>
                    </td>
                  </tr>

                  {/* ── Entity sub-rows ───────────────────────────── */}
                  {expanded && ENTITIES.map((e, i) => (
                    <tr key={i} style={{ backgroundColor: "#FFFFFF", ...BORDER_ROW }}>
                      <td style={{ height: 44 }} />
                      {/* pencil icon in spacer col */}
                      <td style={{ height: 44, padding: "6px 8px", verticalAlign: "middle", textAlign: "center" }}>
                        <Pencil className="w-3.5 h-3.5 inline-block" style={{ color: "rgba(0,0,0,0.54)" }} />
                      </td>
                      {/* Entity name spans Color → Packing Curve (6 cols) */}
                      <td colSpan={6} style={{ height: 44, padding: "6px 8px", verticalAlign: "middle", fontSize: 14, color: "rgba(0,0,0,0.54)" }}>
                        PH M.2.3 + S.3.24
                      </td>
                      {/* Min Log Qty – gray bg, empty */}
                      <td style={{ height: 44, backgroundColor: "#F2F2F2" }} />
                      {/* Qty */}
                      <td style={{ height: 44, padding: "6px 8px", verticalAlign: "middle", textAlign: "right", fontSize: 14, fontWeight: 500, color: "rgba(0,0,0,0.87)" }}>
                        {e.qty}
                      </td>
                      {/* Share */}
                      <td style={{ height: 44, padding: "6px 8px", verticalAlign: "middle", fontSize: 14, color: "rgba(0,0,0,0.87)" }}>
                        {e.share}
                      </td>
                      {/* Country Group */}
                      <td style={{ height: 44, padding: "6px 8px", verticalAlign: "middle", fontSize: 14, color: "rgba(0,0,0,0.87)" }}>
                        {e.country}
                      </td>
                      {/* SOS + Weeks + Season empty */}
                      <td colSpan={3} style={{ height: 44 }} />
                      {/* Actions sticky */}
                      <td style={{ ...TD_ACTIONS, height: 44 }} />
                    </tr>
                  ))}

                  {/* ── Row 11M ──────────────────────────────────── */}
                  <tr style={{ backgroundColor: "#FFFFFF", ...BORDER_ROW }}>
                    <td style={{ height: 78 }} />
                    <td style={{ height: 78 }} />
                    <td style={TD_BASE}>11M</td>
                    <td style={TD_BASE}>N/A</td>
                    <td style={TD_BASE}>XL-XS</td>
                    <td style={TD_BASE}>TA_PRECAPCK_2/4</td>
                    <td style={{ ...TD_BASE, textAlign: "center" }}>~</td>
                    <td style={TD_MID}>~</td>
                    <td style={TD_MINQTY}>9 400</td>
                    <td style={{ ...TD_BASE, textAlign: "right", fontWeight: 500 }}>11 000</td>
                    <td style={TD_MID}>~</td>
                    <td style={TD_MID}>~</td>
                    <td style={TD_BASE}><InputCell value="OB3W" /></td>
                    <td style={{ ...TD_BASE, textAlign: "center" }}><InputCell value="41" align="center" /></td>
                    <td style={TD_BASE}><InputCell value="Winter" /></td>
                    <td style={{ ...TD_ACTIONS, height: 78 }}>
                      <button className="rounded p-1.5 hover:bg-gray-100 mx-auto">
                        <MoreVertical className="w-4 h-4" style={{ color: "rgba(0,0,0,0.54)" }} />
                      </button>
                    </td>
                  </tr>

                  {/* ── Row 22P ──────────────────────────────────── */}
                  <tr style={{ backgroundColor: "#FFFFFF", ...BORDER_ROW }}>
                    <td style={{ height: 78 }} />
                    <td style={{ height: 78 }} />
                    <td style={TD_BASE}>22P</td>
                    <td style={TD_BASE}>N/A</td>
                    <td style={TD_BASE}>XL-XS</td>
                    <td style={TD_BASE}>TA_PRECAPCK_2/4</td>
                    <td style={{ ...TD_BASE, textAlign: "center" }}>~</td>
                    <td style={TD_MID}>~</td>
                    <td style={TD_MINQTY}>9 400</td>
                    <td style={{ ...TD_BASE, textAlign: "right", fontWeight: 500 }}>8 000</td>
                    <td style={TD_MID}>~</td>
                    <td style={TD_MID}>~</td>
                    <td style={TD_BASE}><InputCell value="OB3W" /></td>
                    <td style={{ ...TD_BASE, textAlign: "center" }}><InputCell value="41" align="center" /></td>
                    <td style={TD_BASE}><InputCell value="Winter" /></td>
                    <td style={{ ...TD_ACTIONS, height: 78 }}>
                      <button className="rounded p-1.5 hover:bg-gray-100 mx-auto">
                        <MoreVertical className="w-4 h-4" style={{ color: "rgba(0,0,0,0.54)" }} />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>{/* /px-6 */}
      </main>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer
        className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-2 shrink-0"
        style={{
          height: 56,
          backgroundColor: "#FFFFFF",
          boxShadow: "0px -1px 2px rgba(0,0,0,0.12), 0px -2px 8px rgba(0,0,0,0.06)",
        }}
      >
        {/* Back */}
        <button
          className="rounded-lg px-4 py-2 text-[14px] uppercase"
          style={{ border: "1px solid #00D7B9", backgroundColor: "#FFFFFF", color: "rgba(0,0,0,0.87)", letterSpacing: "0.07em" }}
        >
          Back
        </button>

        {/* Right group */}
        <div className="flex items-center gap-6">
          <button
            className="rounded-lg px-4 py-2 text-[14px] uppercase"
            style={{ border: "1px solid #00D7B9", backgroundColor: "#FFFFFF", color: "rgba(0,0,0,0.87)", letterSpacing: "0.07em" }}
          >
            Recalculate
          </button>
          <button
            className="rounded-lg px-4 py-2 text-[14px] uppercase"
            style={{ backgroundColor: "#00D7B9", color: "rgba(0,0,0,0.87)", letterSpacing: "0.07em" }}
          >
            Next
          </button>
        </div>
      </footer>

      {/* ── Entity Editor Modal ───────────────────────────────────── */}
      {editorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setEditorOpen(false)}
          />
          <div className="relative z-10 flex max-h-[92vh] w-full max-w-[1400px] mx-4 flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex h-14 shrink-0 items-center justify-between border-b px-6" style={{ borderColor: "#E0E0E0" }}>
              <h2 className="text-base font-bold">Manual entity split configuration</h2>
              <button
                onClick={() => setEditorOpen(false)}
                className="rounded-lg px-3 py-1.5 text-sm hover:bg-gray-100"
                style={{ color: "rgba(0,0,0,0.54)" }}
              >
                ✕ Close
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <EntityEditorPrototype asModal />
            </div>
            <div className="flex shrink-0 items-center justify-end gap-3 border-t px-6 py-4" style={{ borderColor: "#E0E0E0" }}>
              <button
                onClick={() => setEditorOpen(false)}
                className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
                style={{ borderColor: "#E0E0E0", color: "rgba(0,0,0,0.87)" }}
              >
                Cancel
              </button>
              <button
                onClick={() => setEditorOpen(false)}
                className="rounded-lg px-5 py-2 text-sm font-semibold"
                style={{ backgroundColor: "#00D7B9", color: "rgba(0,0,0,0.87)" }}
              >
                Confirm split
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
