import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { seoPhaseOnePages } from "./seo-phase-one-content.mjs";

const site = (process.env.SITE_URL || "https://zhenguocool.com").replace(/\/$/, "");
const chrome = process.env.CHROME_BIN || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const port = Number(process.env.GA4_CDP_PORT || 9500 + (process.pid % 300));
const measurementId = "G-3G60NBREE3";
const timeoutMs = Number(process.env.GA4_TIMEOUT_MS || 12000);
const locales = [
  { key: "zh-TW", prefix: "", lang: "zh-TW" },
  { key: "zh-CN", prefix: "/zh-cn", lang: "zh-CN" },
  { key: "en", prefix: "/en", lang: "en" }
];
const collectHosts = new Set(["www.google-analytics.com", "google-analytics.com", "analytics.google.com", "region1.google-analytics.com"]);
const piiKey = /(^|[_.])(email|e-mail|phone|tel|name|contact|company|brand|message|body)([_.]|$)/i;
const emailValue = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const phoneValue = /(?:\+?\d[\s().-]?){7,}\d/;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const withDebug = (url) => { const target = new URL(url); target.searchParams.set("ga_debug", "1"); return target.href; };
const withoutDebug = (url) => { const target = new URL(url); target.searchParams.delete("ga_debug"); return target.href; };
const pageUrl = (page, locale) => `${site}${locale.prefix}/${page.kind === "article" ? "insights" : "services"}/${page.slug}/`;
const pathnameWithSearch = (url) => { const target = new URL(url); return `${target.pathname}${target.search}`; };
const normalizedUrl = (url) => new URL(url).href;

const paramsFrom = (url, postData = "") => {
  const params = {};
  const add = (entries) => {
    for (const [key, value] of entries) {
      if (Object.hasOwn(params, key)) params[key] = Array.isArray(params[key]) ? [...params[key], value] : [params[key], value];
      else params[key] = value;
    }
  };
  add(new URL(url).searchParams);
  if (postData) add(new URLSearchParams(postData));
  return params;
};

const parseCollect = (request, status = null) => {
  const target = new URL(request.url);
  if (!collectHosts.has(target.hostname) || !target.pathname.endsWith("/g/collect")) return null;
  const parameters = paramsFrom(request.url, request.postData || "");
  const value = (key) => Array.isArray(parameters[key]) ? parameters[key].at(-1) : parameters[key] || null;
  return {
    request_id: request.requestId,
    raw_url: request.url,
    raw_post_data: request.postData || null,
    parameters,
    tid: value("tid"),
    event: value("en"),
    page_location: value("dl"),
    page_title: value("dt"),
    language: value("ul"),
    locale: value("ep.locale"),
    content_type: value("ep.content_type"),
    content_slug: value("ep.content_slug"),
    service_name: value("ep.service_name"),
    cta_location: value("ep.cta_location"),
    target_url: value("ep.target_url"),
    from_locale: value("ep.from_locale"),
    to_locale: value("ep.to_locale"),
    debug_mode: value("ep.debug_mode"),
    request_time: request.timestamp,
    http_status: status
  };
};

class Cdp {
  constructor(url) {
    this.ws = new WebSocket(url);
    this.id = 0;
    this.pending = new Map();
    this.events = [];
  }

  async open() {
    await new Promise((resolve, reject) => { this.ws.onopen = resolve; this.ws.onerror = reject; });
    this.ws.onmessage = ({ data }) => {
      const message = JSON.parse(data);
      if (message.id) {
        this.pending.get(message.id)?.(message);
        this.pending.delete(message.id);
      } else {
        this.events.push({ ...message, observed_at: new Date().toISOString(), observed_ms: Date.now() });
      }
    };
  }

  send(method, params = {}, sessionId) {
    return new Promise((resolve, reject) => {
      const id = ++this.id;
      const timer = setTimeout(() => { this.pending.delete(id); reject(new Error(`CDP timeout: ${method}`)); }, timeoutMs);
      this.pending.set(id, (message) => {
        clearTimeout(timer);
        message.error ? reject(new Error(message.error.message)) : resolve(message.result);
      });
      this.ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
    });
  }

