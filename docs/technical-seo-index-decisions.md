# M4 Technical SEO Decisions

Baseline timestamp: 2026-07-28 22:41 Asia/Taipei. Source: `main@88fe8ac`, local repository inventory, and the live technical baseline. GSC remains N/A because the available credential lacks Search Console scope. PageSpeed Insights mobile and desktop requests for `https://zhenguocool.com/` both returned HTTP 429 at 2026-07-28T14:41:07Z, so no PSI score, median, or performance change is inferred.

## Index Decision Matrix

| Page | Current state | Decision | Canonical / hreflang | Sitemap / entry | Reason |
| --- | --- | --- | --- | --- | --- |
| `/tools/` | Indexable, linked from header and home, absent | Add | Self canonical; no alternate because no localized hub exists | Add; header and home | Stable two-product hub with independent discovery intent. |
| `/tools/instagram-insights-passive/` | Indexable, already listed | Keep | Self canonical; root, zh-CN, en, ja cluster | Keep; Hub and MyTools | Primary Traditional Chinese product page. |
| `/zh-cn/tools/instagram-insights-passive/` | Indexable, linked by language switcher, absent | Add | Self canonical; same four-page cluster | Add; language switcher | Distinct Simplified Chinese product page. |
| `/en/tools/instagram-insights-passive/` | Indexable, linked by language switcher, absent | Add | Self canonical; same four-page cluster | Add; language switcher | Distinct English product page. |
| `/ja/tools/instagram-insights-passive/` | Indexable, linked by language switcher, absent | Add | Self canonical; same four-page cluster | Add; language switcher | Distinct Japanese product page. |
| `/tools/instagram-insights-passive/updates/` | Indexable, linked from product navigation, absent | Add | Self canonical; zh-Hant/en cluster | Add; product navigation | Maintained release notes with a clear product intent. |
| `/en/tools/instagram-insights-passive/updates/` | Indexable, linked by language switcher, absent | Add | Self canonical; zh-Hant/en cluster | Add; product navigation | English counterpart of maintained release notes. |
| Passive Analytics FAQ / Install | No standalone routes exist | Do not create | N/A | N/A | FAQ and install are product-page sections/CTAs, not independent pages. |
| `/tools/youtube-channel-metrics/` | Indexable, already listed | Keep | Self canonical; no localized counterpart exists | Keep; Hub and MyTools | Primary YouTube product page. |
| YouTube auxiliary pages | No standalone routes exist | Do not create | N/A | N/A | No FAQ, install, or updates URL exists to index. |
| `/privacy/passive-analytics/` and `/en/privacy/passive-analytics/` | Indexable, already listed | Keep | Self canonicals; zh-Hant/en alternates | Keep; product footer | Required product policy pages with live alternates. |
| `/mytools/ai-rag-intro/` | Indexable by default, course card and ItemList entry, absent | Add | Self canonical; no alternate | Add; MyTools course list | Stable, distinct Lesson 7 content. |
| `/mytools/ai-methods/` | Indexable by default, course card and ItemList entry, absent | Add | Self canonical; no alternate | Add; MyTools course list | Stable, distinct Lesson 8 content. |
| `/mytools/agentic-workflow/` | Indexable by default, course card and ItemList entry, absent | Add | Self canonical; no alternate | Add; MyTools course list | Stable, distinct Lesson 9 content. |
| `/mytools/quote-generator/` | `noindex,nofollow`, linked practical tool | Keep accessible, not sitemap | N/A for noindex operational page | Exclude; MyTools | Session-local operational utility, not an organic landing page. |
| `/mytools/quote-generator/V1/` | `noindex,nofollow`, preview | Keep accessible, not sitemap | N/A for noindex preview | Exclude; only from current tool | Versioned preview has no independent search value. |
| `/thanks/`, `/zh-tw/thanks/`, `/zh-cn/thanks/`, `/en/thanks/` | `noindex, follow` form confirmation pages | Keep accessible, not sitemap | Self canonical; noindex | Exclude; form success only | Transactional success states must not compete in search. |
| `/wuhan-itinerary-2026-07/` | Orphan, absent from sitemap, unrelated to the official site | Noindex, keep accessible | N/A for noindex orphan | Exclude; no detected internal entry | Avoid indexing unrelated, unmaintained content; no redirect is warranted. |

## Technical Evidence and Limits

- Live baseline before the change: `node tools/technical-baseline.mjs` reported sitemap 127/127 HTTP 200, no missing sitemap canonical, and 127/127 unique internal-link targets HTTP 200.
- GSC: N/A. The stored M0 baseline records an HTTP 403 caused by missing Search Console OAuth scope; no index-performance inference is made.
- PSI raw request URL: `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https%3A%2F%2Fzhenguocool.com%2F&strategy=mobile&category=performance`, repeated with `strategy=desktop`. Both returned HTTP 429 at the timestamp above. No performance CSS change is inferred from unavailable PSI data.
- Keyboard checks in clean headless Chrome found no horizontal overflow at 1440px or 390px on the home page, Product Hub, or Passive Analytics page. Desktop and mobile Tab sequences exposed only visible controls with the browser focus indicator. The homepage coral and teal tokens were adjusted from 3.72:1 and 4.12:1 against white to 4.77:1 and 4.93:1, respectively.
- A full generator rebuild initially exposed that approved M3 root-only CTA output was static-only. Its exact five root service modules and one cost-Insight CTA are now regenerated from the existing source file so future sitemap builds do not remove them; this does not add routes or expand M3 coverage.
- No root or `/zh-tw/` migration or redirect is introduced. The Passive Analytics hreflang cluster points only at its four existing routes.
