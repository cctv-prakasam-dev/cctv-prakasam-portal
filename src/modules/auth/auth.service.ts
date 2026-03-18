import { compare, hash } from "bcryptjs";
import { randomBytes } from "node:crypto";

import type { User } from "../../db/schema/users.js";
import type { AuthTokens } from "../../types/app.types.js";
import type { ValidatedForgotPasswordSchema, ValidatedLoginSchema, ValidatedRegisterSchema, ValidatedResetPasswordSchema, ValidatedVerifyEmailSchema } from "./auth.validation.js";

import { appConfig } from "../../config/appConfig.js";
import { FP_EMAIL_SENT, INVALID_CREDENTIALS, INVALID_RESET_TOKEN, INVALID_VERIFICATION_TOKEN, USER_INACTIVE } from "../../constants/appMessages.js";
import { users } from "../../db/schema/users.js";
import ForbiddenException from "../../exceptions/forbiddenException.js";
import NotFoundException from "../../exceptions/notFoundException.js";
import UnauthorizedException from "../../exceptions/unauthorizedException.js";
import {
  getSingleRecordByAColumnValue,
  saveSingleRecord,
  updateRecordById,
} from "../../services/db/baseDbService.js";
import { sendEmailNotification } from "../../services/brevo/brevoEmailService.js";
import { wrapEmailTemplate } from "../../utils/emailTemplate.js";
import { escapeHtml } from "../../utils/escapeHtml.js";
import logger from "../../utils/logger.js";
import { genJWTTokensForUser, verifyJWTToken } from "../../utils/jwtUtils.js";

const SALT_ROUNDS = 10;

function generateToken(): string {
  return randomBytes(32).toString("hex");
}

async function registerUser(data: ValidatedRegisterSchema): Promise<{ user: Omit<User, "password_hash" | "created_at" | "updated_at" | "deleted_at">; tokens: AuthTokens }> {
  const passwordHash = await hash(data.password, SALT_ROUNDS);
  const verificationToken = generateToken();

  const newUser = await saveSingleRecord<User>(users, {
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    password_hash: passwordHash,
    verification_token: verificationToken,
    is_verified: false,
    user_type: "CUSTOMER",
    active: true,
  });

  const verifyUrl = `${appConfig.app_base_url}/verify-email?token=${verificationToken}`;

  const htmlContent = wrapEmailTemplate({
    previewText: "Verify your email to get started with CCTV AP Prakasam",
    body: `
      <h2 style="margin:0 0 16px 0;font-size:20px;color:#0f172a;font-weight:700;">Welcome to CCTV AP Prakasam!</h2>
      <p style="margin:0 0 12px 0;font-size:14px;color:#475569;line-height:1.6;">Hi <strong>${escapeHtml(data.first_name)}</strong>,</p>
      <p style="margin:0 0 20px 0;font-size:14px;color:#475569;line-height:1.6;">Thank you for registering. Please verify your email address to activate your account.</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 20px auto;">
        <tr>
          <td style="border-radius:8px;background:linear-gradient(135deg,#0891B2,#06B6D4);">
            <a href="${verifyUrl}" style="display:inline-block;padding:14px 32px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.5px;">Verify Email Address</a>
          </td>
        </tr>
      </table>
      <p style="margin:0 0 8px 0;font-size:12px;color:#94a3b8;line-height:1.5;">If you did not create this account, you can safely ignore this email.</p>
      <p style="margin:0;font-size:11px;color:#cbd5e1;word-break:break-all;">Button not working? Copy this link: ${verifyUrl}</p>
    `,
  });

  sendEmailNotification(htmlContent, {
    to: data.email,
    subject: "Verify your email - CCTV Prakasam",
  }).catch((err: Error) => logger.error("email", "Failed to send email", { error: err.message }));

  const tokens = await genJWTTokensForUser(newUser.id);

  const { password_hash, created_at, updated_at, deleted_at, ...userWithoutSensitive } = newUser;

  return { user: userWithoutSensitive, tokens };
}

