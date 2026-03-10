import envData from "../env.js";
export const emailConfig = {
    api_key: envData.BREVO_API_KEY,
    base_url: "https://api.brevo.com/v3",
    sender: {
        name: "NyayaTech",
        email: "nyayatech@workr.in",
    },
};
// export const emailConfig = {
//   api_key: process.env.BREVO_API_KEY!,
//   base_url: "https://api.brevo.com/v3",
//   sender: {
//     name: 'NyayaTech',
//     email: 'sdalthaf2018@gmail.com'
//   },
// };
