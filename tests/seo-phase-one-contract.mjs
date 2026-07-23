import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { seoEvidence, seoPhaseOnePages } from "../tools/seo-phase-one-content.mjs";

const root = path.resolve(import.meta.dirname, "..");
const baseUrl = "https://zhenguocool.com/";
const localePaths = [
  { key: "zh-Hant", dir: "", href: "zh-TW", html: "zh-TW" },
  { key: "zh-Hans", dir: "zh-cn", href: "zh-CN", html: "zh-CN" },
  { key: "en", dir: "en", href: "en", html: "en" }
];
const titles = new Set();
const urls = [];
const coreServiceSlugs = [
  "influencer-marketing-agency",
  "overseas-influencer-marketing-guide",
  "japan-influencer-marketing-guide",
  "tiktok-koc-marketing-guide",
  "influencer-marketing-costs"
];

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
    for (const evidenceKey of page.evidence) {
      assert.match(html, /class="evidence-meta"/, `${relative} shows its evidence scope publicly`);
      assert.ok(seoEvidence[evidenceKey][locale.key].evidence, `${relative} has visible evidence text for ${evidenceKey}`);
      assert.ok(html.includes(seoEvidence[evidenceKey][locale.key].evidence), `${relative} displays evidence text for ${evidenceKey}`);
    }
    assert.ok(!html.includes("docs.google.com"), `${relative} does not expose private source links`);
    assert.ok(!html.includes("KOL Master"), `${relative} does not expose retired wording`);
    if (coreServiceSlugs.includes(page.slug)) {
      assert.match(html, /<table>/, `${relative} includes a comparison table`);
      assert.match(html, /class="timeline"/, `${relative} includes an execution timeline`);
      assert.match(html, /授權規則|授权规则|Rights rule/, `${relative} includes rights rules`);
      assert.match(html, /費用因素|费用因素|Cost factors/, `${relative} includes cost factors`);
      assert.match(html, /常見失敗|常见失败|Common failure/, `${relative} includes failure modes`);
    }

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

for (const locale of localePaths) {
  const home = fs.readFileSync(path.join(root, locale.dir, "index.html"), "utf8");
  for (const slug of ["taiwan-influencer-marketing-costs-2026", "how-to-choose-influencer-marketing-agency", "japan-influencer-marketing-guide-article"]) {
    const pathPart = locale.dir ? `${locale.dir}/insights/${slug}/` : `insights/${slug}/`;
    assert.ok(home.includes(`${baseUrl}${pathPart}`), `${locale.dir || "root"} homepage links ${slug}`);
  }
}

for (const slug of ["kol-marketing", "overseas-influencer-marketing", "japan-influencer-marketing", "tiktok-koc-marketing"]) {
  const html = fs.readFileSync(path.join(root, "services", slug, "index.html"), "utf8");
  assert.doesNotMatch(html, /每一步都以品牌端可判斷、可追蹤、可交接為原則/, `${slug} has no repeated generic workflow sentence`);
}

const analytics = fs.readFileSync(path.join(root, "web-assets", "analytics.js"), "utf8");
const analyticsConfig = fs.readFileSync(path.join(root, "web-assets", "analytics-config.js"), "utf8");
assert.match(analyticsConfig, /G-3G60NBREE3/, "GA4 measurement ID is configured in the shared config");
assert.match(analytics, /send_page_view: false/, "GA config suppresses the automatic duplicate page view");
assert.equal((analytics.match(/track\("page_view"\)/g) || []).length, 1, "Analytics emits page_view exactly once in the shared tracker");
assert.match(analytics, /googletagmanager\.com\/gtag\/js\?id=/, "GA loader is present when a measurement ID is configured");
assert.match(analytics, /window\.gtag\("event", event, payload\)/, "Tracked events are forwarded to GA4");
assert.match(analytics, /ga_debug/, "Analytics supports DebugView verification");
assert.match(analytics, /gtag\("set", "debug_mode", true\)/, "DebugView mode is set before GA configuration");
assert.match(fs.readFileSync(path.join(root, "index.html"), "utf8"), /generate_lead/, "Lead form success emits generate_lead");

console.log(`SEO phase-one contract: pass (${urls.length} routes)`);
