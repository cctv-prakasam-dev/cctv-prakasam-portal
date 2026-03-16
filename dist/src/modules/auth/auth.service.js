import { compare, hash } from "bcryptjs";
import { randomBytes } from "node:crypto";
import { appConfig } from "../../config/appConfig.js";
import { FP_EMAIL_SENT, INVALID_CREDENTIALS, INVALID_RESET_TOKEN, INVALID_VERIFICATION_TOKEN, USER_INACTIVE, } from "../../constants/appMessages.js";
import { users } from "../../db/schema/users.js";
import ForbiddenException from "../../exceptions/forbiddenException.js";
import NotFoundException from "../../exceptions/notFoundException.js";
import UnauthorizedException from "../../exceptions/unauthorizedException.js";
import { getSingleRecordByAColumnValue, saveSingleRecord, updateRecordById, } from "../../services/db/baseDbService.js";
import { sendEmailNotification } from "../../services/brevo/brevoEmailService.js";
import { escapeHtml } from "../../utils/escapeHtml.js";
import logger from "../../utils/logger.js";
import { genJWTTokensForUser, verifyJWTToken } from "../../utils/jwtUtils.js";
const SALT_ROUNDS = 10;
function generateToken() {
    return randomBytes(32).toString("hex");
}
async function registerUser(data) {
    const passwordHash = await hash(data.password, SALT_ROUNDS);
    const verificationToken = generateToken();
    const newUser = await saveSingleRecord(users, {
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
    const htmlContent = `
    <h2>Welcome to CCTV Prakasam!</h2>
    <p>Hi ${escapeHtml(data.first_name)},</p>
    <p>Thank you for registering. Please verify your email by clicking the link below:</p>
    <a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#0891B2;color:#fff;text-decoration:none;border-radius:6px;">Verify Email</a>
    <p>If you did not create this account, you can safely ignore this email.</p>
  `;
    sendEmailNotification(htmlContent, {
        to: data.email,
        subject: "Verify your email - CCTV Prakasam",
    }).catch((err) => logger.error("email", "Failed to send email", { error: err.message }));
    const tokens = await genJWTTokensForUser(newUser.id);
    const { password_hash, created_at, updated_at, deleted_at, ...userWithoutSensitive } = newUser;
    return { user: userWithoutSensitive, tokens };
}
async function loginUser(data) {
    const user = await getSingleRecordByAColumnValue(users, "email", data.email, "eq");
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
async function refreshTokens(refreshToken) {
    const decodedPayload = await verifyJWTToken(refreshToken);
    const tokens = await genJWTTokensForUser(decodedPayload.sub);
    return tokens;
}
async function forgotPassword(data) {
    const user = await getSingleRecordByAColumnValue(users, "email", data.email, "eq");
    // Always return success to prevent email enumeration
    if (!user || !user.active) {
        return FP_EMAIL_SENT;
    }
    const resetToken = generateToken();
    const resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await updateRecordById(users, user.id, {
        reset_token: resetToken,
        reset_token_expires_at: resetTokenExpiresAt,
    });
    const resetUrl = `${appConfig.app_base_url}/reset-password?token=${resetToken}`;
    const htmlContent = `
    <h2>Reset Your Password</h2>
    <p>Hi ${escapeHtml(user.first_name || "User")},</p>
    <p>You requested a password reset. Click the link below to set a new password:</p>
    <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#0891B2;color:#fff;text-decoration:none;border-radius:6px;">Reset Password</a>
    <p>This link expires in 1 hour. If you did not request this, you can safely ignore this email.</p>
  `;
    sendEmailNotification(htmlContent, {
        to: data.email,
        subject: "Reset your password - CCTV Prakasam",
    }).catch((err) => logger.error("email", "Failed to send email", { error: err.message }));
    return FP_EMAIL_SENT;
}
async function resetPassword(data) {
    const user = await getSingleRecordByAColumnValue(users, "reset_token", data.token, "eq");
    if (!user) {
        throw new NotFoundException(INVALID_RESET_TOKEN);
    }
    if (user.reset_token_expires_at && new Date(user.reset_token_expires_at) < new Date()) {
        throw new UnauthorizedException(INVALID_RESET_TOKEN);
    }
    const passwordHash = await hash(data.password, SALT_ROUNDS);
    await updateRecordById(users, user.id, {
        password_hash: passwordHash,
        reset_token: null,
        reset_token_expires_at: null,
    });
}
async function verifyEmail(data) {
    const user = await getSingleRecordByAColumnValue(users, "verification_token", data.token, "eq");
    if (!user) {
        throw new NotFoundException(INVALID_VERIFICATION_TOKEN);
    }
    await updateRecordById(users, user.id, {
        is_verified: true,
        verification_token: null,
    });
}
export { forgotPassword, loginUser, refreshTokens, registerUser, resetPassword, verifyEmail, };
