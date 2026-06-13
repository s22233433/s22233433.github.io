import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const sourcePath = path.join(root, "index.html");
const baseUrl = "https://zhenguocool.com/";
const source = fs.readFileSync(sourcePath, "utf8");

const locales = [
  { key: "zh-Hant", dir: "zh-tw", htmlLang: "zh-Hant", url: `${baseUrl}zh-tw/`, label: "榛菓行銷" },
  { key: "zh-Hans", dir: "zh-cn", htmlLang: "zh-Hans", url: `${baseUrl}zh-cn/`, label: "榛果营销" },
  { key: "en", dir: "en", htmlLang: "en", url: `${baseUrl}en/`, label: "Zhenguo Marketing" }
];

const findObjectLiteral = (html, variableName) => {
  const marker = `const ${variableName} =`;
  const markerIndex = html.indexOf(marker);
  if (markerIndex === -1) throw new Error(`Cannot find ${marker}`);
  const start = html.indexOf("{", markerIndex);
  let depth = 0;
  let quote = "";
  let escaped = false;
  for (let index = start; index < html.length; index += 1) {
    const char = html[index];
    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        quote = "";
      }
      continue;
    }
    if (char === "\"" || char === "'" || char === "`") {
      quote = char;
      continue;
    }
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) return html.slice(start, index + 1);
    }
  }
  throw new Error(`Cannot parse ${variableName}`);
};

const translations = Function(`"use strict"; return (${findObjectLiteral(source, "translations")});`)();

const escapeAttr = (value) => String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
const replaceAttr = (tag, attr, value) => {
  const safeValue = escapeAttr(value);
  const pattern = new RegExp(`${attr}="[^"]*"`);
  if (pattern.test(tag)) return tag.replace(pattern, `${attr}="${safeValue}"`);
  return tag.replace(/>$/, ` ${attr}="${safeValue}">`);
};

const localizeElements = (html, copy) => html
  .replace(/(<[^>]+data-i18n="([^"]+)"[^>]*>)([\s\S]*?)(<\/[^>]+>)/g, (match, open, key, _content, close) => {
    if (!(key in copy)) return match;
    return `${open}${copy[key]}${close}`;
  })
  .replace(/(<[^>]+data-i18n-html="([^"]+)"[^>]*>)([\s\S]*?)(<\/[^>]+>)/g, (match, open, key, _content, close) => {
    if (!(key in copy)) return match;
    return `${open}${copy[key]}${close}`;
  })
  .replace(/<[^>]+data-i18n-alt="([^"]+)"[^>]*>/g, (tag, key) => replaceAttr(tag, "alt", copy[key] || ""))
  .replace(/<[^>]+data-i18n-src="([^"]+)"[^>]*>/g, (tag, key) => replaceAttr(tag, "src", copy[key] || ""))
  .replace(/<[^>]+data-i18n-aria-label="([^"]+)"[^>]*>/g, (tag, key) => replaceAttr(tag, "aria-label", copy[key] || ""));

const faqItems = (copy) => [
  [copy.answerOneQuestion, copy.answerOneBody],
  [copy.answerTwoQuestion, copy.answerTwoBody],
  [copy.answerThreeQuestion, copy.answerThreeBody],
  [copy.answerFourQuestion, copy.answerFourBody]
];

