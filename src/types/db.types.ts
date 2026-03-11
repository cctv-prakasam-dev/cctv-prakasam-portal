import type { db } from "../db/configuration.js";
import type { BreakingNewsItem, BreakingNewsTable, NewBreakingNewsItem } from "../db/schema/breakingNews.js";
import type { CategoriesTable, Category, NewCategory } from "../db/schema/categories.js";
import type { FeaturedContentItem, FeaturedContentTable, NewFeaturedContentItem } from "../db/schema/featuredContent.js";
import type { NewNewsletterSubscriber, NewsletterSubscriber, NewsletterSubscribersTable } from "../db/schema/newsletterSubscribers.js";
import type { NewSetting, Setting, SettingsTable } from "../db/schema/settings.js";
import type { NewUser, User, UsersTable } from "../db/schema/users.js";
import type { NewVideo, Video, VideosTable } from "../db/schema/videos.js";

export type DBTable
  = | UsersTable
    | CategoriesTable
    | VideosTable
    | NewsletterSubscribersTable
    | SettingsTable
    | BreakingNewsTable
    | FeaturedContentTable;

export type DBTableRow
  = | User
    | Category
    | Video
    | NewsletterSubscriber
    | Setting
    | BreakingNewsItem
    | FeaturedContentItem;

export type DBNewRecord
  = | NewUser
    | NewCategory
    | NewVideo
    | NewNewsletterSubscriber
    | NewSetting
    | NewBreakingNewsItem
    | NewFeaturedContentItem;

export type DBNewRecords
  = | NewUser[]
    | NewCategory[]
    | NewVideo[]
    | NewNewsletterSubscriber[]
    | NewSetting[]
    | NewBreakingNewsItem[]
    | NewFeaturedContentItem[];

export type SortDirection = "asc" | "desc";

export type UserType
  = | "SUPER_ADMIN"
    | "ADMIN"
    | "MANAGER"
    | "CUSTOMER";

export type DBTableColumns<T extends DBTableRow> = keyof T;

export interface WhereQueryData<T extends DBTableRow> {
  columns: Array<keyof T>;
  values: any[];
  operators: RelationalOperator[];
}

export interface OrderByQueryData<T extends DBTableRow> {
  columns: Array<DBTableColumns<T>>;
  values: SortDirection[];
}

export interface InQueryData<T extends DBTableRow> {
  key: keyof T;
  values: any[];
}

export type UpdateRecordData<R extends DBTableRow> = Partial<
  Omit<R, "id" | "created_at" | "updated_at">
>;

export interface PaginationInfo {
  total_records: number;
  total_pages: number;
  page_size: number;
  current_page: number;
  next_page: number | null;
  prev_page: number | null;
}

export interface PaginatedRecords<T extends DBTableRow> {
  pagination_info: PaginationInfo;
  records: T[];
}

export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

export type RelationalOperator
  = | "eq"
    | "ne"
    | "gt"
    | "gte"
    | "lt"
    | "lte"
    | "like"
    | "ilike"
    | "in"
    | "notIn"
    | "isNull"
    | "isNotNull"
    | "between"
    | "jsonb_contains"
    | "jsonb_ilike"
    | "any";
