import assert from "node:assert/strict";
import { seoPhaseOnePages } from "../tools/seo-phase-one-content.mjs";

const target = process.env.BROWSER_TARGET;
assert.ok(target, "Set BROWSER_TARGET to a 390px-wide browser popup target");
const bridge = "http://localhost:3456";
const baseUrl = "https://zhenguocool.com/";
const locales = ["", "zh-cn/", "en/"];
const urls = seoPhaseOnePages.flatMap((page) => locales.map((locale) => `${baseUrl}${locale}${page.kind === "article" ? "insights" : "services"}/${page.slug}/`));

const request = async (path, body) => {
  const response = await fetch(`${bridge}${path}`, { method: body === undefined ? "GET" : "POST", body });
  if (!response.ok) throw new Error(`${path}: ${response.status}`);
  return response.json();
};

const results = [];
for (const url of urls) {
  await request(`/navigate?target=${target}`, url);
  const result = await request(`/eval?target=${target}`, 'JSON.stringify({innerWidth,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,viewport:document.querySelector("meta[name=viewport]")?.content})');
  const metrics = JSON.parse(result.value);
  results.push({ url, ...metrics, passed: metrics.innerWidth <= 400 && metrics.scrollWidth <= metrics.innerWidth && metrics.viewport === "width=device-width, initial-scale=1.0" });
}

console.log(JSON.stringify({ total: results.length, passed: results.filter((item) => item.passed).length, results }, null, 2));
if (results.some((item) => !item.passed)) process.exitCode = 1;
