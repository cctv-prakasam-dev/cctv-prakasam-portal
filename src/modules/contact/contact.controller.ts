import type { Context } from "hono";

import type { ValidatedContactSchema } from "./contact.validation.js";

import {
  CONTACT_EMAIL_SENT,
  CONTACT_VALIDATION_ERROR,
} from "../../constants/appMessages.js";
import { sendEmailNotification } from "../../services/brevo/brevoEmailService.js";
import { escapeHtml } from "../../utils/escapeHtml.js";
import { sendSuccessResp } from "../../utils/respUtils.js";
import { validateRequest } from "../../validations/validateRequest.js";

async function submitContact(c: Context) {
  const reqData = await c.req.json();

  const validatedData = await validateRequest<ValidatedContactSchema>(
    "submit-contact",
    reqData,
    CONTACT_VALIDATION_ERROR,
  );

  const htmlContent = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(validatedData.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(validatedData.email)}</p>
    <p><strong>Phone:</strong> ${validatedData.phone ? escapeHtml(validatedData.phone) : "N/A"}</p>
    <p><strong>Subject:</strong> ${escapeHtml(validatedData.subject)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(validatedData.message)}</p>
  `;

  await sendEmailNotification(htmlContent, {
    to: validatedData.email,
    subject: `Contact Form: ${escapeHtml(validatedData.subject)}`,
  });

  return sendSuccessResp(c, 200, CONTACT_EMAIL_SENT);
}

export { submitContact };
