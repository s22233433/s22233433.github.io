import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const chromeStores = {
  "Passive Analytics": "https://chromewebstore.google.com/detail/instagram-insights-passiv/lmgkdhjmagniblpcpnfdacloakkpmggj",
  "YouTube 影片平均": "https://chromewebstore.google.com/detail/youtube-%E5%BD%B1%E7%89%87%E5%B9%B3%E5%9D%87/dgngaaaaffepbphniphcgefpbgehpokj"
};

const hub = read("tools/index.html");
assert.equal((hub.match(/data-product-card=/g) || []).length, 2, "Product Hub presents exactly two products.");
for (const forbidden of ["Coming Soon", "YouTube Transcript", "AI 課程", "報價工具", "MyTools"]) assert.doesNotMatch(hub, new RegExp(forbidden), `Product Hub excludes ${forbidden}.`);
for (const [name, store] of Object.entries(chromeStores)) {
  assert.match(hub, new RegExp(`data-product-name="${name}"`), `Hub names ${name}.`);
  assert.ok(hub.includes(store), `Hub keeps the verified ${name} Chrome Web Store URL.`);
  assert.match(hub, new RegExp(`data-track-event="product_click"[^>]*data-product-name="${name}"`), `${name} product entry is tracked.`);
  assert.match(hub, new RegExp(`data-track-event="chrome_store_click"[^>]*data-product-name="${name}"`), `${name} store entry is tracked.`);
}

for (const page of ["index.html", "zh-tw/index.html", "zh-cn/index.html", "en/index.html"]) {
  const home = read(page);
  assert.match(home, /\.product-card > div:first-child \{ display: flex; flex-direction: column; \}/, `${page} keeps product-card CTA content in a vertical layout.`);
  assert.match(home, /\.product-card \.hero-actions \{ margin-top: auto; padding-top: 18px; \}/, `${page} aligns product-card CTA rows.`);
  assert.match(home, /href="\/tools\/" data-track-event="product_click" data-track-location="nav"/, `${page} has a tracked products navigation entry.`);
  assert.match(home, /href="\/tools\/" data-track-event="product_click" data-track-location="hero"/, `${page} has a tracked hero products entry.`);
  assert.equal((home.match(/data-product-card=/g) || []).length, 2, `${page} has exactly two product cards.`);
  for (const [name, store] of Object.entries(chromeStores)) {
    assert.match(home, new RegExp(`data-track-event="product_click"[^>]*data-product-name="${name}"`), `${page} tracks ${name} product entry.`);
    assert.match(home, new RegExp(`data-track-event="chrome_store_click"[^>]*data-product-name="${name}"`), `${page} tracks ${name} Chrome Store entry.`);
    assert.ok(home.includes(store), `${page} contains the verified ${name} Chrome Web Store URL.`);
  }
  assert.doesNotMatch(home, /YouTube Transcript|Coming Soon/, `${page} does not introduce forbidden product wording.`);
}

for (const page of ["tools/instagram-insights-passive/index.html", "zh-cn/tools/instagram-insights-passive/index.html", "en/tools/instagram-insights-passive/index.html", "ja/tools/instagram-insights-passive/index.html"]) {
  const html = read(page);
  assert.match(html, /data-track-event="chrome_store_click"[^>]*data-product-name="Passive Analytics"/, `${page} tracks its existing Passive Analytics Chrome Store CTA.`);
}
assert.match(read("tools/youtube-channel-metrics/index.html"), /data-track-event="chrome_store_click"[^>]*data-product-name="YouTube 影片平均"/, "YouTube product page tracks its existing Chrome Store CTA.");

const analytics = read("web-assets/analytics.js");
assert.match(analytics, /target_url/, "Analytics keeps target_url.");
assert.doesNotMatch(analytics, /source_page|link_url|product_view/, "Analytics does not introduce duplicate page or product-view parameters.");
const verifier = read("tools/verify-ga4.mjs");
assert.match(verifier, /const interactionTotal = selectedClickDefinitions\.length \+ selectedLanguageDefinitions\.length \+ leadModes\.length;/, "GA verifier derives this run's interaction total.");
assert.doesNotMatch(verifier, /writeProgress\("interactions", 0, 14,/, "GA verifier does not retain the old hard-coded interaction total.");
console.log("product discovery contract: pass");
