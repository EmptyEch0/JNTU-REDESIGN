CREATE TYPE "public"."dispensary_meta" AS ENUM('facility', 'medicine');--> statement-breakpoint
CREATE TYPE "public"."dispensary_role" AS ENUM('doctor', 'staff', 'driver');--> statement-breakpoint
CREATE TYPE "public"."eng_meta_type" AS ENUM('construction', 'electrical');--> statement-breakpoint
CREATE TYPE "public"."hostel_category" AS ENUM('block', 'facility');--> statement-breakpoint
CREATE TYPE "public"."hostel_role_type" AS ENUM('warden', 'staff');--> statement-breakpoint
CREATE TYPE "public"."hostel_type" AS ENUM('office', 'girls', 'boys');--> statement-breakpoint
CREATE TYPE "public"."library_meta_type" AS ENUM('digital', 'magazine', 'newspaper');--> statement-breakpoint
CREATE TYPE "public"."library_stats_type" AS ENUM('titles', 'periodicals');--> statement-breakpoint
CREATE TYPE "public"."sports_infra" AS ENUM('field', 'gym');--> statement-breakpoint
CREATE TYPE "public"."sports_role" AS ENUM('faculty', 'non_teaching');--> statement-breakpoint
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
CREATE TABLE "achievements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dept_id" uuid,
	"category" varchar(50),
	"subcategory" varchar(100),
	"title" varchar(255) NOT NULL,
	"description" text,
	"year" varchar(20),
	"course" varchar(50),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "campus_gallery" (
	"id" serial PRIMARY KEY NOT NULL,
	"src" text NOT NULL,
	"caption" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"dept_id" uuid,
	"level" text,
	"name" text NOT NULL,
	"syllabus_url" text,
	"regulation" text
);
--> statement-breakpoint
CREATE TABLE "department_gallery" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dept_id" uuid,
	"title" varchar(255),
	"image_url" text NOT NULL,
	"category" varchar(100),
	"description" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "departments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"hod_password" text DEFAULT 'hod@jntu',
	"hod" text,
	"description" text,
	"image" text,
	"vision" text,
	"mission" text,
	"hod_photo" text,
	"hod_message" text,
	"hod_contact" text,
	"about_details" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "dispensary_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"hod_name" text NOT NULL,
	"message" text NOT NULL,
	"img" text
);
--> statement-breakpoint
CREATE TABLE "dispensary_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dispensary_meta" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" "dispensary_meta" NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dispensary_people" (
	"id" serial PRIMARY KEY NOT NULL,
	"role_type" "dispensary_role" NOT NULL,
	"name" text NOT NULL,
	"qualification" text,
	"working_hours" text,
	"img" text,
	"contact" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "edc_activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"s_no" integer NOT NULL,
	"activity_event" text NOT NULL,
	"academic_year" text NOT NULL,
	"date" text NOT NULL,
	"theme" text NOT NULL,
	"student_participant" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "edc_committee" (
	"id" serial PRIMARY KEY NOT NULL,
	"s_no" integer NOT NULL,
	"name" text NOT NULL,
	"designation" text NOT NULL,
	"role" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "edc_profile" (
	"id" serial PRIMARY KEY NOT NULL,
	"about" text NOT NULL,
	"vision" jsonb NOT NULL,
	"mission" jsonb NOT NULL,
	"coordinator_name" text NOT NULL,
	"coordinator_role" text NOT NULL,
	"coordinator_quote" text NOT NULL,
	"coordinator_image" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "eng_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"description" text,
	"vision" text,
	"mission" text
);
--> statement-breakpoint
CREATE TABLE "eng_meta" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" "eng_meta_type" NOT NULL,
	"title" text,
	"content" text,
	"name" text,
	"description" text,
	"engineer" text,
	"img" text
);
--> statement-breakpoint
CREATE TABLE "eng_staff" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"designation" text NOT NULL,
	"type" text NOT NULL,
	"img" text
);
--> statement-breakpoint
CREATE TABLE "faculty" (
	"id" serial PRIMARY KEY NOT NULL,
	"dept_id" uuid,
	"name" text NOT NULL,
	"designation" text,
	"photo_url" text,
	"profile_link" text,
	"biography" text DEFAULT '',
	"qualifications" text[] DEFAULT '{}',
	"specialization" text DEFAULT '',
	"experience_years" integer DEFAULT 0,
	"awards" text[] DEFAULT '{}',
	"fellowships" text[] DEFAULT '{}',
	"professional_memberships" text[] DEFAULT '{}',
	"international_exchanges" text[] DEFAULT '{}',
	"sabbaticals" text[] DEFAULT '{}',
	"consultancy_projects" jsonb DEFAULT '[]'::jsonb,
	"fdps_attended" text[] DEFAULT '{}',
	"conferences_attended" text[] DEFAULT '{}',
	"workshops_completed" text[] DEFAULT '{}'
);
--> statement-breakpoint
CREATE TABLE "hostel_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"description" text,
	"officer_name" text,
	"officer_role" text,
	"officer_image" text,
	"health_name" text,
	"health_timing" text
);
--> statement-breakpoint
CREATE TABLE "hostel_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" "hostel_type" NOT NULL,
	"url" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "hostel_people" (
	"id" serial PRIMARY KEY NOT NULL,
	"role_type" "hostel_role_type" NOT NULL,
	"hostel_type" "hostel_type",
	"name" text NOT NULL,
	"designation" text,
	"role" text,
	"phone" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "hostel_structure" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" "hostel_type" NOT NULL,
	"category" "hostel_category" NOT NULL,
	"title" text,
	"rooms" integer,
	"dining_hall" integer DEFAULT 1,
	"kitchen" integer DEFAULT 1,
	"name" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "iipc_cell" (
	"id" serial PRIMARY KEY NOT NULL,
	"about" text NOT NULL,
	"objectives" jsonb NOT NULL,
	"activities" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "iqac_composition" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"designation" text NOT NULL,
	"role" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "iqac_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"date" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "iqac_mous" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"image" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "iqac_outcomes" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "iqac_reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"year" text NOT NULL,
	"type" text NOT NULL,
	"link" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "laboratories" (
	"id" serial PRIMARY KEY NOT NULL,
	"dept_id" uuid,
	"name" text NOT NULL,
	"description" text,
	"location" text,
	"photo_url" text,
	"specs" jsonb
);
--> statement-breakpoint
CREATE TABLE "leadership" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"image" text NOT NULL,
	"email" text NOT NULL,
	"designation" text NOT NULL,
	"quote" text NOT NULL,
	"message" text NOT NULL,
	"profile" text NOT NULL,
	"extras" jsonb,
	CONSTRAINT "leadership_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "leadership_staff" (
	"id" serial PRIMARY KEY NOT NULL,
	"leadership_slug" text NOT NULL,
	"name" text NOT NULL,
	"role" text NOT NULL,
	"section" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "library_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"officer_name" text,
	"designation" text,
	"message" text,
	"img" text,
	"about" text,
	"digital_description" text,
	"working_days" text,
	"working_time" text,
	"transaction_time" text
);
--> statement-breakpoint
CREATE TABLE "library_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "library_meta" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" "library_meta_type" NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "library_sections" (
	"id" serial PRIMARY KEY NOT NULL,
	"section" text NOT NULL,
	"area" text NOT NULL,
	"location" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "library_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" "library_stats_type" NOT NULL,
	"name" text NOT NULL,
	"value1" integer,
	"value2" integer
);
--> statement-breakpoint
CREATE TABLE "library_team" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"qualification" text NOT NULL,
	"designation" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "major_recruiters" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "music_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"subtitle" text,
	"message" text,
	"vision" text,
	"mission" text,
	"objectives" text,
	"process" text
);
--> statement-breakpoint
CREATE TABLE "music_equipment" (
	"id" serial PRIMARY KEY NOT NULL,
	"item" text NOT NULL,
	"cost" text
);
--> statement-breakpoint
CREATE TABLE "music_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "music_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"instrument" text,
	"name" text NOT NULL,
	"branch" text,
	"year" text
);
--> statement-breakpoint
CREATE TABLE "music_people" (
	"id" serial PRIMARY KEY NOT NULL,
	"role_type" text NOT NULL,
	"gender" text,
	"name" text NOT NULL,
	"designation" text,
	"branch" text,
	"year" text,
	"img" text
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
CREATE TABLE "nss_activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"s_no" integer NOT NULL,
	"activity" text NOT NULL,
	"date_conducted" text NOT NULL,
	"venue" text NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nss_gallery" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"image_url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nss_profile" (
	"id" serial PRIMARY KEY NOT NULL,
	"about_text" text NOT NULL,
	"officer_name" text NOT NULL,
	"officer_image" text NOT NULL,
	"officer_message" text NOT NULL,
	"officer_quote" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nss_special_camp" (
	"id" serial PRIMARY KEY NOT NULL,
	"day" text NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "placement_gallery" (
	"id" serial PRIMARY KEY NOT NULL,
	"src" text,
	"caption" text
);
--> statement-breakpoint
CREATE TABLE "placement_goals" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "placement_highlights" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"branch" text NOT NULL,
	"company" text NOT NULL,
	"package" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "placement_staff" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"role" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "placement_years" (
	"id" serial PRIMARY KEY NOT NULL,
	"year" text NOT NULL,
	"offers" integer NOT NULL,
	"top" text NOT NULL,
	"recruiters" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prof_chapters" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"about" text NOT NULL,
	"coordinator" text,
	"faculty_members" jsonb,
	"events" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rd_committee" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"role" text,
	"detail" text
);
--> statement-breakpoint
CREATE TABLE "rd_consultancy" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "rd_coordinator_message" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"role" text,
	"quote" text,
	"message" text,
	"image" text
);
--> statement-breakpoint
CREATE TABLE "rd_departments" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rd_focus_areas" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"description" text,
	"icon" text
);
--> statement-breakpoint
CREATE TABLE "rd_funders" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text
);
--> statement-breakpoint
CREATE TABLE "rd_motto" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text,
	"order" integer
);
--> statement-breakpoint
CREATE TABLE "rd_mous" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"body" text,
	"img" text,
	"badge" text,
	"type" text
);
--> statement-breakpoint
CREATE TABLE "rd_projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"dept_id" integer,
	"title" text,
	"pi" text,
	"agency" text,
	"amount" text,
	"period" text,
	"status" text
);
--> statement-breakpoint
CREATE TABLE "rd_publication_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"label" text,
	"value" integer,
	"suffix" text
);
--> statement-breakpoint
CREATE TABLE "rd_publications" (
	"id" serial PRIMARY KEY NOT NULL,
	"dept" text,
	"title" text,
	"venue" text,
	"authors" text
);
--> statement-breakpoint
CREATE TABLE "rd_research_areas" (
	"id" serial PRIMARY KEY NOT NULL,
	"dept_id" integer,
	"area" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rd_scholars" (
	"id" serial PRIMARY KEY NOT NULL,
	"dept_id" integer,
	"scholar_name" text,
	"roll_no" text,
	"supervisor" text,
	"research_title" text,
	"reg_year" text,
	"status" text
);
--> statement-breakpoint
CREATE TABLE "recruiters" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"page" text NOT NULL,
	"section_key" text NOT NULL,
	"title" text,
	"content" text,
	"image_url" text
);
--> statement-breakpoint
CREATE TABLE "sports_achievements" (
	"id" serial PRIMARY KEY NOT NULL,
	"year_label" text,
	"category" text,
	"sno" integer,
	"student" text NOT NULL,
	"branch" text,
	"medal" text,
	"game" text,
	"tournament" text,
	"venue" text,
	"tournament_date" text,
	"remarks" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sports_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"designation" text NOT NULL,
	"message" text NOT NULL,
	"img" text NOT NULL,
	"qualification" text,
	"address" text,
	"phone" text,
	"email" text
);
--> statement-breakpoint
CREATE TABLE "sports_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sports_infra" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" "sports_infra" NOT NULL,
	"name" text NOT NULL,
	"qty" integer,
	"cost" text
);
--> statement-breakpoint
CREATE TABLE "sports_people" (
	"id" serial PRIMARY KEY NOT NULL,
	"role_type" "sports_role" NOT NULL,
	"name" text NOT NULL,
	"designation" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "student_club_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"club_id" integer NOT NULL,
	"section_type" text NOT NULL,
	"heading" text,
	"content" text,
	"image" text
);
--> statement-breakpoint
CREATE TABLE "student_club_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"club_id" integer NOT NULL,
	"url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "student_clubs" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"category" text,
	"title" text,
	"description" text,
	"badge" text,
	"hero_image" text
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"roll_no" text NOT NULL,
	"branch" text NOT NULL,
	"year" text NOT NULL,
	"campus_type" text NOT NULL,
	"company" text NOT NULL,
	CONSTRAINT "students_roll_no_unique" UNIQUE("roll_no")
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
CREATE TABLE "tpo" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"image" text NOT NULL,
	"email" text NOT NULL,
	"designation" text NOT NULL,
	"message" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "we_activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"s_no" integer NOT NULL,
	"title" text NOT NULL,
	"date" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "we_committee" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"role" text NOT NULL,
	"email" text NOT NULL,
	"sub_role" text
);
--> statement-breakpoint
CREATE TABLE "we_gallery" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"image_url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "we_magazine" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "we_profile" (
	"id" serial PRIMARY KEY NOT NULL,
	"about_text" text NOT NULL,
	"quote" text NOT NULL,
	"convener_name" text NOT NULL,
	"convener_image" text NOT NULL,
	"convener_message" text NOT NULL,
	"vision" text NOT NULL,
	"mission" text NOT NULL,
	"objectives" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "we_recreation" (
	"id" serial PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"images" jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_dept_id_departments_id_fk" FOREIGN KEY ("dept_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_dept_id_departments_id_fk" FOREIGN KEY ("dept_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "department_gallery" ADD CONSTRAINT "department_gallery_dept_id_departments_id_fk" FOREIGN KEY ("dept_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faculty" ADD CONSTRAINT "faculty_dept_id_departments_id_fk" FOREIGN KEY ("dept_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "laboratories" ADD CONSTRAINT "laboratories_dept_id_departments_id_fk" FOREIGN KEY ("dept_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leadership_staff" ADD CONSTRAINT "leadership_staff_leadership_slug_leadership_slug_fk" FOREIGN KEY ("leadership_slug") REFERENCES "public"."leadership"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rd_projects" ADD CONSTRAINT "rd_projects_dept_id_rd_departments_id_fk" FOREIGN KEY ("dept_id") REFERENCES "public"."rd_departments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rd_research_areas" ADD CONSTRAINT "rd_research_areas_dept_id_rd_departments_id_fk" FOREIGN KEY ("dept_id") REFERENCES "public"."rd_departments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rd_scholars" ADD CONSTRAINT "rd_scholars_dept_id_rd_departments_id_fk" FOREIGN KEY ("dept_id") REFERENCES "public"."rd_departments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "disp_meta_cat_idx" ON "dispensary_meta" USING btree ("category");--> statement-breakpoint
CREATE INDEX "disp_people_role_idx" ON "dispensary_people" USING btree ("role_type");--> statement-breakpoint
CREATE INDEX "eng_meta_cat_idx" ON "eng_meta" USING btree ("category");--> statement-breakpoint
CREATE INDEX "eng_staff_type_idx" ON "eng_staff" USING btree ("type");--> statement-breakpoint
CREATE INDEX "images_type_idx" ON "hostel_images" USING btree ("type");--> statement-breakpoint
CREATE INDEX "people_type_idx" ON "hostel_people" USING btree ("hostel_type");--> statement-breakpoint
CREATE INDEX "structure_type_idx" ON "hostel_structure" USING btree ("type");--> statement-breakpoint
CREATE INDEX "structure_category_idx" ON "hostel_structure" USING btree ("category");--> statement-breakpoint
CREATE INDEX "library_meta_cat_idx" ON "library_meta" USING btree ("category");--> statement-breakpoint
CREATE INDEX "library_stats_cat_idx" ON "library_stats" USING btree ("category");--> statement-breakpoint
CREATE INDEX "music_people_role_idx" ON "music_people" USING btree ("role_type");--> statement-breakpoint
CREATE INDEX "sports_achievements_year_idx" ON "sports_achievements" USING btree ("year_label");--> statement-breakpoint
CREATE INDEX "sports_achievements_category_idx" ON "sports_achievements" USING btree ("category");--> statement-breakpoint
CREATE INDEX "sports_infra_cat_idx" ON "sports_infra" USING btree ("category");--> statement-breakpoint
CREATE INDEX "sports_people_role_idx" ON "sports_people" USING btree ("role_type");