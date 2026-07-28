import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const baseUrl = "https://zhenguocool.com/";
const guide = "beverage-kol-marketing-guide";
const homes = [
  ["root", "index.html", `${baseUrl}insights/${guide}/`],
  ["zh-tw", "zh-tw/index.html", `${baseUrl}insights/${guide}/`],
  ["zh-cn", "zh-cn/index.html", `${baseUrl}zh-cn/insights/${guide}/`],
  ["en", "en/index.html", `${baseUrl}en/insights/${guide}/`]
];

for (const [locale, file, href] of homes) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  assert.equal((html.match(/data-track-event="article_index_click" data-track-location="home-guides"/g) || []).length, 4, `${locale} home has four guide cards`);
  assert.ok(html.includes(`href="${href}" data-track-event="article_index_click" data-track-location="home-guides"`), `${locale} home links the beverage guide`);
}

const guideLocales = [
  ["root", `insights/${guide}/index.html`, `${baseUrl}insights/${guide}/`, `${baseUrl}cases/korea-kol-goodme/`],
  ["zh-cn", `zh-cn/insights/${guide}/index.html`, `${baseUrl}zh-cn/insights/${guide}/`, `${baseUrl}zh-cn/cases/korea-kol-goodme/`],
  ["en", `en/insights/${guide}/index.html`, `${baseUrl}en/insights/${guide}/`, `${baseUrl}en/cases/korea-kol-goodme/`]
];
for (const [locale, file, canonical, caseUrl] of guideLocales) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  assert.ok(html.includes(`<link rel="canonical" href="${canonical}">`), `${locale} guide is self-canonical`);
  assert.match(html, /"@type": "BlogPosting"/, `${locale} guide has BlogPosting schema`);
  assert.match(html, /"@type": "FAQPage"/, `${locale} guide has FAQ schema`);
  assert.match(html, /"@type": "BreadcrumbList"/, `${locale} guide has breadcrumb schema`);
  assert.match(html, /"datePublished": "2026-07-29"/, `${locale} guide records its actual publication date`);
  assert.match(html, /"dateModified": "2026-07-29"/, `${locale} guide records its actual modification date`);
  assert.ok(html.includes(`href="${caseUrl}" data-track-event="case_study_click" data-track-location="beverage-guide-case"`), `${locale} guide links the Goodme case`);
  for (const slug of ["food-influencer-marketing", "kol-marketing", "korea-influencer-marketing"]) assert.ok(html.includes(`/services/${slug}/`), `${locale} guide links ${slug}`);
}

const cases = [
  ["root", "cases/korea-kol-goodme/index.html", `${baseUrl}insights/${guide}/`],
  ["zh-tw", "zh-tw/cases/korea-kol-goodme/index.html", `${baseUrl}insights/${guide}/`],
  ["zh-cn", "zh-cn/cases/korea-kol-goodme/index.html", `${baseUrl}zh-cn/insights/${guide}/`],
  ["en", "en/cases/korea-kol-goodme/index.html", `${baseUrl}en/insights/${guide}/`]
];
for (const [locale, file, guideUrl] of cases) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  for (const marker of ["case-summary-band", "case-split", "case-story", "case-timeline", "case-checklist"]) assert.ok(html.includes(marker), `${locale} Goodme case includes ${marker}`);
  assert.match(html, /"@type": "CreativeWork"/, `${locale} Goodme case retains CreativeWork schema`);
  assert.ok(html.includes(`href="${guideUrl}" data-track-event="article_cta_click" data-track-location="case-beverage-guide"`), `${locale} Goodme case links the guide`);
}

const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
for (const [, , canonical] of guideLocales) assert.ok(sitemap.includes(`<loc>${canonical}</loc>`), `sitemap includes ${canonical}`);

console.log("Content optimization contract: pass (four home guides, three guide locales, four Goodme case locales)");
