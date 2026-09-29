import type { Config } from "tailwindcss";
export default { content: ["./app/**/*.tsx","./lib/**/*.ts"], theme: { extend: { colors: { ink:"#17262e", paper:"#f4f6f6", line:"#cfd8da", teal:"#0e6b73", warn:"#a15c00", stop:"#a3211b" } } }, plugins: [] } satisfies Config;
