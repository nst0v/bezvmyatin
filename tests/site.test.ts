import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { siteConfig } from "../src/config/site.ts";

test("verified data remains centralized", () => {
  assert.equal(siteConfig.business.name, "БеZвмятин");
  assert.equal(siteConfig.project.city, "Владимир");
  assert.equal(siteConfig.contacts.phone, "+79036472592");
  assert.equal(siteConfig.project.demoMode, true);
  assert.equal(siteConfig.project.allowPublicIndexing, false);
});

test("uncertain address is not presented as confirmed", () => {
  assert.doesNotMatch(siteConfig.contacts.address, /3[ВИ]$/);
  assert.match(siteConfig.contacts.addressNote, /уточните/i);
});

test("commercial claims are not fabricated", () => {
  const serialized = JSON.stringify(siteConfig);
  assert.doesNotMatch(serialized, /\b\d+\s*(?:минут|час|дней|лет)\b/i);
  assert.doesNotMatch(serialized, /\b\d+[\s ]*(?:₽|руб)/i);
  assert.doesNotMatch(serialized, /\b\d+[+]\s*(?:клиент|автомоб|работ)/i);
});

test("demo and indexing restrictions are explicit", async () => {
  const html = await readFile("src/index.html", "utf8");
  const main = await readFile("src/main.ts", "utf8");
  assert.match(html, /noindex, nofollow, noarchive/);
  assert.match(main, /Данные не отправлены/);
  assert.match(main, /данные никуда не отправляются|данные не отправлены/i);
});

test("site contains no decorative SVG or remote imagery", async () => {
  const main = await readFile("src/main.ts", "utf8");
  const css = await readFile("src/styles/main.css", "utf8");
  assert.doesNotMatch(main, /<svg|panelSvg|emptyEvidenceSvg/i);
  assert.doesNotMatch(main, /<img/i);
  assert.doesNotMatch(css, /url\(https?:/i);
});

test("minimal conversion scenarios are functional", async () => {
  const main = await readFile("src/main.ts", "utf8");
  assert.match(main, /data-menu-button/);
  assert.match(main, /data-files/);
  assert.match(main, /<details/);
  assert.match(main, /data-form/);
  assert.doesNotMatch(main, /data-readiness|data-damage-option|data-guide-tab/i);
});
