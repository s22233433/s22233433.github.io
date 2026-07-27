# Website Optimization v2 Baseline

Generated at `2026-07-27T16:46:54.356Z` (`Asia/Taipei` local reporting context) from clean source commit `536a40a357e8f4229ec01a9e2996028c71df8827` and `https://zhenguocool.com`.

## Scope and period

- Requested GA4 and GSC range: `2026-06-30` to `2026-07-27`.
- GA4 returned data only for `2026-07-19` to `2026-07-27`; the GA4 property timezone could not be read because the Admin API is unavailable. No missing days are interpreted as zero traffic.
- Source checkout: `/Users/weiting/Documents/Codex/2026-07-14/https-docs-google-com-spreadsheets-d/work/zhenguocool-site-m1`.

## GA4

Source: Google Analytics Data API, property `546169378`.

| Metric | Value |
| --- | ---: |
| Active users | 47 |
| Sessions | 84 |
| Screen page views | 237 |

Top observed landing pages: Passive Analytics updates 25 sessions, homepage 16, Passive Analytics 11, and MyTools 6. Top observed sources: direct 67 sessions, Google organic 6, and Instagram social 3.

The leading received events were `page_view` 237, `user_engagement` 140, `session_start` 83, `scroll` 59, `language_switch` 8, and GA4-reported `form_start` 5. This is an observed baseline, not a reason to rename the existing `lead_form_start` implementation.

GA4 Admin API checks for custom dimensions, Key Events, and internal-traffic filters are **N/A**: `analyticsadmin.googleapis.com` is disabled for the available local credential project. No account setting was changed.

## GSC and PSI

- GSC query, landing-page, CTR, position, and indexed-page data: **N/A**. The available credential returned HTTP 403 for insufficient Search Console scopes. No SEO conclusion is inferred.
- PSI/Lighthouse mobile and desktop: **N/A**. The first PageSpeed Insights mobile request returned HTTP 429 because the unauthenticated daily quota was exhausted. No score or three-run median is reported.

## Live technical baseline

The full live snapshot is in [technical-baseline.json](technical-baseline.json).

- Sitemap: 127 URLs; all 127 returned HTTP 200.
- Canonical: none missing in sitemap URLs.
- hreflang: 8 sitemap URLs have none, all under MyTools plus the YouTube product page. This is recorded only; its index decision is deferred to Milestone 4.
- Internal links: 1,426 edges across 126 unique internal URLs; all returned HTTP 200.
- Existing 24-page live technical audit: 24/24 passed title, description, H1, canonical, hreflang, schema, sitemap, internal-link presence, GA markup, and mobile markup checks.

No sitemap, canonical, hreflang, redirect, or 404 decision was changed in this milestone.

## Re-run commands

```bash
node /Users/weiting/Documents/Codex/2026-07-14/https-docs-google-com-spreadsheets-d/work/zhenguocool-site/tools/read-ga4.mjs 2026-06-30 2026-07-27

cd /Users/weiting/Documents/Codex/2026-07-14/https-docs-google-com-spreadsheets-d/work/zhenguocool-site-m1
SITE_URL=https://zhenguocool.com node tools/technical-baseline.mjs
SITE_URL=https://zhenguocool.com node tests/seo-phase-one-live-audit.mjs
```

The GA reader is a pre-existing untracked local file in the original checkout. It was read and executed without being moved, overwritten, or committed. GSC requires an OAuth credential with Search Console scope. When PSI quota returns, run each selected URL in mobile and desktop mode three times and record the median.
