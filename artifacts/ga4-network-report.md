# GA4 Network Report

Generated: 2026-07-27T17:21:04.318Z

## Test method

- Every route uses a new Chrome Browser Context, so cookies, localStorage, and sessionStorage start empty.
- Each expected GA4 collect waits for its matching `Network.responseReceived` by request ID; expected events require a 2xx response.
- Raw request evidence, complete parameters, response status, and PII scan results are in the JSON companion report.
- Browser language (GA4 `ul`) reflects the isolated test browser. Route correctness uses the explicit `ep.locale` value.
- SPA route test: **N/A**. This is a static multi-page site; route changes load a new document.

## 24-page coverage

| Locale | URL | page_view | HTTP | Measurement ID | Result |
| --- | --- | ---: | ---: | --- | --- |
| zh-TW | https://zhenguocool.com/services/influencer-marketing-agency/ | 1 | 200 | G-3G60NBREE3 | PASS |
| zh-CN | https://zhenguocool.com/zh-cn/services/influencer-marketing-agency/ | 1 | 200 | G-3G60NBREE3 | PASS |
| en | https://zhenguocool.com/en/services/influencer-marketing-agency/ | 1 | 200 | G-3G60NBREE3 | PASS |
| zh-TW | https://zhenguocool.com/services/overseas-influencer-marketing-guide/ | 1 | 200 | G-3G60NBREE3 | PASS |
| zh-CN | https://zhenguocool.com/zh-cn/services/overseas-influencer-marketing-guide/ | 1 | 200 | G-3G60NBREE3 | PASS |
| en | https://zhenguocool.com/en/services/overseas-influencer-marketing-guide/ | 1 | 200 | G-3G60NBREE3 | PASS |
| zh-TW | https://zhenguocool.com/services/japan-influencer-marketing-guide/ | 1 | 200 | G-3G60NBREE3 | PASS |
| zh-CN | https://zhenguocool.com/zh-cn/services/japan-influencer-marketing-guide/ | 1 | 200 | G-3G60NBREE3 | PASS |
| en | https://zhenguocool.com/en/services/japan-influencer-marketing-guide/ | 1 | 200 | G-3G60NBREE3 | PASS |
| zh-TW | https://zhenguocool.com/services/tiktok-koc-marketing-guide/ | 1 | 200 | G-3G60NBREE3 | PASS |
| zh-CN | https://zhenguocool.com/zh-cn/services/tiktok-koc-marketing-guide/ | 1 | 200 | G-3G60NBREE3 | PASS |
| en | https://zhenguocool.com/en/services/tiktok-koc-marketing-guide/ | 1 | 200 | G-3G60NBREE3 | PASS |
| zh-TW | https://zhenguocool.com/services/influencer-marketing-costs/ | 1 | 200 | G-3G60NBREE3 | PASS |
| zh-CN | https://zhenguocool.com/zh-cn/services/influencer-marketing-costs/ | 1 | 200 | G-3G60NBREE3 | PASS |
| en | https://zhenguocool.com/en/services/influencer-marketing-costs/ | 1 | 200 | G-3G60NBREE3 | PASS |
| zh-TW | https://zhenguocool.com/insights/taiwan-influencer-marketing-costs-2026/ | 1 | 200 | G-3G60NBREE3 | PASS |
| zh-CN | https://zhenguocool.com/zh-cn/insights/taiwan-influencer-marketing-costs-2026/ | 1 | 200 | G-3G60NBREE3 | PASS |
| en | https://zhenguocool.com/en/insights/taiwan-influencer-marketing-costs-2026/ | 1 | 200 | G-3G60NBREE3 | PASS |
| zh-TW | https://zhenguocool.com/insights/how-to-choose-influencer-marketing-agency/ | 1 | 200 | G-3G60NBREE3 | PASS |
| zh-CN | https://zhenguocool.com/zh-cn/insights/how-to-choose-influencer-marketing-agency/ | 1 | 200 | G-3G60NBREE3 | PASS |
| en | https://zhenguocool.com/en/insights/how-to-choose-influencer-marketing-agency/ | 1 | 200 | G-3G60NBREE3 | PASS |
| zh-TW | https://zhenguocool.com/insights/japan-influencer-marketing-guide-article/ | 1 | 200 | G-3G60NBREE3 | PASS |
| zh-CN | https://zhenguocool.com/zh-cn/insights/japan-influencer-marketing-guide-article/ | 1 | 200 | G-3G60NBREE3 | PASS |
| en | https://zhenguocool.com/en/insights/japan-influencer-marketing-guide-article/ | 1 | 200 | G-3G60NBREE3 | PASS |

