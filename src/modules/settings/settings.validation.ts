import type { InferOutput } from "valibot";

import { maxLength, nonEmpty, object, optional, pipe, string } from "valibot";

export const VUpdateSettingSchema = object({
  value: pipe(
    string("Value must be a string"),
    nonEmpty("Value is required"),
  ),
  description: optional(pipe(
    string("Description must be a string"),
    maxLength(500, "Description must be at most 500 characters"),
  )),
});

export type ValidatedUpdateSettingSchema = InferOutput<typeof VUpdateSettingSchema>;
