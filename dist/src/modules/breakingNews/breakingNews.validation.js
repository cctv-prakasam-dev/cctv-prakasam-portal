import { boolean, integer, maxLength, nonEmpty, number, object, optional, pipe, string } from "valibot";
export const VCreateBreakingNewsSchema = object({
    text: pipe(string("Text must be a string"), nonEmpty("Text is required"), maxLength(500, "Text must be at most 500 characters")),
    text_te: optional(pipe(string("Telugu text must be a string"), maxLength(500, "Telugu text must be at most 500 characters"))),
    sort_order: optional(pipe(number("Sort order must be a number"), integer("Sort order must be an integer"))),
});
export const VUpdateBreakingNewsSchema = object({
    text: optional(pipe(string("Text must be a string"), nonEmpty("Text is required"), maxLength(500, "Text must be at most 500 characters"))),
    text_te: optional(pipe(string("Telugu text must be a string"), maxLength(500, "Telugu text must be at most 500 characters"))),
    sort_order: optional(pipe(number("Sort order must be a number"), integer("Sort order must be an integer"))),
    is_active: optional(boolean("Active status must be a boolean")),
});
