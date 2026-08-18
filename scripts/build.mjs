import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const copyFile = async (source, target) => {
  await mkdir(dirname(target), { recursive: true });
  await cp(source, target);
};

await mkdir("dist/assets/config", { recursive: true });
await copyFile("src/index.html", "dist/index.html");
await copyFile(".build/main.js", "dist/assets/main.js");
await copyFile(".build/config/site.js", "dist/assets/config/site.js");
await copyFile("src/styles/theme.css", "dist/assets/theme.css");
await copyFile("src/styles/main.css", "dist/assets/styles.css");
await cp("public", "dist", { recursive: true });

for (const file of ["dist/assets/main.js", "dist/assets/config/site.js"]) {
  const code = await readFile(file, "utf8");
  await writeFile(file, code.replace(/^\/\/# sourceMappingURL=.*$/gm, ""), "utf8");
}

const required = [
  "dist/index.html",
  "dist/assets/main.js",
  "dist/assets/config/site.js",
  "dist/assets/styles.css",
  "dist/assets/theme.css",
  "dist/favicon.svg",
  "dist/robots.txt",
  "dist/404.html",
  "dist/.nojekyll",
];

for (const file of required) await readFile(file);
console.log(`Production build created: ${join(process.cwd(), "dist")}`);
