import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { seoPhaseOnePages } from "./seo-phase-one-content.mjs";

const site = process.env.SITE_URL || "https://zhenguocool.com";
const chrome = process.env.CHROME_BIN || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const port = Number(process.env.GA4_CDP_PORT || 9337);
const measurementId = "G-3G60NBREE3";
const locales = [
  { key: "zh-TW", prefix: "", lang: "zh-TW" },
  { key: "zh-CN", prefix: "/zh-cn", lang: "zh-CN" },
  { key: "en", prefix: "/en", lang: "en" }
];
const collectHosts = new Set(["www.google-analytics.com", "google-analytics.com", "analytics.google.com", "region1.google-analytics.com"]);
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const pageUrl = (page, locale) => `${site}${locale.prefix}/${page.kind === "article" ? "insights" : "services"}/${page.slug}/`;
const withDebug = (url) => { const target = new URL(url); target.searchParams.set("ga_debug", "1"); return target.href; };
const parseCollect = (url, status = null) => {
  const target = new URL(url);
  if (!collectHosts.has(target.hostname) || !target.pathname.endsWith("/g/collect")) return null;
  const value = (key) => target.searchParams.get(key);
  return {
    tid: value("tid"), event: value("en"), page_location: value("dl"), page_title: value("dt"),
    language: value("ul"), locale: value("ep.locale"), content_type: value("ep.content_type"),
    content_slug: value("ep.content_slug"), service_name: value("ep.service_name"),
    cta_location: value("ep.cta_location"), target_url: value("ep.target_url"),
    debug_mode: value("ep.debug_mode"), request_time: new Date().toISOString(), http_status: status
  };
};

class Cdp {
  constructor(url) { this.ws = new WebSocket(url); this.id = 0; this.pending = new Map(); this.events = []; }
  async open() {
    await new Promise((resolve, reject) => { this.ws.onopen = resolve; this.ws.onerror = reject; });
    this.ws.onmessage = ({ data }) => { const message = JSON.parse(data); if (message.id) { this.pending.get(message.id)?.(message); this.pending.delete(message.id); } else this.events.push(message); };
  }
  send(method, params = {}, sessionId) {
    return new Promise((resolve, reject) => {
      const id = ++this.id; const timeout = setTimeout(() => { this.pending.delete(id); reject(new Error(`CDP timeout: ${method}`)); }, 10000);
      this.pending.set(id, (message) => { clearTimeout(timeout); message.error ? reject(new Error(message.error.message)) : resolve(message.result); });
      this.ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
    });
  }
  eventsAfter(index, sessionId) { return this.events.slice(index).filter((event) => !sessionId || event.sessionId === sessionId); }
  close() { this.ws.close(); }
}

async function waitForChrome() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try { return await (await fetch(`http://127.0.0.1:${port}/json/version`)).json(); } catch { await delay(250); }
  }
  throw new Error("Chrome CDP did not start");
}

async function withPage(cdp, callback) {
  const context = await cdp.send("Target.createBrowserContext");
  try {
    const target = await cdp.send("Target.createTarget", { url: "about:blank", browserContextId: context.browserContextId });
    const attached = await cdp.send("Target.attachToTarget", { targetId: target.targetId, flatten: true });
    const sessionId = attached.sessionId;
    await cdp.send("Network.enable", {}, sessionId);
    await cdp.send("Runtime.enable", {}, sessionId);
    return await callback(sessionId);
  } finally { await cdp.send("Target.disposeBrowserContext", { browserContextId: context.browserContextId }); }
}

