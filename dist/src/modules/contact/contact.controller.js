import { CONTACT_EMAIL_SENT, CONTACT_VALIDATION_ERROR, } from "../../constants/appMessages.js";
import { sendEmailNotification } from "../../services/brevo/brevoEmailService.js";
import { wrapEmailTemplate } from "../../utils/emailTemplate.js";
import { escapeHtml } from "../../utils/escapeHtml.js";
import { sendSuccessResp } from "../../utils/respUtils.js";
import { validateRequest } from "../../validations/validateRequest.js";
async function submitContact(c) {
    const reqData = await c.req.json();
    const validatedData = await validateRequest("submit-contact", reqData, CONTACT_VALIDATION_ERROR);
    const htmlContent = wrapEmailTemplate({
        previewText: `Contact: ${validatedData.subject}`,
        body: `
      <h2 style="margin:0 0 16px 0;font-size:20px;color:#0f172a;font-weight:700;">New Contact Message</h2>
      <p style="margin:0 0 16px 0;font-size:14px;color:#475569;line-height:1.6;">You've received a new message through the CCTV AP Prakasam website.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;margin:0 0 20px 0;">
        <tr>
          <td style="padding:16px 20px;border-bottom:1px solid #e2e8f0;">
            <span style="font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Name</span><br/>
            <span style="font-size:14px;color:#0f172a;font-weight:500;">${escapeHtml(validatedData.name)}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 20px;border-bottom:1px solid #e2e8f0;">
            <span style="font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Email</span><br/>
            <a href="mailto:${escapeHtml(validatedData.email)}" style="font-size:14px;color:#0891B2;text-decoration:none;">${escapeHtml(validatedData.email)}</a>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 20px;border-bottom:1px solid #e2e8f0;">
            <span style="font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Phone</span><br/>
            <span style="font-size:14px;color:#0f172a;">${validatedData.phone ? escapeHtml(validatedData.phone) : "N/A"}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 20px;border-bottom:1px solid #e2e8f0;">
            <span style="font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Subject</span><br/>
            <span style="font-size:14px;color:#0f172a;font-weight:600;">${escapeHtml(validatedData.subject)}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 20px;">
            <span style="font-size:11px;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Message</span><br/>
            <p style="margin:8px 0 0 0;font-size:14px;color:#475569;line-height:1.6;white-space:pre-wrap;">${escapeHtml(validatedData.message)}</p>
          </td>
        </tr>
      </table>
    `,
    });
    // Send notification to admin
    await sendEmailNotification(htmlContent, {
        to: "cctvprakasam@gmail.com",
        subject: `Contact Form: ${escapeHtml(validatedData.subject)}`,
    });
    // Send confirmation to user
    const confirmationHtml = wrapEmailTemplate({
        previewText: "We received your message — CCTV AP Prakasam",
        body: `
      <h2 style="margin:0 0 16px 0;font-size:20px;color:#0f172a;font-weight:700;">Thank You for Contacting Us!</h2>
      <p style="margin:0 0 12px 0;font-size:14px;color:#475569;line-height:1.6;">Hi <strong>${escapeHtml(validatedData.name)}</strong>,</p>
      <p style="margin:0 0 12px 0;font-size:14px;color:#475569;line-height:1.6;">We have received your message regarding <strong>"${escapeHtml(validatedData.subject)}"</strong>. Our team will review it and get back to you within 24 hours.</p>
      <p style="margin:0;font-size:13px;color:#94a3b8;">— CCTV AP Prakasam Team</p>
    `,
    });
    await sendEmailNotification(confirmationHtml, {
        to: validatedData.email,
        subject: "We received your message - CCTV Prakasam",
    });
    return sendSuccessResp(c, 200, CONTACT_EMAIL_SENT);
}
export { submitContact };
