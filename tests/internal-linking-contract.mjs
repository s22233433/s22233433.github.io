import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const tracked = (file, event, product, service) => {
  const html = read(file);
  assert.match(html, new RegExp(`data-track-event="${event}"[^>]*data-track-location="(?:product|service)-product-module|data-track-event="${event}"[^>]*data-track-location="product-service-module"`), `${file} has ${event}.`);
  if (product) assert.match(html, new RegExp(`data-product-name="${product}"`), `${file} names ${product}.`);
  if (service) assert.match(html, new RegExp(`data-service-name="${service}"`), `${file} names ${service}.`);
};

tracked("tools/instagram-insights-passive/index.html", "product_to_service_click", "Passive Analytics", "influencer-marketing-agency");
tracked("tools/youtube-channel-metrics/index.html", "product_to_service_click", "YouTube 影片平均", "youtube-influencer-marketing");

for (const [file, service, product] of [
  ["services/kol-marketing/index.html", "kol-marketing", "Passive Analytics"],
  ["services/instagram-influencer-marketing/index.html", "instagram-influencer-marketing", "Passive Analytics"],
  ["services/tiktok-influencer-marketing/index.html", "tiktok-influencer-marketing", "Passive Analytics"],
  ["services/youtube-influencer-marketing/index.html", "youtube-influencer-marketing", "YouTube 影片平均"],
  ["services/overseas-influencer-marketing/index.html", "overseas-influencer-marketing", "Passive Analytics"]
]) tracked(file, "service_to_product_click", product, service);

for (const slug of [
  "kol-marketing",
  "instagram-influencer-marketing",
  "tiktok-influencer-marketing",
  "youtube-influencer-marketing",
  "overseas-influencer-marketing"
]) assert.doesNotMatch(read(`zh-tw/services/${slug}/index.html`), /data-track-event="service_to_product_click"[^>]*data-track-location="service-product-module"/, `${slug} remains root-only.`);

const insight = read("insights/taiwan-influencer-marketing-costs-2026/index.html");
assert.match(insight, /data-track-event="article_cta_click"[^>]*data-track-location="article-related-service"[^>]*data-service-name="influencer-marketing-costs"/, "Cost insight keeps one related service CTA.");
assert.match(insight, /data-track-event="article_cta_click"[^>]*data-track-location="article-related-product"[^>]*data-product-name="Passive Analytics"/, "Cost insight adds one related product CTA.");
assert.match(read("mytools/index.html"), /<h1>實用工具與 AI 課程<\/h1>/, "MyTools keeps its clear front-end name.");
const verifier = read("tools/verify-ga4.mjs");
assert.match(verifier, /GA4_INTERNAL_LINKING/, "Verifier can isolate M3 internal-linking events.");
console.log("internal linking contract: pass");
