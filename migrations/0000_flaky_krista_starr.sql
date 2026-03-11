CREATE TABLE "breaking_news" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" varchar(500) NOT NULL,
	"text_te" varchar(500),
	"is_active" boolean DEFAULT true,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"name_te" varchar(200),
	"slug" varchar(100) NOT NULL,
	"icon" varchar(10),
	"color" varchar(7),
	"video_count" integer DEFAULT 0,
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "featured_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" varchar(50) NOT NULL,
	"video_id" integer,
	"title" varchar(200),
	"is_active" boolean DEFAULT true,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "newsletter_subscribers" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"status" varchar(20) DEFAULT 'active',
	"subscribed_at" timestamp DEFAULT now(),
	"unsubscribed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(100) NOT NULL,
	"value" text NOT NULL,
	"description" varchar(500),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_id" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"email" varchar,
	"phone" varchar,
	"password_hash" varchar,
	"user_type" varchar DEFAULT 'CUSTOMER' NOT NULL,
	"active" boolean DEFAULT true,
	"is_verified" boolean DEFAULT false,
	"verification_token" varchar,
	"reset_token" varchar,
	"reset_token_expires_at" timestamp,
	"profile_pic" text,
	"date_of_birth" date,
	"gender" varchar,
	"aadhaar" varchar,
	"address" text,
	"state" varchar,
	"occupation" varchar,
	"bio" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "videos" (
	"id" serial PRIMARY KEY NOT NULL,
	"youtube_id" varchar(20) NOT NULL,
	"title" varchar(500) NOT NULL,
	"title_te" varchar(500),
	"description" text,
	"category_id" integer,
	"thumbnail_url" varchar(500),
	"duration" varchar(10),
	"view_count" varchar(20),
	"published_at" timestamp,
	"is_featured" boolean DEFAULT false,
	"is_trending" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "featured_content" ADD CONSTRAINT "featured_content_video_id_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."videos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "videos" ADD CONSTRAINT "videos_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "breaking_news_is_active_idx" ON "breaking_news" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "breaking_news_sort_order_idx" ON "breaking_news" USING btree ("sort_order");--> statement-breakpoint
CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "categories_sort_order_idx" ON "categories" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "categories_is_active_idx" ON "categories" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "featured_content_type_idx" ON "featured_content" USING btree ("type");--> statement-breakpoint
CREATE INDEX "featured_content_is_active_idx" ON "featured_content" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "featured_content_sort_order_idx" ON "featured_content" USING btree ("sort_order");--> statement-breakpoint
CREATE UNIQUE INDEX "newsletter_subscribers_email_idx" ON "newsletter_subscribers" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "settings_key_idx" ON "settings" USING btree ("key");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "users_phone_idx" ON "users" USING btree ("phone");--> statement-breakpoint
CREATE UNIQUE INDEX "users_aadhaar_idx" ON "users" USING btree ("aadhaar");--> statement-breakpoint
CREATE UNIQUE INDEX "users_customer_id_idx" ON "users" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "users_user_type_idx" ON "users" USING btree ("user_type");--> statement-breakpoint
CREATE INDEX "users_deleted_at_idx" ON "users" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "users_first_name_idx" ON "users" USING btree ("first_name");--> statement-breakpoint
CREATE INDEX "users_last_name_idx" ON "users" USING btree ("last_name");--> statement-breakpoint
CREATE UNIQUE INDEX "videos_youtube_id_idx" ON "videos" USING btree ("youtube_id");--> statement-breakpoint
CREATE INDEX "videos_category_id_idx" ON "videos" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "videos_is_featured_idx" ON "videos" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "videos_is_trending_idx" ON "videos" USING btree ("is_trending");--> statement-breakpoint
CREATE INDEX "videos_is_active_idx" ON "videos" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "videos_published_at_idx" ON "videos" USING btree ("published_at");