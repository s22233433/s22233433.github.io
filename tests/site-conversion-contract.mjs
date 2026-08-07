import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const home = read("index.html");
const builder = read("tools/build-locales.mjs");
const analyticsConfig = read("web-assets/analytics-config.js");

const localeEntry = home.match(/<script id="locale-entry">([\s\S]*?)<\/script>/)?.[1] || "";
const runLocaleEntry = ({ pathname = "/", search = "", hash = "", saved = "", languages = [] } = {}) => {
  const redirects = [];
  vm.runInNewContext(localeEntry, {
    location: { pathname, search, hash, replace: (url) => redirects.push(url) },
    localStorage: { getItem: () => saved },
    navigator: { languages, language: languages[0] || "" }
  });
  return redirects;
};
assert.deepEqual(runLocaleEntry({ search: "?utm_source=test", hash: "#contact", languages: ["en-US"] }), ["/en/?utm_source=test#contact"], "English visitors should enter the English homepage without an intermediate page.");
assert.deepEqual(runLocaleEntry({ languages: ["zh-CN"] }), ["/zh-cn/"], "Simplified Chinese visitors should enter the Simplified Chinese homepage.");
assert.deepEqual(runLocaleEntry({ saved: "zh-Hant", languages: ["en-US"] }), [], "A saved manual language choice should override the browser language.");
assert.deepEqual(runLocaleEntry({ pathname: "/en/", languages: ["zh-CN"] }), [], "Localized routes must not redirect again.");
assert.match(home, /localStorage\.setItem\("zg_locale", link\.dataset\.langLink\)/, "Manual language choices need to be remembered.");

assert.match(analyticsConfig, /G-3G60NBREE3/, "Shared analytics config needs the ZhenguoCool GA4 measurement ID.");
for (const file of fs.readdirSync(root, { recursive: true }).filter((file) => file.endsWith(".html") && !file.startsWith("mytools/") && !file.startsWith("tools/"))) {
  assert.match(fs.readFileSync(path.join(root, file), "utf8"), /(web-assets\/analytics\.js|googletagmanager\.com\/gtag\/js\?id=G-3G60NBREE3)/, `Missing analytics entry point: ${file}`);
}

assert.match(home, /<form[^>]+id="lead-form"/, "Homepage needs a qualifying lead form.");
assert.match(home, /name="brand_name"/, "Lead form needs a brand field.");
assert.match(home, /name="budget_range"/, "Lead form needs a budget field.");
const leadForm = home.match(/<form[^>]+id="lead-form"[\s\S]*?<\/form>/)?.[0] || "";
for (const field of ["brand_name", "email", "target_market"]) {
  assert.match(leadForm, new RegExp(`name="${field}"[^>]*required`), `Lead form needs ${field} to remain required.`);
}
for (const field of ["contact_name", "product_category", "budget_range", "launch_timing", "cooperation_goal"]) {
  assert.doesNotMatch(leadForm, new RegExp(`name="${field}"[^>]*required`), `Lead form needs ${field} to remain optional.`);
}
assert.match(leadForm, /安全保存所填資料/, "Lead form needs a nearby data-use notice.");
assert.match(home, /lead_form_start/, "Lead form needs a first-interaction funnel event.");
assert.match(home, /name="utm_source"/, "Lead form needs UTM capture.");
assert.match(home, /action="\/api\/contact"/, "Lead form needs the Cloudflare Pages Function endpoint.");
assert.match(leadForm, /type="email"[^>]+pattern=/, "Lead form rejects incomplete email domains before submission.");
assert.match(home, /name="website"/, "Lead form needs a honeypot field.");
assert.match(home, /thanks\//, "Lead form needs a thank-you destination.");
assert.match(home, /web-assets\/og-zhenguocool-campaign-plan\.webp/, "Homepage needs the current share image.");

assert.match(builder, /const caseStudies = \[/, "Builder needs a reusable case-study source.");
assert.match(builder, /renderCasePage/, "Builder needs a case-page renderer.");
assert.match(builder, /caseStudyUrl/, "Builder needs localized case-study URLs.");
assert.match(builder, /立即取得初步合作建議/, "Service-page CTA needs the updated B2B language.");

for (const page of [
  "cases/liming-weiquan-cheer/index.html",
  "cases/korea-kol-goodme/index.html",
  "cases/camay-curling-iron/index.html",
  "thanks/index.html"
]) {
  assert.ok(fs.existsSync(path.join(root, page)), `Missing generated page: ${page}`);
}

const service = read("services/tiktok-koc-marketing/index.html");
assert.match(service, /海內外創作者行銷專案團隊/, "Service pages need the unified brand descriptor.");
assert.match(service, /立即取得初步合作建議/, "Service pages need the updated CTA.");
assert.match(service, /cases\//, "Service pages need relevant case-study links.");

const homepage = read("index.html");
assert.match(homepage, /cases\/liming-weiquan-cheer\//, "Homepage needs a case-study link.");
assert.match(homepage, /caseLabelMarket">專案範圍/, "Homepage cases need a project-scope label.");
assert.match(homepage, /caseLabelExecution">專案節點/, "Homepage cases need a project-stage label.");
assert.doesNotMatch(read("zh-tw/index.html"), /href="https:\/\/zhenguocool\.com\/zh-tw\/insights\//, "Traditional Chinese guide links must use the existing root routes.");

const seoSlugs = [
  "ugc-content-creation",
  "ecommerce-influencer-marketing",
  "consumer-electronics-influencer-marketing",
  "health-supplement-influencer-marketing",
  "japan-koc-marketing",
  "korea-koc-marketing"
];
for (const slug of seoSlugs) {
  assert.match(builder, new RegExp(`slug: "${slug}"`), `Missing service definition: ${slug}`);
  for (const prefix of ["", "zh-tw/", "zh-cn/", "en/"]) {
    const page = path.join(root, prefix, "services", slug, "index.html");
    assert.ok(fs.existsSync(page), `Missing generated SEO page: ${page}`);
    assert.match(fs.readFileSync(page, "utf8"), /FAQPage/, `SEO page needs FAQ schema: ${page}`);
  }
  assert.match(read("sitemap.xml"), new RegExp(`/services/${slug}/`), `SEO page must be in sitemap: ${slug}`);
}

assert.match(builder, /const serviceRelation = \{/, "Builder needs relation data for overlapping service intent.");
assert.match(builder, /const serviceDecisionGuide =/, "Builder needs a service decision-guide renderer.");
assert.doesNotMatch(builder, /ui\.faqTwo/, "Builder must not reuse the generic FAQ set across every service.");

const tiktokService = read("services/tiktok-influencer-marketing/index.html");
assert.match(tiktokService, /web-assets\/og-zhenguocool-campaign-plan\.webp/, "Service pages need the current share image.");
assert.match(tiktokService, /合作判斷與交付/, "Service pages need a decision and deliverables section.");
assert.match(tiktokService, /tiktok-koc-marketing/, "TikTok service pages need an intent-comparison link.");
assert.doesNotMatch(tiktokService, /如何挑選適合品牌的網紅？/, "Service pages must not retain the old generic FAQ.");

for (const slug of ["youtube-influencer-marketing", "instagram-influencer-marketing", "japan-influencer-marketing", "korea-influencer-marketing"]) {
  const html = read(`services/${slug}/index.html`);
  assert.match(html, /service-comparison/, `Missing comparison section: ${slug}`);
}

console.log("site conversion contract: pass");
