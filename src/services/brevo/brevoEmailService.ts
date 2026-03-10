import type { StatusCode } from "hono/utils/http-status";

import type { emailOptions } from "../../types/app.types.js";

import { emailConfig } from "../../config/emailConfig.js";
import { FP_EMAIL, FP_EMAIL_ERROR } from "../../constants/appMessages.js";
import BrevoErrorException from "../../exceptions/brevoErrorException.js";
import { httpPost } from "../http.js";

async function sendOTP(htmlContent: string, email: emailOptions) {
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

  const respData = await response.json();

  if (!response.ok) {
    throw new BrevoErrorException(
      response.status as StatusCode,
      FP_EMAIL_ERROR,
      response.statusText,
      true,
      respData || null,
    );
  }

  return respData;
}

async function sendEmailNotification(htmlContent: string, email: emailOptions) {
  const emailData = {
    sender: emailConfig.sender,
    to: [
      {
        email: email.to,
      },
    ],
    CC:
      Array.isArray(email.cc) && email.cc.length > 0
        ? email.cc.map((ccEmail: string) => ({ email: ccEmail }))
        : undefined,
    subject: email.subject,
    htmlContent,
    view_case_link: email.view_case_link,
  };
  const url = `${emailConfig.base_url}/smtp/email`;

  const response = await httpPost(url, emailData, {
    "api-key": emailConfig.api_key,
  });
  const respData = await response.json();
  if (!response.ok) {
    throw new BrevoErrorException(
      response.status as StatusCode,
      FP_EMAIL,
      response.statusText,
      true,
      respData || null,
    );
  }

  return respData;
}

export { sendEmailNotification, sendOTP };
