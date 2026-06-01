CREATE TABLE "academic_regulations" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"size" text NOT NULL,
	"date" text NOT NULL,
	"link" text DEFAULT '#'
);
--> statement-breakpoint
CREATE TABLE "notices" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" text NOT NULL,
	"tag" text NOT NULL,
	"title" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);