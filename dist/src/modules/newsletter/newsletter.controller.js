import { NEWSLETTER_SUBSCRIBED, NEWSLETTER_SUBSCRIBER_DELETED, NEWSLETTER_SUBSCRIBERS_FETCHED, SUBSCRIBE_NEWSLETTER_VALIDATION_ERROR, } from "../../constants/appMessages.js";
import { sendSuccessResp } from "../../utils/respUtils.js";
import { validateRequest } from "../../validations/validateRequest.js";
import { getAllSubscribers, removeSubscriber, subscribe, } from "./newsletter.service.js";
async function subscribeNewsletter(c) {
    const reqData = await c.req.json();
    const validatedData = await validateRequest("subscribe-newsletter", reqData, SUBSCRIBE_NEWSLETTER_VALIDATION_ERROR);
    const result = await subscribe(validatedData);
    return sendSuccessResp(c, 201, NEWSLETTER_SUBSCRIBED, result);
}
async function getSubscribers(c) {
    const page = Number(c.req.query("page")) || 1;
    const limit = Number(c.req.query("limit")) || 10;
    const result = await getAllSubscribers(page, limit);
    return sendSuccessResp(c, 200, NEWSLETTER_SUBSCRIBERS_FETCHED, result);
}
async function deleteSubscriber(c) {
    const id = Number(c.req.param("id"));
    const result = await removeSubscriber(id);
    return sendSuccessResp(c, 200, NEWSLETTER_SUBSCRIBER_DELETED, result);
}
export { deleteSubscriber, getSubscribers, subscribeNewsletter, };