  eventsAfter(index, sessionId) {
    return this.events.slice(index).filter((event) => !sessionId || event.sessionId === sessionId);
  }

  async waitFor(after, sessionId, predicate, description, waitMs = timeoutMs) {
    const deadline = Date.now() + waitMs;
    while (Date.now() < deadline) {
      const events = this.eventsAfter(after, sessionId);
      const result = await predicate(events);
      if (result) return result;
      await delay(50);
    }
    throw new Error(`Timed out waiting for ${description}`);
  }

  close() { this.ws.close(); }
}

const requestRows = (events) => {
  const statuses = new Map(events.filter((event) => event.method === "Network.responseReceived").map((event) => [event.params.requestId, event.params.response.status]));
  return events
    .filter((event) => event.method === "Network.requestWillBeSent")
    .map((event) => parseCollect({ requestId: event.params.requestId, ...event.params.request }, statuses.get(event.params.requestId) || null))
    .filter(Boolean);
};

const scansForPii = (collects) => collects.flatMap((collect) => Object.entries(collect.parameters).flatMap(([key, value]) => {
  const values = Array.isArray(value) ? value : [value];
  return values.flatMap((item) => (piiKey.test(key) || emailValue.test(item) || phoneValue.test(item)) ? [{ request_id: collect.request_id, event: collect.event, key, value: item }] : []);
}));

const gaFor = (events, eventName) => requestRows(events).filter((event) => event.event === eventName);
const expectedContent = (url) => {
  const parts = new URL(url).pathname.split("/").filter(Boolean);
  const index = parts.findIndex((part) => ["services", "insights", "cases"].includes(part));
  const content_type = index < 0 ? "homepage" : parts[index] === "insights" ? "article" : parts[index] === "cases" ? "case_study" : "service";
  const content_slug = index < 0 ? "home" : parts[index + 1] || content_type;
  return { content_type, content_slug, ...(content_type === "service" ? { service_name: content_slug } : {}) };
};

function eventParameters(event, context, extra = {}) {
  const expected = {
    page_path: pathnameWithSearch(context.url),
    page_title: context.title,
    locale: context.locale,
    ...expectedContent(context.url),
    ...extra
  };
  const actual = {
    page_path: event?.parameters["ep.page_path"] || null,
    page_title: event?.page_title || null,
    locale: event?.locale || null,
    content_type: event?.content_type || null,
    content_slug: event?.content_slug || null,
    service_name: event?.service_name || null,
    cta_location: event?.cta_location || null,
    target_url: event?.target_url || null,
    from_locale: event?.from_locale || null,
    to_locale: event?.to_locale || null,
    debug_mode: event?.debug_mode || null
  };
  const mismatches = Object.entries(expected).flatMap(([key, value]) => value === undefined ? [] : actual[key] === value ? [] : [{ key, expected: value, actual: actual[key] }]);
  if (context.debug && actual.debug_mode !== "true") mismatches.push({ key: "debug_mode", expected: "true", actual: actual.debug_mode });
  if (!context.debug && actual.debug_mode !== null) mismatches.push({ key: "debug_mode", expected: null, actual: actual.debug_mode });
  return { expected, actual, mismatches, passed: mismatches.length === 0 };
}

async function waitForChrome() {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try { return await (await fetch(`http://127.0.0.1:${port}/json/version`)).json(); } catch { await delay(100); }
  }
  throw new Error("Chrome CDP did not start");
}

async function withPage(cdp, callback) {
  const context = await cdp.send("Target.createBrowserContext");
  try {
    const target = await cdp.send("Target.createTarget", { url: "about:blank", browserContextId: context.browserContextId });
    const attached = await cdp.send("Target.attachToTarget", { targetId: target.targetId, flatten: true });
    const sessionId = attached.sessionId;
    await Promise.all(["Network.enable", "Page.enable", "Runtime.enable"].map((method) => cdp.send(method, {}, sessionId)));
    return await callback(sessionId);
  } finally {
    await cdp.send("Target.disposeBrowserContext", { browserContextId: context.browserContextId });
  }
}

