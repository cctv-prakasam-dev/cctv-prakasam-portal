import { boolean, integer, maxLength, nonEmpty, number, object, optional, pipe, pipeAsync, rawTransformAsync, string } from "valibot";

import { categorySlugExists } from "../../validations/customValidations.js";
import { prepareValibotIssue } from "../../validations/prepareValibotIssue.js";

export const VCreateCategorySchema = pipeAsync(
  object({
    name: pipe(
      string("Name must be a string"),
      nonEmpty("Name is required"),
      maxLength(100, "Name must be at most 100 characters"),
    ),
    name_te: optional(pipe(
      string("Telugu name must be a string"),
      maxLength(200, "Telugu name must be at most 200 characters"),
    )),
    slug: pipe(
      string("Slug must be a string"),
      nonEmpty("Slug is required"),
      maxLength(100, "Slug must be at most 100 characters"),
    ),
    icon: optional(pipe(
      string("Icon must be a string"),
      maxLength(10, "Icon must be at most 10 characters"),
    )),
    color: optional(pipe(
      string("Color must be a string"),
      maxLength(7, "Color must be at most 7 characters"),
    )),
    sort_order: optional(pipe(
      number("Sort order must be a number"),
      integer("Sort order must be an integer"),
    )),
  }),
  rawTransformAsync(async ({ dataset, addIssue }) => {
    const { slug } = dataset.value;

    const slugAlreadyExists = await categorySlugExists(slug);
    if (slugAlreadyExists) {
      prepareValibotIssue(
        dataset,
        addIssue,
        "slug",
        slug,
        "A category with this slug already exists",
      );
    }

    return dataset.value;
  }),
);

export const VUpdateCategorySchema = object({
  name: optional(pipe(
    string("Name must be a string"),
    nonEmpty("Name is required"),
    maxLength(100, "Name must be at most 100 characters"),
  )),
  name_te: optional(pipe(
    string("Telugu name must be a string"),
    maxLength(200, "Telugu name must be at most 200 characters"),
  )),
  slug: optional(pipe(
    string("Slug must be a string"),
    nonEmpty("Slug is required"),
    maxLength(100, "Slug must be at most 100 characters"),
  )),
  icon: optional(pipe(
    string("Icon must be a string"),
    maxLength(10, "Icon must be at most 10 characters"),
  )),
  color: optional(pipe(
    string("Color must be a string"),
    maxLength(7, "Color must be at most 7 characters"),
  )),
  sort_order: optional(pipe(
    number("Sort order must be a number"),
    integer("Sort order must be an integer"),
  )),
  is_active: optional(boolean("Active status must be a boolean")),
});