async function visit(cdp, sessionId, url) {
  const before = cdp.events.length;
  await cdp.send("Page.navigate", { url }, sessionId);
  await delay(2500);
  const events = cdp.eventsAfter(before, sessionId);
  const response = events.find((event) => event.method === "Network.responseReceived" && event.params?.response?.url?.split("#")[0] === url.split("#")[0]);
  const requests = events.filter((event) => event.method === "Network.requestWillBeSent");
  const responses = new Map(events.filter((event) => event.method === "Network.responseReceived").map((event) => [event.params.requestId, event.params.response.status]));
  const collects = requests.map((event) => parseCollect(event.params.request.url, responses.get(event.params.requestId) || null)).filter(Boolean);
  const evaluated = await cdp.send("Runtime.evaluate", { expression: "JSON.stringify({title:document.title,lang:document.documentElement.lang,url:location.href})", returnByValue: true }, sessionId);
  return { page: JSON.parse(evaluated.result.value), http_status: response?.params?.response?.status || null, collects };
}

const gaFor = (result, name) => result.collects.filter((event) => event.event === name);
const pageCheck = (expected, result) => {
  const pageViews = gaFor(result, "page_view");
  const event = pageViews[0];
  return {
    url: expected.url, locale: expected.locale, page_view_count: pageViews.length, measurement_id: event?.tid || null,
    page_location: event?.page_location || null, page_title: event?.page_title || null, http_status: result.http_status,
    passed: result.http_status === 200 && pageViews.length === 1 && event?.tid === measurementId && event?.page_location === withDebug(expected.url) && event?.page_title === result.page.title && event?.locale === expected.lang && event?.debug_mode === "true"
  };
};

async function evaluate(cdp, sessionId, expression, wait = 800) {
  const before = cdp.events.length;
  await cdp.send("Runtime.evaluate", { expression, awaitPromise: true }, sessionId);
  await delay(wait);
  const events = cdp.eventsAfter(before, sessionId);
  const responses = new Map(events.filter((event) => event.method === "Network.responseReceived").map((event) => [event.params.requestId, event.params.response.status]));
  return events.filter((event) => event.method === "Network.requestWillBeSent").map((event) => parseCollect(event.params.request.url, responses.get(event.params.requestId) || null)).filter(Boolean);
}

async function interactions(cdp) {
  const checks = [];
  const test = async (name, url, selector, expected) => withPage(cdp, async (sessionId) => {
    await visit(cdp, sessionId, withDebug(url));
    const events = await evaluate(cdp, sessionId, `document.querySelector(${JSON.stringify(selector)})?.click()`);
    const actual = events.filter((event) => event.event === expected);
    checks.push({ event: expected, test_page: url, expected_count: 1, actual_count: actual.length, parameters: actual[0] || null, duplicate: actual.length > 1, passed: actual.length === 1 });
  });
  await test("service hero", `${site}/services/influencer-marketing-agency/`, '[data-track-event="service_cta_click"]', "service_cta_click");
  await test("article hero", `${site}/insights/how-to-choose-influencer-marketing-agency/`, '[data-track-event="article_cta_click"]', "article_cta_click");
  await test("contact", `${site}/`, '[data-track-event="contact_click"]', "contact_click");
  await test("case", `${site}/`, '[data-track-event="case_study_click"]', "case_study_click");
  await test("quote", `${site}/`, '[data-track-event="quote_request_click"]', "quote_request_click");
  await withPage(cdp, async (sessionId) => {
    const url = `${site}/services/influencer-marketing-agency/`;
    await visit(cdp, sessionId, withDebug(url));
    const events = await evaluate(cdp, sessionId, `(() => { const link = document.querySelector('[data-lang-link="en"]'); if (link) link.click(); })()` , 1700);
    const language = events.filter((event) => event.event === "language_switch");
    const pages = events.filter((event) => event.event === "page_view");
    checks.push({ event: "language_switch", test_page: url, expected_count: 1, actual_count: language.length, parameters: language[0] || null, duplicate: language.length > 1, passed: language.length === 1 && pages.length === 1 && language[0]?.target_url?.includes("ga_debug=1") });
  });
  for (const mode of ["empty", "invalid", "error", "success", "double"]) await withPage(cdp, async (sessionId) => {
    await visit(cdp, sessionId, withDebug(`${site}/`));
    const status = mode === "success" || mode === "double" ? 200 : 500;
    const fill = mode === "empty" ? "" : `document.querySelectorAll('#lead-form input[required],#lead-form select[required]').forEach((field) => { field.value = field.tagName === 'SELECT' ? field.options[1].value : 'test'; }); document.querySelector('#lead-form input[type=email]').value='test@example.com';`;
    const events = await evaluate(cdp, sessionId, `(() => { window.fetch = async () => new Response('', {status:${status}}); ${fill} const form=document.querySelector('#lead-form'); form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})); ${mode === "double" ? "form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));" : ""} })()`, 1100);
    const leads = events.filter((event) => event.event === "generate_lead");
    checks.push({ event: "generate_lead", test_page: `${site}/`, test: mode, expected_count: mode === "success" || mode === "double" ? 1 : 0, actual_count: leads.length, parameters: leads[0] || null, duplicate: leads.length > 1, passed: leads.length === (mode === "success" || mode === "double" ? 1 : 0) });
  });
  return checks;
}

