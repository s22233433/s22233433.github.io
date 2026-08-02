import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..");
const source = fs.readFileSync(path.join(root, "web-assets/analytics.js"), "utf8");
const home = fs.readFileSync(path.join(root, "index.html"), "utf8");
const page = (pathname, search = "", storage = new Map()) => {
  const window = {};
  const document = { title: "Analytics contract", documentElement: { lang: "zh-Hant" }, addEventListener() {}, head: { append() {} } };
  vm.runInNewContext(source, {
    window,
    document,
    location: { pathname, search, href: `https://zhenguocool.com${pathname}${search}`, hostname: "zhenguocool.com" },
    URLSearchParams,
    sessionStorage: { getItem: () => null, setItem() {} },
    localStorage: { getItem: (key) => storage.get(key) || null, setItem: (key, value) => storage.set(key, String(value)), removeItem: (key) => storage.delete(key) },
    Element: class {},
    HTMLAnchorElement: class {},
    Promise,
    setTimeout
  });
  return { payload: window.zgPagePayload(), pageView: window.dataLayer.find((event) => event?.event === "page_view") };
};

for (const [pathname, content_type, content_slug] of [
  ["/", "homepage", "home"],
  ["/zh-cn/services/kol-marketing/", "service", "kol-marketing"],
  ["/en/insights/how-to-choose-influencer-marketing-agency/", "article", "how-to-choose-influencer-marketing-agency"],
  ["/tools/instagram-insights-passive/", "product", "instagram-insights-passive"],
  ["/zh-cn/tools/instagram-insights-passive/", "product", "instagram-insights-passive"],
  ["/mytools/", "mytools", "mytools"],
  ["/privacy/passive-analytics/", "privacy", "passive-analytics"],
  ["/wuhan-itinerary-2026-07/", "other", "wuhan-itinerary-2026-07"]
]) {
  assert.deepEqual(page(pathname).payload.content_type, content_type, `${pathname} content_type`);
  assert.deepEqual(page(pathname).payload.content_slug, content_slug, `${pathname} content_slug`);
}

const internalStorage = new Map();
assert.equal(page("/", "?ga_internal=1", internalStorage).pageView.traffic_type, "internal", "opt-in marks the current browser as internal");
assert.equal(page("/", "", internalStorage).pageView.traffic_type, "internal", "internal marker persists without depending on the current IP");
assert.equal(page("/", "?ga_internal=0", internalStorage).pageView.traffic_type, undefined, "opt-out removes the internal marker");

assert.match(home, /lead_form_start/, "Keep the historical lead_form_start event.");
assert.match(source, /target_url/, "Keep the historical target_url parameter.");
assert.doesNotMatch(source, /source_page/, "Do not add a duplicate source_page parameter.");
assert.doesNotMatch(source, /link_url/, "Do not rename target_url to link_url.");
console.log("analytics classification contract: pass");
