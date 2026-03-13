import type { User } from "../db/schema/users.js";
import type { ValidatedForgotPasswordSchema, ValidatedLoginSchema, ValidatedRefreshTokenSchema, ValidatedRegisterSchema, ValidatedResetPasswordSchema, ValidatedVerifyEmailSchema } from "../modules/auth/auth.validation.js";
import type { ValidatedContactSchema } from "../modules/contact/contact.validation.js";
import type { ValidatedUpdateUserRoleSchema } from "../modules/dashboard/dashboard.validation.js";
import type { ValidatedCreateBreakingNewsSchema, ValidatedUpdateBreakingNewsSchema } from "../modules/breakingNews/breakingNews.validation.js";
import type { ValidatedCreateCategorySchema, ValidatedUpdateCategorySchema } from "../modules/categories/categories.validation.js";
import type { ValidatedCreateFeaturedContentSchema, ValidatedUpdateFeaturedContentSchema } from "../modules/featuredContent/featuredContent.validation.js";
import type { ValidatedSubscribeNewsletterSchema } from "../modules/newsletter/newsletter.validation.js";
import type { ValidatedUpdateSettingSchema } from "../modules/settings/settings.validation.js";
import type { ValidatedCreateVideoSchema, ValidatedUpdateVideoSchema } from "../modules/videos/videos.validation.js";
import type { DBTableRow } from "./db.types.js";

export type ActionType = string;

export interface PaginatedResp<T extends DBTableRow> {
  pagination_info: PaginationInfo;
  records: T[];
}

export interface PaginationInfo {
  total_records: number;
  total_pages: number;
  page_size: number;
  current_page: number;
  next_page: number | null;
  prev_page: number | null;
}
export interface emailOptions {
  to: string | null;
  cc?: any;
  subject: string;
  user_name?: string;
  login_link?: string;
  view_case_link?: string;
}
export type DeviceType = "mobile" | "web";

export type AppRespData
  = | PaginatedResp<DBTableRow>
    | User
    | emailOptions
    | unknown;

export interface SuccessResp {
  status: number;
  success: true;
  message: string;
  data?: AppRespData;
}

export interface ErrorResp {
  status: number;
  success: false;
  message: string;
  errData?: any;
}

export interface JWTUserPayload {
  sub: number;
  iat: number;
}

export type SignUpOrSignInActivity
  = | "signup-or-signin"
    | "signup-or-signin-verify"
    | "signin"
    | "signin-verify"
    | "signin-with-phone"
    | "signin-with-phone-verify";

export type AuthActivity
  = | "register"
    | "login"
    | "refresh-token"
    | "forgot-password"
    | "reset-password"
    | "verify-email";

export type CategoryActivity
  = | "create-category"
    | "update-category";

export type VideoActivity
  = | "create-video"
    | "update-video";

export type NewsletterActivity = "subscribe-newsletter";

export type BreakingNewsActivity
  = | "create-breaking-news"
    | "update-breaking-news";

export type FeaturedContentActivity
  = | "create-featured-content"
    | "update-featured-content";

export type SettingsActivity = "update-setting";

export type ContactActivity = "submit-contact";

export type DashboardActivity = "update-user-role";

export type UserLogOut = "user-logout";

export type AppActivity
  = | SignUpOrSignInActivity
    | AuthActivity
    | CategoryActivity
    | VideoActivity
    | NewsletterActivity
    | BreakingNewsActivity
    | FeaturedContentActivity
    | SettingsActivity
    | ContactActivity
    | DashboardActivity
    | UserLogOut;

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  refresh_token_expires_at: number;
}

export type ValidatedRequest
  = | ValidatedRegisterSchema
    | ValidatedLoginSchema
    | ValidatedRefreshTokenSchema
    | ValidatedForgotPasswordSchema
    | ValidatedResetPasswordSchema
    | ValidatedVerifyEmailSchema
    | ValidatedCreateCategorySchema
    | ValidatedUpdateCategorySchema
    | ValidatedCreateVideoSchema
    | ValidatedUpdateVideoSchema
    | ValidatedSubscribeNewsletterSchema
    | ValidatedCreateBreakingNewsSchema
    | ValidatedUpdateBreakingNewsSchema
    | ValidatedCreateFeaturedContentSchema
    | ValidatedUpdateFeaturedContentSchema
    | ValidatedUpdateSettingSchema
    | ValidatedContactSchema
    | ValidatedUpdateUserRoleSchema;
