import React, { useState } from "react";
import StepperInput from "@/components/StepperInput";
import WeekDatePicker from "@/components/WeekDatePicker";
import { Bell, User, ChevronRight, ChevronsUpDown, AlertCircle, LayoutList, Columns2 } from "lucide-react";

// ─── Colour tokens ────────────────────────────────────────
const T = {
  teal:      "#00D7B9",
  tealLight: "#C8F3ED",
  tealDark:  "#00564A",
  gray5:     "#F2F2F2",
  gray40:    "#949494",
  gray70:    "#4A4A4A",
  border:    "#E0E0E0",
  white:     "#FFFFFF",
  text:      "rgba(0,0,0,0.87)",
  textMid:   "rgba(0,0,0,0.54)",
};

// ─── Section wrapper ──────────────────────────────────────
function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <div id={id} className="mb-16">
      <div className="mb-6 border-b-2 border-primary-50 pb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary-50">{title}</span>
      </div>
      <div className="flex flex-wrap gap-8 items-start">{children}</div>
    </div>
  );
}

function ComponentBox({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[10px] font-bold uppercase tracking-widest text-oa-gray-40">{label}</span>
      <div className="flex flex-wrap gap-3 items-center">{children}</div>
    </div>
  );
}

// ─── ATOMS ────────────────────────────────────────────────

