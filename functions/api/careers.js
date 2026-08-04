import { handleForm } from "../_lib/form.js";

const config = {
  endpointBinding: "CAREERS_FORM_ENDPOINT",
  subject: "ZhenguoCool｜人才資料",
  fields: [["full_name", 200], ["email", 254], ["career_direction", 200], ["experience_background", 1000], ["portfolio_url", 1000], ["introduction", 4000], ["privacy_consent", 20]],
  required: ["full_name", "email", "career_direction", "experience_background", "introduction", "privacy_consent"]
};

export const onRequest = (context) => handleForm(context, config);
