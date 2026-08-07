import assert from "node:assert/strict";
import { onRequest as contact } from "../functions/api/contact.js";
import { onRequest as careers } from "../functions/api/careers.js";

const verifier = await import("node:fs/promises").then(({ readFile }) => readFile(new URL("../tools/verify-ga4.mjs", import.meta.url), "utf8"));
assert.match(verifier, /formsubmit\.co/, "GA verification must intercept FormSubmit instead of delivering a real test inquiry.");
assert.match(verifier, /career_form_success/, "GA verification must cover successful career submissions without PII.");

const originalFetch = globalThis.fetch;
const endpoint = "https://formsubmit.co/ajax/test@example.com";
let forwarded;
globalThis.fetch = async (url, init) => {
  forwarded = { url, body: init.body };
  return new Response(JSON.stringify({ success: true }), { status: 200 });
};

const formRequest = (path, values) => {
  const body = new FormData();
  Object.entries(values).forEach(([name, value]) => body.set(name, value));
  return new Request(`https://zhenguocool-site.pages.dev${path}`, { method: "POST", body });
};

let response = await contact({ request: formRequest("/api/contact", { brand_name: "Brand", email: "team@example.com", target_market: "Japan", message: "Need help", ignored: "never forward" }), env: { CONTACT_FORM_ENDPOINT: endpoint } });
assert.equal(response.status, 200);
assert.equal(forwarded.url, endpoint);
assert.equal(await forwarded.body.get("brand_name"), "Brand");
assert.equal(forwarded.body.get("ignored"), null);

response = await careers({ request: formRequest("/api/careers", { full_name: "Name", email: "person@example.com", career_direction: "SEO", experience_background: "3 years", introduction: "Hello", privacy_consent: "agreed", resume_file: "not forwarded" }), env: { CAREERS_FORM_ENDPOINT: endpoint } });
assert.equal(response.status, 200);
assert.equal(forwarded.body.get("resume_file"), null);

response = await contact({ request: formRequest("/api/contact", { brand_name: "Brand", email: "not-an-email", target_market: "Japan" }), env: { CONTACT_FORM_ENDPOINT: endpoint } });
assert.equal(response.status, 422);
response = await contact({ request: formRequest("/api/contact", { brand_name: "Brand", email: "team@example.com", target_market: "Japan", website: "bot" }), env: { CONTACT_FORM_ENDPOINT: endpoint } });
assert.equal(response.status, 400);

globalThis.fetch = originalFetch;
console.log("pages functions contract: pass");
