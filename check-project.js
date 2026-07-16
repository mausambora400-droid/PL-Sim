const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const required = [
  "index.html",
  "src/styles.css",
  "src/app.js",
  "README.md",
  "package.json",
  ".editorconfig",
  ".gitignore"
];
const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));

if (missing.length) {
  console.error(`Missing required files: ${missing.join(", ")}`);
  process.exit(1);
}

const app = fs.readFileSync(path.join(root, "src/app.js"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "src/styles.css"), "utf8");
const combined = `${app}\n${html}\n${css}`;

const titleBlock = app.match(/const stepTitles = \[([\s\S]*?)\];/);
const screenTitles = titleBlock ? [...titleBlock[1].matchAll(/"[^"]+"/g)].length : 0;

if (screenTitles !== 20) {
  console.error(`Expected 20 simulator screens, found ${screenTitles}.`);
  process.exit(1);
}

if (!app.includes("code: `HDHC_PL${String(index + 1).padStart(2, \"0\")}_PL`")) {
  console.error("Visible HDHC simulator code generation is missing.");
  process.exit(1);
}

if (!combined.includes("HDHC BANK") || !combined.includes("HDHC Bank Ltd.")) {
  console.error("HDHC visible branding is missing.");
  process.exit(1);
}

if (!app.includes("originalCode: `HDFC_PL")) {
  console.error("Original HDFC sequence reference is missing.");
  process.exit(1);
}

console.log("Project check passed.");
