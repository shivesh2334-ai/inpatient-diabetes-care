import "./globals.css";
export const metadata = { title: "Inpatient Diabetes Care — ADA 2026 §16", description: "Assessment and treatment workflow based on ADA Standards of Care in Diabetes—2026, Section 16." };
export default function L({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><head>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600&family=Source+Serif+4:wght@600&display=swap" />
  </head><body>{children}</body></html>);
}