const responseForUrl = (events, url) => events.find((event) => event.method === "Network.responseReceived" && event.params.type === "Document" && normalizedUrl(event.params.response.url) === normalizedUrl(url));
const pageViewFor = (events, url) => gaFor(events, "page_view").find((event) => event.page_location === normalizedUrl(url));

async function waitForGaIdle(cdp, after, sessionId, description) {
  const deadline = Date.now() + 3000;
  let latest = 0;
  while (Date.now() < deadline) {
    const collects = requestRows(cdp.eventsAfter(after, sessionId));
    if (collects.length) {
      const last = cdp.eventsAfter(after, sessionId).filter((event) => event.method === "Network.requestWillBeSent" && parseCollect({ requestId: event.params.requestId, ...event.params.request })).at(-1);
      latest = last?.observed_ms || latest;
      if (latest && Date.now() - latest >= 350) return collects;
    }
    await delay(50);
  }
  throw new Error(`Timed out waiting for GA network idle after ${description}`);
}

async function pageInfo(cdp, sessionId) {
  const result = await cdp.send("Runtime.evaluate", { expression: "JSON.stringify({title:document.title,locale:document.documentElement.lang,url:location.href})", returnByValue: true }, sessionId);
  return JSON.parse(result.result.value);
}

async function visit(cdp, sessionId, url) {
  const start = cdp.events.length;
  await cdp.send("Page.navigate", { url }, sessionId);
  await cdp.waitFor(start, sessionId, (events) => responseForUrl(events, url), `document response for ${url}`);
  await cdp.waitFor(start, sessionId, (events) => pageViewFor(events, url), `page_view for ${url}`);
  await waitForGaIdle(cdp, start, sessionId, `page load ${url}`);
  const events = cdp.eventsAfter(start, sessionId);
  const response = responseForUrl(events, url);
  return { start, url: normalizedUrl(url), page: await pageInfo(cdp, sessionId), http_status: response?.params.response.status || null, events, collects: requestRows(events) };
}

async function trigger(cdp, sessionId, selector, description) {
  const start = cdp.events.length;
  const expression = `(() => { const element = document.querySelector(${JSON.stringify(selector)}); if (!element) throw new Error(${JSON.stringify(`Missing selector: ${selector}`)}); element.scrollIntoView({block:"center"}); const target_url = element instanceof HTMLAnchorElement ? element.href : location.href; element.click(); return JSON.stringify({target_url}); })()`;
  const result = await cdp.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true }, sessionId);
  return { start, target_url: JSON.parse(result.result.value).target_url, description };
}

async function runClickCheck(cdp, definition) {
  return withPage(cdp, async (sessionId) => {
    const url = withDebug(definition.url);
    const loaded = await visit(cdp, sessionId, url);
    const action = await trigger(cdp, sessionId, definition.selector, definition.name);
    const collected = await cdp.waitFor(action.start, sessionId, (events) => gaFor(events, definition.event).find((event) => event.cta_location === definition.location), `${definition.event} from ${definition.name}`);
    await waitForGaIdle(cdp, action.start, sessionId, definition.name);
    const events = cdp.eventsAfter(action.start, sessionId);
    const actual = gaFor(events, definition.event).filter((event) => event.cta_location === definition.location);
    const context = { url, title: loaded.page.title, locale: loaded.page.locale, debug: true };
    const validation = eventParameters(actual[0], context, { cta_location: definition.location, target_url: action.target_url });
    const pii = scansForPii(requestRows(events));
    return {
      event: definition.event,
      test: definition.name,
      test_page: url,
      expected_count: 1,
      actual_count: actual.length,
      duplicate: actual.length > 1,
      parameters: validation,
      raw_collects: requestRows(events),
      pii_findings: pii,
      passed: actual.length === 1 && validation.passed && pii.length === 0,
      reason: actual.length !== 1 ? [`Expected one ${definition.event} at ${definition.location}; received ${actual.length}.`] : validation.passed && !pii.length ? [] : ["Event parameter or privacy validation failed."]
    };
  });
}

