import { handleForm } from "../_lib/form.js";

const config = {
  type: "contact",
  nameField: "contact_name",
  organizationField: "brand_name",
  fields: [["brand_name", 200], ["contact_name", 200], ["messaging_id", 200], ["email", 254], ["product_category", 200], ["target_market", 100], ["budget_range", 100], ["launch_timing", 100], ["cooperation_goal", 100], ["message", 4000], ["utm_source", 200], ["utm_medium", 200], ["utm_campaign", 200], ["utm_content", 200], ["landing_page", 1000]],
  required: ["brand_name", "email", "target_market"]
};

export const onRequest = (context) => handleForm(context, config);
