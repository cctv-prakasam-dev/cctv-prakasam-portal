import type { User } from "../db/schema/users.js";
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

export type UserLogOut = "user-logout";

export type AppActivity
  = | SignUpOrSignInActivity
    | AuthActivity
    | CategoryActivity
    | VideoActivity
    | NewsletterActivity
    | BreakingNewsActivity
    | FeaturedContentActivity
    | UserLogOut;

export interface ValidatedRegister {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface ValidatedLogin {
  email: string;
  password: string;
}

export interface ValidatedRefreshToken {
  refresh_token: string;
}

export interface ValidatedForgotPassword {
  email: string;
}

export interface ValidatedResetPassword {
  token: string;
  password: string;
}

export interface ValidatedVerifyEmail {
  token: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  refresh_token_expires_at: number;
}

export interface ValidatedCreateCategory {
  name: string;
  name_te?: string;
  slug: string;
  icon?: string;
  color?: string;
  sort_order?: number;
}

export interface ValidatedUpdateCategory {
  name?: string;
  name_te?: string;
  slug?: string;
  icon?: string;
  color?: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface ValidatedCreateVideo {
  youtube_id: string;
  title: string;
  title_te?: string;
  description?: string;
  category_id?: number;
  thumbnail_url?: string;
  duration?: string;
  view_count?: string;
  published_at?: string;
  is_featured?: boolean;
  is_trending?: boolean;
}

export interface ValidatedSubscribeNewsletter {
  email: string;
}

export interface ValidatedCreateBreakingNews {
  text: string;
  text_te?: string;
  sort_order?: number;
}

export interface ValidatedUpdateBreakingNews {
  text?: string;
  text_te?: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface ValidatedCreateFeaturedContent {
  type: string;
  video_id?: number;
  title?: string;
  sort_order?: number;
}

export interface ValidatedUpdateFeaturedContent {
  type?: string;
  video_id?: number;
  title?: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface ValidatedUpdateVideo {
  title?: string;
  title_te?: string;
  description?: string;
  category_id?: number;
  thumbnail_url?: string;
  duration?: string;
  view_count?: string;
  published_at?: string;
  is_featured?: boolean;
  is_trending?: boolean;
  is_active?: boolean;
}

export type ValidatedRequest
  = | ValidatedRegister
    | ValidatedLogin
    | ValidatedRefreshToken
    | ValidatedForgotPassword
    | ValidatedResetPassword
    | ValidatedVerifyEmail
    | ValidatedCreateCategory
    | ValidatedUpdateCategory
    | ValidatedCreateVideo
    | ValidatedUpdateVideo
    | ValidatedSubscribeNewsletter
    | ValidatedCreateBreakingNews
    | ValidatedUpdateBreakingNews
    | ValidatedCreateFeaturedContent
    | ValidatedUpdateFeaturedContent;
