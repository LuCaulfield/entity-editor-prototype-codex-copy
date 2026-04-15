import React, { useState } from "react";
import { ChevronDown, ChevronUp, ChevronRight, MoreVertical, Check, Bell } from "lucide-react";
import EntityEditorPrototype from "./EntityEditorPrototype";

// ── Stepper ──────────────────────────────────────────────────────────────────
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
        return (
          <React.Fragment key={num}>
            {i > 0 && (
              <div className="flex-1 h-px mt-[18px] shrink" style={{ backgroundColor: "rgba(0,0,0,0.24)" }} />
            )}
            <div className="flex flex-col items-center gap-2 shrink-0" style={{ minWidth: 82 }}>
              <StepCircle num={num} />
              <span
                className="text-[14px] leading-[1.571em] text-center"
                style={{ color: num > ACTIVE_STEP ? "rgba(0,0,0,0.54)" : "rgba(0,0,0,0.87)" }}
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

// ── Style card fields ─────────────────────────────────────────────────────────
const STYLE_FIELDS = [
  { label: "Style",         value: "277IY" },
  { label: "Department",    value: "ladies' garment SI" },
  { label: "Class",         value: "L_t-shirts_l_s" },
  { label: "Subclass",      value: "L_t-shirts_l_s" },
  { label: "Line",          value: "LADY" },
  { label: "Fashion level", value: "Standard" },
  { label: "Product type",  value: "RG - Regular" },
  { label: "Collection",    value: "Ski Collection" },
  { label: "Model season",  value: "AW 2024" },
  { label: "Model intake",  value: "10" },
  { label: "RFID",          value: "no RFID" },
  { label: "VPN",           value: "LADIES' BLOUSE BODY" },
  { label: "Supplier name", value: "Shanghai Office" },
  { label: "Company",       value: "LPP" },
];

// ── Country badge ─────────────────────────────────────────────────────────────
function CountryBadge({ country }: { country: string }) {
  const isEcom = country.toLowerCase().includes("ecom");
  if (isEcom) {
    return (
      <span
        className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap"
        style={{ backgroundColor: "#C8F3ED", color: "#00564A", border: "1px solid #00D7B9" }}
      >
        {country}
      </span>
    );
  }
  return <span style={{ fontSize: 14, color: "rgba(0,0,0,0.87)" }}>{country}</span>;
}

// ── Input-style cell ──────────────────────────────────────────────────────────
function InputCell({ value }: { value: string }) {
  return (
    <div className="inline-flex items-center gap-1 pb-0.5" style={{ borderBottom: "1px solid rgba(0,0,0,0.42)" }}>
      <span style={{ fontSize: 14, color: "rgba(0,0,0,0.87)" }}>{value}</span>
      <ChevronDown className="w-3.5 h-3.5 shrink-0" style={{ color: "rgba(0,0,0,0.54)" }} />
    </div>
  );
}

// ── Packing curve selector (entity sub-row) ───────────────────────────────────
function PackingCurveSelect() {
  return (
    <div className="flex flex-col gap-1 py-1">
      <div className="flex items-center justify-between pb-0.5" style={{ borderBottom: "1px solid rgba(0,0,0,0.42)" }}>
        <span style={{ fontSize: 14, color: "rgba(0,0,0,0.87)" }}>P01 (4,5,2,3) + 3,5,2,4</span>
        <ChevronDown className="w-3.5 h-3.5 shrink-0 ml-2" style={{ color: "rgba(0,0,0,0.54)" }} />
      </div>
      <div className="flex items-center justify-between pb-0.5" style={{ borderBottom: "1px solid rgba(0,0,0,0.42)" }}>
        <span style={{ fontSize: 14, color: "rgba(0,0,0,0.87)" }}>P01 (4,5,2,3) + 3,5,2,4</span>
        <ChevronDown className="w-3.5 h-3.5 shrink-0 ml-2" style={{ color: "rgba(0,0,0,0.54)" }} />
      </div>
    </div>
  );
}

// ── Checkbox icon ─────────────────────────────────────────────────────────────
function CheckboxIcon({ muted = false }: { muted?: boolean }) {
  return (
    <div
      className="w-4 h-4 rounded flex items-center justify-center mx-auto"
      style={{
        border: muted ? "1.5px solid rgba(0,0,0,0.38)" : "1.5px solid #00D7B9",
        backgroundColor: muted ? "transparent" : "#C8F3ED",
      }}
    >
      <Check strokeWidth={3} className="w-2.5 h-2.5" style={{ color: muted ? "rgba(0,0,0,0.38)" : "#00564A" }} />
    </div>
  );
}

// ── Entity data ───────────────────────────────────────────────────────────────
const ENTITIES = [
  { qty: "3 500", share: "25 %", shareAlt: "",       country: "UE" },
  { qty: "1 000", share: "7 %",  shareAlt: "",       country: "Non UE" },
  { qty: "2 500", share: "18 %", shareAlt: "(33 %)", country: "UE Ecom" },
  { qty: "3 500", share: "25 %", shareAlt: "",       country: "UE South" },
  { qty: "2 500", share: "18 %", shareAlt: "(33 %)", country: "UE Ecom South" },
  { qty: "1 000", share: "7 %",  shareAlt: "",       country: "NO-EACU" },
];

// ── Column widths (total = 1392px) ────────────────────────────────────────────
const COL_WIDTHS = [48, 48, 78, 64, 73, 130, 64, 196, 90, 78, 87, 137, 78, 74, 78, 69];
const NCOLS = COL_WIDTHS.length; // 16

// ── Shared cell styles ────────────────────────────────────────────────────────
const S = {
  th: { padding: "10px 8px", verticalAlign: "middle" as const, textAlign: "left" as const, fontSize: 14, fontWeight: 400, color: "rgba(0,0,0,0.87)" },
  td: { padding: "6px 8px", verticalAlign: "middle" as const, fontSize: 14, color: "rgba(0,0,0,0.87)" },
  tdMid: { padding: "6px 8px", verticalAlign: "middle" as const, fontSize: 14, color: "rgba(0,0,0,0.54)" },
  minQty: { padding: "6px 8px", verticalAlign: "middle" as const, fontSize: 14, color: "rgba(0,0,0,0.54)", backgroundColor: "#F2F2F2", textAlign: "right" as const },
  qty: { padding: "6px 8px", verticalAlign: "middle" as const, fontSize: 14, fontWeight: 500, color: "rgba(0,0,0,0.87)", textAlign: "right" as const },
  actions: { padding: "6px 8px", verticalAlign: "middle" as const, textAlign: "center" as const, position: "sticky" as const, right: 0, backgroundColor: "#FFFFFF", borderLeft: "1px solid #E0E0E0" },
  rowBorder: { borderBottom: "1px solid #E0E0E0" },
};

// ── Color rows data ───────────────────────────────────────────────────────────
const COLOR_ROWS = [
  { id: "00J", color: "00J", qty: "14 000", hasEntities: true },
  { id: "11M", color: "11M", qty: "14 000", hasEntities: false },
  { id: "22P", color: "22P", qty: "14 000", hasEntities: false },
];

// ── Main component ────────────────────────────────────────────────────────────
export default function QuantityScreen() {
  const [expanded00J, setExpanded00J] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);

  return (
    <div className="h-screen bg-white flex flex-col font-sans overflow-hidden">

      {/* ── Top Nav ──────────────────────────────────────────────── */}
      <header
        className="flex shrink-0 items-center justify-between px-6 z-30"
        style={{ height: 56, backgroundColor: "#00D7B9", boxShadow: "0px 1px 2px rgba(0,0,0,0.24), 0px 2px 12px rgba(0,0,0,0.08)" }}
      >
        <div className="flex items-center gap-6">
          <div className="flex items-center justify-center rounded" style={{ width: 62, height: 40, backgroundColor: "rgba(255,255,255,0.15)" }}>
            <span className="text-white font-bold text-sm tracking-widest">LPP</span>
          </div>
          <span style={{ color: "#FFFFFF", fontSize: 16, fontWeight: 600 }}>Ordering Application</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/10">
            <Bell className="w-5 h-5" style={{ color: "rgba(255,255,255,0.87)" }} />
          </button>
          <button className="flex items-center gap-2 rounded-lg px-4 py-2" style={{ backgroundColor: "rgba(0,86,74,0.35)" }}>
            <span style={{ color: "rgba(255,255,255,0.87)", fontSize: 14 }}>supplier15-uat</span>
            <svg viewBox="0 0 24 24" className="w-6 h-6" style={{ fill: "rgba(255,255,255,0.87)" }}>
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </button>
        </div>
      </header>

      {/* ── Breadcrumbs ───────────────────────────────────────────── */}
      <div className="flex shrink-0 items-center justify-between px-6" style={{ borderBottom: "1px solid #E0E0E0" }}>
        <div className="flex items-center gap-1 py-4" style={{ fontSize: 14 }}>
          <span className="cursor-pointer hover:underline" style={{ color: "rgba(0,0,0,0.54)" }}>Home</span>
          <ChevronRight className="w-4 h-4" style={{ color: "rgba(0,0,0,0.54)" }} />
          <span className="cursor-pointer hover:underline" style={{ color: "rgba(0,0,0,0.54)" }}>Orders List</span>
          <ChevronRight className="w-4 h-4" style={{ color: "rgba(0,0,0,0.54)" }} />
          <span style={{ color: "rgba(0,0,0,0.87)" }}>Edit Garment Order</span>
        </div>
        <button className="p-2 rounded hover:bg-gray-100">
          <MoreVertical className="w-5 h-5" style={{ color: "rgba(0,0,0,0.54)" }} />
        </button>
      </div>

      {/* ── Content ───────────────────────────────────────────────── */}
      <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        <div className="px-6 pt-8 pb-8 flex flex-col" style={{ gap: 24 }}>

          {/* EDIT ORDER + Stepper */}
          <div className="flex items-start gap-12">
            <div className="shrink-0 pt-1">
              <h1 style={{ fontSize: 24, fontWeight: 700, lineHeight: "36px", letterSpacing: "0.3px", color: "rgba(0,0,0,0.87)" }}>
                EDIT ORDER
              </h1>
            </div>
            <Stepper />
          </div>

          {/* Style card */}
          <div className="flex items-stretch overflow-hidden" style={{ border: "1px solid rgba(0,0,0,0.42)", borderRadius: 4, height: 71 }}>
            <div className="shrink-0 flex items-center justify-center m-1.5 rounded overflow-hidden" style={{ width: 56, height: 56, border: "2px solid #4A4A4A", backgroundColor: "#f0f0f0" }}>
              <svg viewBox="0 0 24 24" className="w-7 h-7" style={{ fill: "#ccc" }}>
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
              </svg>
            </div>
            <div className="flex items-stretch overflow-x-auto flex-1 border-l" style={{ borderColor: "rgba(0,0,0,0.12)" }}>
              {STYLE_FIELDS.map((f) => (
                <div key={f.label} className="flex flex-col justify-between shrink-0 border-r px-2 py-1.5" style={{ borderColor: "#E0E0E0", minWidth: 68 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, lineHeight: "10px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(0,0,0,0.87)" }}>{f.label}</span>
                  <span style={{ fontSize: 10, lineHeight: "10px", color: "rgba(0,0,0,0.87)" }}>{f.value}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col justify-between shrink-0 self-center mx-2 px-2 py-1 rounded" style={{ border: "1px solid rgba(0,0,0,0.42)", minWidth: 180, height: 40 }}>
              <span style={{ fontSize: 10, lineHeight: "10px", color: "#949494" }}>Order Group | Order Season | Supplier Name</span>
              <div className="flex items-center gap-1">
                <span className="flex-1 truncate" style={{ fontSize: 12, color: "rgba(0,0,0,0.87)" }}>2604348 | AW 2024 | Shanghai Office</span>
                <ChevronDown className="w-4 h-4 shrink-0" style={{ color: "rgba(0,0,0,0.54)" }} />
              </div>
            </div>
            <div className="flex items-center justify-center shrink-0 px-4" style={{ borderLeft: "1px solid rgba(0,0,0,0.42)" }}>
              <span style={{ fontSize: 10, color: "#000" }}>PREORDER</span>
            </div>
          </div>

          {/* ── Table ──────────────────────────────────────────────── */}
          <div style={{ borderRadius: 16, boxShadow: "0px 1px 2px rgba(0,0,0,0.24), 0px 2px 12px rgba(0,0,0,0.08)", overflow: "clip" }}>
            <div className="overflow-x-auto">
              <table style={{ tableLayout: "fixed", width: 1392, borderCollapse: "collapse" }}>
                <colgroup>
                  {COL_WIDTHS.map((w, i) => <col key={i} style={{ width: w }} />)}
                </colgroup>

                {/* Table Header */}
                <thead>
                  <tr style={{ backgroundColor: "#FFFFFF", borderBottom: "1px solid #E0E0E0" }}>
                    <th style={{ ...S.th, textAlign: "center" }} />
                    <th style={S.th} />
                    <th style={S.th}>Color</th>
                    <th style={S.th}>Store Group</th>
                    <th style={S.th}>Eligibility</th>
                    <th style={S.th}>Size Curve</th>
                    <th style={{ ...S.th, textAlign: "center" }}>PPack & Xdock</th>
                    <th style={S.th}>Packing Curve</th>
                    <th style={{ ...S.th, textAlign: "right" }}>Minimum Logistics Quantity</th>
                    <th style={{ ...S.th, textAlign: "right" }}>Quantity</th>
                    <th style={S.th}>Share</th>
                    <th style={S.th}>Country Group</th>
                    <th style={S.th}>SOS Type</th>
                    <th style={{ ...S.th, textAlign: "center" }}>Weeks on Stock</th>
                    <th style={S.th}>Seasonality</th>
                    <th style={{ ...S.th, textAlign: "center", position: "sticky", right: 0, backgroundColor: "#FFFFFF", borderLeft: "1px solid #E0E0E0" }}>
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {/* ── Parent / Summary row ──────────────────────── */}
                  <tr style={{ backgroundColor: "#FFFFFF", ...S.rowBorder }}>
                    <td style={{ height: 78, ...S.tdMid, textAlign: "center" }}>
                      <ChevronUp className="w-5 h-5 inline-block" style={{ color: "rgba(0,0,0,0.54)" }} />
                    </td>
                    <td style={{ height: 78 }} />
                    <td style={{ ...S.tdMid }}>–</td>
                    <td style={S.td}>N/A</td>
                    <td style={S.td}>XL-XS</td>
                    <td style={S.td}>TA_PRECAPCK_2/4</td>
                    <td style={{ ...S.td, textAlign: "center" }}><CheckboxIcon muted /></td>
                    <td style={S.tdMid}><InputCell value="~" /></td>
                    <td style={S.minQty}>30 000</td>
                    <td style={{ ...S.tdMid, textAlign: "right" }}>~</td>
                    <td style={S.tdMid}>~</td>
                    <td style={S.tdMid}>–</td>
                    <td style={S.td} />
                    <td style={{ ...S.td, textAlign: "center" }}><InputCell value="41" /></td>
                    <td style={S.td}><InputCell value="Winter" /></td>
                    <td style={{ ...S.actions, height: 78 }} />
                  </tr>

                  {/* ── Color rows (00J, 11M, 22P) ───────────────── */}
                  {COLOR_ROWS.map((row) => (
                    <React.Fragment key={row.id}>
                      {/* Color main row */}
                      <tr style={{ backgroundColor: "#FFFFFF", ...S.rowBorder }}>
                        <td style={{ height: 78, ...S.td, textAlign: "center" }}>
                          {row.hasEntities ? (
                            <button onClick={() => setExpanded00J(e => !e)} className="flex items-center justify-center w-full">
                              {expanded00J
                                ? <ChevronUp className="w-5 h-5" style={{ color: "rgba(0,0,0,0.54)" }} />
                                : <ChevronDown className="w-5 h-5" style={{ color: "rgba(0,0,0,0.54)" }} />}
                            </button>
                          ) : (
                            <ChevronDown className="w-5 h-5 inline-block" style={{ color: "rgba(0,0,0,0.54)" }} />
                          )}
                        </td>
                        <td style={{ height: 78 }} />
                        <td style={S.td}>{row.color}</td>
                        <td style={S.td}>N/A</td>
                        <td style={S.td}>XL-XS</td>
                        <td style={S.td} />
                        <td style={{ ...S.td, textAlign: "center" }} />
                        <td style={S.td}><InputCell value="~" /></td>
                        <td style={S.minQty}>9 400</td>
                        <td style={S.qty}>{row.qty}</td>
                        <td style={S.td}>100%</td>
                        <td style={S.tdMid}>–</td>
                        <td style={S.td}><InputCell value="OB3W" /></td>
                        <td style={{ ...S.td, textAlign: "center" }}><InputCell value="41" /></td>
                        <td style={S.td}><InputCell value="Winter" /></td>
                        <td style={{ ...S.actions, height: 78 }}>
                          <button className="rounded p-1.5 hover:bg-gray-100 mx-auto flex">
                            <MoreVertical className="w-4 h-4" style={{ color: "rgba(0,0,0,0.54)" }} />
                          </button>
                        </td>
                      </tr>

                      {/* Entity section — only for 00J when expanded */}
                      {row.hasEntities && expanded00J && (
                        <>
                          {/* Entity sub-rows */}
                          {ENTITIES.map((e, i) => (
                            <tr key={i} style={{ backgroundColor: "#FFFFFF", ...S.rowBorder }}>
                              {/* cols 0–6 empty */}
                              <td style={{ height: 80 }} />
                              <td style={{ height: 80 }} />
                              <td style={{ height: 80 }} />
                              <td style={{ height: 80 }} />
                              <td style={{ height: 80 }} />
                              <td style={{ height: 80 }} />
                              <td style={{ height: 80 }} />
                              {/* col 7: Packing Curve — two stacked selectors */}
                              <td style={{ height: 80, padding: "0 8px", verticalAlign: "middle" }}>
                                <PackingCurveSelect />
                              </td>
                              {/* col 8: Min Log Qty gray */}
                              <td style={{ height: 80, backgroundColor: "#F2F2F2" }} />
                              {/* col 9: Qty */}
                              <td style={{ ...S.qty, height: 80 }}>{e.qty}</td>
                              {/* col 10: Share */}
                              <td style={{ ...S.td, height: 80 }}>
                                <span>{e.share}</span>
                                {e.shareAlt && (
                                  <span className="ml-1" style={{ fontSize: 12, color: "rgba(0,0,0,0.38)" }}>{e.shareAlt}</span>
                                )}
                              </td>
                              {/* col 11: Country Group */}
                              <td style={{ ...S.td, height: 80 }}>
                                <CountryBadge country={e.country} />
                              </td>
                              {/* cols 12–14 empty */}
                              <td style={{ height: 80 }} />
                              <td style={{ height: 80 }} />
                              <td style={{ height: 80 }} />
                              {/* col 15: Actions sticky */}
                              <td style={{ ...S.actions, height: 80 }} />
                            </tr>
                          ))}
                        </>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer
        className="shrink-0 flex items-center justify-between px-6 z-20"
        style={{ height: 56, backgroundColor: "#FFFFFF", boxShadow: "0px -1px 2px rgba(0,0,0,0.12), 0px -2px 8px rgba(0,0,0,0.06)" }}
      >
        <button className="rounded-lg px-4 py-2 text-[14px] uppercase" style={{ border: "1px solid #00D7B9", backgroundColor: "#FFFFFF", color: "rgba(0,0,0,0.87)", letterSpacing: "0.07em" }}>
          Back
        </button>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 text-[14px]" style={{ color: "rgba(0,0,0,0.54)", letterSpacing: "0.07em", background: "none", border: "none" }}>
            recalculate
          </button>
          <button
            onClick={() => setEditorOpen(true)}
            className="rounded-lg px-4 py-2 text-[14px] uppercase"
            style={{ border: "1px solid #00D7B9", backgroundColor: "#FFFFFF", color: "rgba(0,0,0,0.87)", letterSpacing: "0.07em" }}
          >
            Manual
          </button>
          <button className="rounded-lg px-4 py-2 text-[14px] uppercase" style={{ backgroundColor: "#00D7B9", color: "rgba(0,0,0,0.87)", letterSpacing: "0.07em" }}>
            Next (Default)
          </button>
        </div>
      </footer>

      {/* ── Entity Editor Modal ───────────────────────────────────── */}
      {editorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditorOpen(false)} />
          <div className="relative z-10 flex max-h-[92vh] w-full max-w-[1400px] mx-4 flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex h-14 shrink-0 items-center justify-between border-b px-6" style={{ borderColor: "#E0E0E0" }}>
              <h2 className="text-base font-bold">Manual entity split configuration</h2>
              <button onClick={() => setEditorOpen(false)} className="rounded-lg px-3 py-1.5 text-sm hover:bg-gray-100" style={{ color: "rgba(0,0,0,0.54)" }}>
                ✕ Close
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <EntityEditorPrototype asModal />
            </div>
            <div className="flex shrink-0 items-center justify-end gap-3 border-t px-6 py-4" style={{ borderColor: "#E0E0E0" }}>
              <button onClick={() => setEditorOpen(false)} className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-gray-50" style={{ borderColor: "#E0E0E0", color: "rgba(0,0,0,0.87)" }}>
                Cancel
              </button>
              <button onClick={() => setEditorOpen(false)} className="rounded-lg px-5 py-2 text-sm font-semibold" style={{ backgroundColor: "#00D7B9", color: "rgba(0,0,0,0.87)" }}>
                Generate entities
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
