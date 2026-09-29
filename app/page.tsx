"use client";
import { useState } from "react";
import { assess, crisis, discharge, type Inputs, type Crisis, type Section } from "@/lib/engine";

const I0: Inputs = { setting: "ward", dm: "t2", wt: 70, glucose: 220, confirmed180: false, a1c: "", a1cRecent: false, nutrition: "oral", relaxed: false, cardiacSurgery: false, homeInsulin: "", steroid: "none", sglt2: false, ertugliflozin: false, glp1: false, hf: false, pumpCgm: false, surgery: "none", ckd: false, hypoHistory: false };
const C0: Crisis = { ph: 7.1, hco3: 10, bhb: 5, glucose: 450, osm: 300, wt: 70, k: 4.5, severity: "moderate", hypovolemia: "mild" };
const tone = { info: "border-line", act: "border-teal", warn: "border-warn", stop: "border-stop" } as const;
const tag = { info: "Note", act: "Action", warn: "Caution", stop: "Critical" } as const;

function Out({ s }: { s: Section[] }) {
  return <div className="space-y-6">{s.map(x => <section key={x.title}><h2 className="text-xl mb-2">{x.title}</h2><ul className="space-y-2">
    {x.items.map((it, k) => <li key={k} className={`border-l-4 ${tone[it.lvl]} bg-white pl-3 pr-3 py-2`}>
      <p className="text-[15px] leading-relaxed"><b className={it.lvl === "stop" ? "text-stop" : it.lvl === "warn" ? "text-warn" : it.lvl === "act" ? "text-teal" : ""}>{tag[it.lvl]}: </b>{it.t}</p>
      <p className="text-xs text-ink/60">ADA 2026 §16 · {it.ref}</p></li>)}</ul></section>)}</div>;
}
const F = ({ l, children }: { l: string; children: React.ReactNode }) => <label className="block text-sm font-semibold">{l}<div className="mt-1 font-normal">{children}</div></label>;
const inp = "w-full border border-line bg-white px-2 py-1.5 rounded";
const Chk = ({ l, v, on }: { l: string; v: boolean; on: (b: boolean) => void }) => <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={v} onChange={e => on(e.target.checked)} />{l}</label>;

