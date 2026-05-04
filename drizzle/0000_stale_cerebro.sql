CREATE TABLE "placement_highlights" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"branch" text NOT NULL,
	"company" text NOT NULL,
	"package" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "placement_years" (
	"id" serial PRIMARY KEY NOT NULL,
	"year" text NOT NULL,
	"offers" integer NOT NULL,
	"top" text NOT NULL,
	"recruiters" integer NOT NULL
);
