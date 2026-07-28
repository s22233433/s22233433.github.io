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
const targets = process.env.GA4_TARGETS ? process.env.GA4_TARGETS.split("|").filter(Boolean) : [];
const includeProductDiscovery = process.env.GA4_PRODUCT_DISCOVERY === "1";
const includeInternalLinking = process.env.GA4_INTERNAL_LINKING === "1";
const selected = (value) => !targets.length || targets.some((target) => value.includes(target));
const reportName = targets.length ? "ga4-targeted-report" : "ga4-network-report";
const locales = [
  { key: "zh-TW", prefix: "", lang: "zh-TW" },
  { key: "zh-CN", prefix: "/zh-cn", lang: "zh-CN" },
  { key: "en", prefix: "/en", lang: "en" }
];
const collectHosts = new Set(["www.google-analytics.com", "google-analytics.com", "analytics.google.com", "region1.google-analytics.com"]);
const piiKey = /(^|[_.])(email|e-mail|phone|tel|name|contact|company|brand|message|body)([_.]|$)/i;
const allowedEventKeys = new Set(["ep.service_name", "ep.product_name", "ep.content_slug", "ep.content_type", "ep.locale", "ep.page_path", "ep.cta_location", "ep.target_url", "ep.from_locale", "ep.to_locale", "ep.debug_mode"]);
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
    product_name: value("ep.product_name"),
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
    this.formSubmitResponse = null;
    this.formSubmitSessionId = null;
    this.fetchFulfillErrors = [];
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
        if (message.method === "Fetch.requestPaused") {
          const url = message.params.request.url;
          if (this.formSubmitResponse && url.includes("formsubmit.co")) {
            const body = Buffer.from(JSON.stringify(this.formSubmitResponse < 400 ? { success: "true" } : { success: "false" })).toString("base64");
            this.send("Fetch.fulfillRequest", { requestId: message.params.requestId, responseCode: this.formSubmitResponse, responseHeaders: [{ name: "content-type", value: "application/json" }, { name: "access-control-allow-origin", value: site }], body }, message.sessionId).catch((error) => {
              this.fetchFulfillErrors.push({ paused_session: message.sessionId, configured_session: this.formSubmitSessionId, error: error.message });
            });
          }
        }
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
  const sensitiveKey = piiKey.test(key) && !allowedEventKeys.has(key);
  return values.flatMap((item) => (sensitiveKey || emailValue.test(item) || (key.startsWith("ep.") && !allowedEventKeys.has(key) && phoneValue.test(item))) ? [{ request_id: collect.request_id, event: collect.event, key, value: item }] : []);
}));

