import { drizzle } from "drizzle-orm/node-postgres";
import fs from "node:fs";
import pg from "pg";

import { dbConfig } from "../config/dbConfig.js";
import * as breakingNewsSchema from "./schema/breakingNews.js";
import * as categoriesSchema from "./schema/categories.js";
import * as featuredContentSchema from "./schema/featuredContent.js";
import * as newsletterSubscribersSchema from "./schema/newsletterSubscribers.js";
import * as settingsSchema from "./schema/settings.js";
import * as usersSchema from "./schema/users.js";
import * as videosSchema from "./schema/videos.js";

const { Pool } = pg;

const dbClient = new Pool({
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync("./ca.pem").toString(),
  },
});
export const db = drizzle(dbClient, {
  schema: {
    ...usersSchema,
    ...categoriesSchema,
    ...videosSchema,
    ...newsletterSubscribersSchema,
    ...settingsSchema,
    ...breakingNewsSchema,
    ...featuredContentSchema,
  },
});