const buildSchema = (copy, locale) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
      "@id": `${baseUrl}#organization`,
      name: locale.key === "en" ? "Zhenguo Marketing Co., Ltd." : locale.label,
      alternateName: "ZHENGUOCool",
      url: baseUrl,
      email: "weiting@zhenguocool.com",
      sameAs: ["https://www.instagram.com/kolmasters_tw"],
      address: [
        {
          "@type": "PostalAddress",
          streetAddress: locale.key === "en" ? "2F.-3, No. 352, Sec. 1, Fuxing S. Rd." : "復興南路一段352號2樓之3",
          addressLocality: locale.key === "en" ? "Da'an District" : "大安區",
          addressRegion: locale.key === "en" ? "Taipei City" : "臺北市",
          addressCountry: "TW"
        },
        {
          "@type": "PostalAddress",
          streetAddress: locale.key === "en" ? "Room 2009-B050, Qianhai Champagne Building, No. 18 Free Trade West Street" : "前海合作區自貿西街18號前海香繽大廈2009-B050",
          addressLocality: locale.key === "en" ? "Nanshan District, Shenzhen" : "深圳市南山區",
          addressRegion: locale.key === "en" ? "Guangdong" : "廣東省",
          addressCountry: "CN"
        }
      ]
    },
    {
      "@type": "WebSite",
      "@id": `${baseUrl}#website`,
      url: locale.url,
      name: locale.label,
      inLanguage: locale.htmlLang,
      publisher: { "@id": `${baseUrl}#organization` }
    },
    {
      "@type": "Service",
      "@id": `${locale.url}#service`,
      name: copy.serviceOneTitle,
      provider: { "@id": `${baseUrl}#organization` },
      serviceType: ["Influencer Marketing", "Creator Matchmaking", "Campaign Planning", "Livestream Collaboration"],
      areaServed: ["Taiwan", "Hong Kong", "China"],
      description: copy.metaDescription
    },
    {
      "@type": "FAQPage",
      "@id": `${locale.url}#faq`,
      mainEntity: faqItems(copy).map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer }
      }))
    }
  ]
});

const setLanguageLinks = (html, locale) => html
  .replace(/<a ([^>]*data-lang-link="([^"]+)"[^>]*)>/g, (match, attrs, key) => {
    let nextAttrs = attrs.replace(/\saria-current="page"/g, "");
    nextAttrs = nextAttrs.replace(/href="zh-tw\/"/, 'href="../zh-tw/"');
    nextAttrs = nextAttrs.replace(/href="zh-cn\/"/, 'href="../zh-cn/"');
    nextAttrs = nextAttrs.replace(/href="en\/"/, 'href="../en/"');
    if (key === locale.key) nextAttrs += ' aria-current="page"';
    return `<a ${nextAttrs}>`;
  });

const renderLocale = (locale) => {
  const copy = translations[locale.key];
  if (!copy) throw new Error(`Missing copy for ${locale.key}`);

  let html = source;
  html = html.replace(/<html lang="[^"]+" data-locale="[^"]+">/, `<html lang="${locale.htmlLang}" data-locale="${locale.key}">`);
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${copy.metaTitle}</title>`);
  html = html.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${escapeAttr(copy.metaDescription)}">`);
  html = html.replace(/<link rel="canonical" href="[^"]+">/, `<link rel="canonical" href="${locale.url}">`);
  html = html.replace(/<meta property="og:site_name" content="[^"]*">/, `<meta property="og:site_name" content="${escapeAttr(locale.label)}">`);
  html = html.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${escapeAttr(copy.metaTitle)}">`);
  html = html.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${escapeAttr(copy.metaDescription)}">`);
  html = html.replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${locale.url}">`);
  html = html.replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${escapeAttr(copy.metaTitle)}">`);
  html = html.replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${escapeAttr(copy.metaDescription)}">`);
  html = html.replace(/<script type="application\/ld\+json" id="structured-data">[\s\S]*?<\/script>/, `<script type="application/ld+json" id="structured-data">\n${JSON.stringify(buildSchema(copy, locale), null, 2)}\n  </script>`);
  html = localizeElements(html, copy);
  html = setLanguageLinks(html, locale);
  html = html.replace(/(src|href)="web-assets\//g, '$1="../web-assets/');
  html = html.replace(/content="https:\/\/zhenguocool.com\/web-assets\//g, 'content="https://zhenguocool.com/web-assets/');
  return html;
};

for (const locale of locales) {
  const dir = path.join(root, locale.dir);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), renderLocale(locale));
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${[
  { loc: baseUrl, key: "x-default" },
  ...locales.map((locale) => ({ loc: locale.url, key: locale.key }))
].map(({ loc }) => `  <url>\n    <loc>${loc}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>${loc === baseUrl ? "1.0" : "0.9"}</priority>\n${locales.map((locale) => `    <xhtml:link rel="alternate" hreflang="${locale.htmlLang}" href="${locale.url}" />`).join("\n")}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}" />\n  </url>`).join("\n")}\n</urlset>\n`;
fs.writeFileSync(path.join(root, "sitemap.xml"), sitemap);

const robots = `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}sitemap.xml\n`;
fs.writeFileSync(path.join(root, "robots.txt"), robots);

console.log(`Built ${locales.length} locale pages plus sitemap.xml and robots.txt`);
