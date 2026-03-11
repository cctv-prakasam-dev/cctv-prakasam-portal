import type { NewsletterSubscriber } from "../../db/schema/newsletterSubscribers.js";
import type { ValidatedSubscribeNewsletter } from "../../types/app.types.js";

import { NEWSLETTER_SUBSCRIBER_NOT_FOUND } from "../../constants/appMessages.js";
import { newsletterSubscribers } from "../../db/schema/newsletterSubscribers.js";
import NotFoundException from "../../exceptions/notFoundException.js";
import {
  deleteRecordById,
  getPaginatedRecordsConditionally,
  getRecordById,
  saveSingleRecord,
} from "../../services/db/baseDbService.js";
import { sendEmailNotification } from "../../services/brevo/brevoEmailService.js";

async function subscribe(data: ValidatedSubscribeNewsletter): Promise<NewsletterSubscriber> {
  const subscriber = await saveSingleRecord<NewsletterSubscriber>(newsletterSubscribers, {
    email: data.email,
    status: "active",
  });

  const htmlContent = `
    <h2>Welcome to CCTV Prakasam Newsletter!</h2>
    <p>Thank you for subscribing to our newsletter.</p>
    <p>You will now receive the latest news updates from CCTV Prakasam directly in your inbox.</p>
    <p>Stay tuned for breaking news, political updates, entertainment, and more from Prakasam District!</p>
  `;

  sendEmailNotification(htmlContent, {
    to: data.email,
    subject: "Welcome to CCTV Prakasam Newsletter",
  }).catch(console.error);

  return subscriber;
}

async function getAllSubscribers(page: number, pageSize: number) {
  const result = await getPaginatedRecordsConditionally<NewsletterSubscriber>(
    newsletterSubscribers,
    page,
    pageSize,
    {
      columns: ["subscribed_at"],
      values: ["desc"],
    },
  );

  return result;
}

async function removeSubscriber(id: number): Promise<NewsletterSubscriber> {
  const subscriber = await getRecordById<NewsletterSubscriber>(newsletterSubscribers, id);

  if (!subscriber) {
    throw new NotFoundException(NEWSLETTER_SUBSCRIBER_NOT_FOUND);
  }

  const deletedSubscriber = await deleteRecordById<NewsletterSubscriber>(newsletterSubscribers, id);

  return deletedSubscriber;
}

export {
  getAllSubscribers,
  removeSubscriber,
  subscribe,
};
