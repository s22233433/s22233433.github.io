const json = (status, body) => new Response(JSON.stringify(body), {
  status,
  headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
});

const readValue = (form, name, maxLength = 500) => {
  const value = form.get(name);
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
};

export const handleForm = async ({ request, env }, config) => {
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

  const values = Object.fromEntries(config.fields.map(([name, maxLength]) => [name, readValue(form, name, maxLength)]));
  if (config.required.some((name) => !values[name]) || !/^\S+@\S+\.\S+$/.test(values.email || "")) return json(422, { ok: false });

  const endpoint = env[config.endpointBinding];
  if (!endpoint) return json(503, { ok: false });

  const outgoing = new FormData();
  outgoing.set("_subject", config.subject);
  outgoing.set("_template", "table");
  outgoing.set("_captcha", "false");
  Object.entries(values).forEach(([name, value]) => outgoing.set(name, value));

  try {
    const response = await fetch(endpoint, { method: "POST", headers: { Accept: "application/json" }, body: outgoing });
    if (!response.ok) return json(502, { ok: false });
  } catch {
    return json(502, { ok: false });
  }
  return json(200, { ok: true });
};