async function runLanguageCheck(cdp, definition) {
  return withPage(cdp, async (sessionId) => {
    const fromUrl = withDebug(definition.url);
    const loaded = await visit(cdp, sessionId, fromUrl);
    const action = await trigger(cdp, sessionId, `[data-lang-link="${definition.targetLink}"]`, definition.name);
    const expectedTarget = withDebug(action.target_url);
    await cdp.waitFor(action.start, sessionId, (events) => gaFor(events, "language_switch").find((event) => event.from_locale === definition.from && event.to_locale === definition.to), `language_switch ${definition.name}`);
    await cdp.waitFor(action.start, sessionId, (events) => pageViewFor(events, expectedTarget), `language page_view ${definition.name}`);
    await waitForGaIdle(cdp, action.start, sessionId, definition.name);
    const events = cdp.eventsAfter(action.start, sessionId);
    const switches = gaFor(events, "language_switch");
    const pages = gaFor(events, "page_view").filter((event) => event.page_location === expectedTarget);
    const context = { url: fromUrl, title: loaded.page.title, locale: definition.from, debug: true };
    const validation = eventParameters(switches[0], context, { from_locale: definition.from, to_locale: definition.to, target_url: expectedTarget });
    const pii = scansForPii(requestRows(events));
    return {
      event: "language_switch",
      test: definition.name,
      test_page: fromUrl,
      expected_count: 1,
      actual_count: switches.length,
      page_view_count_after_switch: pages.length,
      duplicate: switches.length > 1 || pages.length > 1,
      parameters: validation,
      raw_collects: requestRows(events),
      pii_findings: pii,
      passed: switches.length === 1 && pages.length === 1 && validation.passed && pii.length === 0,
      reason: switches.length !== 1 || pages.length !== 1 ? [`Expected one language_switch and one destination page_view; received ${switches.length} and ${pages.length}.`] : validation.passed && !pii.length ? [] : ["Language event parameter or privacy validation failed."]
    };
  });
}

const fillForm = `
  const form = document.querySelector('#lead-form');
  for (const field of form.querySelectorAll('input[required], select[required], textarea[required]')) {
    if (field.type === 'email') field.value = 'ga4-test@example.invalid';
    else if (field.tagName === 'SELECT') field.selectedIndex = 1;
    else field.value = 'GA4 verification';
  }
`;

