import { readFile, readdir } from "node:fs/promises";
import { extname, join } from "node:path";

const files = [];
const walk = async (directory) => {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else files.push(path);
  }
};
await walk("src");
const textFiles = files.filter((file) => [".ts", ".css", ".html"].includes(extname(file)));
const contents = new Map();
for (const file of textFiles) contents.set(file, await readFile(file, "utf8"));
const failures = [];
const banned = [
  ["Lorem ipsum", /lorem ipsum/i],
  ["TODO marker", /\bTODO\b/],
  ["automatic AI font", /\b(?:Inter|Geist|Space Grotesk)\b/],
  ["glassmorphism", /glassmorphism|liquid glass|backdrop-filter/i],
  ["radial decoration", /radial-gradient|radial orb/i],
  ["sparkle decoration", /sparkle|✨|💫/u],
  ["decorative SVG", /<svg|panelSvg|emptyEvidenceSvg/i],
  ["remote media", /(?:src|url)\s*[=(]["']?https?:/i],
];
for (const [label, pattern] of banned) {
  for (const [file, content] of contents) if (pattern.test(content)) failures.push(`${label}: ${file}`);
}
const css = await readFile("src/styles/main.css", "utf8");
const theme = await readFile("src/styles/theme.css", "utf8");
const main = await readFile("src/main.ts", "utf8");
const html = await readFile("src/index.html", "utf8");
const config = await readFile("src/config/site.ts", "utf8");
if (!css.startsWith('@import "./theme.css";')) failures.push("main.css must import theme.css first");
if (!theme.includes("--color-accent:")) failures.push("theme.css lacks centralized accent token");
if (!main.includes('import { siteConfig } from "./config/site.js"')) failures.push("main.ts must import centralized site config");
if (!html.includes('name="robots" content="noindex, nofollow, noarchive"')) failures.push("noindex metadata is missing");
if (!config.includes("Демонстрационный концепт")) failures.push("visible demo label is missing");
if ((main.match(/<h1/g) ?? []).length !== 1) failures.push("exactly one H1 is required");
if ((css.match(/box-shadow:/g) ?? []).length > 2) failures.push("decorative shadows detected");
if ((css.match(/border-radius:/g) ?? []).length > 10) failures.push("too many radius declarations");
if (/data-readiness|data-damage-option|data-guide-tab/i.test(main)) failures.push("obsolete overcomplicated interactions detected");
if (failures.length > 0) {
  console.error("Lint failed:\n" + failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}
console.log(`Lint passed: ${textFiles.length} source files checked`);
