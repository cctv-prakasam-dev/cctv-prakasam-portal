import { flatten, safeParseAsync } from "valibot";

import type { AppActivity, ValidatedRequest } from "../types/app.types.js";

import UnprocessableContentException from "../exceptions/unprocessableContentException.js";
import {
  VForgotPasswordSchema,
  VLoginSchema,
  VRefreshTokenSchema,
  VRegisterSchema,
  VResetPasswordSchema,
  VVerifyEmailSchema,
} from "../modules/auth/auth.validation.js";

export async function validateRequest<R extends ValidatedRequest>(
  actionType: AppActivity,
  reqData: any,
  errorMessage: string,
) {
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
    default:
  }
  if (!schema) {
    throw new Error(`Schema is undefined for action type: ${actionType}`);
  }
  const validation = await safeParseAsync(schema, reqData, {
    abortPipeEarly: true,
  });

  if (!validation.success) {
    throw new UnprocessableContentException(
      errorMessage,
      flatten(validation.issues).nested,
    );
  }

  return validation.output as R;
}