async function runLeadCheck(cdp, mode) {
  return withPage(cdp, async (sessionId) => {
    const url = withDebug(`${site}/`);
    const loaded = await visit(cdp, sessionId, url);
    const start = cdp.events.length;
    const isInvalid = mode === "empty" || mode === "invalid";
    const expression = `(() => {
      const form = document.querySelector('#lead-form');
      window.__zgInvalid = false;
      form.addEventListener('invalid', () => { window.__zgInvalid = true; }, {capture:true, once:true});
      window.fetch = async () => new Response('', {status:${mode === "error" ? 500 : 200}});
      ${mode === "empty" ? "" : fillForm}
      ${mode === "invalid" ? "form.elements.email.value = 'not-an-email';" : ""}
      form.requestSubmit();
      ${mode === "double" ? "form.requestSubmit();" : ""}
    })()`;
    await cdp.send("Runtime.evaluate", { expression, awaitPromise: true }, sessionId);
    if (isInvalid) {
      await cdp.waitFor(start, sessionId, async () => {
        const value = await cdp.send("Runtime.evaluate", { expression: "window.__zgInvalid === true", returnByValue: true }, sessionId);
        return value.result.value === true;
      }, `native validation for ${mode}`);
    } else if (mode === "error") {
      await cdp.waitFor(start, sessionId, (events) => gaFor(events, "lead_form_error")[0], "lead_form_error");
    } else {
      await cdp.waitFor(start, sessionId, (events) => gaFor(events, "generate_lead")[0], `generate_lead ${mode}`);
      await cdp.waitFor(start, sessionId, (events) => pageViewFor(events, `${site}/thanks/`), `thank-you page_view ${mode}`);
    }
    if (!isInvalid) await waitForGaIdle(cdp, start, sessionId, `lead ${mode}`);
    const events = cdp.eventsAfter(start, sessionId);
    const leads = gaFor(events, "generate_lead");
    const pii = scansForPii(requestRows(events));
    const context = { url, title: loaded.page.title, locale: loaded.page.locale, debug: true };
    const validation = leads.length ? eventParameters(leads[0], context) : { expected: {}, actual: {}, mismatches: [], passed: true };
    const expected = ["success", "double"].includes(mode) ? 1 : 0;
    return {
      event: "generate_lead",
      test: mode,
      test_page: url,
      expected_count: expected,
      actual_count: leads.length,
      duplicate: leads.length > 1,
      parameters: validation,
      raw_collects: requestRows(events),
      pii_findings: pii,
      passed: leads.length === expected && validation.passed && pii.length === 0,
      reason: leads.length !== expected ? [`Expected ${expected} generate_lead event(s); received ${leads.length}.`] : validation.passed && !pii.length ? [] : ["Lead event parameter or privacy validation failed."]
    };
  });
}

async function runLifecycleChecks(cdp) {
  const checks = [];
  checks.push(await withPage(cdp, async (sessionId) => {
    const url = withDebug(`${site}/services/influencer-marketing-agency/`);
    await visit(cdp, sessionId, url);
    const start = cdp.events.length;
    await cdp.send("Page.reload", { ignoreCache: true }, sessionId);
    await cdp.waitFor(start, sessionId, (events) => pageViewFor(events, url), "reload page_view");
    await waitForGaIdle(cdp, start, sessionId, "reload");
    const pageViews = gaFor(cdp.eventsAfter(start, sessionId), "page_view").filter((event) => event.page_location === url);
    return { event: "page_view", test: "reload", test_page: url, expected_count: 1, actual_count: pageViews.length, duplicate: pageViews.length > 1, raw_collects: requestRows(cdp.eventsAfter(start, sessionId)), passed: pageViews.length === 1, reason: pageViews.length === 1 ? [] : [`Expected one reload page_view; received ${pageViews.length}.`] };
  }));
  checks.push(await withPage(cdp, async (sessionId) => {
    const url = withoutDebug(`${site}/`);
    const loaded = await visit(cdp, sessionId, url);
    const pageView = gaFor(loaded.events, "page_view")[0];
    const validation = eventParameters(pageView, { url, title: loaded.page.title, locale: loaded.page.locale, debug: false });
    return { event: "page_view", test: "no_debug_fresh_context", test_page: url, expected_count: 1, actual_count: gaFor(loaded.events, "page_view").length, duplicate: gaFor(loaded.events, "page_view").length > 1, parameters: validation, raw_collects: loaded.collects, passed: gaFor(loaded.events, "page_view").length === 1 && validation.passed, reason: validation.passed ? [] : ["Fresh non-debug context included debug_mode or mismatched page parameters."] };
  }));
  checks.push(await withPage(cdp, async (sessionId) => {
    await visit(cdp, sessionId, withDebug(`${site}/`));
    const url = withoutDebug(`${site}/services/influencer-marketing-agency/`);
    const loaded = await visit(cdp, sessionId, url);
    const pageView = gaFor(loaded.events, "page_view")[0];
    const validation = eventParameters(pageView, { url, title: loaded.page.title, locale: loaded.page.locale, debug: true });
    return { event: "page_view", test: "session_debug_persists", test_page: url, expected_count: 1, actual_count: gaFor(loaded.events, "page_view").length, duplicate: gaFor(loaded.events, "page_view").length > 1, parameters: validation, raw_collects: loaded.collects, passed: gaFor(loaded.events, "page_view").length === 1 && validation.passed, reason: validation.passed ? [] : ["sessionStorage ga_debug did not retain debug_mode on a no-query navigation."] };
  }));
  return checks;
}

