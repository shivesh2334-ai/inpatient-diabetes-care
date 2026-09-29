// Source: ADA Standards of Care in Diabetes—2026, Section 16 (Diabetes Care 2026;49 Suppl 1:S339–S355).
export type Inputs = {
  setting: "icu" | "ward"; dm: "t1" | "t2" | "other" | "unknown"; wt: number; glucose: number; confirmed180: boolean;
  a1c: number | ""; a1cRecent: boolean; nutrition: "oral" | "npo" | "enteralCont" | "enteralBolus" | "enteralNight" | "tpn";
  relaxed: boolean; cardiacSurgery: boolean; homeInsulin: number | ""; steroid: "none" | "intermediate" | "long";
  sglt2: boolean; ertugliflozin: boolean; glp1: boolean; hf: boolean; pumpCgm: boolean;
  surgery: "none" | "elective" | "emergency"; ckd: boolean; hypoHistory: boolean;
};
export type Item = { lvl: "info" | "act" | "warn" | "stop"; t: string; ref: string };
export type Section = { title: string; items: Item[] };
const r = (n: number) => Math.round(n * 10) / 10;

export function assess(i: Inputs): Section[] {
  const S: Section[] = []; const icu = i.setting === "icu"; let n = 1;
  const a: Item[] = [];
  if (i.dm === "unknown" && i.glucose > 140) a.push({ lvl: "act", t: "Glucose >140 mg/dL without known diabetes: treat as hyperglycemia and classify the type (T1, T2, stress, drug-related, pancreatogenic, nutrition-related).", ref: "Considerations on Admission" });
  if (!i.a1cRecent && (i.dm !== "unknown" || i.glucose > 140)) a.push({ lvl: "act", t: "Order A1C now (no result in prior 3 months).", ref: "Rec 16.1 (B)" });
  if (i.a1c !== "" && i.a1c >= 6.5 && i.dm === "unknown") a.push({ lvl: "warn", t: "A1C ≥6.5% suggests diabetes predated admission.", ref: "Standard Definitions" });
  if (i.a1c !== "" && i.a1c > 9) a.push({ lvl: "warn", t: "A1C >9%: high readmission risk. Monitor insulin adjustments and use a transitional care model.", ref: "Preventing Readmissions" });
  if (i.glucose < 54) a.push({ lvl: "stop", t: "Level 2 hypoglycemia (<54 mg/dL): immediate correction.", ref: "Definitions" });
  else if (i.glucose < 70) a.push({ lvl: "warn", t: "Level 1 hypoglycemia (54–69 mg/dL): treat promptly to prevent progression.", ref: "Definitions" });
  a.push({ lvl: "info", t: "Assess self-management knowledge and begin education early. Consult a diabetes/glucose management team if available.", ref: "Rec 16.3 (B)" });
  S.push({ title: `${n++}. Admission assessment`, items: a });
  const t: Item[] = [];
  const tgt = icu ? (i.cardiacSurgery ? "110–140 mg/dL (selected cardiac surgery ICU patients, only if achievable without significant hypoglycemia)" : "140–180 mg/dL") : "100–180 mg/dL";
  t.push({ lvl: "info", t: `Start insulin${icu ? "" : " and/or other glucose-lowering therapy"} for persistent glucose ≥180 mg/dL, confirmed twice within 24 h. ${i.glucose >= 180 ? (i.confirmed180 ? "Threshold met." : "Current reading ≥180: repeat to confirm.") : "Current reading is below the threshold."}`, ref: icu ? "Rec 16.4a (A)" : "Rec 16.4b (B)" });
  t.push({ lvl: "info", t: `Glycemic goal once treated: ${tgt}.`, ref: icu ? "Rec 16.5a (A)" : "Rec 16.5b (B)" });
  if (i.relaxed) t.push({ lvl: "info", t: "Higher levels (up to 250 mg/dL) may be acceptable: terminal illness, advanced kidney failure/dialysis, high hypoglycemia risk, labile glucose.", ref: "Glycemic Goals" });
  t.push({ lvl: "warn", t: "Fasting glucose <100 mg/dL predicts hypoglycemia within 24 h: adjust the basal dose.", ref: "Glycemic Goals" });
  S.push({ title: `${n++}. Glycemic targets`, items: t });
  const m: Item[] = [];
  m.push({ lvl: "act", t: icu ? "IV insulin: POC glucose every 30 min–2 h." : i.nutrition === "oral" ? "Eating: POC glucose before meals." : "Not eating: POC glucose every 4–6 h.", ref: "Glucose Monitoring" });
  m.push({ lvl: "info", t: "Use FDA-approved, hospital-calibrated POC meters. Repeat any result that does not fit the clinical picture; send a lab sample if the repeat is similar. Beware perfusion abnormality, edema, anemia/erythrocytosis.", ref: "Glucose Monitoring" });
  if (i.pumpCgm) m.push({ lvl: "act", t: "Personal CGM/pump: continue if clinically appropriate, with confirmatory POC for insulin dosing. CGM is valid if within ±20% of POC (±20 mg/dL if ≤70). Cross-check at least daily and document data daily. Requires trained staff and an institutional protocol; consult the diabetes team if admission may be device-related.", ref: "Rec 16.6 (B), 16.7 (C)" });
  S.push({ title: `${n++}. Monitoring`, items: m });
  const x: Item[] = []; const w = i.wt || 0;
  if (icu) x.push({ lvl: "act", t: "Continuous IV insulin infusion by validated written/computerized protocol. If eating, give SC rapid-acting prandial insulin to avoid big infusion swings. Give SC basal 2 h before stopping the infusion; ~0.15–0.3 units/kg basal analog may be added early to limit rebound.", ref: "Rec 16.8a (A)" });
  else if (i.nutrition === "oral") x.push({ lvl: "act", t: "Basal + prandial + correction insulin. Avoid correction-only (sliding scale).", ref: "Rec 16.9 (A), 16.10 (A)" });
  else x.push({ lvl: "act", t: "Basal, or basal + correction, insulin (poor/no oral intake). Avoid correction-only.", ref: "Rec 16.8b (A)" });
  if (i.dm === "t1") x.push({ lvl: "stop", t: "Type 1: never correction-only. Basal insulin (SC, pump or infusion) must not be held, even when NPO or during transitions.", ref: "Type 1 Diabetes" });
  if (w > 0 && !icu) {
    x.push({ lvl: "info", t: `Weight-based total daily dose 0.3–0.6 units/kg/day = ${r(w * 0.3)}–${r(w * 0.6)} units/day, or ~80% of home dose${i.homeInsulin !== "" ? ` (${r(Number(i.homeInsulin) * 0.8)} units)` : ""}. Half basal, half nutritional. Correction scale: low <40, medium 40–80, high >80 units/day; start at 140–150 mg/dL.`, ref: "Noncritical Care Setting" });
    if (i.ckd || i.hypoHistory) x.push({ lvl: "warn", t: "Kidney failure or hypoglycemia risk: favor the lower end of the range and reassess daily.", ref: "Inpatient Hypoglycemia" });
  }
  if (!icu) x.push({ lvl: "info", t: "Prefer analogs; avoid premixed insulin (70/30 etc.). Use pens with single-patient safeguards. Restarting home insulin should consider adherence, nutrition and kidney function. Correction-only is acceptable only for mild T2 hyperglycemia staying <180 mg/dL.", ref: "Noncritical Care Setting" });
  if (i.nutrition === "enteralCont") x.push({ lvl: "act", t: "Continuous enteral feeds: keep basal; nutritional insulin 1 unit per 10–15 g carbohydrate (regular q6h, rapid-acting q4h or NPH q8–12h). Correction q6h regular or q4h rapid-acting. If feeds stop, give IV dextrose for the duration of insulin action.", ref: "Enteral and Parenteral Feedings" });
  if (i.nutrition === "enteralBolus") x.push({ lvl: "act", t: "Bolus feeds: ~1 unit rapid-acting per 10–15 g carbohydrate before each feed, plus correction.", ref: "Enteral Feedings" });
  if (i.nutrition === "enteralNight") x.push({ lvl: "act", t: "Nocturnal feeds: give NPH when the feed starts.", ref: "Enteral Feedings" });
  if (i.nutrition === "tpn") x.push({ lvl: "act", t: "TPN: consider regular insulin in the bag (start 1 unit per 10 g dextrose, adjust daily), especially if >20 units correction in 24 h; add SC correction.", ref: "Parenteral Feedings" });
  if (["enteralCont", "enteralBolus", "enteralNight", "tpn"].includes(i.nutrition)) x.push({ lvl: "warn", t: "Continuous feeding is a continuous postprandial state: pushing glucose below 140 mg/dL raises hypoglycemia risk.", ref: "Enteral and Parenteral Feedings" });
  if (i.steroid === "intermediate") x.push({ lvl: "act", t: "Morning prednisone/prednisolone: give NPH with the steroid dose; expect afternoon–evening peak.", ref: "Glucocorticoid Therapy" });
  if (i.steroid === "long") x.push({ lvl: "act", t: "Long-acting steroid (e.g. dexamethasone) or multidose use: long-acting basal may be needed; prandial/correction often need 40–60%+ more. Adjust daily; watch for hypoglycemia at taper.", ref: "Glucocorticoid Therapy" });
  if (i.hf && i.sglt2) x.push({ lvl: "info", t: "SGLT2 inhibitor may be continued/started for heart failure after recovery from acute illness if no contraindication; adjust insulin and diuretics proactively. Avoid in severe illness, ketosis, prolonged fasting.", ref: "Rec 16.11 (A)" });
  else if (i.sglt2) x.push({ lvl: "warn", t: "SGLT2 inhibitor: not for inpatient glycemic control; hold in severe illness, ketonemia, prolonged fasting.", ref: "Noninsulin Therapies" });
  if (i.glp1) x.push({ lvl: "warn", t: "GLP-1 RA / dual GIP-GLP-1 RA: hold in acutely ill inpatients.", ref: "Noninsulin Therapies" });
  if (i.glucose < 200 && !icu && i.dm === "t2") x.push({ lvl: "info", t: "Mild hyperglycemia (<180–200 mg/dL): DPP-4 inhibitor ± basal insulin is an option (linagliptin needs no renal adjustment; avoid saxagliptin/alogliptin in heart failure).", ref: "Noninsulin Therapies" });
  S.push({ title: `${n++}. Treatment plan`, items: x });
  if (i.surgery !== "none") {
    const p: Item[] = [{ lvl: "act", t: "Keep glucose 100–180 mg/dL before, during and after surgery; check at least every 2–4 h while NPO. Insulin is the only recommended agent perioperatively. Do not use CGM alone during surgery.", ref: "Rec 16.15 (E)" }];
    if (i.surgery === "elective") p.push({ lvl: "info", t: "Preoperative A1C goal <8% within 3 months (or GMI <8% / TIR >50%). Do not postpone surgery on A1C alone.", ref: "Rec 16.14 (C)" });
    p.push({ lvl: "act", t: "Hold metformin and other oral agents on the day of surgery. Evening before: reduce basal by 25% (NPH to 50%, long-acting analogs to 75–80%); individualize in T1D.", ref: "Perioperative Care" });
    if (i.sglt2) p.push({ lvl: "stop", t: i.surgery === "elective" ? `Stop SGLT2 inhibitor ${i.ertugliflozin ? "4 days (ertugliflozin)" : "3 days"} before surgery.` : "Emergency surgery on SGLT2 inhibitor: monitor closely for (euglycemic) DKA.", ref: "SGLT2i Perioperative" });
    if (i.glp1) p.push({ lvl: "warn", t: "Personalize GLP-1 RA management (aspiration risk): consider indication, symptoms, dose, procedure and anesthesia; consider gastric ultrasound, full-stomach precautions or a 24 h liquid diet; provide an insulin plan if the drug is held.", ref: "GLP-1 RA Perioperative" });
    if (i.pumpCgm) p.push({ lvl: "info", t: "Pump may continue if institutional policy allows; otherwise start an alternative (infusion or basal + correction) before surgery.", ref: "Perioperative Care" });
    S.push({ title: `${n++}. Perioperative care`, items: p });
  }
  S.push({ title: `${n++}. Hypoglycemia safety`, items: [
    { lvl: "act", t: "Glucose <70 mg/dL: nurse-initiated protocol. 15 g fast-acting carbohydrate if able to swallow; IV glucose or glucagon if NPO/unable. Recheck every 15 min until >70.", ref: "Hypoglycemia" },
    { lvl: "act", t: "After any value <70: review and change the insulin plan, document in the EHR and track. Consider root-cause review.", ref: "Rec 16.12–16.13 (C)" },
    { lvl: "info", t: "Look for triggers: steroid taper, reduced intake/emesis, mistimed rapid-acting insulin, interrupted feeds or dextrose, delayed checks, kidney failure, sepsis, liver/heart failure, age. On basal insulin, risk peaks midnight–6 AM.", ref: "Risk Factors" }] });
  return S;
}

