import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const home = read("index.html");
const builder = read("tools/build-locales.mjs");

assert.match(home, /<form[^>]+id="lead-form"/, "Homepage needs a qualifying lead form.");
assert.match(home, /name="brand_name"/, "Lead form needs a brand field.");
assert.match(home, /name="budget_range"/, "Lead form needs a budget field.");
assert.match(home, /name="utm_source"/, "Lead form needs UTM capture.");
assert.match(home, /formsubmit\.co\/ajax/, "Lead form needs a delivery endpoint.");
assert.match(home, /thanks\//, "Lead form needs a thank-you destination.");

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

console.log("site conversion contract: pass");
