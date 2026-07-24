# GA4 Network Report

Generated: 2026-07-24T03:01:42.453Z

## Test method

- Every route uses a new Chrome Browser Context, so cookies, localStorage, and sessionStorage start empty.
- Each assertion waits for its expected GA4 collect request or an explicit timeout; there is no fixed page or interaction sleep.
- Raw request evidence, complete parameters, response status, and PII scan results are in the JSON companion report.
- Browser language (GA4 `ul`) reflects the isolated test browser. Route correctness uses the explicit `ep.locale` value.
- SPA route test: **N/A**. This is a static multi-page site; route changes load a new document.

## 24-page coverage

| Locale | URL | page_view | HTTP | Measurement ID | Result |
| --- | --- | ---: | ---: | --- | --- |


## Lifecycle and interaction events

| Event | Test | Expected | Actual | Duplicate | Result |
| --- | --- | ---: | ---: | --- | --- |
| generate_lead | success | 1 | 1 | no | PASS |
| generate_lead | double | 1 | 1 | no | PASS |

## Failed items

- None.

## DebugView manual confirmation

1. Sign in to GA4 and open **Admin -> Data display -> DebugView**.
2. In a browser with no ad blocker, open [https://zhenguocool.com/?ga_debug=1](https://zhenguocool.com/?ga_debug=1).
3. Open the page, switch language once, click a service CTA, click an article CTA, and submit one test form.
4. Confirm `page_view`, `language_switch`, one CTA event, and `generate_lead`.
5. Open events to confirm `locale`, `page_path`, `content_slug`, `cta_location`, and that no PII is present.
6. Capture the DebugView timeline as the final owner-only evidence.
