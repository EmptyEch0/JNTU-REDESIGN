CREATE TABLE "academic_calendars" (
	"id" serial PRIMARY KEY NOT NULL,
	"level" text NOT NULL,
	"program_name" text NOT NULL,
	"regulation" text NOT NULL,
	"academic_year" text NOT NULL,
	"calendar_type" text NOT NULL,
	"pdf_url" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "academic_courses_offered" (
	"id" serial PRIMARY KEY NOT NULL,
	"program_name" text NOT NULL,
	"duration" text NOT NULL,
	"year_started" integer NOT NULL,
	"intake" integer NOT NULL,
	"program_type" text NOT NULL,
	"program_subtype" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "academic_downloads" (
	"id" serial PRIMARY KEY NOT NULL,
	"document_name" text NOT NULL,
	"category" text NOT NULL,
	"pdf_url" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "academic_faculty" (
	"id" serial PRIMARY KEY NOT NULL,
	"faculty_name" text NOT NULL,
	"designation" text NOT NULL,
	"department" text NOT NULL,
	"qualification" text NOT NULL,
	"experience" text NOT NULL,
	"email" text NOT NULL,
	"photo_url" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "academic_fee_structure" (
	"id" serial PRIMARY KEY NOT NULL,
	"level" text NOT NULL,
	"program_name" text NOT NULL,
	"title" text NOT NULL,
	"pdf_url" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "academic_regulations" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"size" text NOT NULL,
	"date" text NOT NULL,
	"link" text DEFAULT '#'
);
--> statement-breakpoint
CREATE TABLE "academic_syllabus" (
	"id" serial PRIMARY KEY NOT NULL,
	"level" text NOT NULL,
	"program_name" text NOT NULL,
	"regulation" text NOT NULL,
	"branch" text NOT NULL,
	"academic_year" text NOT NULL,
	"semester" text NOT NULL,
	"subject_name" text NOT NULL,
	"pdf_url" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "academic_timetables" (
	"id" serial PRIMARY KEY NOT NULL,
	"level" text NOT NULL,
	"program_name" text NOT NULL,
	"regulation" text NOT NULL,
	"branch" text NOT NULL,
	"academic_year" text NOT NULL,
	"semester" text NOT NULL,
	"subject_name" text NOT NULL,
	"pdf_url" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "academics_admissions_new" (
	"id" serial PRIMARY KEY NOT NULL,
	"program" text NOT NULL,
	"procedure" text NOT NULL,
	"tuition_fee" text NOT NULL,
	"hostel_fee" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "academics_announcements" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"file_url" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "academics_brochures" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"file_url" text NOT NULL,
	"type" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "academics_cac" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"role" text NOT NULL,
	"designation" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "academics_calendar_new" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" text NOT NULL,
	"section" text NOT NULL,
	"title" text NOT NULL,
	"date" text NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "academics_dashboard_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"value" text NOT NULL,
	"icon" text NOT NULL,
	"color" text NOT NULL,
	"trend" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "academics_downloads" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"file_url" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "academics_downloads_new" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" text NOT NULL,
	"program" text NOT NULL,
	"title" text NOT NULL,
	"file_url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "academics_exam_cell" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"date" text NOT NULL,
	"file_url" text
);
--> statement-breakpoint
CREATE TABLE "academics_examinations" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"file_url" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "academics_faculty_new" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"role" text NOT NULL,
	"department" text NOT NULL,
	"specialization" text,
	"email" text NOT NULL,
	"phone" text,
	"status" text NOT NULL,
	"avatar" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "academics_hod_desk" (
	"id" serial PRIMARY KEY NOT NULL,
	"department" text NOT NULL,
	"name" text NOT NULL,
	"designation" text,
	"message" text,
	"achievements" text,
	"image_url" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "academics_mission_vision" (
	"id" serial PRIMARY KEY NOT NULL,
	"mission" text,
	"vision" text,
	"core_values" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "academics_principals" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"designation" text,
	"message" text,
	"image_url" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "academics_programs" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"image_url" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "academics_regulations_new" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" text NOT NULL,
	"branch" text NOT NULL,
	"code" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"file_url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "academics_scholarships_new" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"amount" text NOT NULL,
	"description" text,
	"eligibility" text NOT NULL,
	"last_date" text NOT NULL,
	"status" text NOT NULL,
	"apply_url" text
);
--> statement-breakpoint
CREATE TABLE "academics_syllabus" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"file_url" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "academics_syllabus_new" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" text NOT NULL,
	"program" text NOT NULL,
	"branch" text NOT NULL,
	"regulation" text NOT NULL,
	"semester" text NOT NULL,
	"subject_code" text NOT NULL,
	"subject_name" text NOT NULL,
	"department" text NOT NULL,
	"file_url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "academics_timetables" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"file_url" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "academics_timetables_new" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" text NOT NULL,
	"program" text NOT NULL,
	"branch" text NOT NULL,
	"semester" text NOT NULL,
	"title" text NOT NULL,
	"file_url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "academics_vc_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"designation" text,
	"message" text,
	"image_url" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "admin_audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"admin_id" uuid,
	"action" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"details" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"admin_id" uuid NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text
);
--> statement-breakpoint
CREATE TABLE "admins" (
	"admin_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text,
	"role" text DEFAULT 'department_admin' NOT NULL,
	"auth_provider" text DEFAULT 'email' NOT NULL,
	"authorized_depts" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admins_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "campus_gallery" (
	"id" serial PRIMARY KEY NOT NULL,
	"src" text NOT NULL,
	"caption" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notices" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" text NOT NULL,
	"tag" text NOT NULL,
	"title" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ticker_notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"source" text NOT NULL,
	"label" text NOT NULL,
	"text" text NOT NULL,
	"date" text NOT NULL,
	"to" text NOT NULL,
	"urgent" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "faculty" ALTER COLUMN "specialization" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "departments" ADD COLUMN "hod_password" text DEFAULT 'hod@jntu';--> statement-breakpoint
ALTER TABLE "faculty" ADD COLUMN "biography" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "faculty" ADD COLUMN "qualifications" text[] DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "faculty" ADD COLUMN "experience_years" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "faculty" ADD COLUMN "awards" text[] DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "faculty" ADD COLUMN "fellowships" text[] DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "faculty" ADD COLUMN "professional_memberships" text[] DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "faculty" ADD COLUMN "international_exchanges" text[] DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "faculty" ADD COLUMN "sabbaticals" text[] DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "faculty" ADD COLUMN "consultancy_projects" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "faculty" ADD COLUMN "fdps_attended" text[] DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "faculty" ADD COLUMN "conferences_attended" text[] DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "faculty" ADD COLUMN "workshops_completed" text[] DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "admin_audit_logs" ADD CONSTRAINT "admin_audit_logs_admin_id_admins_admin_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."admins"("admin_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_sessions" ADD CONSTRAINT "admin_sessions_admin_id_admins_admin_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."admins"("admin_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "admin_audit_logs_admin_id_idx" ON "admin_audit_logs" USING btree ("admin_id");--> statement-breakpoint
CREATE INDEX "admin_sessions_admin_id_idx" ON "admin_sessions" USING btree ("admin_id");--> statement-breakpoint
CREATE INDEX "achievements_dept_id_idx" ON "achievements" USING btree ("dept_id");--> statement-breakpoint
CREATE INDEX "courses_dept_id_idx" ON "courses" USING btree ("dept_id");--> statement-breakpoint
CREATE INDEX "department_gallery_dept_id_idx" ON "department_gallery" USING btree ("dept_id");--> statement-breakpoint
CREATE INDEX "departments_slug_idx" ON "departments" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "faculty_dept_id_idx" ON "faculty" USING btree ("dept_id");--> statement-breakpoint
CREATE INDEX "laboratories_dept_id_idx" ON "laboratories" USING btree ("dept_id");--> statement-breakpoint
CREATE INDEX "leadership_staff_slug_idx" ON "leadership_staff" USING btree ("leadership_slug");--> statement-breakpoint
CREATE INDEX "rd_projects_dept_id_idx" ON "rd_projects" USING btree ("dept_id");--> statement-breakpoint
CREATE INDEX "rd_research_areas_dept_id_idx" ON "rd_research_areas" USING btree ("dept_id");--> statement-breakpoint
CREATE INDEX "rd_scholars_dept_id_idx" ON "rd_scholars" USING btree ("dept_id");--> statement-breakpoint
CREATE INDEX "site_content_page_idx" ON "site_content" USING btree ("page");--> statement-breakpoint
CREATE INDEX "site_content_page_section_idx" ON "site_content" USING btree ("page","section_key");