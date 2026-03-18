import { NEWSLETTER_SUBSCRIBER_NOT_FOUND } from "../../constants/appMessages.js";
import { newsletterSubscribers } from "../../db/schema/newsletterSubscribers.js";
import NotFoundException from "../../exceptions/notFoundException.js";
import { deleteRecordById, getPaginatedRecordsConditionally, getRecordById, saveSingleRecord, } from "../../services/db/baseDbService.js";
import { sendEmailNotification } from "../../services/brevo/brevoEmailService.js";
import { wrapEmailTemplate } from "../../utils/emailTemplate.js";
import { parseOrderByQuery } from "../../utils/dbUtils.js";
import logger from "../../utils/logger.js";
async function subscribe(data) {
    const subscriber = await saveSingleRecord(newsletterSubscribers, {
        email: data.email,
        status: "active",
    });
    const htmlContent = wrapEmailTemplate({
        previewText: "You're subscribed to CCTV AP Prakasam newsletter!",
        body: `
      <h2 style="margin:0 0 16px 0;font-size:20px;color:#0f172a;font-weight:700;">You're Subscribed!</h2>
      <p style="margin:0 0 12px 0;font-size:14px;color:#475569;line-height:1.6;">Thank you for subscribing to the <strong>CCTV AP Prakasam</strong> newsletter.</p>
      <p style="margin:0 0 20px 0;font-size:14px;color:#475569;line-height:1.6;">You'll now receive the latest news updates directly in your inbox — breaking news, political updates, entertainment, devotional content, and more from Prakasam District.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px 0;">
        <tr>
          <td style="background:#ecfeff;border-radius:8px;padding:16px 20px;text-align:center;">
            <p style="margin:0 0 12px 0;font-size:13px;color:#0e7490;font-weight:600;">Follow us on YouTube for daily video updates</p>
            <a href="https://www.youtube.com/@CctvPrakasam" style="display:inline-block;padding:10px 24px;background:#DC2626;color:#ffffff;font-size:13px;font-weight:700;text-decoration:none;border-radius:6px;">&#9654; Subscribe on YouTube</a>
          </td>
        </tr>
      </table>
      <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.5;">If you didn't subscribe, you can safely ignore this email.</p>
    `,
    });
    sendEmailNotification(htmlContent, {
        to: data.email,
        subject: "Welcome to CCTV Prakasam Newsletter",
    }).catch((err) => logger.error("email", "Failed to send newsletter welcome", { error: err.message }));
    return subscriber;
}
async function getAllSubscribers(page, pageSize) {
    const orderByQueryData = parseOrderByQuery(undefined, "subscribed_at", "desc");
    const result = await getPaginatedRecordsConditionally(newsletterSubscribers, page, pageSize, orderByQueryData);
    return result;
}
async function removeSubscriber(id) {
    const subscriber = await getRecordById(newsletterSubscribers, id);
    if (!subscriber) {
        throw new NotFoundException(NEWSLETTER_SUBSCRIBER_NOT_FOUND);
    }
    const deletedSubscriber = await deleteRecordById(newsletterSubscribers, id);
    return deletedSubscriber;
}
export { getAllSubscribers, removeSubscriber, subscribe, };
