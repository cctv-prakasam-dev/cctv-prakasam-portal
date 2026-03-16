import { drizzle } from "drizzle-orm/node-postgres";
import fs from "node:fs";
import pg from "pg";
import { dbConfig } from "../config/dbConfig.js";
import logger from "../utils/logger.js";
import * as breakingNewsSchema from "./schema/breakingNews.js";
import * as categoriesSchema from "./schema/categories.js";
import * as featuredContentSchema from "./schema/featuredContent.js";
import * as newsletterSubscribersSchema from "./schema/newsletterSubscribers.js";
import * as settingsSchema from "./schema/settings.js";
import * as usersSchema from "./schema/users.js";
import * as videosSchema from "./schema/videos.js";
const { Pool } = pg;
let sslConfig = false;
try {
    const ca = fs.readFileSync("./ca.pem").toString();
    sslConfig = { rejectUnauthorized: true, ca };
}
catch {
    logger.warn("db", "ca.pem not found. SSL disabled for database connection.");
}
const dbClient = new Pool({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    ssl: sslConfig,
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
