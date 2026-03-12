import type { Context } from "hono";

import type {
  ValidatedForgotPasswordSchema,
  ValidatedLoginSchema,
  ValidatedRefreshTokenSchema,
  ValidatedRegisterSchema,
  ValidatedResetPasswordSchema,
  ValidatedVerifyEmailSchema,
} from "./auth.validation.js";

import {
  EMAIL_VERIFIED,
  FORGOT_PASSWORD_VALIDATION_ERROR,
  LOGIN_DONE,
  LOGIN_VALIDATION_ERROR,
  LOGOUT_DONE,
  PASSWORD_RESET_DONE,
  REFRESH_TOKEN_VALIDATION_ERROR,
  REGISTER_DONE,
  REGISTER_VALIDATION_ERROR,
  RESET_PASSWORD_VALIDATION_ERROR,
  VERIFY_EMAIL_VALIDATION_ERROR,
} from "../../constants/appMessages.js";
import { sendSuccessResp } from "../../utils/respUtils.js";
import { validateRequest } from "../../validations/validateRequest.js";
import {
  forgotPassword,
  loginUser,
  refreshTokens,
  registerUser,
  resetPassword,
  verifyEmail,
} from "./auth.service.js";

async function register(c: Context) {
  const reqData = await c.req.json();

  const validatedData = await validateRequest<ValidatedRegisterSchema>(
    "register",
    reqData,
    REGISTER_VALIDATION_ERROR,
  );

  const result = await registerUser(validatedData);

  return sendSuccessResp(c, 201, REGISTER_DONE, result);
}

async function login(c: Context) {
  const reqData = await c.req.json();

  const validatedData = await validateRequest<ValidatedLoginSchema>(
    "login",
    reqData,
    LOGIN_VALIDATION_ERROR,
  );

  const result = await loginUser(validatedData);

  return sendSuccessResp(c, 200, LOGIN_DONE, result);
}

async function refreshToken(c: Context) {
  const reqData = await c.req.json();

  const validatedData = await validateRequest<ValidatedRefreshTokenSchema>(
    "refresh-token",
    reqData,
    REFRESH_TOKEN_VALIDATION_ERROR,
  );

  const tokens = await refreshTokens(validatedData.refresh_token);

  return sendSuccessResp(c, 200, LOGIN_DONE, tokens);
}

async function forgotPasswordHandler(c: Context) {
  const reqData = await c.req.json();

  const validatedData = await validateRequest<ValidatedForgotPasswordSchema>(
    "forgot-password",
    reqData,
    FORGOT_PASSWORD_VALIDATION_ERROR,
  );

  const message = await forgotPassword(validatedData);

  return sendSuccessResp(c, 200, message);
}

async function resetPasswordHandler(c: Context) {
  const reqData = await c.req.json();

  const validatedData = await validateRequest<ValidatedResetPasswordSchema>(
    "reset-password",
    reqData,
    RESET_PASSWORD_VALIDATION_ERROR,
  );

  await resetPassword(validatedData);

  return sendSuccessResp(c, 200, PASSWORD_RESET_DONE);
}

async function verifyEmailHandler(c: Context) {
  const reqData = await c.req.json();

  const validatedData = await validateRequest<ValidatedVerifyEmailSchema>(
    "verify-email",
    reqData,
    VERIFY_EMAIL_VALIDATION_ERROR,
  );

  await verifyEmail(validatedData);

  return sendSuccessResp(c, 200, EMAIL_VERIFIED);
}

async function logout(c: Context) {
  return sendSuccessResp(c, 200, LOGOUT_DONE);
}

export {
  forgotPasswordHandler,
  login,
  logout,
  refreshToken,
  register,
  resetPasswordHandler,
  verifyEmailHandler,
};
