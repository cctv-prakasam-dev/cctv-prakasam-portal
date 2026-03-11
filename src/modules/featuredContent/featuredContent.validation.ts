import { boolean, integer, maxLength, nonEmpty, number, object, optional, pipe, string } from "valibot";

export const VCreateFeaturedContentSchema = object({
  type: pipe(
    string("Type must be a string"),
    nonEmpty("Type is required"),
    maxLength(50, "Type must be at most 50 characters"),
  ),
  video_id: optional(pipe(
    number("Video ID must be a number"),
    integer("Video ID must be an integer"),
  )),
  title: optional(pipe(
    string("Title must be a string"),
    maxLength(200, "Title must be at most 200 characters"),
  )),
  sort_order: optional(pipe(
    number("Sort order must be a number"),
    integer("Sort order must be an integer"),
  )),
});

export const VUpdateFeaturedContentSchema = object({
  type: optional(pipe(
    string("Type must be a string"),
    nonEmpty("Type is required"),
    maxLength(50, "Type must be at most 50 characters"),
  )),
  video_id: optional(pipe(
    number("Video ID must be a number"),
    integer("Video ID must be an integer"),
  )),
  title: optional(pipe(
    string("Title must be a string"),
    maxLength(200, "Title must be at most 200 characters"),
  )),
  sort_order: optional(pipe(
    number("Sort order must be a number"),
    integer("Sort order must be an integer"),
  )),
  is_active: optional(boolean("Active status must be a boolean")),
});
