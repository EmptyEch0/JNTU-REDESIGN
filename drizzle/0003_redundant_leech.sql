CREATE TYPE "public"."hostel_type" AS ENUM('office', 'girls', 'boys');--> statement-breakpoint
CREATE TABLE "hostel_about" (
	"id" serial PRIMARY KEY NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hostel_blocks" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" "hostel_type" NOT NULL,
	"title" text NOT NULL,
	"rooms" integer NOT NULL,
	"dining_hall" integer DEFAULT 1,
	"kitchen" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "hostel_facilities" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hostel_health" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"timing" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hostel_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" "hostel_type" NOT NULL,
	"url" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "hostel_officer" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"role" text NOT NULL,
	"image" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hostel_staff" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"role" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hostel_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" "hostel_type" NOT NULL,
	"label" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hostel_wardens" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" "hostel_type" NOT NULL,
	"name" text NOT NULL,
	"designation" text NOT NULL,
	"phone" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "placement_highlights" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "placement_years" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
CREATE INDEX "blocks_type_idx" ON "hostel_blocks" USING btree ("type");--> statement-breakpoint
CREATE INDEX "images_type_idx" ON "hostel_images" USING btree ("type");--> statement-breakpoint
CREATE INDEX "wardens_type_idx" ON "hostel_wardens" USING btree ("type");--> statement-breakpoint
CREATE INDEX "placement_year_idx" ON "placement_years" USING btree ("year");--> statement-breakpoint
CREATE INDEX "recruiter_name_idx" ON "recruiters" USING btree ("name");