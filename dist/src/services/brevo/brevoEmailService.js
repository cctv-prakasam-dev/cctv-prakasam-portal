import { emailConfig } from "../../config/emailConfig.js";
import { FP_EMAIL, FP_EMAIL_ERROR } from "../../constants/appMessages.js";
import BrevoErrorException from "../../exceptions/brevoErrorException.js";
import { httpPost } from "../http.js";
async function sendOTP(htmlContent, email) {
    const emailData = {
        sender: emailConfig.sender,
        to: [
            {
                email: email.to,
            },
        ],
        subject: email.subject,
        htmlContent,
    };
    const url = `${emailConfig.base_url}/smtp/email`;
    const response = await httpPost(url, emailData, {
        "api-key": emailConfig.api_key,
    });
    if (!response.ok) {
        const respData = await response.json().catch(() => null);
        throw new BrevoErrorException(response.status, FP_EMAIL_ERROR, response.statusText, true, respData);
    }
    return await response.json();
}
async function sendEmailNotification(htmlContent, email) {
    const emailData = {
        sender: emailConfig.sender,
        to: [
            {
                email: email.to,
            },
        ],
        CC: Array.isArray(email.cc) && email.cc.length > 0
            ? email.cc.map((ccEmail) => ({ email: ccEmail }))
            : undefined,
        subject: email.subject,
        htmlContent,
        view_case_link: email.view_case_link,
    };
    const url = `${emailConfig.base_url}/smtp/email`;
    const response = await httpPost(url, emailData, {
        "api-key": emailConfig.api_key,
    });
    if (!response.ok) {
        const respData = await response.json().catch(() => null);
        throw new BrevoErrorException(response.status, FP_EMAIL, response.statusText, true, respData);
    }
    return await response.json();
}
export { sendEmailNotification, sendOTP };
