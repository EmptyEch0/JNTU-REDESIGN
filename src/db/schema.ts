import { pgTable, serial, text, integer, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const placementYears = pgTable('placement_years', {
  id: serial('id').primaryKey(),
  year: text('year').notNull(),
  offers: integer('offers').notNull(),
  top: text('top').notNull(), // using text since user provided "42 LPA"
  recruiters: integer('recruiters').notNull(),
});

export const placementHighlights = pgTable('placement_highlights', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  branch: text('branch').notNull(),
  company: text('company').notNull(),
  package: text('package').notNull(),
});
export const tpo = pgTable('tpo', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  image: text('image').notNull(),
  email: text('email').notNull(),
  designation: text('designation').notNull(),
  message: text('message').notNull(),
});

export const placementGoals = pgTable('placement_goals', {
  id: serial('id').primaryKey(),
  text: text('text').notNull(),
});

export const majorRecruiters = pgTable('major_recruiters', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});

export const placementStaff = pgTable('placement_staff', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  role: text('role').notNull(),
});

export const recruiters = pgTable('recruiters', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  url: text('url').notNull(),
});

export const students = pgTable('students', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  rollNo: text('roll_no').notNull().unique(),
  branch: text('branch').notNull(),
  year: text('year').notNull(),
  campusType: text('campus_type').notNull(),
  company: text('company').notNull(),
});

export const rdDepartments = pgTable("rd_departments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const rdResearchAreas = pgTable("rd_research_areas", {
  id: serial("id").primaryKey(),
  deptId: integer("dept_id").references(() => rdDepartments.id, { onDelete: 'cascade' }),
  area: text("area").notNull(),
});

export const rdDepartmentsRelations = relations(rdDepartments, ({ many }) => ({
  researchAreas: many(rdResearchAreas),
  projects: many(rdProjects),
  scholars: many(rdScholars),
}));

export const rdResearchAreasRelations = relations(rdResearchAreas, ({ one }) => ({
  department: one(rdDepartments, {
    fields: [rdResearchAreas.deptId],
    references: [rdDepartments.id],
  }),
}));

export const rdFocusAreas = pgTable("rd_focus_areas", {
  id: serial("id").primaryKey(),
  title: text("title"),
  description: text("description"),
  icon: text("icon"), // lucide icon name
});

export const rdFunders = pgTable("rd_funders", {
  id: serial("id").primaryKey(),
  name: text("name"),
});

export const rdConsultancy = pgTable("rd_consultancy", {
  id: serial("id").primaryKey(),
  name: text("name"),
  description: text("description"),
});

export const rdCommittee = pgTable("rd_committee", {
  id: serial("id").primaryKey(),
  name: text("name"),
  role: text("role"),
  detail: text("detail"),
});

export const rdProjects = pgTable("rd_projects", {
  id: serial("id").primaryKey(),
  deptId: integer("dept_id").references(() => rdDepartments.id, { onDelete: 'cascade' }),
  title: text("title"),
  pi: text("pi"),
  agency: text("agency"),
  amount: text("amount"),
  period: text("period"),
  status: text("status"), // 'Completed' | 'On going'
});

export const rdProjectsRelations = relations(rdProjects, ({ one }) => ({
  department: one(rdDepartments, {
    fields: [rdProjects.deptId],
    references: [rdDepartments.id],
  }),
}));

export const rdScholars = pgTable("rd_scholars", {
  id: serial("id").primaryKey(),
  deptId: integer("dept_id").references(() => rdDepartments.id, { onDelete: 'cascade' }),
  scholarName: text("scholar_name"),
  rollNo: text("roll_no"),
  supervisor: text("supervisor"),
  researchTitle: text("research_title"),
  regYear: text("reg_year"),
  status: text("status"),
});

export const rdScholarsRelations = relations(rdScholars, ({ one }) => ({
  department: one(rdDepartments, {
    fields: [rdScholars.deptId],
    references: [rdDepartments.id],
  }),
}));

export const rdCoordinatorMessage = pgTable("rd_coordinator_message", {
  id: serial("id").primaryKey(),
  name: text("name"),
  role: text("role"),
  quote: text("quote"),
  message: text("message"),
  image: text("image"),
});

export const rdMotto = pgTable("rd_motto", {
  id: serial("id").primaryKey(),
  text: text("text"),
  order: integer("order"),
});

export const rdPublications = pgTable("rd_publications", {
  id: serial("id").primaryKey(),
  dept: text("dept"),
  title: text("title"),
  venue: text("venue"),
  authors: text("authors"),
});

export const rdPublicationStats = pgTable("rd_publication_stats", {
  id: serial("id").primaryKey(),
  label: text("label"),
  value: integer("value"),
  suffix: text("suffix"),
});

export const rdMous = pgTable("rd_mous", {
  id: serial("id").primaryKey(),
  title: text("title"),
  body: text("body"),
  img: text("img"),
  badge: text("badge"),
  type: text("type"), // 'department' or 'certificate'
});

export const placementGallery = pgTable("placement_gallery", {
  id: serial("id").primaryKey(),
  src: text("src"),
  caption: text("caption"),
});

