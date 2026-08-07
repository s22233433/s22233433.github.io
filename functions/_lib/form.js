const json = (status, body) => new Response(JSON.stringify(body), {
  status,
  headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
});

const readValue = (form, name, maxLength = 500) => {
  const value = form.get(name);
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
};

const verifyTurnstile = async (request, secret, token) => {
  const body = new FormData();
  body.set("secret", secret);
  body.set("response", token);
  const remoteIp = request.headers.get("CF-Connecting-IP");
  if (remoteIp) body.set("remoteip", remoteIp);
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
  if (!response.ok) throw new Error("Turnstile verification unavailable");
  return (await response.json()).success === true;
};

const notify = async (service, type, values) => {
  const response = await service.fetch("https://form-notifier.internal/", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ type, values })
  });
  if (!response.ok) throw new Error(`Form notification failed: ${response.status}`);
};

export const handleForm = async ({ request, env, waitUntil }, config) => {
  if (request.method !== "POST") return json(405, { ok: false });
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).origin !== new URL(request.url).origin) return json(403, { ok: false });

  let form;
  try {
    form = await request.formData();
  } catch {
    return json(400, { ok: false });
  }
  if (readValue(form, "website")) return json(400, { ok: false });
  if (!env.TURNSTILE_SECRET) return json(503, { ok: false });
  const turnstileToken = readValue(form, "cf-turnstile-response", 2048);
  if (!turnstileToken) return json(403, { ok: false });
  try {
    if (!await verifyTurnstile(request, env.TURNSTILE_SECRET, turnstileToken)) return json(403, { ok: false });
  } catch {
    return json(502, { ok: false });
  }

  const values = Object.fromEntries(config.fields.map(([name, maxLength]) => [name, readValue(form, name, maxLength)]));
  if (config.required.some((name) => !values[name]) || !/^\S+@\S+\.\S+$/.test(values.email || "")) return json(422, { ok: false });

  if (!env.FORM_DB) return json(503, { ok: false });
  try {
    await env.FORM_DB.prepare(`
      INSERT INTO form_submissions (form_type, email, name, organization, payload_json)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      config.type,
      values.email,
      values[config.nameField] || "",
      values[config.organizationField] || "",
      JSON.stringify(values)
    ).run();
  } catch {
    return json(502, { ok: false });
  }
  if (env.FORM_NOTIFIER) {
    const task = notify(env.FORM_NOTIFIER, config.type, values).catch((error) => console.error(error.message));
    if (typeof waitUntil === "function") waitUntil(task);
    else await task;
  }
  return json(200, { ok: true });
};