export type Crisis = { ph: number; hco3: number; bhb: number; glucose: number; osm: number; wt: number; k: number; severity: "mild" | "moderate" | "severe"; hypovolemia: "severe" | "mild" | "cardiac" };
export function crisis(c: Crisis): Section[] {
  const acid = c.ph < 7.3 || c.hco3 < 18;
  const dka = c.glucose >= 200 && c.bhb >= 3 && acid;
  const eu = c.glucose < 200 && c.bhb >= 3 && acid;
  const hhs = c.glucose >= 600 && c.osm > 300 && c.bhb < 3 && c.ph >= 7.3 && c.hco3 >= 15;
  const dx: Item[] = [{ lvl: dka || eu || hhs ? "warn" : "info", t: hhs ? "Meets HHS criteria." : dka ? "Meets DKA criteria." : eu ? "Euglycemic DKA pattern (glucose <200 with ketosis and acidosis). Think SGLT2i, pregnancy, alcohol, liver failure, low intake; requires diabetes history." : "Does not meet full DKA or HHS criteria as entered (all criteria must be met). Reassess; hybrid DKA-HHS occurs.", ref: "Table 16.1" }];
  const w = c.wt || 0; const u = (f: number) => r(w * f);
  const fl: Item[] = [{ lvl: "act", t: c.hypovolemia === "severe" ? "Severe hypovolemia: 0.9% NaCl or other crystalloid 1.0 L/h initially." : c.hypovolemia === "cardiac" ? "Cardiac compromise: hemodynamic monitoring/pressors." : "Mild hypovolemia: crystalloid at a rate replacing ~50% of the estimated deficit in 8–12 h.", ref: "Figure 16.1" }];
  if (c.glucose < 250) fl.push({ lvl: "act", t: "Glucose <250: add 5–10% dextrose to the crystalloid" + (eu ? " (in euglycemic DKA, start dextrose with the insulin)." : "."), ref: "Figure 16.1" });
  const ins: Item[] = [];
  if (hhs) ins.push({ lvl: "act", t: `HHS: IV short-acting insulin ${u(0.05)} units/h (0.05 units/kg/h), fixed-rate or nurse-driven variable protocol. Target glucose 200–250 mg/dL until resolution.`, ref: "Figure 16.1" });
  else if (c.severity === "mild") ins.push({ lvl: "act", t: `Mild DKA: SC rapid-acting ${u(0.1)} units bolus (0.1 units/kg), then ${u(0.1)} units every 1 h or ${u(0.2)} units every 2 h. Requires adequate fluids and frequent POC checks.`, ref: "Figure 16.1" });
  else ins.push({ lvl: "act", t: `Moderate/severe DKA: IV short-acting insulin ${u(0.1)} units/h (0.1 units/kg/h), fixed-rate or nurse-driven protocol (never below 1 unit/h). Consider ${u(0.1)} units IV bolus if infusion is delayed. Keep glucose 150–200 mg/dL until resolution.`, ref: "Figure 16.1" });
  if (!hhs) ins.push({ lvl: "info", t: `When glucose <250 mg/dL: reduce to ${u(0.05)} units/h (0.05 units/kg/h) IV, or per protocol, and continue dextrose.`, ref: "Figure 16.1" });
  const kk: Item[] = [{ lvl: c.k > 5 ? "warn" : "act", t: c.k < 3.5 ? "K+ <3.5 mmol/L: give 10–20 mmol/h until >3.5 (faster needs central access). Hold insulin until K+ is corrected, per protocol." : c.k <= 5 ? "K+ 3.5–5.0 mmol/L: give 10–20 mmol K+ per liter of IV fluid to keep serum K+ at 4–5." : "K+ >5.0 mmol/L: start insulin but do NOT give K+; recheck serum K+ every 2 h.", ref: "Figure 16.1" },
    { lvl: "info", t: "Confirm adequate kidney function (urine output ~0.5 mL/kg/h) before giving potassium.", ref: "Figure 16.1" }];
  const oth: Item[] = [
    { lvl: "info", t: "Bicarbonate only if pH <7.0. Phosphate only if <1.0 mmol/L with muscle weakness or respiratory compromise.", ref: "Figure 16.1" },
    { lvl: "act", t: "Check electrolytes, kidney function, venous pH, osmolality and glucose every 2–4 h until stable. Treat the precipitant (sepsis, MI, stroke, SGLT2i, missed insulin).", ref: "DKA and HHS" },
    { lvl: "info", t: "Resolution. DKA: pH >7.3 or bicarbonate >18 and ketones <0.6 mmol/L. HHS: osmolality <300 mOsm/kg, urine output >0.5 mL/kg/h, glucose <250. Then start SC multidose insulin and continue IV insulin 1–2 h after the SC dose (basal 2–4 h before stopping IV).", ref: "Figure 16.1, Rec 16.16 (A)" },
    { lvl: "act", t: "Before discharge teach recognition, prevention and management of DKA/HHS.", ref: "Rec 16.17 (B)" }];
  return [{ title: "Diagnosis", items: dx }, { title: "Fluids", items: fl }, { title: "Insulin", items: ins }, { title: "Potassium", items: kk }, { title: "Monitoring, resolution, follow-through", items: oth }];
}

export const discharge = [
  "Structured discharge plan started at admission and tailored to the person; if not going home, confirm facility diabetes capabilities (Rec 16.18, B)",
  "Medication reconciliation: cross-check home and hospital drugs, no chronic drug stopped by accident, no duplicate brands; fill and review new prescriptions before leaving",
  "Supplies: insulin pens, needles, meter and strips, lancets, CGM sensors; consider starting CGM before discharge",
  "Consider glucagon after severe hypoglycemia, with impaired awareness, or at high hypoglycemia risk",
  "Education: glucose monitoring and home goals, medication and insulin dosing, meal planning, hypoglycemia treatment, sick-day rules, when to call, sharps disposal",
  "Follow-up booked before discharge: within 1 month if hyper/hypoglycemia occurred in hospital; within 1–2 weeks if medications changed or control is suboptimal",
  "Discharge summary sent promptly: cause of hyperglycemia, complications, medication changes, pending tests, follow-up needs",
  "Admission A1C >9% or DKA: closer insulin follow-up and transitional care model",
  "Refer to dietitian or diabetes care and education specialist if needed",
];
