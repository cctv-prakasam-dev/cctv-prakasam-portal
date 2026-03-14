import { eq, sql } from "drizzle-orm";

import { db } from "../src/db/configuration.js";
import { breakingNews } from "../src/db/schema/breakingNews.js";
import { categories } from "../src/db/schema/categories.js";
import { featuredContent } from "../src/db/schema/featuredContent.js";
import { settings } from "../src/db/schema/settings.js";
import { videos } from "../src/db/schema/videos.js";

// ── Categories ──────────────────────────────────────────────
const categoryData = [
  { name: "General News", name_te: "సాధారణ వార్తలు", slug: "general-news", icon: "📰", color: "#0891B2", sort_order: 1 },
  { name: "Political News", name_te: "రాజకీయ వార్తలు", slug: "political-news", icon: "🏛️", color: "#6D28D9", sort_order: 2 },
  { name: "Entertainment", name_te: "వినోదం", slug: "entertainment", icon: "🎬", color: "#D97706", sort_order: 3 },
  { name: "Devotional", name_te: "భక్తి", slug: "devotional", icon: "🙏", color: "#DB2777", sort_order: 4 },
  { name: "Local News", name_te: "స్థానిక వార్తలు", slug: "local-news", icon: "📍", color: "#059669", sort_order: 5 },
  { name: "Sports", name_te: "క్రీడలు", slug: "sports", icon: "⚽", color: "#2563EB", sort_order: 6 },
];

// ── Breaking News ───────────────────────────────────────────
const breakingNewsData = [
  { text: "CCTV AP Prakasam brings you the latest news from Prakasam district", text_te: "CCTV AP ప్రకాశం ప్రకాశం జిల్లా నుండి తాజా వార్తలు మీకు అందిస్తుంది", sort_order: 1 },
  { text: "Stay tuned for live updates from Ongole and surrounding areas", text_te: "ఒంగోలు మరియు చుట్టుపక్కల ప్రాంతాల నుండి లైవ్ అప్‌డేట్‌ల కోసం చూస్తూ ఉండండి", sort_order: 2 },
  { text: "Subscribe to our YouTube channel for daily news coverage", text_te: "రోజువారీ వార్తల కవరేజ్ కోసం మా YouTube ఛానెల్‌ను సబ్‌స్క్రైబ్ చేయండి", sort_order: 3 },
];

// ── Settings ────────────────────────────────────────────────
const settingsData = [
  { key: "site_name", value: "CCTV AP Prakasam", description: "Website name" },
  { key: "site_description", value: "Prakasam District Digital News Channel", description: "Website meta description" },
  { key: "contact_email", value: "cctvprakasam@gmail.com", description: "Contact email address" },
  { key: "contact_phone", value: "+91 9032266619", description: "Contact phone number" },
  { key: "youtube_channel_url", value: "https://www.youtube.com/@CctvPrakasam", description: "YouTube channel URL" },
  { key: "office_address", value: "RTC Bus Stand Backside, Mulaguntapadu, Singarayakonda, Prakasam Dist, AP — 523101", description: "Office address" },
  { key: "ceo_name", value: "Khaja Hussain", description: "CEO / Founder name" },
];

async function seed() {
  console.log("🌱 Starting seed...\n");

  // ── 1. Seed Categories ──────────────────────────────────
  console.log("📂 Seeding categories...");
  for (const cat of categoryData) {
    const existing = await db.select().from(categories).where(eq(categories.slug, cat.slug)).limit(1);
    if (existing.length === 0) {
      await db.insert(categories).values(cat);
      console.log(`   ✓ ${cat.name}`);
    }
    else {
      console.log(`   ○ ${cat.name} (already exists)`);
    }
  }

  // ── 2. Seed Breaking News ───────────────────────────────
  console.log("\n📢 Seeding breaking news...");
  const existingBreaking = await db.select().from(breakingNews).limit(1);
  if (existingBreaking.length === 0) {
    await db.insert(breakingNews).values(breakingNewsData);
    console.log(`   ✓ Added ${breakingNewsData.length} breaking news items`);
  }
  else {
    console.log("   ○ Breaking news already exists");
  }

  // ── 3. Seed Settings ───────────────────────────────────
  console.log("\n⚙️  Seeding settings...");
  for (const setting of settingsData) {
    const existing = await db.select().from(settings).where(eq(settings.key, setting.key)).limit(1);
    if (existing.length === 0) {
      await db.insert(settings).values(setting);
      console.log(`   ✓ ${setting.key}`);
    }
    else {
      console.log(`   ○ ${setting.key} (already exists)`);
    }
  }

  // ── 4. Mark first 6 videos as featured, next 6 as trending ──
  console.log("\n🎬 Marking featured & trending videos...");
  const allVideos = await db.select({ id: videos.id }).from(videos).orderBy(videos.published_at).limit(15);

  if (allVideos.length > 0) {
    // Mark first 6 as featured
    const featuredIds = allVideos.slice(0, Math.min(6, allVideos.length)).map(v => v.id);
    await db.update(videos).set({ is_featured: true }).where(sql`${videos.id} IN (${sql.join(featuredIds.map(id => sql`${id}`), sql`, `)})`);
    console.log(`   ✓ Marked ${featuredIds.length} videos as featured`);

    // Mark next 6 as trending
    const trendingIds = allVideos.slice(6, Math.min(12, allVideos.length)).map(v => v.id);
    if (trendingIds.length > 0) {
      await db.update(videos).set({ is_trending: true }).where(sql`${videos.id} IN (${sql.join(trendingIds.map(id => sql`${id}`), sql`, `)})`);
      console.log(`   ✓ Marked ${trendingIds.length} videos as trending`);
    }

    // Assign first category to videos that have no category
    const cats = await db.select({ id: categories.id }).from(categories).limit(1);
    if (cats.length > 0) {
      const result = await db.update(videos).set({ category_id: cats[0].id }).where(sql`${videos.category_id} IS NULL`);
      console.log(`   ✓ Assigned default category to uncategorized videos`);
    }
  }
  else {
    console.log("   ○ No videos found — sync YouTube first, then re-run seed");
  }

  // ── 5. Seed Featured Content ────────────────────────────
  console.log("\n⭐ Seeding featured content...");
  const existingFeatured = await db.select().from(featuredContent).limit(1);
  if (existingFeatured.length === 0 && allVideos.length > 0) {
    await db.insert(featuredContent).values({
      type: "hero",
      video_id: allVideos[0].id,
      title: "Featured Story",
      is_active: true,
      sort_order: 1,
    });
    console.log("   ✓ Added hero featured content");
  }
  else {
    console.log("   ○ Featured content already exists or no videos available");
  }

  console.log("\n✅ Seed complete!\n");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
