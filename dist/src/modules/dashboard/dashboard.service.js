import { count, desc, gte, sql } from "drizzle-orm";
import { USER_NOT_FOUND } from "../../constants/appMessages.js";
import { youtubeConfig } from "../../config/youtubeConfig.js";
import { db } from "../../db/configuration.js";
import { breakingNews } from "../../db/schema/breakingNews.js";
import { categories } from "../../db/schema/categories.js";
import { newsletterSubscribers } from "../../db/schema/newsletterSubscribers.js";
import { users } from "../../db/schema/users.js";
import { videos } from "../../db/schema/videos.js";
import NotFoundException from "../../exceptions/notFoundException.js";
import { getPaginatedRecordsConditionally, getRecordById, updateRecordById, } from "../../services/db/baseDbService.js";
import { httpGet } from "../../services/http.js";
import { parseOrderByQuery } from "../../utils/dbUtils.js";
async function getYouTubeSubscriberCount() {
    try {
        const url = `${youtubeConfig.baseUrl}/channels?part=statistics&id=${youtubeConfig.channelId}&key=${youtubeConfig.apiKey}`;
        const data = await httpGet(url);
        if (data.items && data.items.length > 0) {
            return Number.parseInt(data.items[0].statistics.subscriberCount || "0", 10);
        }
        return 0;
    }
    catch {
        return 0;
    }
}
async function getDashboardStats() {
    const [videoCount] = await db.select({ total: count() }).from(videos);
    const [userCount] = await db.select({ total: count() }).from(users);
    const [subscriberCount] = await db.select({ total: count() }).from(newsletterSubscribers);
    const [breakingNewsCount] = await db.select({ total: count() }).from(breakingNews);
    // Videos published per day this week (last 7 days, UTC)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyVideos = await db
        .select({
        day: sql `TO_CHAR(${videos.published_at}, 'Dy')`,
        count: count(),
    })
        .from(videos)
        .where(gte(videos.published_at, sevenDaysAgo))
        .groupBy(sql `TO_CHAR(${videos.published_at}, 'Dy'), TO_CHAR(${videos.published_at}, 'D')`)
        .orderBy(sql `TO_CHAR(${videos.published_at}, 'D')`);
    // YouTube channel subscriber count
    const youtube_subscribers = await getYouTubeSubscriberCount();
    // Category distribution (video count per category)
    const categoryDistribution = await db
        .select({
        id: categories.id,
        name: categories.name,
        color: categories.color,
        icon: categories.icon,
        video_count: count(videos.id),
    })
        .from(categories)
        .leftJoin(videos, sql `${videos.category_id} = ${categories.id} AND ${videos.is_active} = true`)
        .where(sql `${categories.is_active} = true`)
        .groupBy(categories.id, categories.name, categories.color, categories.icon)
        .orderBy(sql `count(${videos.id}) DESC`);
    // Recent activity — derive from latest records across tables
    const recentVideos = await db
        .select({
        type: sql `'video_published'`,
        title: videos.title,
        detail: videos.title_te,
        created_at: videos.created_at,
    })
        .from(videos)
        .orderBy(desc(videos.created_at))
        .limit(5);
    const recentUsers = await db
        .select({
        type: sql `'new_user'`,
        title: sql `COALESCE(${users.first_name} || ' ' || ${users.last_name}, ${users.email})`,
        detail: users.email,
        created_at: users.created_at,
    })
        .from(users)
        .orderBy(desc(users.created_at))
        .limit(5);
    const recentSubscribers = await db
        .select({
        type: sql `'subscriber'`,
        title: newsletterSubscribers.email,
        detail: sql `'Newsletter subscription'`,
        created_at: newsletterSubscribers.created_at,
    })
        .from(newsletterSubscribers)
        .orderBy(desc(newsletterSubscribers.created_at))
        .limit(5);
    const recentCategories = await db
        .select({
        type: sql `'category_added'`,
        title: categories.name,
        detail: categories.name_te,
        created_at: categories.created_at,
    })
        .from(categories)
        .orderBy(desc(categories.created_at))
        .limit(3);
    // Merge and sort by created_at descending, take top 10
    const recentActivity = [...recentVideos, ...recentUsers, ...recentSubscribers, ...recentCategories]
        .sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
    })
        .slice(0, 10);
    return {
        videos: videoCount.total,
        users: userCount.total,
        newsletter_subscribers: subscriberCount.total,
        breaking_news: breakingNewsCount.total,
        weekly_videos: weeklyVideos,
        youtube_subscribers,
        category_distribution: categoryDistribution,
        recent_activity: recentActivity,
    };
}
async function getUsers(page, pageSize, sort) {
    const orderByQueryData = parseOrderByQuery(sort, "created_at", "desc");
    const result = await getPaginatedRecordsConditionally(users, page, pageSize, orderByQueryData);
    return result;
}
async function updateUserRole(id, data) {
    const existing = await getRecordById(users, id);
    if (!existing) {
        throw new NotFoundException(USER_NOT_FOUND);
    }
    const updatedUser = await updateRecordById(users, id, data);
    return updatedUser;
}
export { getDashboardStats, getUsers, updateUserRole, };