function AtomButton({ label, variant, disabled }: { label: string; variant: "primary" | "secondary" | "outline"; disabled?: boolean }) {
  const base = "flex h-9 items-center gap-1.5 rounded px-4 text-sm font-semibold transition select-none";
  const styles = {
    primary:   "bg-primary-50 text-white hover:bg-primary-80",
    secondary: "bg-white text-oa-text border border-oa-border hover:bg-oa-gray-5",
    outline:   "bg-transparent text-primary-50 border border-primary-50 hover:bg-primary-10",
  };
  return (
    <button type="button" disabled={disabled} className={`${base} ${styles[variant]} ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}>
      {label}
    </button>
  );
}

function AtomInput({ placeholder, state }: { placeholder: string; state: "default" | "focus" | "error" | "disabled" }) {
  const borders = {
    default:  "border-oa-border focus:border-primary-50 focus:ring-2 focus:ring-primary-10",
    focus:    "border-primary-50 ring-2 ring-primary-10",
    error:    "border-rose-400 ring-2 ring-rose-100",
    disabled: "border-oa-border bg-oa-gray-5 text-oa-gray-40 cursor-not-allowed",
  };
  return (
    <input
      type="text"
      placeholder={placeholder}
      disabled={state === "disabled"}
      className={`h-9 w-48 rounded border bg-white px-3 text-sm text-oa-text outline-none transition ${borders[state]}`}
    />
  );
}

function AtomChip({ label, selected, variant }: { label: string; selected: boolean; variant: "country" | "color" }) {
  if (variant === "country") {
    return (
      <button type="button" className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${selected ? "border-primary-50 bg-primary-10 text-primary-80" : "border-oa-border bg-white text-oa-gray-70 hover:border-primary-50"}`}>
        {label}
      </button>
    );
  }
  return (
    <button type="button" className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${selected ? "border-oa-gray-70 bg-oa-gray-70 text-white" : "border-oa-border bg-white text-oa-gray-70 hover:border-oa-gray-70"}`}>
      {label}
    </button>
  );
}

function AtomBadge({ label }: { label: string }) {
  return (
    <span className="rounded bg-primary-10 px-1.5 py-0.5 text-xs font-bold text-primary-80">{label}</span>
  );
}

function AtomStepBubble({ num, state }: { num: number; state: "done" | "active" | "pending" }) {
  const base = "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold";
  const styles = {
    done:    `${base} bg-primary-50 text-white`,
    active:  `${base} bg-primary-50 text-white ring-2 ring-primary-50 ring-offset-2`,
    pending: `${base} border-2 border-oa-border bg-white text-oa-gray-40`,
  };
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={styles[state]}>{state === "done" ? "✓" : num}</div>
      <span className={`text-[10px] font-semibold whitespace-nowrap ${state === "active" ? "text-primary-50" : state === "done" ? "text-primary-80" : "text-oa-gray-40"}`}>
        {state}
      </span>
    </div>
  );
}

function AtomToggleBtn({ label, active }: { label: string; active: boolean }) {
  return (
    <button type="button" className={`h-7 rounded px-3 text-xs font-semibold transition ${active ? "bg-primary-50 text-white" : "text-oa-gray-40 hover:text-oa-gray-70"}`}>
      {label}
    </button>
  );
}

function AtomIconBtn() {
  return (
    <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full text-oa-gray-40 border border-oa-border hover:bg-oa-gray-5 transition">
      <Bell className="h-5 w-5" />
    </button>
  );
}

function AtomProfilePill() {
  return (
    <button type="button" className="flex h-9 items-center gap-2 rounded-full bg-primary-50/20 px-3 text-sm font-semibold text-primary-80 hover:bg-primary-10 transition">
      <User className="h-4 w-4" />
      <span>Lukasz O.</span>
    </button>
  );
}

function AtomDivider() {
  return <div className="h-10 w-px bg-oa-border" />;
}

// ─── MOLECULES ────────────────────────────────────────────

function MolToggleGroup({ opt1, opt2, activeDefault }: { opt1: string; opt2: string; activeDefault: string }) {
  const [active, setActive] = useState(activeDefault);
  return (
    <div className="flex h-8 items-center rounded border border-oa-border bg-white p-0.5 text-xs shadow-sm">
      {[opt1, opt2].map(o => (
        <button key={o} type="button" onClick={() => setActive(o)}
          className={`h-full rounded px-3 font-semibold transition ${active === o ? "bg-primary-50 text-white" : "text-oa-gray-40 hover:text-oa-gray-70"}`}>
          {o}
        </button>
      ))}
    </div>
  );
}

function MolFormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-bold uppercase tracking-wide text-oa-gray-40">{label}</span>
      {children}
    </div>
  );
}

function MolWarningBanner({ type }: { type: "warning" | "error" }) {
  const styles = {
    warning: "border-amber-200 bg-amber-50 text-amber-700",
    error:   "border-rose-200 bg-rose-50 text-rose-700",
  };
  return (
    <div className={`flex items-center gap-2 rounded border px-3 py-2 text-sm ${styles[type]}`}>
      <span className="shrink-0">{type === "error" ? "✕" : "⚠"}</span>
      <span>{type === "error" ? "Error: Min quantity ≥ total quantity" : "Warning: No entity has UE country group"}</span>
    </div>
  );
}

function MolBreadcrumb() {
  return (
    <nav className="flex items-center gap-1 text-sm text-oa-gray-40">
      {["Home", "Ordering", "Products", "Configure"].map((c, i) => (
        <React.Fragment key={c}>
          {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
          <button type="button" className="hover:text-oa-text transition">{c}</button>
        </React.Fragment>
      ))}
      <ChevronRight className="h-3.5 w-3.5 shrink-0" />
      <span className="font-semibold text-oa-text">Entity Split</span>
    </nav>
  );
}

function MolStepBar() {
  const steps = ["Select Model", "Store Groups", "Eligibility", "Size Curve", "Entity Split", "Review"];
  return (
    <div className="flex items-center gap-0">
      {steps.map((step, i) => {
        const done = i < 4, active = i === 4;
        return (
          <React.Fragment key={step}>
            {i > 0 && <div className={`h-px w-10 ${done ? "bg-primary-50" : "bg-oa-border"}`} />}
            <div className="flex flex-col items-center gap-1">
              <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${active ? "bg-primary-50 text-white ring-2 ring-primary-50 ring-offset-1" : done ? "bg-primary-50 text-white" : "border-2 border-oa-border bg-white text-oa-gray-40"}`}>
                {done ? "✓" : i + 1}
              </div>
              <span className={`text-[9px] font-semibold whitespace-nowrap ${active ? "text-primary-50" : done ? "text-primary-80" : "text-oa-gray-40"}`}>{step}</span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

function MolDataCell({ label, value, sub, subColor }: { label: string; value: string; sub: string; subColor?: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-r border-oa-border px-5 py-3 last:border-r-0">
      <span className="text-[10px] font-bold uppercase tracking-wide text-oa-gray-40">{label}</span>
      <span className="text-sm font-bold text-oa-text">{value}</span>
      <span className={`text-xs ${subColor ?? "text-oa-gray-40"}`}>{sub}</span>
    </div>
  );
}