const gaFor = (events, eventName) => requestRows(events).filter((event) => event.event === eventName);
const is2xx = (event) => Number.isInteger(event?.http_status) && event.http_status >= 200 && event.http_status < 300;
const statusText = (event) => event?.http_status ?? "missing";
async function waitForCollectResponse(cdp, after, sessionId, match, description) {
  const request = await cdp.waitFor(after, sessionId, (events) => requestRows(events).find(match), `${description} collect`);
  await cdp.waitFor(after, sessionId, (events) => events.some((event) => event.method === "Network.responseReceived" && event.params.requestId === request.request_id), `${description} HTTP response`);
}
const expectedContent = (url) => {
  const parts = new URL(url).pathname.split("/").filter(Boolean);
  const route = ["zh-tw", "zh-cn", "en", "ja"].includes(parts[0]) ? parts.slice(1) : parts;
  const section = route[0];
  const content_type = section === "services" ? "service"
    : section === "insights" ? "article"
    : section === "cases" ? "case_study"
    : section === "tools" ? "product"
    : section === "mytools" ? "mytools"
    : section === "privacy" ? "privacy"
    : section ? "other" : "homepage";
  const content_slug = content_type === "homepage" ? "home" : route[1] || (content_type === "other" ? section : content_type);
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
    page_path: event?.parameters.dp || null,
    page_title: event?.page_title || null,
    locale: event?.locale || null,
    content_type: event?.content_type || null,
    content_slug: event?.content_slug || null,
    service_name: event?.service_name || null,
    product_name: event?.product_name || null,
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

async function retryCheck(name, runner, attemptsLimit = 3) {
  const attempts = [];
  let result = null;
  for (let attempt = 1; attempt <= attemptsLimit; attempt += 1) {
    try {
      result = await runner();
      attempts.push({ attempt, passed: result.passed, raw_collects: result.raw_collects || [], reason: result.reason || [] });
      if (result.passed) return { result, attempts };
    } catch (error) {
      attempts.push({ attempt, passed: false, error: error.message, network_evidence: error.network_evidence || null });
    }
  }
  return { result, attempts };
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

async function waitForUi(cdp, sessionId, selector) {
  await cdp.waitFor(0, sessionId, async () => {
    const result = await cdp.send("Runtime.evaluate", { expression: `Boolean(document.querySelector(${JSON.stringify(selector)}) && typeof window.zgTrack === 'function' && window.google_tag_manager)`, returnByValue: true }, sessionId);
    return result.result.value === true;
  }, `UI and analytics readiness for ${selector}`);
}

async function visit(cdp, sessionId, url) {
  const start = cdp.events.length;
  try {
    await cdp.send("Page.navigate", { url }, sessionId);
    await cdp.waitFor(start, sessionId, (events) => responseForUrl(events, url), `document response for ${url}`);
    await waitForCollectResponse(cdp, start, sessionId, (event) => event.event === "page_view" && event.page_location === normalizedUrl(url), `page_view for ${url}`);
    await waitForGaIdle(cdp, start, sessionId, `page load ${url}`);
    const events = cdp.eventsAfter(start, sessionId);
    const response = responseForUrl(events, url);
    return { start, url: normalizedUrl(url), page: await pageInfo(cdp, sessionId), http_status: response?.params.response.status || null, events, collects: requestRows(events) };
  } catch (error) {
    error.network_evidence = { url, collects: requestRows(cdp.eventsAfter(start, sessionId)), requests: cdp.eventsAfter(start, sessionId).filter((event) => event.method === "Network.requestWillBeSent").map((event) => event.params.request.url) };
    throw error;
  }
}

async function trigger(cdp, sessionId, selector, description, holdNavigation = false) {
  const start = cdp.events.length;
  const expression = `(() => { const element = document.querySelector(${JSON.stringify(selector)}); if (!element) throw new Error(${JSON.stringify(`Missing selector: ${selector}`)}); ${holdNavigation ? "document.addEventListener('click', (event) => event.preventDefault(), {capture:true, once:true});" : ""} element.scrollIntoView({block:"center"}); const target_url = element instanceof HTMLAnchorElement ? element.href : location.href; element.click(); return JSON.stringify({target_url}); })()`;
  const result = await cdp.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true }, sessionId);
  return { start, target_url: JSON.parse(result.result.value).target_url, description };
}

async function runClickCheck(cdp, definition) {
  return withPage(cdp, async (sessionId) => {
    const url = withDebug(definition.url);
    const loaded = await visit(cdp, sessionId, url);
    await waitForUi(cdp, sessionId, definition.selector);
    const action = await trigger(cdp, sessionId, definition.selector, definition.name, true);
    await waitForCollectResponse(cdp, action.start, sessionId, (event) => event.event === definition.event && event.cta_location === definition.location, `${definition.event} from ${definition.name}`);
    await waitForGaIdle(cdp, action.start, sessionId, definition.name);
    const events = cdp.eventsAfter(action.start, sessionId);
    const actual = gaFor(events, definition.event).filter((event) => event.cta_location === definition.location);
    const context = { url, title: loaded.page.title, locale: loaded.page.locale, debug: true };
    const validation = eventParameters(actual[0], context, { cta_location: definition.location, target_url: action.target_url, ...(definition.parameters || {}) });
    const pii = scansForPii(requestRows(events));
    return {
      event: definition.event,
      test: definition.name,
      test_page: url,
      expected_count: 1,
      actual_count: actual.length,
      duplicate: actual.length > 1,
      http_status: actual[0]?.http_status ?? null,
      parameters: validation,
      raw_collects: requestRows(events),
      pii_findings: pii,
      passed: actual.length === 1 && is2xx(actual[0]) && validation.passed && pii.length === 0,
      reason: actual.length !== 1 ? [`Expected one ${definition.event} at ${definition.location}; received ${actual.length}.`] : !is2xx(actual[0]) ? [`Expected a 2xx response; received ${statusText(actual[0])}.`] : validation.passed && !pii.length ? [] : ["Event parameter or privacy validation failed."]
    };
  });
}