async function loginUser(data: ValidatedLoginSchema): Promise<{ user: Omit<User, "password_hash" | "created_at" | "updated_at" | "deleted_at">; tokens: AuthTokens }> {
  const user = await getSingleRecordByAColumnValue<User>(
    users,
    "email",
    data.email,
    "eq",
  );

  if (!user || !user.password_hash) {
    throw new UnauthorizedException(INVALID_CREDENTIALS);
  }

  if (!user.active) {
    throw new ForbiddenException(USER_INACTIVE);
  }

  const isPasswordValid = await compare(data.password, user.password_hash);
  if (!isPasswordValid) {
    throw new UnauthorizedException(INVALID_CREDENTIALS);
  }

  const tokens = await genJWTTokensForUser(user.id);

  const { password_hash, created_at, updated_at, deleted_at, ...userWithoutSensitive } = user;

  return { user: userWithoutSensitive, tokens };
}

async function refreshTokens(refreshToken: string): Promise<AuthTokens> {
  const decodedPayload = await verifyJWTToken(refreshToken);
  const tokens = await genJWTTokensForUser(decodedPayload.sub as number);
  return tokens;
}

async function forgotPassword(data: ValidatedForgotPasswordSchema): Promise<string> {
  const user = await getSingleRecordByAColumnValue<User>(
    users,
    "email",
    data.email,
    "eq",
  );

  // Always return success to prevent email enumeration
  if (!user || !user.active) {
    return FP_EMAIL_SENT;
  }

  const resetToken = generateToken();
  const resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await updateRecordById<User>(users, user.id, {
    reset_token: resetToken,
    reset_token_expires_at: resetTokenExpiresAt,
  });

  const resetUrl = `${appConfig.app_base_url}/reset-password?token=${resetToken}`;

  const htmlContent = wrapEmailTemplate({
    previewText: "Reset your CCTV AP Prakasam password",
    body: `
      <h2 style="margin:0 0 16px 0;font-size:20px;color:#0f172a;font-weight:700;">Reset Your Password</h2>
      <p style="margin:0 0 12px 0;font-size:14px;color:#475569;line-height:1.6;">Hi <strong>${escapeHtml(user.first_name || "User")}</strong>,</p>
      <p style="margin:0 0 20px 0;font-size:14px;color:#475569;line-height:1.6;">We received a request to reset your password. Click the button below to set a new one.</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 20px auto;">
        <tr>
          <td style="border-radius:8px;background:linear-gradient(135deg,#0891B2,#06B6D4);">
            <a href="${resetUrl}" style="display:inline-block;padding:14px 32px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.5px;">Reset Password</a>
          </td>
        </tr>
      </table>
      <div style="background:#fef3c7;border-left:3px solid #d97706;padding:12px 16px;border-radius:6px;margin:0 0 16px 0;">
        <p style="margin:0;font-size:12px;color:#92400e;line-height:1.5;">&#9888; This link expires in <strong>1 hour</strong>. If you did not request this, you can safely ignore this email.</p>
      </div>
      <p style="margin:0;font-size:11px;color:#cbd5e1;word-break:break-all;">Button not working? Copy this link: ${resetUrl}</p>
    `,
  });

  sendEmailNotification(htmlContent, {
    to: data.email,
    subject: "Reset your password - CCTV Prakasam",
  }).catch((err: Error) => logger.error("email", "Failed to send email", { error: err.message }));

  return FP_EMAIL_SENT;
}

async function resetPassword(data: ValidatedResetPasswordSchema): Promise<void> {
  const user = await getSingleRecordByAColumnValue<User>(
    users,
    "reset_token",
    data.token,
    "eq",
  );

  if (!user) {
    throw new NotFoundException(INVALID_RESET_TOKEN);
  }

  if (user.reset_token_expires_at && new Date(user.reset_token_expires_at) < new Date()) {
    throw new UnauthorizedException(INVALID_RESET_TOKEN);
  }

  const passwordHash = await hash(data.password, SALT_ROUNDS);

  await updateRecordById<User>(users, user.id, {
    password_hash: passwordHash,
    reset_token: null,
    reset_token_expires_at: null,
  });
}

async function verifyEmail(data: ValidatedVerifyEmailSchema): Promise<void> {
  const user = await getSingleRecordByAColumnValue<User>(
    users,
    "verification_token",
    data.token,
    "eq",
  );

  if (!user) {
    throw new NotFoundException(INVALID_VERIFICATION_TOKEN);
  }

  await updateRecordById<User>(users, user.id, {
    is_verified: true,
    verification_token: null,
  });
}

export {
  forgotPassword,
  loginUser,
  refreshTokens,
  registerUser,
  resetPassword,
  verifyEmail,
};
