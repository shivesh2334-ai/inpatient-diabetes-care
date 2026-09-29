# Inpatient Diabetes Care

Assessment and treatment workflow for hospitalized adults with diabetes or hyperglycemia, based on **ADA Standards of Care in Diabetes—2026, Section 16** (Diabetes Care 2026;49 Suppl 1:S339–S355).

Modules: admission assessment and targets, monitoring, insulin and non-insulin treatment (ICU/ward, T1D, enteral/TPN, steroids), perioperative care, hypoglycemia safety, DKA/HHS pathway (Table 16.1, Figure 16.1), discharge checklist.

Rules live in `lib/engine.ts`; every item cites its recommendation. Clinical decision support only, verify against local protocols. No patient data is stored.

## Deploy
1. Push to GitHub. 2. Import the repo in Vercel (framework auto-detected, region `bom1` in `vercel.json`). 3. Deploy.

Local: `npm install && npm run dev`
