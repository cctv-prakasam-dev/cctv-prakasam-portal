import type { InferOutput } from "valibot";

import { email, maxLength, nonEmpty, object, optional, pipe, string } from "valibot";

export const VContactSchema = object({
  name: pipe(
    string("Name must be a string"),
    nonEmpty("Name is required"),
    maxLength(100, "Name must be at most 100 characters"),
  ),
  email: pipe(
    string("Email must be a string"),
    nonEmpty("Email is required"),
    email("Invalid email format"),
  ),
  phone: optional(pipe(
    string("Phone must be a string"),
    maxLength(20, "Phone must be at most 20 characters"),
  )),
  subject: pipe(
    string("Subject must be a string"),
    nonEmpty("Subject is required"),
    maxLength(200, "Subject must be at most 200 characters"),
  ),
  message: pipe(
    string("Message must be a string"),
    nonEmpty("Message is required"),
    maxLength(2000, "Message must be at most 2000 characters"),
  ),
});

export type ValidatedContactSchema = InferOutput<typeof VContactSchema>;
