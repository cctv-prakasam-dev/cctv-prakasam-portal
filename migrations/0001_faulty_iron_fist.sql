ALTER TABLE "newsletter_subscribers" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "created_at" timestamp DEFAULT now();