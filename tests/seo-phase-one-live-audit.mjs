import assert from "node:assert/strict";
import { seoPhaseOnePages } from "../tools/seo-phase-one-content.mjs";

const baseUrl = process.env.SITE_URL || "https://zhenguocool.com/";
const locales = [
  { key: "zh-Hant", dir: "", href: "zh-TW" },
  { key: "zh-Hans", dir: "zh-cn", href: "zh-CN" },
  { key: "en", dir: "en", href: "en" }
];

const requiredTypes = (kind) => kind === "article"
  ? ["BlogPosting", "FAQPage", "BreadcrumbList"]
  : ["Service", "FAQPage", "BreadcrumbList"];

const pageUrl = (page, locale) => {
  const directory = page.kind === "article" ? "insights" : "services";
  return `${baseUrl}${locale.dir ? `${locale.dir}/` : ""}${directory}/${page.slug}/`;
};

const text = (html, pattern) => html.match(pattern)?.[1]?.trim() || "";

const sitemapResponse = await fetch(new URL("sitemap.xml", baseUrl));
assert.equal(sitemapResponse.status, 200, "Live sitemap must return 200");
const sitemap = await sitemapResponse.text();
const results = [];

for (const page of seoPhaseOnePages) {
  for (const locale of locales) {
    const url = pageUrl(page, locale);
    const response = await fetch(url, { redirect: "manual" });
    const html = await response.text();
    const checks = {
      status_200: response.status === 200,
      title: Boolean(text(html, /<title>([\s\S]*?)<\/title>/i)),
      meta_description: Boolean(text(html, /<meta name="description" content="([^"]+)"/i)),
      h1: Boolean(text(html, /<h1>([\s\S]*?)<\/h1>/i)),
      canonical: html.includes(`<link rel="canonical" href="${url}">`),
      hreflang: locales.every((alternate) => html.includes(`hreflang="${alternate.href}" href="${pageUrl(page, alternate)}"`)),
      schema: requiredTypes(page.kind).every((type) => html.includes(`"@type": "${type}"`)),
      sitemap: sitemap.includes(`<loc>${url}</loc>`),
      internal_links: (html.match(/<a [^>]*href="https:\/\/zhenguocool\.com\//g) || []).length > 0,
      ga_page_view: html.includes("web-assets/analytics.js") && html.includes("web-assets/analytics-config.js"),
      mobile_markup: html.includes('name="viewport" content="width=device-width, initial-scale=1.0"') && html.includes("@media (max-width:760px)")
    };
    results.push({ url, status: response.status, checks, passed: Object.values(checks).every(Boolean) });
  }
}

console.log(JSON.stringify({ baseUrl, sitemap_status: sitemapResponse.status, total: results.length, passed: results.filter((item) => item.passed).length, results }, null, 2));

if (results.some((item) => !item.passed)) process.exitCode = 1;