async function runLanguageCheck(cdp, definition) {
  return withPage(cdp, async (sessionId) => {
    const fromUrl = withDebug(definition.url);
    const loaded = await visit(cdp, sessionId, fromUrl);
    await waitForUi(cdp, sessionId, `[data-lang-link="${definition.targetLink}"]`);
    const action = await trigger(cdp, sessionId, `[data-lang-link="${definition.targetLink}"]`, definition.name, true);
    const expectedTarget = withDebug(action.target_url);
    await waitForCollectResponse(cdp, action.start, sessionId, (event) => event.event === "language_switch" && event.from_locale === definition.from && event.to_locale === definition.to, `language_switch ${definition.name}`);
    const navigationStart = cdp.events.length;
    await cdp.send("Page.navigate", { url: expectedTarget }, sessionId);
    await waitForCollectResponse(cdp, navigationStart, sessionId, (event) => event.event === "page_view" && event.page_location === expectedTarget, `language page_view ${definition.name}`);
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
      http_status: switches[0]?.http_status ?? null,
      destination_page_view_http_status: pages[0]?.http_status ?? null,
      parameters: validation,
      raw_collects: requestRows(events),
      pii_findings: pii,
      passed: switches.length === 1 && pages.length === 1 && is2xx(switches[0]) && is2xx(pages[0]) && validation.passed && pii.length === 0,
      reason: switches.length !== 1 || pages.length !== 1 ? [`Expected one language_switch and one destination page_view; received ${switches.length} and ${pages.length}.`] : !is2xx(switches[0]) || !is2xx(pages[0]) ? [`Expected 2xx responses; received ${statusText(switches[0])} and ${statusText(pages[0])}.`] : validation.passed && !pii.length ? [] : ["Language event parameter or privacy validation failed."]
    };
  });
}

async function runClassificationCheck(cdp, definition) {
  return withPage(cdp, async (sessionId) => {
    const url = withDebug(definition.url);
    const loaded = await visit(cdp, sessionId, url);
    const pageViews = gaFor(loaded.events, "page_view");
    const pageView = pageViews[0];
    const validation = eventParameters(pageView, { url, title: loaded.page.title, locale: loaded.page.locale, debug: true });
    const pii = scansForPii(loaded.collects);
    return {
      event: "page_view",
      test: definition.name,
      test_page: url,
      expected_count: 1,
      actual_count: pageViews.length,
      duplicate: pageViews.length > 1,
      http_status: pageView?.http_status ?? null,
      parameters: validation,
      raw_collects: loaded.collects,
      pii_findings: pii,
      passed: loaded.http_status === 200 && pageViews.length === 1 && pageView?.tid === measurementId && is2xx(pageView) && validation.passed && pii.length === 0,
      reason: loaded.http_status !== 200 ? [`HTTP status was ${loaded.http_status}.`] : pageViews.length !== 1 ? [`Expected one page_view; received ${pageViews.length}.`] : pageView?.tid !== measurementId ? [`Measurement ID was ${pageView?.tid || "missing"}.`] : !is2xx(pageView) ? [`Expected a 2xx response; received ${statusText(pageView)}.`] : validation.passed && !pii.length ? [] : ["Classification parameter or privacy validation failed."]
    };
  });
}

