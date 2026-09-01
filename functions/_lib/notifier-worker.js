const FIELDS = {
  contact: ["brand_name", "contact_name", "messaging_id", "email", "product_category", "target_market", "budget_range", "launch_timing", "cooperation_goal", "message", "utm_source", "utm_medium", "utm_campaign", "utm_content", "landing_page"],
  careers: ["full_name", "email", "career_direction", "experience_background", "portfolio_url", "introduction", "privacy_consent"]
};

export default {
  async fetch(request, env) {
    if (request.method !== "POST") return new Response(null, { status: 405 });
    let data;
    try {
      data = await request.json();
    } catch {
      return new Response(null, { status: 400 });
    }
    const fields = FIELDS[data?.type];
    if (!fields || !data.values || typeof data.values !== "object") return new Response(null, { status: 422 });

    const text = [
      `Form: ${data.type}`,
      `Received: ${new Date().toISOString()}`,
      "",
      ...fields.filter((name) => data.values[name]).map((name) => `${name}: ${String(data.values[name]).slice(0, 4000)}`)
    ].join("\n");

    await env.EMAIL.send({
      from: { email: "forms@notify.zhenguocool.com", name: "ZhenguoCool Website" },
      to: "weiting@zhenguocool.com",
      replyTo: data.values.email,
      subject: data.type === "careers" ? "[ZhenguoCool] New career application" : "[ZhenguoCool] New contact inquiry",
      text
    });
    return new Response(null, { status: 204 });
  }
};
