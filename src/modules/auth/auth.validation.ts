import type { InferOutput } from "valibot";

import { email, minLength, nonEmpty, object, pipe, pipeAsync, rawTransformAsync, string } from "valibot";

import { userEmailExists } from "../../validations/customValidations.js";
import { prepareValibotIssue } from "../../validations/prepareValibotIssue.js";

export const VRegisterSchema = pipeAsync(
  object({
    first_name: pipe(
      string("First name must be a string"),
      nonEmpty("First name is required"),
    ),
    last_name: pipe(
      string("Last name must be a string"),
      nonEmpty("Last name is required"),
    ),
    email: pipe(
      string("Email must be a string"),
      nonEmpty("Email is required"),
      email("Invalid email format"),
    ),
    password: pipe(
      string("Password must be a string"),
      nonEmpty("Password is required"),
      minLength(8, "Password must be at least 8 characters"),
    ),
  }),
  rawTransformAsync(async ({ dataset, addIssue }) => {
    const { email: emailValue } = dataset.value;

    const emailAlreadyExists = await userEmailExists(emailValue);
    if (emailAlreadyExists) {
      prepareValibotIssue(
        dataset,
        addIssue,
        "email",
        emailValue,
        "An account with this email already exists",
      );
    }

    return dataset.value;
  }),
);

export const VLoginSchema = object({
  email: pipe(
    string("Email must be a string"),
    nonEmpty("Email is required"),
    email("Invalid email format"),
  ),
  password: pipe(
    string("Password must be a string"),
    nonEmpty("Password is required"),
  ),
});

export const VRefreshTokenSchema = object({
  refresh_token: pipe(
    string("Refresh token must be a string"),
    nonEmpty("Refresh token is required"),
  ),
});

export const VForgotPasswordSchema = object({
  email: pipe(
    string("Email must be a string"),
    nonEmpty("Email is required"),
    email("Invalid email format"),
  ),
});

export const VResetPasswordSchema = object({
  token: pipe(
    string("Token must be a string"),
    nonEmpty("Token is required"),
  ),
  password: pipe(
    string("Password must be a string"),
    nonEmpty("Password is required"),
    minLength(8, "Password must be at least 8 characters"),
  ),
});

export const VVerifyEmailSchema = object({
  token: pipe(
    string("Token must be a string"),
    nonEmpty("Token is required"),
  ),
});

export type ValidatedRegisterSchema = InferOutput<typeof VRegisterSchema>;
export type ValidatedLoginSchema = InferOutput<typeof VLoginSchema>;
export type ValidatedRefreshTokenSchema = InferOutput<typeof VRefreshTokenSchema>;
export type ValidatedForgotPasswordSchema = InferOutput<typeof VForgotPasswordSchema>;
export type ValidatedResetPasswordSchema = InferOutput<typeof VResetPasswordSchema>;
export type ValidatedVerifyEmailSchema = InferOutput<typeof VVerifyEmailSchema>;