const fillForm = `
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
    await waitForUi(cdp, sessionId, "#lead-form");
    const start = cdp.events.length;
    const isInvalid = mode === "empty" || mode === "invalid";
    if (!isInvalid) {
      cdp.formSubmitResponse = mode === "error" ? 500 : 200;
      cdp.formSubmitSessionId = sessionId;
      cdp.fetchFulfillErrors = [];
      await cdp.send("Fetch.enable", { patterns: [{ urlPattern: "*formsubmit.co/*", requestStage: "Request" }] }, sessionId);
    }
    const expression = `(() => {
      const form = document.querySelector('#lead-form');
      ${mode === "empty" ? "" : fillForm}
      ${mode === "invalid" ? "form.elements.email.value = 'not-an-email';" : ""}
      window.__zgInvalid = !form.checkValidity();
      if (!window.__zgInvalid) form.dispatchEvent(new Event('submit', {bubbles:true, cancelable:true}));
      ${mode === "double" ? "if (!window.__zgInvalid) form.dispatchEvent(new Event('submit', {bubbles:true, cancelable:true}));" : ""}
    })()`;
    const submitted = await cdp.send("Runtime.evaluate", { expression, awaitPromise: true }, sessionId);
    if (submitted.exceptionDetails) throw new Error(`Lead test evaluation failed: ${submitted.exceptionDetails.exception?.description || submitted.exceptionDetails.text}`);
    if (isInvalid) {
      const invalid = await cdp.send("Runtime.evaluate", { expression: "window.__zgInvalid === true", returnByValue: true }, sessionId);
      if (invalid.result.value !== true) throw new Error(`Native validation did not fail for ${mode}`);
    } else if (mode === "error") {
      await cdp.waitFor(start, sessionId, async () => {
        const value = await cdp.send("Runtime.evaluate", { expression: "document.querySelector('[data-form-error]')?.hidden === false", returnByValue: true }, sessionId);
        return value.result.value === true;
      }, "form error state");
    } else {
      try {
        await waitForCollectResponse(cdp, start, sessionId, (event) => event.event === "generate_lead", `generate_lead ${mode}`);
      } catch (error) {
        const state = await cdp.send("Runtime.evaluate", { expression: "JSON.stringify({url:location.href,data_layer_events:(window.dataLayer || []).map((entry) => entry?.event || entry?.[1] || null),tag_manager:Boolean(window.google_tag_manager),gtag:String(window.gtag).slice(0,120)})", returnByValue: true }, sessionId);
        error.network_evidence = {
          form_state: JSON.parse(state.result.value),
          collects: requestRows(cdp.eventsAfter(start, sessionId)),
          requests: cdp.eventsAfter(start, sessionId).filter((event) => event.method === "Network.requestWillBeSent").map((event) => event.params.request.url)
        };
        throw error;
      }
      await waitForCollectResponse(cdp, start, sessionId, (event) => event.event === "page_view" && event.page_location === `${site}/thanks/`, `thank-you page_view ${mode}`);
    }
    if (mode !== "error" && !isInvalid) await waitForGaIdle(cdp, start, sessionId, `lead ${mode}`);
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
      http_status: leads[0]?.http_status ?? null,
      parameters: validation,
      raw_collects: requestRows(events),
      pii_findings: pii,
      passed: leads.length === expected && (expected === 0 || is2xx(leads[0])) && validation.passed && pii.length === 0,
      reason: leads.length !== expected ? [`Expected ${expected} generate_lead event(s); received ${leads.length}.`] : expected && !is2xx(leads[0]) ? [`Expected a 2xx response; received ${statusText(leads[0])}.`] : validation.passed && !pii.length ? [] : ["Lead event parameter or privacy validation failed."]
    };
  });
}

async function runLifecycleChecks(cdp) {
  const checks = [];
  const localSite = ["localhost", "127.0.0.1", "::1"].includes(new URL(site).hostname);
  const add = async (test, runner, fallback) => {
    const outcome = await retryCheck(`lifecycle ${test}`, runner);
    checks.push(outcome.result ? { ...outcome.result, attempts: outcome.attempts } : fallback(outcome.attempts));
  };
  await add("reload", () => withPage(cdp, async (sessionId) => {
    const url = withDebug(`${site}/services/influencer-marketing-agency/`);
    await visit(cdp, sessionId, url);
    const start = cdp.events.length;
    await cdp.send("Page.reload", { ignoreCache: true }, sessionId);
    await waitForCollectResponse(cdp, start, sessionId, (event) => event.event === "page_view" && event.page_location === url, "reload page_view");
    await waitForGaIdle(cdp, start, sessionId, "reload");
    const pageViews = gaFor(cdp.eventsAfter(start, sessionId), "page_view").filter((event) => event.page_location === url);
    return { event: "page_view", test: "reload", test_page: url, expected_count: 1, actual_count: pageViews.length, duplicate: pageViews.length > 1, http_status: pageViews[0]?.http_status ?? null, raw_collects: requestRows(cdp.eventsAfter(start, sessionId)), passed: pageViews.length === 1 && is2xx(pageViews[0]), reason: pageViews.length !== 1 ? [`Expected one reload page_view; received ${pageViews.length}.`] : !is2xx(pageViews[0]) ? [`Expected a 2xx response; received ${statusText(pageViews[0])}.`] : [] };
  }), (attempts) => ({ event: "page_view", test: "reload", test_page: withDebug(`${site}/services/influencer-marketing-agency/`), expected_count: 1, actual_count: 0, duplicate: false, raw_collects: [], passed: false, attempts, reason: ["No reload attempt received the expected page_view collect request."] }));
  if (localSite) {
    checks.push({ event: "page_view", test: "no_debug_fresh_context", applicable: false, expected_count: 0, actual_count: 0, duplicate: false, raw_collects: [], passed: true, reason: ["N/A: localhost intentionally enables debug_mode."] });
  } else await add("no_debug_fresh_context", () => withPage(cdp, async (sessionId) => {
    const url = withoutDebug(`${site}/`);
    const loaded = await visit(cdp, sessionId, url);
    const pageView = gaFor(loaded.events, "page_view")[0];
    const validation = eventParameters(pageView, { url, title: loaded.page.title, locale: loaded.page.locale, debug: false });
    return { event: "page_view", test: "no_debug_fresh_context", test_page: url, expected_count: 1, actual_count: gaFor(loaded.events, "page_view").length, duplicate: gaFor(loaded.events, "page_view").length > 1, http_status: pageView?.http_status ?? null, parameters: validation, raw_collects: loaded.collects, passed: gaFor(loaded.events, "page_view").length === 1 && is2xx(pageView) && validation.passed, reason: !is2xx(pageView) ? [`Expected a 2xx response; received ${statusText(pageView)}.`] : validation.passed ? [] : ["Fresh non-debug context included debug_mode or mismatched page parameters."] };
  }), (attempts) => ({ event: "page_view", test: "no_debug_fresh_context", test_page: withoutDebug(`${site}/`), expected_count: 1, actual_count: 0, duplicate: false, raw_collects: [], passed: false, attempts, reason: ["No non-debug attempt received the expected page_view collect request."] }));
  await add("session_debug_persists", () => withPage(cdp, async (sessionId) => {
    await visit(cdp, sessionId, withDebug(`${site}/`));
    const url = withoutDebug(`${site}/services/influencer-marketing-agency/`);
    const loaded = await visit(cdp, sessionId, url);
    const pageView = gaFor(loaded.events, "page_view")[0];
    const validation = eventParameters(pageView, { url, title: loaded.page.title, locale: loaded.page.locale, debug: true });
    return { event: "page_view", test: "session_debug_persists", test_page: url, expected_count: 1, actual_count: gaFor(loaded.events, "page_view").length, duplicate: gaFor(loaded.events, "page_view").length > 1, http_status: pageView?.http_status ?? null, parameters: validation, raw_collects: loaded.collects, passed: gaFor(loaded.events, "page_view").length === 1 && is2xx(pageView) && validation.passed, reason: !is2xx(pageView) ? [`Expected a 2xx response; received ${statusText(pageView)}.`] : validation.passed ? [] : ["sessionStorage ga_debug did not retain debug_mode on a no-query navigation."] };
  }), (attempts) => ({ event: "page_view", test: "session_debug_persists", test_page: withoutDebug(`${site}/services/influencer-marketing-agency/`), expected_count: 1, actual_count: 0, duplicate: false, raw_collects: [], passed: false, attempts, reason: ["No session-debug attempt received the expected page_view collect request."] }));
  return checks;
}

const markdown = (report) => {
  const coverageRows = report.coverage.map((item) => `| ${item.locale} | ${item.url} | ${item.page_view_count} | ${item.http_status || "-"} | ${item.measurement_id || "-"} | ${item.passed ? "PASS" : "FAIL"} |`).join("\n");
  const classificationRows = report.classification.map((item) => `| ${item.test} | ${item.test_page} | ${item.parameters.actual.content_type || "-"} | ${item.parameters.actual.content_slug || "-"} | ${item.http_status ?? "-"} | ${item.passed ? "PASS" : "FAIL"} |`).join("\n");
  const interactions = [...report.lifecycle, ...report.interaction_events];
  const interactionRows = interactions.map((item) => `| ${item.event} | ${item.test || "-"} | ${item.expected_count} | ${item.actual_count} | ${item.http_status ?? "-"}${item.destination_page_view_http_status ? ` / ${item.destination_page_view_http_status}` : ""} | ${item.duplicate ? "yes" : "no"} | ${item.passed ? "PASS" : "FAIL"} |`).join("\n");
  const failures = report.failures.length ? report.failures.map((item) => `- **${item.event} / ${item.test || item.url}**: ${item.reason.join(" ")}`).join("\n") : "- None.";
  return `# GA4 Network Report

