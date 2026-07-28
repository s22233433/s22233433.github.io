import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const site = "https://zhenguocool.com";
const sitemap = read("sitemap.xml");
const sitemapUrls = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));
const url = (route) => `${site}${route}`;

for (const route of [
  "/tools/",
  "/zh-cn/tools/instagram-insights-passive/",
  "/en/tools/instagram-insights-passive/",
  "/ja/tools/instagram-insights-passive/",
  "/tools/instagram-insights-passive/updates/",
  "/en/tools/instagram-insights-passive/updates/",
  "/privacy/passive-analytics/",
  "/en/privacy/passive-analytics/",
  "/mytools/ai-rag-intro/",
  "/mytools/ai-methods/",
  "/mytools/agentic-workflow/"
]) assert.ok(sitemapUrls.has(url(route)), `${route} is indexed in the sitemap.`);

for (const [file, canonical] of [
  ["tools/index.html", "/tools/"],
  ["tools/instagram-insights-passive/index.html", "/tools/instagram-insights-passive/"],
  ["zh-cn/tools/instagram-insights-passive/index.html", "/zh-cn/tools/instagram-insights-passive/"],
  ["en/tools/instagram-insights-passive/index.html", "/en/tools/instagram-insights-passive/"],
  ["ja/tools/instagram-insights-passive/index.html", "/ja/tools/instagram-insights-passive/"],
  ["tools/instagram-insights-passive/updates/index.html", "/tools/instagram-insights-passive/updates/"],
  ["en/tools/instagram-insights-passive/updates/index.html", "/en/tools/instagram-insights-passive/updates/"],
  ["tools/youtube-channel-metrics/index.html", "/tools/youtube-channel-metrics/"]
]) assert.match(read(file), new RegExp(`rel="canonical" href="${url(canonical)}"`), `${file} has a self canonical.`);

for (const file of [
  "tools/instagram-insights-passive/index.html",
  "zh-cn/tools/instagram-insights-passive/index.html",
  "en/tools/instagram-insights-passive/index.html",
  "ja/tools/instagram-insights-passive/index.html"
]) {
  const html = read(file);
  for (const route of ["/tools/instagram-insights-passive/", "/zh-cn/tools/instagram-insights-passive/", "/en/tools/instagram-insights-passive/", "/ja/tools/instagram-insights-passive/"]) assert.ok(html.includes(url(route)), `${file} has a live Passive Analytics alternate.`);
  assert.doesNotMatch(html, /zh-tw\/tools\/instagram-insights-passive/, `${file} does not point hreflang at a missing zh-tw route.`);
}

for (const file of ["mytools/quote-generator/index.html", "mytools/quote-generator/V1/index.html", "thanks/index.html", "zh-tw/thanks/index.html", "zh-cn/thanks/index.html", "en/thanks/index.html", "wuhan-itinerary-2026-07/index.html"]) {
  const html = read(file);
  assert.match(html, /<meta name="robots" content="noindex[, ]/, `${file} remains non-indexable.`);
  const route = `/${path.dirname(file).replace(/\\/g, "/")}/`.replace("/./", "/");
  assert.ok(!sitemapUrls.has(url(route)), `${route} is excluded from the sitemap.`);
}

for (const file of ["index.html", "zh-tw/index.html", "zh-cn/index.html", "en/index.html"]) {
  const html = read(file);
  assert.match(html, /--coral: #cf3f2d;/, `${file} keeps the AA coral token.`);
  assert.match(html, /--teal: #0d7d80;/, `${file} keeps the AA teal token.`);
}

console.log("technical SEO contract: pass");