// ─── ORGANISMS ────────────────────────────────────────────

function OrgTopPanel() {
  return (
    <div className="flex h-14 w-full items-center gap-4 bg-primary-50 px-6 shadow-oa">
      <div className="flex h-10 w-[62px] shrink-0 items-center justify-center rounded bg-white/20">
        <span className="text-sm font-black tracking-tight text-white">nOA</span>
      </div>
      <span className="flex-1 text-base font-bold text-white">Ordering Application</span>
      <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-white/20 transition">
        <Bell className="h-5 w-5" />
      </button>
      <button type="button" className="flex h-9 items-center gap-2 rounded-full bg-white/20 px-3 text-sm font-bold text-white hover:bg-white/30 transition">
        <User className="h-4 w-4" />Lukasz O.
      </button>
    </div>
  );
}

function OrgBreadcrumbsBar() {
  return (
    <div className="flex h-[54px] w-full items-center justify-between border-b border-oa-border px-6">
      <MolBreadcrumb />
      <button type="button" className="flex h-8 w-[52px] items-center justify-center rounded border border-oa-border bg-white hover:bg-oa-gray-5 transition">
        <ChevronsUpDown className="h-4 w-4 text-oa-gray-40" />
      </button>
    </div>
  );
}

function OrgDataSummaryRow() {
  return (
    <div className="flex w-full divide-x divide-oa-border rounded border border-oa-border bg-white">
      <MolDataCell label="Article / Model" value="SKU-2024-FLOW-BLK" sub="Flow Running Shoe · Black" />
      <MolDataCell label="Total ordered qty" value="39,000 pcs" sub="Fully allocated" subColor="text-primary-50 font-medium" />
      <MolDataCell label="Planned delivery" value="W41 · 3 entities" sub="Retail 62% · E-com 38%" />
    </div>
  );
}

function OrgParametersBar() {
  const [week] = useState(41);
  return (
    <div className="flex w-full flex-wrap items-end gap-3 rounded border border-oa-border bg-white px-5 py-3">
      <MolFormField label="Total quantity">
        <input type="number" value={39000} readOnly className="h-9 w-32 rounded border border-oa-border bg-oa-gray-5 px-3 text-center text-sm text-oa-gray-40" />
      </MolFormField>
      <MolFormField label="Entities">
        <StepperInput value={3} onChange={() => {}} min={1} />
      </MolFormField>
      <div className="h-10 w-px bg-oa-border" />
      <MolFormField label="Delivery dates">
        <MolToggleGroup opt1="Default" opt2="Individual" activeDefault="Default" />
      </MolFormField>
      <MolFormField label="First planned delivery">
        <WeekDatePicker week={week} onChange={() => {}} />
      </MolFormField>
      <MolFormField label="Weeks between">
        <StepperInput value={2} onChange={() => {}} min={1} />
      </MolFormField>
      <div className="h-10 w-px bg-oa-border" />
      <button type="button" className="h-9 rounded bg-primary-50 px-4 text-sm font-bold text-white hover:bg-primary-80 transition">
        Generate entities
      </button>
    </div>
  );
}

