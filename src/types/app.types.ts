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

export type UserLogOut = "user-logout";
export type AppActivity
  = | SignUpOrSignInActivity
    | UserLogOut;

export type ValidatedRequest
  = | null;