const profile = await mkdtemp(path.join(tmpdir(), "zg-ga4-"));
const child = spawn(chrome, ["--headless=new", "--disable-extensions", "--disable-component-extensions-with-background-pages", "--no-first-run", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "about:blank"], { stdio: "ignore" });
try {
  const version = await waitForChrome();
  const cdp = new Cdp(version.webSocketDebuggerUrl); await cdp.open();
  const coverage = [];
  for (const page of seoPhaseOnePages) for (const locale of locales) {
    const expected = { url: pageUrl(page, locale), locale: locale.key, lang: locale.lang };
    const result = await withPage(cdp, (sessionId) => visit(cdp, sessionId, withDebug(expected.url)));
    coverage.push(pageCheck(expected, result));
  }
  const interaction = await interactions(cdp);
  const report = { generated_at: new Date().toISOString(), site, measurement_id: measurementId, coverage, interaction_events: interaction, failures: [...coverage.filter((item) => !item.passed), ...interaction.filter((item) => !item.passed)], summary: { coverage_passed: coverage.filter((item) => item.passed).length, coverage_total: coverage.length, interactions_passed: interaction.filter((item) => item.passed).length, interactions_total: interaction.length } };
  await mkdir("artifacts", { recursive: true });
  await writeFile("artifacts/ga4-network-report.json", `${JSON.stringify(report, null, 2)}\n`);
  const rows = coverage.map((item) => `| ${item.locale} | ${item.url} | ${item.page_view_count} | ${item.http_status} | ${item.passed ? "PASS" : "FAIL"} |`).join("\n");
  const interactionsMd = interaction.map((item) => `| ${item.event}${item.test ? ` (${item.test})` : ""} | ${item.expected_count} | ${item.actual_count} | ${item.passed ? "PASS" : "FAIL"} |`).join("\n");
  await writeFile("artifacts/ga4-network-report.md", `# GA4 Network Report\n\nGenerated: ${report.generated_at}\n\n## 24-page coverage\n\n| Locale | URL | page_view | HTTP | Result |\n| --- | --- | ---: | ---: | --- |\n${rows}\n\n## Interaction events\n\n| Event | Expected | Actual | Result |\n| --- | ---: | ---: | --- |\n${interactionsMd}\n\n## DebugView manual confirmation\n\n1. Sign in to GA4 and open **Admin -> Data display -> DebugView**.\n2. In a browser without ad blocking, open [${withDebug(site)}](${withDebug(site)}).\n3. Open the page, switch language once, click a service CTA, click an article CTA, then submit one test form.\n4. Confirm **page_view**, **language_switch**, one CTA event, and **generate_lead**.\n5. Open each event and confirm locale, page_path, content_slug, and no PII parameters.\n6. Capture the DebugView timeline as the owner evidence.\n`);
  console.log(JSON.stringify(report.summary));
  if (report.failures.length) process.exitCode = 1;
  cdp.close();
} finally { child.kill("SIGTERM"); await rm(profile, { recursive: true, force: true }); }