const markdown = (report) => {
  const coverageRows = report.coverage.map((item) => `| ${item.locale} | ${item.url} | ${item.page_view_count} | ${item.http_status || "-"} | ${item.measurement_id || "-"} | ${item.passed ? "PASS" : "FAIL"} |`).join("\n");
  const interactions = [...report.lifecycle, ...report.interaction_events];
  const interactionRows = interactions.map((item) => `| ${item.event} | ${item.test || "-"} | ${item.expected_count} | ${item.actual_count} | ${item.duplicate ? "yes" : "no"} | ${item.passed ? "PASS" : "FAIL"} |`).join("\n");
  const failures = report.failures.length ? report.failures.map((item) => `- **${item.event} / ${item.test || item.url}**: ${item.reason.join(" ")}`).join("\n") : "- None.";
  return `# GA4 Network Report

Generated: ${report.generated_at}

## Test method

- Every route uses a new Chrome Browser Context, so cookies, localStorage, and sessionStorage start empty.
- Each assertion waits for its expected GA4 collect request or an explicit timeout; there is no fixed page or interaction sleep.
- Raw request evidence, complete parameters, response status, and PII scan results are in the JSON companion report.
- Browser language (GA4 \`ul\`) reflects the isolated test browser. Route correctness uses the explicit \`ep.locale\` value.
- SPA route test: **N/A**. This is a static multi-page site; route changes load a new document.

## 24-page coverage

| Locale | URL | page_view | HTTP | Measurement ID | Result |
| --- | --- | ---: | ---: | --- | --- |
${coverageRows}

## Lifecycle and interaction events

| Event | Test | Expected | Actual | Duplicate | Result |
| --- | --- | ---: | ---: | --- | --- |
${interactionRows}

## Failed items

${failures}

## DebugView manual confirmation

1. Sign in to GA4 and open **Admin -> Data display -> DebugView**.
2. In a browser with no ad blocker, open [${withDebug(site)}](${withDebug(site)}).
3. Open the page, switch language once, click a service CTA, click an article CTA, and submit one test form.
4. Confirm \`page_view\`, \`language_switch\`, one CTA event, and \`generate_lead\`.
5. Open events to confirm \`locale\`, \`page_path\`, \`content_slug\`, \`cta_location\`, and that no PII is present.
6. Capture the DebugView timeline as the final owner-only evidence.
`;
};