function OrgEntityCard() {
  return (
    <div className="w-full rounded-xl border border-oa-border bg-white p-4 shadow-oa">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-bold text-white">A</div>
          <div className="text-sm font-bold text-oa-text">Entity 1</div>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <MolFormField label="Planned delivery date">
            <WeekDatePicker week={41} onChange={() => {}} />
          </MolFormField>
          <MolFormField label="Port">
            <select className="h-9 w-36 rounded border border-oa-border bg-white px-3 text-sm text-oa-text">
              <option>Shanghai</option>
            </select>
          </MolFormField>
          <MolFormField label="Pack type">
            <select className="h-9 w-36 rounded border border-oa-border bg-white px-3 text-sm text-oa-text">
              <option>Retail Pack</option>
            </select>
          </MolFormField>
          <MolFormField label="Min quantity">
            <StepperInput value={9000} onChange={() => {}} min={0} step={100} />
          </MolFormField>
        </div>
      </div>
      {/* Country groups */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {["UE", "UE Ecom", "UE South", "ME", "US"].map((g, i) => (
          <AtomChip key={g} label={g} selected={i === 0} variant="country" />
        ))}
      </div>
      {/* Colors */}
      <div className="flex flex-wrap gap-1.5">
        {["00J", "001", "100", "200", "300"].map((c, i) => (
          <AtomChip key={c} label={c} selected={i === 0} variant="color" />
        ))}
      </div>
    </div>
  );
}

function OrgBottomPanel() {
  return (
    <div className="flex h-[54px] w-full items-center justify-between border-t border-oa-border bg-white px-6">
      <button type="button" className="flex h-9 items-center gap-1.5 rounded border border-oa-border bg-white px-4 text-sm font-medium text-oa-text hover:bg-oa-gray-5 transition">
        Cancel
      </button>
      <div className="flex items-center gap-2">
        <button type="button" className="flex h-9 items-center gap-1.5 rounded border border-oa-border bg-white px-4 text-sm font-medium text-oa-text hover:bg-oa-gray-5 transition">
          Back
        </button>
        <button type="button" className="flex h-9 items-center gap-1.5 rounded bg-primary-50 px-5 text-sm font-bold text-white hover:bg-primary-80 transition">
          Next
        </button>
      </div>
    </div>
  );
}

// ─── Main showcase ────────────────────────────────────────

export default function ComponentShowcase() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] p-10 font-sans text-oa-text">
      <div className="mb-12">
        <h1 className="text-3xl font-black text-oa-text">nOA Design System</h1>
        <p className="mt-1 text-sm text-oa-gray-40">Component library — Atomic Design · Entity Editor Prototype</p>
      </div>

      {/* ── ATOMS ─────────────────────────────────── */}
      <div id="atoms">
        <Section id="atoms-buttons" title="Atoms / Buttons">
          <ComponentBox label="Primary">
            <AtomButton label="Generate entities" variant="primary" />
            <AtomButton label="Next" variant="primary" />
            <AtomButton label="Disabled" variant="primary" disabled />
          </ComponentBox>
          <ComponentBox label="Secondary">
            <AtomButton label="Cancel" variant="secondary" />
            <AtomButton label="Back" variant="secondary" />
            <AtomButton label="Disabled" variant="secondary" disabled />
          </ComponentBox>
          <ComponentBox label="Outline">
            <AtomButton label="Load BI" variant="outline" />
          </ComponentBox>
        </Section>

        <Section id="atoms-inputs" title="Atoms / Inputs">
          <ComponentBox label="Default">
            <AtomInput placeholder="Value" state="default" />
          </ComponentBox>
          <ComponentBox label="Focus">
            <AtomInput placeholder="Value" state="focus" />
          </ComponentBox>
          <ComponentBox label="Error">
            <AtomInput placeholder="Value" state="error" />
          </ComponentBox>
          <ComponentBox label="Disabled">
            <AtomInput placeholder="Value" state="disabled" />
          </ComponentBox>
        </Section>

        <Section id="atoms-stepper" title="Atoms / Stepper Input">
          <ComponentBox label="Default">
            <StepperInput value={3} onChange={() => {}} min={1} />
          </ComponentBox>
          <ComponentBox label="Large step">
            <StepperInput value={9000} onChange={() => {}} min={0} step={100} />
          </ComponentBox>
        </Section>

        <Section id="atoms-weekpicker" title="Atoms / Week Date Picker">
          <ComponentBox label="Default">
            <WeekDatePicker week={41} onChange={() => {}} />
          </ComponentBox>
        </Section>

        <Section id="atoms-chips" title="Atoms / Chips">
          <ComponentBox label="Country Group — Default">
            {["UE", "UE Ecom", "ME"].map(g => <AtomChip key={g} label={g} selected={false} variant="country" />)}
          </ComponentBox>
          <ComponentBox label="Country Group — Selected">
            {["UE", "UE South"].map(g => <AtomChip key={g} label={g} selected={true} variant="country" />)}
          </ComponentBox>
          <ComponentBox label="Color — Default">
            {["00J", "001", "100"].map(c => <AtomChip key={c} label={c} selected={false} variant="color" />)}
          </ComponentBox>
          <ComponentBox label="Color — Selected">
            {["00J"].map(c => <AtomChip key={c} label={c} selected={true} variant="color" />)}
          </ComponentBox>
        </Section>

        <Section id="atoms-misc" title="Atoms / Misc">
          <ComponentBox label="Week Badge">
            <AtomBadge label="W41" />
            <AtomBadge label="W43" />
          </ComponentBox>
          <ComponentBox label="Step Bubble">
            <AtomStepBubble num={1} state="done" />
            <AtomStepBubble num={2} state="active" />
            <AtomStepBubble num={3} state="pending" />
          </ComponentBox>
          <ComponentBox label="Toggle Button">
            <AtomToggleBtn label="Default" active={true} />
            <AtomToggleBtn label="Individual" active={false} />
          </ComponentBox>
          <ComponentBox label="Icon Button">
            <AtomIconBtn />
          </ComponentBox>
          <ComponentBox label="Profile Pill">
            <AtomProfilePill />
          </ComponentBox>
          <ComponentBox label="Divider">
            <AtomDivider />
          </ComponentBox>
        </Section>
      </div>

      {/* ── MOLECULES ────────────────────────────── */}
      <div id="molecules">
        <Section id="mol-toggle" title="Molecules / Toggle Group">
          <ComponentBox label="Delivery dates">
            <MolToggleGroup opt1="Default" opt2="Individual" activeDefault="Default" />
          </ComponentBox>
          <ComponentBox label="Assignment mode">
            <MolToggleGroup opt1="Sets" opt2="Matrix" activeDefault="Sets" />
          </ComponentBox>
        </Section>

        <Section id="mol-form" title="Molecules / Form Field">
          <MolFormField label="Total quantity">
            <input type="number" value={39000} readOnly className="h-9 w-32 rounded border border-oa-border bg-oa-gray-5 px-3 text-center text-sm text-oa-gray-40" />
          </MolFormField>
          <MolFormField label="Entities">
            <StepperInput value={3} onChange={() => {}} min={1} />
          </MolFormField>
          <MolFormField label="Planned delivery">
            <WeekDatePicker week={41} onChange={() => {}} />
          </MolFormField>
        </Section>

        <Section id="mol-warnings" title="Molecules / Warning Banner">
          <div className="flex flex-col gap-2 w-full max-w-lg">
            <MolWarningBanner type="warning" />
            <MolWarningBanner type="error" />
          </div>
        </Section>

        <Section id="mol-breadcrumb" title="Molecules / Breadcrumb">
          <MolBreadcrumb />
        </Section>

        <Section id="mol-stepper" title="Molecules / Workflow Stepper">
          <MolStepBar />
        </Section>

        <Section id="mol-datacell" title="Molecules / Data Cell">
          <div className="flex divide-x divide-oa-border rounded border border-oa-border bg-white">
            <MolDataCell label="Article / Model" value="SKU-2024-FLOW-BLK" sub="Flow Running Shoe · Black" />
            <MolDataCell label="Total ordered qty" value="39,000 pcs" sub="Fully allocated" subColor="text-primary-50 font-medium" />
            <MolDataCell label="Planned delivery" value="W41 · 3 entities" sub="Retail 62% · E-com 38%" />
          </div>
        </Section>
      </div>

      {/* ── ORGANISMS ────────────────────────────── */}
      <div id="organisms">
        <Section id="org-toppanel" title="Organisms / Top Panel">
          <div className="w-full overflow-hidden rounded border border-oa-border">
            <OrgTopPanel />
          </div>
        </Section>

        <Section id="org-breadcrumbs" title="Organisms / Breadcrumbs Bar">
          <div className="w-full overflow-hidden rounded border border-oa-border bg-white">
            <OrgBreadcrumbsBar />
          </div>
        </Section>

        <Section id="org-datasummary" title="Organisms / Data Summary Row">
          <div className="w-full">
            <OrgDataSummaryRow />
          </div>
        </Section>

        <Section id="org-params" title="Organisms / Parameters Bar">
          <div className="w-full">
            <OrgParametersBar />
          </div>
        </Section>

        <Section id="org-entitycard" title="Organisms / Entity Assignment Card">
          <div className="w-full max-w-3xl">
            <OrgEntityCard />
          </div>
        </Section>

        <Section id="org-bottompanel" title="Organisms / Bottom Panel">
          <div className="w-full overflow-hidden rounded border border-oa-border">
            <OrgBottomPanel />
          </div>
        </Section>
      </div>
    </div>
  );
}
