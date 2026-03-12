import type { Context } from "hono";

import type { ValidatedContactSchema } from "./contact.validation.js";

import {
  CONTACT_EMAIL_SENT,
  CONTACT_VALIDATION_ERROR,
} from "../../constants/appMessages.js";
import { sendEmailNotification } from "../../services/brevo/brevoEmailService.js";
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
    <p><strong>Name:</strong> ${validatedData.name}</p>
    <p><strong>Email:</strong> ${validatedData.email}</p>
    <p><strong>Phone:</strong> ${validatedData.phone || "N/A"}</p>
    <p><strong>Subject:</strong> ${validatedData.subject}</p>
    <p><strong>Message:</strong></p>
    <p>${validatedData.message}</p>
  `;

  await sendEmailNotification(htmlContent, {
    to: validatedData.email,
    subject: `Contact Form: ${validatedData.subject}`,
  });

  return sendSuccessResp(c, 200, CONTACT_EMAIL_SENT);
}

export { submitContact };
