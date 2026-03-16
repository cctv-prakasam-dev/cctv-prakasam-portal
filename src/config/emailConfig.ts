import envData from "../env.js";

export const emailConfig = {
  api_key: envData.BREVO_API_KEY!,
  base_url: "https://api.brevo.com/v3",
  sender: {
    name: "CCTV AP Prakasam",
    email: "cctvprakasam@gmail.com",
  },
};
