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
  return json(200, { ok: true });
};
