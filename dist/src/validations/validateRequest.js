import { flatten, safeParseAsync } from "valibot";
import UnprocessableContentException from "../exceptions/unprocessableContentException.js";
import { VForgotPasswordSchema, VLoginSchema, VRefreshTokenSchema, VRegisterSchema, VResetPasswordSchema, VVerifyEmailSchema, } from "../modules/auth/auth.validation.js";
import { VCreateCategorySchema, VUpdateCategorySchema, } from "../modules/categories/categories.validation.js";
import { VCreateBreakingNewsSchema, VUpdateBreakingNewsSchema, } from "../modules/breakingNews/breakingNews.validation.js";
import { VCreateFeaturedContentSchema, VUpdateFeaturedContentSchema, } from "../modules/featuredContent/featuredContent.validation.js";
import { VSubscribeNewsletterSchema } from "../modules/newsletter/newsletter.validation.js";
import { VCreateVideoSchema, VUpdateVideoSchema, } from "../modules/videos/videos.validation.js";
export async function validateRequest(actionType, reqData, errorMessage) {
    let schema;
    switch (actionType) {
        case "register":
            schema = VRegisterSchema;
            break;
        case "login":
            schema = VLoginSchema;
            break;
        case "refresh-token":
            schema = VRefreshTokenSchema;
            break;
        case "forgot-password":
            schema = VForgotPasswordSchema;
            break;
        case "reset-password":
            schema = VResetPasswordSchema;
            break;
        case "verify-email":
            schema = VVerifyEmailSchema;
            break;
        case "create-category":
            schema = VCreateCategorySchema;
            break;
        case "update-category":
            schema = VUpdateCategorySchema;
            break;
        case "create-video":
            schema = VCreateVideoSchema;
            break;
        case "update-video":
            schema = VUpdateVideoSchema;
            break;
        case "subscribe-newsletter":
            schema = VSubscribeNewsletterSchema;
            break;
        case "create-breaking-news":
            schema = VCreateBreakingNewsSchema;
            break;
        case "update-breaking-news":
            schema = VUpdateBreakingNewsSchema;
            break;
        case "create-featured-content":
            schema = VCreateFeaturedContentSchema;
            break;
        case "update-featured-content":
            schema = VUpdateFeaturedContentSchema;
            break;
        default:
    }
    if (!schema) {
        throw new Error(`Schema is undefined for action type: ${actionType}`);
    }
    const validation = await safeParseAsync(schema, reqData, {
        abortPipeEarly: true,
    });
    if (!validation.success) {
        throw new UnprocessableContentException(errorMessage, flatten(validation.issues).nested);
    }
    return validation.output;
}