## Shared classification regression

| Test | URL | content_type | content_slug | HTTP | Result |
| --- | --- | --- | --- | ---: | --- |
| product zh-TW | https://zhenguocool.com/tools/instagram-insights-passive/?ga_debug=1 | product | instagram-insights-passive | 204 | PASS |
| product zh-CN | https://zhenguocool.com/zh-cn/tools/instagram-insights-passive/?ga_debug=1 | product | instagram-insights-passive | 204 | PASS |
| product en | https://zhenguocool.com/en/tools/instagram-insights-passive/?ga_debug=1 | product | instagram-insights-passive | 204 | PASS |
| mytools | https://zhenguocool.com/mytools/?ga_debug=1 | mytools | mytools | 204 | PASS |
| privacy | https://zhenguocool.com/privacy/passive-analytics/?ga_debug=1 | privacy | passive-analytics | 204 | PASS |
| other | https://zhenguocool.com/wuhan-itinerary-2026-07/?ga_debug=1 | other | wuhan-itinerary-2026-07 | 204 | PASS |

## Lifecycle and interaction events

| Event | Test | Expected | Actual | HTTP | Duplicate | Result |
| --- | --- | ---: | ---: | ---: | --- | --- |
| page_view | reload | 1 | 1 | 204 | no | PASS |
| page_view | no_debug_fresh_context | 1 | 1 | 204 | no | PASS |
| page_view | session_debug_persists | 1 | 1 | 204 | no | PASS |
| service_cta_click | service hero CTA | 1 | 1 | 204 | no | PASS |
| service_cta_click | service final CTA | 1 | 1 | 204 | no | PASS |
| article_cta_click | article hero CTA | 1 | 1 | 204 | no | PASS |
| contact_click | contact navigation | 1 | 1 | 204 | no | PASS |
| case_study_click | case study card | 1 | 1 | 204 | no | PASS |
| quote_request_click | quote request hero | 1 | 1 | 204 | no | PASS |
| language_switch | zh-TW to zh-CN | 1 | 1 | 204 / 204 | no | PASS |
| language_switch | zh-CN to en | 1 | 1 | 204 / 204 | no | PASS |
| language_switch | en to zh-TW | 1 | 1 | 204 / 204 | no | PASS |
| generate_lead | empty | 0 | 0 | - | no | PASS |
| generate_lead | invalid | 0 | 0 | - | no | PASS |
| generate_lead | error | 0 | 0 | - | no | PASS |
| generate_lead | success | 1 | 1 | 204 | no | PASS |
| generate_lead | double | 1 | 1 | 204 | no | PASS |

## Failed items

- None.

## DebugView manual confirmation

1. Sign in to GA4 and open **Admin -> Data display -> DebugView**.
2. In a browser with no ad blocker, open [https://zhenguocool.com/?ga_debug=1](https://zhenguocool.com/?ga_debug=1).
3. Open the page, switch language once, click a service CTA, click an article CTA, and submit one test form.
4. Confirm `page_view`, `language_switch`, one CTA event, and `generate_lead`.
5. Open events to confirm `locale`, `page_path`, `content_slug`, `cta_location`, and that no PII is present.
6. Capture the DebugView timeline as the final owner-only evidence.