const profile = await mkdtemp(path.join(tmpdir(), "zg-ga4-"));
const child = spawn(chrome, ["--headless=new", "--disable-extensions", "--disable-component-extensions-with-background-pages", "--disable-default-apps", "--no-first-run", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "about:blank"], { stdio: "ignore" });
let cdp;
try {
  const version = await waitForChrome();
  cdp = new Cdp(version.webSocketDebuggerUrl);
  await cdp.open();
  const coverage = [];
  for (const page of seoPhaseOnePages) for (const locale of locales) {
    const expected = { url: pageUrl(page, locale), locale: locale.key, lang: locale.lang };
    const result = await withPage(cdp, (sessionId) => visit(cdp, sessionId, withDebug(expected.url)));
    const pageViews = gaFor(result.events, "page_view");
    const event = pageViews[0];
    const validation = eventParameters(event, { url: withDebug(expected.url), title: result.page.title, locale: expected.lang, debug: true });
    const pii = scansForPii(result.collects);
    coverage.push({
      url: expected.url,
      locale: expected.locale,
      page_view_count: pageViews.length,
      measurement_id: event?.tid || null,
      page_location: event?.page_location || null,
      page_title: event?.page_title || null,
      language: event?.language || null,
      http_status: result.http_status,
      parameters: validation,
      raw_collects: result.collects,
      pii_findings: pii,
      passed: result.http_status === 200 && pageViews.length === 1 && event?.tid === measurementId && validation.passed && pii.length === 0,
      reason: result.http_status !== 200 ? [`HTTP status was ${result.http_status}.`] : pageViews.length !== 1 ? [`Expected one page_view; received ${pageViews.length}.`] : event?.tid !== measurementId ? [`Measurement ID was ${event?.tid || "missing"}.`] : validation.passed && !pii.length ? [] : ["Page-view parameter or privacy validation failed."]
    });
  }
  const interactions = [];
  for (const definition of [
    { name: "service hero CTA", url: `${site}/services/influencer-marketing-agency/`, selector: '[data-track-event="service_cta_click"][data-track-location="hero"]', event: "service_cta_click", location: "hero" },
    { name: "service final CTA", url: `${site}/services/influencer-marketing-agency/`, selector: '[data-track-event="service_cta_click"][data-track-location="final"]', event: "service_cta_click", location: "final" },
    { name: "article hero CTA", url: `${site}/insights/how-to-choose-influencer-marketing-agency/`, selector: '[data-track-event="article_cta_click"][data-track-location="hero"]', event: "article_cta_click", location: "hero" },
    { name: "contact navigation", url: `${site}/`, selector: '[data-track-event="contact_click"][data-track-location="nav"]', event: "contact_click", location: "nav" },
    { name: "case study card", url: `${site}/`, selector: '[data-track-event="case_study_click"][data-track-location="case-card"]', event: "case_study_click", location: "case-card" },
    { name: "quote request hero", url: `${site}/`, selector: '[data-track-event="quote_request_click"][data-track-location="hero"]', event: "quote_request_click", location: "hero" }
  ]) interactions.push(await runClickCheck(cdp, definition));
  for (const definition of [
    { name: "zh-TW to zh-CN", url: `${site}/services/influencer-marketing-agency/`, targetLink: "zh-Hans", from: "zh-TW", to: "zh-CN" },
    { name: "zh-CN to en", url: `${site}/zh-cn/services/influencer-marketing-agency/`, targetLink: "en", from: "zh-CN", to: "en" },
    { name: "en to zh-TW", url: `${site}/en/services/influencer-marketing-agency/`, targetLink: "zh-Hant", from: "en", to: "zh-TW" }
  ]) interactions.push(await runLanguageCheck(cdp, definition));
  for (const mode of ["empty", "invalid", "error", "success", "double"]) interactions.push(await runLeadCheck(cdp, mode));
  const lifecycle = await runLifecycleChecks(cdp);
  const report = {
    generated_at: new Date().toISOString(),
    site,
    measurement_id: measurementId,
    storage_isolation: "A new CDP BrowserContext is created per check; no cookies, localStorage, or sessionStorage are reused.",
    spa_route_change: { applicable: false, reason: "Static multi-page site; route changes create a new document." },
    coverage,
    lifecycle,
    interaction_events: interactions,
    failures: [...coverage, ...lifecycle, ...interactions].filter((item) => !item.passed),
    summary: {
      coverage_passed: coverage.filter((item) => item.passed).length,
      coverage_total: coverage.length,
      lifecycle_passed: lifecycle.filter((item) => item.passed).length,
      lifecycle_total: lifecycle.length,
      interactions_passed: interactions.filter((item) => item.passed).length,
      interactions_total: interactions.length
    }
  };
  await mkdir("artifacts", { recursive: true });
  await writeFile("artifacts/ga4-network-report.json", `${JSON.stringify(report, null, 2)}\n`);
  await writeFile("artifacts/ga4-network-report.md", markdown(report));
  console.log(JSON.stringify(report.summary));
  if (report.failures.length) process.exitCode = 1;
} finally {
  cdp?.close();
  child.kill("SIGTERM");
  await rm(profile, { recursive: true, force: true });
}