export default function Page() {
  const [tab, setTab] = useState<"a" | "c" | "d">("a");
  const [i, setI] = useState<Inputs>(I0); const [c, setC] = useState<Crisis>(C0);
  const [run, setRun] = useState(false); const [done, setDone] = useState<boolean[]>(discharge.map(() => false));
  const u = <K extends keyof Inputs>(k: K, v: Inputs[K]) => { setI({ ...i, [k]: v }); setRun(false); };
  const n = (s: string) => (s === "" ? NaN : Number(s));
  const tabs = [["a", "Assessment and plan"], ["c", "DKA / HHS"], ["d", "Discharge"]] as const;
  return (<main className="max-w-3xl mx-auto px-4 py-6">
    <header className="mb-4"><h1 className="text-3xl">Inpatient Diabetes Care</h1>
      <p className="text-sm text-ink/70 mt-1">Workflow built from ADA Standards of Care in Diabetes—2026, Section 16: Diabetes Care in the Hospital (Diabetes Care 2026;49 Suppl 1:S339–S355). Decision support for clinicians; it does not replace clinical judgment or local protocols. Doses are starting points.</p></header>
    <nav className="flex gap-1 border-b border-line mb-5" role="tablist">{tabs.map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`px-3 py-2 text-sm font-semibold ${tab === k ? "border-b-2 border-teal text-teal" : "text-ink/70"}`}>{l}</button>)}</nav>
    {tab === "a" && <div className="space-y-5">
      <div className="grid sm:grid-cols-3 gap-3">
        <F l="Care setting"><select className={inp} value={i.setting} onChange={e => u("setting", e.target.value as Inputs["setting"])}><option value="ward">Non-ICU</option><option value="icu">ICU</option></select></F>
        <F l="Diabetes type"><select className={inp} value={i.dm} onChange={e => u("dm", e.target.value as Inputs["dm"])}><option value="t1">Type 1</option><option value="t2">Type 2</option><option value="other">Other (gestational, pancreatogenic, drug, nutrition)</option><option value="unknown">No known diabetes / stress hyperglycemia</option></select></F>
        <F l="Nutrition"><select className={inp} value={i.nutrition} onChange={e => u("nutrition", e.target.value as Inputs["nutrition"])}><option value="oral">Eating</option><option value="npo">NPO / poor intake</option><option value="enteralCont">Continuous enteral</option><option value="enteralBolus">Bolus enteral</option><option value="enteralNight">Nocturnal enteral</option><option value="tpn">Parenteral (TPN)</option></select></F>
        <F l="Weight (kg)"><input className={inp} type="number" value={i.wt} onChange={e => u("wt", n(e.target.value))} /></F>
        <F l="Current glucose (mg/dL)"><input className={inp} type="number" value={i.glucose} onChange={e => u("glucose", n(e.target.value))} /></F>
        <F l="A1C % (optional)"><input className={inp} type="number" step="0.1" value={i.a1c} onChange={e => u("a1c", e.target.value === "" ? "" : Number(e.target.value))} /></F>
        <F l="Home insulin total daily dose (units, optional)"><input className={inp} type="number" value={i.homeInsulin} onChange={e => u("homeInsulin", e.target.value === "" ? "" : Number(e.target.value))} /></F>
        <F l="Glucocorticoid"><select className={inp} value={i.steroid} onChange={e => u("steroid", e.target.value as Inputs["steroid"])}><option value="none">None</option><option value="intermediate">Prednisone/prednisolone daily</option><option value="long">Dexamethasone / multidose</option></select></F>
        <F l="Surgery"><select className={inp} value={i.surgery} onChange={e => u("surgery", e.target.value as Inputs["surgery"])}><option value="none">None</option><option value="elective">Elective</option><option value="emergency">Emergency</option></select></F>
      </div>
      <div className="grid sm:grid-cols-2 gap-2">
        <Chk l="A1C available from prior 3 months" v={i.a1cRecent} on={v => u("a1cRecent", v)} />
        <Chk l="Glucose ≥180 confirmed twice within 24 h" v={i.confirmed180} on={v => u("confirmed180", v)} />
        <Chk l="Terminal illness, dialysis/advanced kidney failure or labile glucose" v={i.relaxed} on={v => u("relaxed", v)} />
        <Chk l="Kidney failure" v={i.ckd} on={v => u("ckd", v)} />
        <Chk l="Prior hypoglycemia / high hypoglycemia risk" v={i.hypoHistory} on={v => u("hypoHistory", v)} />
        <Chk l="ICU cardiac surgery patient" v={i.cardiacSurgery} on={v => u("cardiacSurgery", v)} />
        <Chk l="On SGLT2 inhibitor" v={i.sglt2} on={v => u("sglt2", v)} />
        <Chk l="…ertugliflozin" v={i.ertugliflozin} on={v => u("ertugliflozin", v)} />
        <Chk l="Heart failure" v={i.hf} on={v => u("hf", v)} />
        <Chk l="On GLP-1 RA / GIP-GLP-1 RA" v={i.glp1} on={v => u("glp1", v)} />
        <Chk l="Uses insulin pump / AID / personal CGM" v={i.pumpCgm} on={v => u("pumpCgm", v)} />
      </div>
      <button onClick={() => setRun(true)} className="bg-teal text-white px-4 py-2 rounded font-semibold">Generate plan</button>
      {run && (Number.isFinite(i.glucose) ? <Out s={assess(i)} /> : <p className="text-stop text-sm">Enter the current glucose to generate a plan.</p>)}
    </div>}
    {tab === "c" && <div className="space-y-5">
      <p className="text-sm">Enter values at presentation. Criteria and treatment follow Table 16.1 and Figure 16.1.</p>
      <div className="grid sm:grid-cols-3 gap-3">
        {([["Glucose (mg/dL)", "glucose"], ["Venous pH", "ph"], ["Bicarbonate (mmol/L)", "hco3"], ["β-hydroxybutyrate (mmol/L)", "bhb"], ["Effective osmolality (mOsm/kg)", "osm"], ["Serum K+ (mmol/L)", "k"], ["Weight (kg)", "wt"]] as const).map(([l, k]) => <F key={k} l={l}><input className={inp} type="number" step="0.1" value={c[k]} onChange={e => setC({ ...c, [k]: n(e.target.value) })} /></F>)}
        <F l="DKA severity"><select className={inp} value={c.severity} onChange={e => setC({ ...c, severity: e.target.value as Crisis["severity"] })}><option value="mild">Mild</option><option value="moderate">Moderate</option><option value="severe">Severe</option></select></F>
        <F l="Volume status"><select className={inp} value={c.hypovolemia} onChange={e => setC({ ...c, hypovolemia: e.target.value as Crisis["hypovolemia"] })}><option value="mild">Mild hypovolemia</option><option value="severe">Severe hypovolemia</option><option value="cardiac">Cardiac compromise</option></select></F>
      </div>
      <Out s={crisis(c)} />
    </div>}
    {tab === "d" && <div><h2 className="text-xl mb-2">Discharge checklist</h2><p className="text-xs text-ink/60 mb-3">Start at admission. ADA 2026 §16: Transition From the Hospital, Recs 16.17–16.18.</p>
      <ul className="space-y-2">{discharge.map((d, k) => <li key={k} className="bg-white border-l-4 border-line pl-3 py-2"><label className="flex gap-2 text-[15px]"><input type="checkbox" checked={done[k]} onChange={e => setDone(done.map((x, j) => j === k ? e.target.checked : x))} className="mt-1" />{d}</label></li>)}</ul>
      <p className="text-sm mt-3">{done.filter(Boolean).length} of {discharge.length} complete</p></div>}
    <footer className="mt-10 text-xs text-ink/60 border-t border-line pt-3">Source: American Diabetes Association Professional Practice Committee. Diabetes Care in the Hospital: Standards of Care in Diabetes—2026. Diabetes Care 2026;49(Suppl 1):S339–S355. No patient data is stored or transmitted; all calculations run in the browser.</footer>
  </main>);
}
