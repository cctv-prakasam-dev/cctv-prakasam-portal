import { boolean, integer, maxLength, nonEmpty, number, object, optional, pipe, pipeAsync, rawTransformAsync, string } from "valibot";
import { videoYoutubeIdExists } from "../../validations/customValidations.js";
import { prepareValibotIssue } from "../../validations/prepareValibotIssue.js";
export const VCreateVideoSchema = pipeAsync(object({
    youtube_id: pipe(string("YouTube ID must be a string"), nonEmpty("YouTube ID is required"), maxLength(20, "YouTube ID must be at most 20 characters")),
    title: pipe(string("Title must be a string"), nonEmpty("Title is required"), maxLength(500, "Title must be at most 500 characters")),
    title_te: optional(pipe(string("Telugu title must be a string"), maxLength(500, "Telugu title must be at most 500 characters"))),
    description: optional(string("Description must be a string")),
    category_id: optional(pipe(number("Category ID must be a number"), integer("Category ID must be an integer"))),
    thumbnail_url: optional(pipe(string("Thumbnail URL must be a string"), maxLength(500, "Thumbnail URL must be at most 500 characters"))),
    duration: optional(pipe(string("Duration must be a string"), maxLength(10, "Duration must be at most 10 characters"))),
    view_count: optional(pipe(string("View count must be a string"), maxLength(20, "View count must be at most 20 characters"))),
    published_at: optional(string("Published date must be a string")),
    is_featured: optional(boolean("Featured status must be a boolean")),
    is_trending: optional(boolean("Trending status must be a boolean")),
}), rawTransformAsync(async ({ dataset, addIssue }) => {
    const { youtube_id } = dataset.value;
    const youtubeIdAlreadyExists = await videoYoutubeIdExists(youtube_id);
    if (youtubeIdAlreadyExists) {
        prepareValibotIssue(dataset, addIssue, "youtube_id", youtube_id, "A video with this YouTube ID already exists");
    }
    return dataset.value;
}));
export const VUpdateVideoSchema = object({
    title: optional(pipe(string("Title must be a string"), nonEmpty("Title is required"), maxLength(500, "Title must be at most 500 characters"))),
    title_te: optional(pipe(string("Telugu title must be a string"), maxLength(500, "Telugu title must be at most 500 characters"))),
    description: optional(string("Description must be a string")),
    category_id: optional(pipe(number("Category ID must be a number"), integer("Category ID must be an integer"))),
    thumbnail_url: optional(pipe(string("Thumbnail URL must be a string"), maxLength(500, "Thumbnail URL must be at most 500 characters"))),
    duration: optional(pipe(string("Duration must be a string"), maxLength(10, "Duration must be at most 10 characters"))),
    view_count: optional(pipe(string("View count must be a string"), maxLength(20, "View count must be at most 20 characters"))),
    published_at: optional(string("Published date must be a string")),
    is_featured: optional(boolean("Featured status must be a boolean")),
    is_trending: optional(boolean("Trending status must be a boolean")),
    is_active: optional(boolean("Active status must be a boolean")),
});
