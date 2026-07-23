import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { seoPhaseOnePages } from "../tools/seo-phase-one-content.mjs";

const root = path.resolve(import.meta.dirname, "..");
const baseUrl = "https://zhenguocool.com/";
const localePaths = [
  { key: "zh-Hant", dir: "", href: "zh-TW", html: "zh-TW" },
  { key: "zh-Hans", dir: "zh-cn", href: "zh-CN", html: "zh-CN" },
  { key: "en", dir: "en", href: "en", html: "en" }
];
const titles = new Set();
const urls = [];

assert.equal(seoPhaseOnePages.length, 8, "Phase one must contain exactly eight topics");

for (const page of seoPhaseOnePages) {
  assert.ok(["service", "article"].includes(page.kind), `${page.slug} has a supported page kind`);
  for (const locale of localePaths) {
    const directory = page.kind === "article" ? "insights" : "services";
    const relative = locale.dir ? `${locale.dir}/${directory}/${page.slug}/` : `${directory}/${page.slug}/`;
    const file = path.join(root, relative, "index.html");
    const html = fs.readFileSync(file, "utf8");
    const copy = page.copy[locale.key];
    const url = `${baseUrl}${relative}`;
    urls.push(url);

    assert.match(html, new RegExp(`<html lang="${locale.html}">`), `${relative} has correct html language`);
    assert.match(html, new RegExp(`<link rel="canonical" href="${url}">`), `${relative} is self-canonical`);
    assert.match(html, /<meta name="robots" content="index, follow">/, `${relative} is indexable`);
    assert.match(html, /<script src="(?:\.\.\/){2,3}web-assets\/analytics-config\.js" defer><\/script>/, `${relative} loads analytics config once`);
    assert.equal((html.match(/web-assets\/analytics\.js/g) || []).length, 1, `${relative} loads analytics once`);
    assert.equal((html.match(/<h1>/g) || []).length, 1, `${relative} has one H1`);
    assert.ok(html.includes(`<h1>${copy.h1}</h1>`), `${relative} exposes the page H1`);
    assert.ok(html.includes(`<meta name="description" content="${copy.description}">`), `${relative} exposes the page description`);
    assert.ok(!titles.has(copy.title), `Title must be unique: ${copy.title}`);
    titles.add(copy.title);
    assert.match(html, /"@type": "FAQPage"/, `${relative} includes FAQPage schema`);
    assert.match(html, /"@type": "BreadcrumbList"/, `${relative} includes breadcrumb schema`);
    assert.match(html, page.kind === "article" ? /"@type": "BlogPosting"/ : /"@type": "Service"/, `${relative} uses the correct primary schema`);
    assert.ok(html.includes(copy.faqs[0][0]), `${relative} visible FAQ matches its schema source`);
    assert.match(html, new RegExp(`data-track-event="${page.kind === "article" ? "article_cta_click" : "service_cta_click"}"`), `${relative} tracks its CTA`);
    assert.ok(!html.includes("docs.google.com"), `${relative} does not expose private source links`);
    assert.ok(!html.includes("KOL Master"), `${relative} does not expose retired wording`);

    for (const alternate of localePaths) {
      const alternateRelative = alternate.dir ? `${alternate.dir}/${directory}/${page.slug}/` : `${directory}/${page.slug}/`;
      assert.ok(html.includes(`hreflang="${alternate.href}" href="${baseUrl}${alternateRelative}"`), `${relative} reciprocally links ${alternate.href}`);
    }
  }
}

assert.equal(urls.length, 24, "Phase one must emit 24 direct language routes");
assert.equal(titles.size, 24, "All phase-one pages must have unique titles");

const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
for (const url of urls) assert.ok(sitemap.includes(`<loc>${url}</loc>`), `Sitemap includes ${url}`);

const analytics = fs.readFileSync(path.join(root, "web-assets", "analytics.js"), "utf8");
const analyticsConfig = fs.readFileSync(path.join(root, "web-assets", "analytics-config.js"), "utf8");
assert.match(analyticsConfig, /G-3G60NBREE3/, "GA4 measurement ID is configured in the shared config");
assert.match(analytics, /send_page_view: false/, "GA config suppresses the automatic duplicate page view");
assert.equal((analytics.match(/track\("page_view"\)/g) || []).length, 1, "Analytics emits page_view exactly once in the shared tracker");
assert.match(analytics, /googletagmanager\.com\/gtag\/js\?id=/, "GA loader is present when a measurement ID is configured");
assert.match(analytics, /window\.gtag\("event", event, payload\)/, "Tracked events are forwarded to GA4");

console.log(`SEO phase-one contract: pass (${urls.length} routes)`);
