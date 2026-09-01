import assert from "node:assert/strict";
import { onRequest as contact } from "../functions/api/contact.js";
import { onRequest as careers } from "../functions/api/careers.js";
import notifierWorker from "../functions/_lib/notifier-worker.js";

const verifier = await import("node:fs/promises").then(({ readFile }) => readFile(new URL("../tools/verify-ga4.mjs", import.meta.url), "utf8"));
assert.match(verifier, /\/api\/contact/, "GA verification must intercept the Cloudflare form endpoint.");
assert.match(verifier, /career_form_success/, "GA verification must cover successful career submissions without PII.");
const readFile = await import("node:fs/promises").then((module) => module.readFile);
for (const page of ["../index.html", "../careers/index.html"]) {
  assert.match(await readFile(new URL(page, import.meta.url), "utf8"), /class="cf-turnstile"/, `${page} must render Turnstile.`);
}

const writes = [];
const originalFetch = globalThis.fetch;
globalThis.fetch = async (_url, options) => {
  const body = options?.body;
  return Response.json({ success: body?.get("secret") === "test-secret" && body?.get("response") === "test-token" });
};
const db = {
  prepare: (sql) => ({
    bind: (...values) => ({
      run: async () => { writes.push({ sql, values }); return { success: true }; }
    })
  })
};
const notifications = [];
const notifier = {
  fetch: async (_url, options) => {
    notifications.push(JSON.parse(options.body));
    return new Response(null, { status: 204 });
  }
};

const formRequest = (path, values) => {
  const body = new FormData();
  body.set("cf-turnstile-response", "test-token");
  Object.entries(values).forEach(([name, value]) => body.set(name, value));
  return new Request(`https://zhenguocool-site.pages.dev${path}`, { method: "POST", body });
};

const env = { FORM_DB: db, TURNSTILE_SECRET: "test-secret", FORM_NOTIFIER: notifier };
const pending = [];
const context = (request) => ({ request, env, waitUntil: (promise) => pending.push(promise) });
let response = await contact(context(formRequest("/api/contact", { brand_name: "Brand", messaging_id: "line_test", email: "team@example.com", target_market: "Japan", message: "Need help", ignored: "never store" })));
assert.equal(response.status, 200);
await Promise.all(pending.splice(0));
assert.deepEqual(writes[0].values.slice(0, 4), ["contact", "team@example.com", "", "Brand"]);
assert.equal(JSON.parse(writes[0].values[4]).ignored, undefined);
assert.equal(JSON.parse(writes[0].values[4]).messaging_id, "line_test");
assert.equal(notifications[0].type, "contact");
assert.equal(notifications[0].values.messaging_id, "line_test");
assert.equal(notifications[0].values.ignored, undefined);

response = await careers(context(formRequest("/api/careers", { full_name: "Name", email: "person@example.com", career_direction: "SEO", experience_background: "3 years", introduction: "Hello", privacy_consent: "agreed", resume_file: "not stored" })));
assert.equal(response.status, 200);
await Promise.all(pending.splice(0));
assert.equal(JSON.parse(writes[1].values[4]).resume_file, undefined);
assert.equal(notifications[1].type, "careers");
assert.equal(notifications[1].values.resume_file, undefined);

response = await contact({ request: formRequest("/api/contact", { brand_name: "Brand", email: "not-an-email", target_market: "Japan" }), env });
assert.equal(response.status, 422);
response = await contact({ request: formRequest("/api/contact", { brand_name: "Brand", email: "team@example.com", target_market: "Japan", website: "bot" }), env });
assert.equal(response.status, 400);
response = await contact({ request: formRequest("/api/contact", { brand_name: "Brand", email: "team@example.com", target_market: "Japan" }), env: {} });
assert.equal(response.status, 503);

const missingToken = formRequest("/api/contact", { brand_name: "Brand", email: "team@example.com", target_market: "Japan" });
const missingTokenBody = await missingToken.formData();
missingTokenBody.delete("cf-turnstile-response");
response = await contact({ request: new Request(missingToken.url, { method: "POST", body: missingTokenBody }), env });
assert.equal(response.status, 403);

const sent = [];
response = await notifierWorker.fetch(new Request("https://internal/", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ type: "contact", values: { brand_name: "Brand", messaging_id: "wechat_test", email: "team@example.com", target_market: "Japan" } })
}), { EMAIL: { send: async (message) => sent.push(message) } });
assert.equal(response.status, 204);
assert.equal(sent[0].to, "weiting@zhenguocool.com");
assert.equal(sent[0].from.email, "forms@notify.zhenguocool.com");
assert.equal(sent[0].replyTo, "team@example.com");
assert.match(sent[0].text, /messaging_id: wechat_test/);

globalThis.fetch = originalFetch;

console.log("pages functions contract: pass");
