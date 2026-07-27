import { mkdir, writeFile } from "node:fs/promises";

const site = (process.env.SITE_URL || "https://zhenguocool.com").replace(/\/$/, "");
const origin = new URL(site).origin;
const fetchPage = async (url) => {
  try {
    const response = await fetch(url, { redirect: "manual" });
    return { url, status: response.status, html: await response.text() };
  } catch (error) {
    return { url, status: null, error: error.message, html: "" };
  }
};
const concurrent = async (items, worker, limit = 8) => {
  const output = [];
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const index = next++;
      output[index] = await worker(items[index]);
    }
  }));
  return output;
};
const countByStatus = (rows) => Object.fromEntries([...new Set(rows.map(({ status }) => String(status)))].sort().map((status) => [status, rows.filter((row) => String(row.status) === status).length]));

const sitemapResponse = await fetch(`${site}/sitemap.xml`);
const sitemapXml = await sitemapResponse.text();
const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const pages = await concurrent(sitemapUrls, fetchPage);
const internalLinks = new Map();
const pageChecks = pages.map((page) => {
  const canonical = page.html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1] || null;
  const hreflang = [...page.html.matchAll(/<link\s+rel="alternate"\s+hreflang="[^"]+"\s+href="[^"]+"/gi)].length;
  for (const match of page.html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/gi)) {
    try {
      const target = new URL(match[1], page.url);
      if (target.origin !== origin) continue;
      target.hash = "";
      internalLinks.set(target.href, (internalLinks.get(target.href) || 0) + 1);
    } catch {}
  }
  return { url: page.url, status: page.status, canonical, hreflang_count: hreflang };
});
const linked = await concurrent([...internalLinks.keys()], fetchPage);
const report = {
  generated_at: new Date().toISOString(),
  site,
  sitemap: {
    http_status: sitemapResponse.status,
    urls: sitemapUrls.length,
    status_counts: countByStatus(pages),
    non_200: pages.filter((page) => page.status !== 200).map(({ url, status, error }) => ({ url, status, error: error || null }))
  },
  canonical: { missing: pageChecks.filter((page) => !page.canonical).map(({ url }) => url) },
  hreflang: { missing: pageChecks.filter((page) => page.hreflang_count === 0).map(({ url }) => url) },
  internal_links: {
    unique: linked.length,
    edges: [...internalLinks.values()].reduce((total, count) => total + count, 0),
    status_counts: countByStatus(linked),
    non_200: linked.filter((page) => page.status !== 200).map(({ url, status, error }) => ({ url, status, error: error || null }))
  }
};
await mkdir("artifacts", { recursive: true });
await writeFile("artifacts/technical-baseline.json", `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ sitemap_urls: report.sitemap.urls, sitemap_status_counts: report.sitemap.status_counts, canonical_missing: report.canonical.missing.length, hreflang_missing: report.hreflang.missing.length, internal_link_status_counts: report.internal_links.status_counts }, null, 2));
if (report.sitemap.http_status !== 200 || report.sitemap.non_200.length || report.internal_links.non_200.length) process.exitCode = 1;