export const leadership = pgTable("leadership", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  image: text("image").notNull(),
  email: text("email").notNull(),
  designation: text("designation").notNull(),
  quote: text("quote").notNull(),
  message: text("message").notNull(),
  profile: text("profile").notNull(),
  extras: jsonb("extras"),
});

export const leadershipStaff = pgTable("leadership_staff", {
  id: serial("id").primaryKey(),
  leadershipSlug: text("leadership_slug").notNull().references(() => leadership.slug),
  name: text("name").notNull(),
  role: text("role").notNull(),
  section: text("section").notNull(),
});

export const iqacComposition = pgTable("iqac_composition", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  designation: text("designation").notNull(),
  role: text("role").notNull(),
});

export const iqacReports = pgTable("iqac_reports", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  year: text("year").notNull(),
  type: text("type").notNull(), // 'AQAR' or 'Academic Audit'
  link: text("link").notNull(),
});

export const iqacEvents = pgTable("iqac_events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  date: text("date").notNull(),
});

export const iqacOutcomes = pgTable("iqac_outcomes", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
});

export const iqacMous = pgTable("iqac_mous", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
});

export const nssProfile = pgTable("nss_profile", {
  id: serial("id").primaryKey(),
  aboutText: text("about_text").notNull(),
  officerName: text("officer_name").notNull(),
  officerImage: text("officer_image").notNull(),
  officerMessage: text("officer_message").notNull(),
  officerQuote: text("officer_quote").notNull(),
});

export const nssActivities = pgTable("nss_activities", {
  id: serial("id").primaryKey(),
  sNo: integer("s_no").notNull(),
  activity: text("activity").notNull(),
  dateConducted: text("date_conducted").notNull(),
  venue: text("venue").notNull(),
  description: text("description").notNull(),
});

export const nssSpecialCamp = pgTable("nss_special_camp", {
  id: serial("id").primaryKey(),
  day: text("day").notNull(),
  description: text("description").notNull(),
});

export const nssGallery = pgTable("nss_gallery", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  imageUrl: text("image_url").notNull(),
});

export const weProfile = pgTable("we_profile", {
  id: serial("id").primaryKey(),
  aboutText: text("about_text").notNull(),
  quote: text("quote").notNull(),
  convenerName: text("convener_name").notNull(),
  convenerImage: text("convener_image").notNull(),
  convenerMessage: text("convener_message").notNull(),
  vision: text("vision").notNull(),
  mission: text("mission").notNull(),
  objectives: jsonb("objectives").notNull(), // stored as string[]
});

export const weCommittee = pgTable("we_committee", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  email: text("email").notNull(),
  subRole: text("sub_role"),
});

export const weActivities = pgTable("we_activities", {
  id: serial("id").primaryKey(),
  sNo: integer("s_no").notNull(),
  title: text("title").notNull(),
  date: text("date").notNull(),
});

export const weRecreation = pgTable("we_recreation", {
  id: serial("id").primaryKey(),
  description: text("description").notNull(),
  images: jsonb("images").notNull(), // stored as string[]
});

export const weMagazine = pgTable("we_magazine", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
});

export const weGallery = pgTable("we_gallery", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  imageUrl: text("image_url").notNull(),
});

export const edcProfile = pgTable("edc_profile", {
  id: serial("id").primaryKey(),
  about: text("about").notNull(),
  vision: jsonb("vision").notNull(), // string[]
  mission: jsonb("mission").notNull(), // string[]
  coordinatorName: text("coordinator_name").notNull(),
  coordinatorRole: text("coordinator_role").notNull(),
  coordinatorQuote: text("coordinator_quote").notNull(),
  coordinatorImage: text("coordinator_image").notNull(),
});

export const edcCommittee = pgTable("edc_committee", {
  id: serial("id").primaryKey(),
  sNo: integer("s_no").notNull(),
  name: text("name").notNull(),
  designation: text("designation").notNull(),
  role: text("role").notNull(),
});

export const edcActivities = pgTable("edc_activities", {
  id: serial("id").primaryKey(),
  sNo: integer("s_no").notNull(),
  activityEvent: text("activity_event").notNull(),
  academicYear: text("academic_year").notNull(),
  date: text("date").notNull(),
  theme: text("theme").notNull(),
  studentParticipant: text("student_participant").notNull(),
});


export const profChapters = pgTable("prof_chapters", {
  id: serial("id").primaryKey(),
  code: text("code").notNull(), // "CSI", "IEEE", "IE", "IETE", "IIM"
  name: text("name").notNull(),
  about: text("about").notNull(),
  coordinator: text("coordinator"),
  facultyMembers: jsonb("faculty_members"), // { name: string, membershipNo: string }[] or null
  events: jsonb("events").notNull(), // { sNo: number, title: string, date: string, details: string }[]
});

export const iipcCell = pgTable("iipc_cell", {
  id: serial("id").primaryKey(),
  about: text("about").notNull(),
  objectives: jsonb("objectives").notNull(), // string[]
  activities: jsonb("activities").notNull(), // { title: string, details: string }[]
});