Generated: ${report.generated_at}

## Test method

- Every route uses a new Chrome Browser Context, so cookies, localStorage, and sessionStorage start empty.
- Each expected GA4 collect waits for its matching \`Network.responseReceived\` by request ID; expected events require a 2xx response.
- Raw request evidence, complete parameters, response status, and PII scan results are in the JSON companion report.
- Browser language (GA4 \`ul\`) reflects the isolated test browser. Route correctness uses the explicit \`ep.locale\` value.
- SPA route test: **N/A**. This is a static multi-page site; route changes load a new document.

## 24-page coverage

| Locale | URL | page_view | HTTP | Measurement ID | Result |
| --- | --- | ---: | ---: | --- | --- |
${coverageRows}

## Shared classification regression

| Test | URL | content_type | content_slug | HTTP | Result |
| --- | --- | --- | --- | ---: | --- |
${classificationRows}

## Lifecycle and interaction events

| Event | Test | Expected | Actual | HTTP | Duplicate | Result |
| --- | --- | ---: | ---: | ---: | --- | --- |
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

const writeProgress = async (phase, completed, total, detail) => {
  await mkdir("artifacts", { recursive: true });
  await writeFile("artifacts/ga4-network-progress.json", `${JSON.stringify({ updated_at: new Date().toISOString(), phase, completed, total, detail }, null, 2)}\n`);
};

const profile = await mkdtemp(path.join(tmpdir(), "zg-ga4-"));
const child = spawn(chrome, ["--headless=new", "--disable-extensions", "--disable-component-extensions-with-background-pages", "--disable-default-apps", "--no-first-run", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "about:blank"], { stdio: "ignore" });
let cdp;
try {
  const version = await waitForChrome();
  cdp = new Cdp(version.webSocketDebuggerUrl);
  await cdp.open();
  const coverage = [];
  const coverageTargets = seoPhaseOnePages.flatMap((page) => locales.map((locale) => ({ page, locale }))).filter(({ page, locale }) => selected(pageUrl(page, locale)));
  for (const [coverageIndex, { page, locale }] of coverageTargets.entries()) {
    await writeProgress("coverage", coverageIndex, coverageTargets.length, pageUrl(page, locale));
    const expected = { url: pageUrl(page, locale), locale: locale.key, lang: locale.lang };
    const outcome = await retryCheck(`coverage ${expected.url}`, async () => {
      const result = await withPage(cdp, (sessionId) => visit(cdp, sessionId, withDebug(expected.url)));
      const pageViews = gaFor(result.events, "page_view");
      const event = pageViews[0];
      const validation = eventParameters(event, { url: withDebug(expected.url), title: result.page.title, locale: expected.lang, debug: true });
      const pii = scansForPii(result.collects);
      return {
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
      };
    });
    coverage.push(outcome.result ? { ...outcome.result, attempts: outcome.attempts } : {
      url: expected.url,
      locale: expected.locale,
      page_view_count: 0,
      measurement_id: null,
      page_location: null,
      page_title: null,
      http_status: null,
      raw_collects: [],
      pii_findings: [],
      passed: false,
      attempts: outcome.attempts,
      reason: ["No attempt received the expected page_view collect request."]
    });
  }
  const classificationDefinitions = [
    { name: "product zh-TW", url: `${site}/tools/instagram-insights-passive/` },
    { name: "product zh-CN", url: `${site}/zh-cn/tools/instagram-insights-passive/` },
    { name: "product en", url: `${site}/en/tools/instagram-insights-passive/` },
    { name: "mytools", url: `${site}/mytools/` },
    { name: "privacy", url: `${site}/privacy/passive-analytics/` },
    { name: "other", url: `${site}/wuhan-itinerary-2026-07/` }
  ];
  const classification = [];
  for (const definition of classificationDefinitions.filter((item) => selected(item.name))) {
    const outcome = await retryCheck(`classification ${definition.name}`, () => runClassificationCheck(cdp, definition));
    classification.push(outcome.result ? { ...outcome.result, attempts: outcome.attempts } : { event: "page_view", test: definition.name, test_page: withDebug(definition.url), expected_count: 1, actual_count: 0, duplicate: false, raw_collects: [], pii_findings: [], passed: false, attempts: outcome.attempts, reason: ["No classification attempt received the expected page_view collect request."] });
  }
  const interactions = [];
  const clickDefinitions = [
    { name: "service hero CTA", url: `${site}/services/influencer-marketing-agency/`, selector: '[data-track-event="service_cta_click"][data-track-location="hero"]', event: "service_cta_click", location: "hero" },
    { name: "service final CTA", url: `${site}/services/influencer-marketing-agency/`, selector: '[data-track-event="service_cta_click"][data-track-location="final"]', event: "service_cta_click", location: "final" },
    { name: "article hero CTA", url: `${site}/insights/how-to-choose-influencer-marketing-agency/`, selector: '[data-track-event="article_cta_click"][data-track-location="hero"]', event: "article_cta_click", location: "hero" },
    { name: "contact navigation", url: `${site}/`, selector: '[data-track-event="contact_click"][data-track-location="nav"]', event: "contact_click", location: "nav" },
    { name: "case study card", url: `${site}/`, selector: '[data-track-event="case_study_click"][data-track-location="case-card"]', event: "case_study_click", location: "case-card" },
    { name: "quote request hero", url: `${site}/`, selector: '[data-track-event="quote_request_click"][data-track-location="hero"]', event: "quote_request_click", location: "hero" },
    ...(includeProductDiscovery ? [
      { name: "product hub hero", url: `${site}/`, selector: '[data-track-event="product_click"][data-track-location="hero"]', event: "product_click", location: "hero" },
      { name: "Passive Analytics hub entry", url: `${site}/tools/`, selector: '[data-track-event="product_click"][data-product-name="Passive Analytics"]', event: "product_click", location: "product-hub-card", parameters: { product_name: "Passive Analytics" } },
      { name: "Passive Analytics Chrome Store", url: `${site}/tools/`, selector: '[data-track-event="chrome_store_click"][data-product-name="Passive Analytics"]', event: "chrome_store_click", location: "product-hub-card", parameters: { product_name: "Passive Analytics" } },
      { name: "YouTube 影片平均 Chrome Store", url: `${site}/tools/`, selector: '[data-track-event="chrome_store_click"][data-product-name="YouTube 影片平均"]', event: "chrome_store_click", location: "product-hub-card", parameters: { product_name: "YouTube 影片平均" } }
    ] : []),
    ...(includeInternalLinking ? [
      { name: "Passive Analytics to service", url: `${site}/tools/instagram-insights-passive/`, selector: '[data-track-event="product_to_service_click"][data-product-name="Passive Analytics"]', event: "product_to_service_click", location: "product-service-module", parameters: { product_name: "Passive Analytics", service_name: "influencer-marketing-agency" } },
      { name: "YouTube product to service", url: `${site}/tools/youtube-channel-metrics/`, selector: '[data-track-event="product_to_service_click"][data-product-name="YouTube 影片平均"]', event: "product_to_service_click", location: "product-service-module", parameters: { product_name: "YouTube 影片平均", service_name: "youtube-influencer-marketing" } },
      { name: "KOL service to Passive Analytics", url: `${site}/services/kol-marketing/`, selector: '[data-track-event="service_to_product_click"][data-product-name="Passive Analytics"]', event: "service_to_product_click", location: "service-product-module", parameters: { service_name: "kol-marketing", product_name: "Passive Analytics" } },
      { name: "Instagram service to Passive Analytics", url: `${site}/services/instagram-influencer-marketing/`, selector: '[data-track-event="service_to_product_click"][data-product-name="Passive Analytics"]', event: "service_to_product_click", location: "service-product-module", parameters: { service_name: "instagram-influencer-marketing", product_name: "Passive Analytics" } },
      { name: "TikTok service to Passive Analytics", url: `${site}/services/tiktok-influencer-marketing/`, selector: '[data-track-event="service_to_product_click"][data-product-name="Passive Analytics"]', event: "service_to_product_click", location: "service-product-module", parameters: { service_name: "tiktok-influencer-marketing", product_name: "Passive Analytics" } },
      { name: "YouTube service to product", url: `${site}/services/youtube-influencer-marketing/`, selector: '[data-track-event="service_to_product_click"][data-product-name="YouTube 影片平均"]', event: "service_to_product_click", location: "service-product-module", parameters: { service_name: "youtube-influencer-marketing", product_name: "YouTube 影片平均" } },
      { name: "Overseas service to Passive Analytics", url: `${site}/services/overseas-influencer-marketing/`, selector: '[data-track-event="service_to_product_click"][data-product-name="Passive Analytics"]', event: "service_to_product_click", location: "service-product-module", parameters: { service_name: "overseas-influencer-marketing", product_name: "Passive Analytics" } },
      { name: "Cost insight to service", url: `${site}/insights/taiwan-influencer-marketing-costs-2026/`, selector: '[data-track-event="article_cta_click"][data-track-location="article-related-service"]', event: "article_cta_click", location: "article-related-service", parameters: { service_name: "influencer-marketing-costs" } },
      { name: "Cost insight to Passive Analytics", url: `${site}/insights/taiwan-influencer-marketing-costs-2026/`, selector: '[data-track-event="article_cta_click"][data-track-location="article-related-product"]', event: "article_cta_click", location: "article-related-product", parameters: { product_name: "Passive Analytics" } }
    ] : [])
  ];
  const selectedClickDefinitions = clickDefinitions.filter((item) => selected(item.name));
  const languageDefinitions = [
    { name: "zh-TW to zh-CN", url: `${site}/services/influencer-marketing-agency/`, targetLink: "zh-Hans", from: "zh-TW", to: "zh-CN" },
    { name: "zh-CN to en", url: `${site}/zh-cn/services/influencer-marketing-agency/`, targetLink: "en", from: "zh-CN", to: "en" },
    { name: "en to zh-TW", url: `${site}/en/services/influencer-marketing-agency/`, targetLink: "zh-Hant", from: "en", to: "zh-TW" }
  ];
  const selectedLanguageDefinitions = languageDefinitions.filter((item) => selected(item.name));
  const leadModes = ["empty", "invalid", "error", "success", "double"].filter(selected);
  const interactionTotal = selectedClickDefinitions.length + selectedLanguageDefinitions.length + leadModes.length;
  await writeProgress("interactions", 0, interactionTotal, "starting");
  for (const [interactionIndex, definition] of selectedClickDefinitions.entries()) {
    await writeProgress("interactions", interactionIndex, interactionTotal, definition.name);
    const outcome = await retryCheck(definition.name, () => runClickCheck(cdp, definition));
    interactions.push(outcome.result ? { ...outcome.result, attempts: outcome.attempts } : { event: definition.event, test: definition.name, test_page: withDebug(definition.url), expected_count: 1, actual_count: 0, duplicate: false, raw_collects: [], pii_findings: [], passed: false, attempts: outcome.attempts, reason: ["No attempt received the expected CTA collect request."] });
  }
  for (const [languageIndex, definition] of selectedLanguageDefinitions.entries()) {
    await writeProgress("interactions", selectedClickDefinitions.length + languageIndex, interactionTotal, definition.name);
    const outcome = await retryCheck(definition.name, () => runLanguageCheck(cdp, definition));
    interactions.push(outcome.result ? { ...outcome.result, attempts: outcome.attempts } : { event: "language_switch", test: definition.name, test_page: withDebug(definition.url), expected_count: 1, actual_count: 0, duplicate: false, raw_collects: [], pii_findings: [], passed: false, attempts: outcome.attempts, reason: ["No attempt received the expected language-switch collect request."] });
  }
  for (const [leadIndex, mode] of leadModes.entries()) {
    await writeProgress("interactions", selectedClickDefinitions.length + selectedLanguageDefinitions.length + leadIndex, interactionTotal, `generate_lead ${mode}`);
    const outcome = await retryCheck(`generate_lead ${mode}`, () => runLeadCheck(cdp, mode));
    interactions.push(outcome.result ? { ...outcome.result, attempts: outcome.attempts } : { event: "generate_lead", test: mode, test_page: withDebug(`${site}/`), expected_count: ["success", "double"].includes(mode) ? 1 : 0, actual_count: 0, duplicate: false, raw_collects: [], pii_findings: [], passed: false, attempts: outcome.attempts, reason: ["No attempt completed the lead test."] });
  }
  await writeProgress("lifecycle", 0, 3, "starting");
  const lifecycle = targets.length ? [] : await runLifecycleChecks(cdp);
  const report = {
    generated_at: new Date().toISOString(),
    site,
    measurement_id: measurementId,
    storage_isolation: "A new CDP BrowserContext is created per check; no cookies, localStorage, or sessionStorage are reused.",
    spa_route_change: { applicable: false, reason: "Static multi-page site; route changes create a new document." },
    coverage,
    classification,
    lifecycle,
    interaction_events: interactions,
    failures: [...coverage, ...classification, ...lifecycle, ...interactions].filter((item) => !item.passed),
    summary: {
      coverage_passed: coverage.filter((item) => item.passed).length,
      coverage_total: coverage.length,
      classification_passed: classification.filter((item) => item.passed).length,
      classification_total: classification.length,
      lifecycle_passed: lifecycle.filter((item) => item.passed).length,
      lifecycle_total: lifecycle.length,
      interactions_passed: interactions.filter((item) => item.passed).length,
      interactions_total: interactions.length
    }
  };
  await mkdir("artifacts", { recursive: true });
  await writeFile(`artifacts/${reportName}.json`, `${JSON.stringify(report, null, 2)}\n`);
  await writeFile(`artifacts/${reportName}.md`, markdown(report));
  console.log(JSON.stringify(report.summary));
  if (report.failures.length) process.exitCode = 1;
} catch (error) {
  await mkdir("artifacts", { recursive: true });
  await writeFile("artifacts/ga4-network-error.json", `${JSON.stringify({ generated_at: new Date().toISOString(), site, message: error.message, stack: error.stack, network_evidence: error.network_evidence || null }, null, 2)}\n`);
  console.error(error.stack);
  process.exitCode = 1;
} finally {
  cdp?.close();
  if (child.exitCode === null) {
    child.kill("SIGTERM");
    await Promise.race([new Promise((resolve) => child.once("exit", resolve)), delay(2000)]);
    if (child.exitCode === null) child.kill("SIGKILL");
  }
  await rm(profile, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
}
