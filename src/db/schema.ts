import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  index,
  pgEnum,
  jsonb
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
export const placementYears = pgTable("placement_years", {
  id: serial("id").primaryKey(),
  year: text("year").notNull(),
  offers: integer("offers").notNull(),
  top: text("top").notNull(), // using text since user provided "42 LPA"
  recruiters: integer("recruiters").notNull(),
});
import {  uuid, varchar } from "drizzle-orm/pg-core";
export const placementHighlights = pgTable("placement_highlights", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  branch: text("branch").notNull(),
  company: text("company").notNull(),
  package: text("package").notNull(),
});
export const tpo = pgTable("tpo", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  image: text("image").notNull(),
  email: text("email").notNull(),
  designation: text("designation").notNull(),
  message: text("message").notNull(),
});

export const placementGoals = pgTable("placement_goals", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
});

export const majorRecruiters = pgTable("major_recruiters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const placementStaff = pgTable("placement_staff", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
});

export const recruiters = pgTable("recruiters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
});

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  rollNo: text("roll_no").notNull().unique(),
  branch: text("branch").notNull(),
  year: text("year").notNull(),
  campusType: text("campus_type").notNull(),
  company: text("company").notNull(),
});

export const rdDepartments = pgTable("rd_departments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const rdResearchAreas = pgTable("rd_research_areas", {
  id: serial("id").primaryKey(),
  deptId: integer("dept_id").references(() => rdDepartments.id, { onDelete: "cascade" }),
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
  deptId: integer("dept_id").references(() => rdDepartments.id, { onDelete: "cascade" }),
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
  deptId: integer("dept_id").references(() => rdDepartments.id, { onDelete: "cascade" }),
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
  leadershipSlug: text("leadership_slug")
    .notNull()
    .references(() => leadership.slug),
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



/* ===========================
   🔹 ENUM (recommended)
=========================== */
export const hostelTypeEnum = pgEnum("hostel_type", [
  "office",
  "girls",
  "boys",
]);

export const hostelCategoryEnum = pgEnum("hostel_category", [
  "block",
  "facility",
]);

export const hostelRoleEnum = pgEnum("hostel_role_type", [
  "warden",
  "staff",
]);

/* ===========================
   🔹 HOSTEL CONTENT (same as before)
=========================== */
export const hostelContent = pgTable("hostel_content", {
  id: serial("id").primaryKey(),

  description: text("description"),

  officerName: text("officer_name"),
  officerRole: text("officer_role"),
  officerImage: text("officer_image"),

  healthName: text("health_name"),
  healthTiming: text("health_timing"),
});

/* ===========================
   🔹 HOSTEL STRUCTURE (MERGED)
=========================== */
export const hostelStructure = pgTable(
  "hostel_structure",
  {
    id: serial("id").primaryKey(),

    type: hostelTypeEnum("type").notNull(),
    category: hostelCategoryEnum("category").notNull(),

    // 🔹 BLOCK
    title: text("title"),
    rooms: integer("rooms"),
    diningHall: integer("dining_hall").default(1),
    kitchen: integer("kitchen").default(1),

    // 🔹 FACILITY
    name: text("name"),

    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    typeIdx: index("structure_type_idx").on(table.type),
    categoryIdx: index("structure_category_idx").on(table.category),
  })
);

/* ===========================
   🔹 HOSTEL PEOPLE (MERGED)
=========================== */
export const hostelPeople = pgTable(
  "hostel_people",
  {
    id: serial("id").primaryKey(),

    roleType: hostelRoleEnum("role_type").notNull(),
    hostelType: hostelTypeEnum("hostel_type"),

    name: text("name").notNull(),
    designation: text("designation"),
    role: text("role"),
    phone: text("phone"),

    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    typeIdx: index("people_type_idx").on(table.hostelType),
  })
);

/* ===========================
   🔹 IMAGES (unchanged)
=========================== */
export const hostelImages = pgTable(
  "hostel_images",
  {
    id: serial("id").primaryKey(),
    type: hostelTypeEnum("type").notNull(),
    url: text("url").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    typeIdx: index("images_type_idx").on(table.type),
  })
);
// ======================================================
// dispensaryContent

/* ===========================
   🔹 ENUMS
=========================== */

export const dispensaryRoleEnum = pgEnum("dispensary_role", [
  "doctor",
  "staff",
  "driver",
]);

export const dispensaryMetaEnum = pgEnum("dispensary_meta", [
  "facility",
  "medicine",
]);

/* ===========================
   🏥 CONTENT (INFO)
=========================== */
export const dispensaryContent = pgTable("dispensary_content", {
  id: serial("id").primaryKey(),

  hodName: text("hod_name").notNull(),
  message: text("message").notNull(),
  img: text("img"),
});

/* ===========================
   👥 PEOPLE (MERGED)
=========================== */
export const dispensaryPeople = pgTable(
  "dispensary_people",
  {
    id: serial("id").primaryKey(),

    roleType: dispensaryRoleEnum("role_type").notNull(),

    name: text("name").notNull(),
    qualification: text("qualification"),
    workingHours: text("working_hours"),
    img: text("img"),
    contact: text("contact"),

    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    roleIdx: index("disp_people_role_idx").on(table.roleType),
  })
);

/* ===========================
   📋 META (FACILITY + MEDICINE)
=========================== */
export const dispensaryMeta = pgTable(
  "dispensary_meta",
  {
    id: serial("id").primaryKey(),

    category: dispensaryMetaEnum("category").notNull(),
    name: text("name").notNull(),
  },
  (table) => ({
    catIdx: index("disp_meta_cat_idx").on(table.category),
  })
);

/* ===========================
   🖼️ IMAGES
=========================== */
export const dispensaryImages = pgTable("dispensary_images", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
});
// ======================================================



/* ===========================
   🔹 ENUMS
=========================== */

export const libraryStatsEnum = pgEnum("library_stats_type", [
  "titles",
  "periodicals",
]);

export const libraryMetaEnum = pgEnum("library_meta_type", [
  "digital",
  "magazine",
  "newspaper",
]);

/* ===========================
   📚 CONTENT (MERGED)
=========================== */
export const libraryContent = pgTable("library_content", {
  id: serial("id").primaryKey(),

  officerName: text("officer_name"),
  designation: text("designation"),
  message: text("message"),
  img: text("img"),

  about: text("about"),
  digitalDescription: text("digital_description"),

  workingDays: text("working_days"),
  workingTime: text("working_time"),
  transactionTime: text("transaction_time"),
});

/* ===========================
   🏢 SECTIONS (KEEP)
=========================== */
export const librarySections = pgTable("library_sections", {
  id: serial("id").primaryKey(),
  section: text("section").notNull(),
  area: text("area").notNull(),
  location: text("location").notNull(),
});

/* ===========================
   📊 STATS (TITLES + PERIODICALS)
=========================== */
export const libraryStats = pgTable(
  "library_stats",
  {
    id: serial("id").primaryKey(),

    category: libraryStatsEnum("category").notNull(),

    name: text("name").notNull(), // branch / department
    value1: integer("value1"), // titles OR count
    value2: integer("value2"), // volumes (only for titles)
  },
  (table) => ({
    catIdx: index("library_stats_cat_idx").on(table.category),
  })
);

/* ===========================
   📋 META (DIGITAL / MAGAZINE / NEWSPAPER)
=========================== */
export const libraryMeta = pgTable(
  "library_meta",
  {
    id: serial("id").primaryKey(),

    category: libraryMetaEnum("category").notNull(),
    name: text("name").notNull(),
  },
  (table) => ({
    catIdx: index("library_meta_cat_idx").on(table.category),
  })
);

/* ===========================
   👥 TEAM (KEEP)
=========================== */
export const libraryTeam = pgTable("library_team", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  qualification: text("qualification").notNull(),
  designation: text("designation").notNull(),
});

/* ===========================
   🖼️ IMAGES (KEEP)
=========================== */
export const libraryImages = pgTable("library_images", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
});
//  =====================================================


/* ===========================
   🔹 ENUMS
=========================== */

export const sportsRoleEnum = pgEnum("sports_role", [
  "faculty",
  "non_teaching",
]);

export const sportsInfraEnum = pgEnum("sports_infra", [
  "field",
  "gym",
]);

/* ===========================
   🏆 CONTENT (INFO)
=========================== */
export const sportsContent = pgTable("sports_content", {
  id: serial("id").primaryKey(),

  name: text("name").notNull(),
  designation: text("designation").notNull(),
  message: text("message").notNull(),
  img: text("img").notNull(),

  qualification: text("qualification"),
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
});

/* ===========================
   👥 PEOPLE (FACULTY + NON TEACHING)
=========================== */
export const sportsPeople = pgTable(
  "sports_people",
  {
    id: serial("id").primaryKey(),

    roleType: sportsRoleEnum("role_type").notNull(),

    name: text("name").notNull(),
    designation: text("designation").notNull(),
  },
  (table) => ({
    roleIdx: index("sports_people_role_idx").on(table.roleType),
  })
);

/* ===========================
   🏟️ INFRA (FIELDS + GYM)
=========================== */
export const sportsInfra = pgTable(
  "sports_infra",
  {
    id: serial("id").primaryKey(),

    category: sportsInfraEnum("category").notNull(),

    name: text("name").notNull(),
    qty: integer("qty"),
    cost: text("cost"),
  },
  (table) => ({
    catIdx: index("sports_infra_cat_idx").on(table.category),
  })
);

/* ===========================
   🥇 ACHIEVEMENTS (KEEP)
=========================== */
export const sportsAchievements = pgTable("sports_achievements", {
  id: serial("id").primaryKey(),

  student: text("student").notNull(),
  branch: text("branch"),
  game: text("game"),
  tournament: text("tournament"),
  venue: text("venue"),
});

/* ===========================
   🖼️ IMAGES (KEEP)
=========================== */
export const sportsImages = pgTable("sports_images", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
});


/* ===========================
   🔹 ENUMS
=========================== */
export const engMetaEnum = pgEnum("eng_meta_type", [
  "construction",
  "electrical",
]);

/* ===========================
   📄 CONTENT
=========================== */
export const engContent = pgTable("eng_content", {
  id: serial("id").primaryKey(),

  title: text("title"),
  description: text("description"),

  vision: text("vision"),
  mission: text("mission"),
});

/* ===========================
   📋 META
   (CONSTRUCTION + ELECTRICAL)
=========================== */
export const engMeta = pgTable(
  "eng_meta",
  {
    id: serial("id").primaryKey(),

    category: engMetaEnum("category").notNull(),

    /* 🔹 CONSTRUCTION */
    title: text("title"),
    content: text("content"),

    /* 🔹 ELECTRICAL */
    name: text("name"),
    description: text("description"),
    engineer: text("engineer"),
    img: text("img"),
  },
  (table) => ({
    catIdx: index("eng_meta_cat_idx").on(table.category),
  })
);

/* ===========================
   👥 STAFF
=========================== */
export const engStaff = pgTable(
  "eng_staff",
  {
    id: serial("id").primaryKey(),

    name: text("name").notNull(),
    designation: text("designation").notNull(),

    /* ✅ civil | electrical */
    type: text("type").notNull(),

    /* optional */
    img: text("img"),
  },
  (table) => ({
    typeIdx: index("eng_staff_type_idx").on(table.type),
  })
);


/* ===========================
   🎵 MUSIC CONTENT
=========================== */
export const musicContent = pgTable("music_content", {
  id: serial("id").primaryKey(),

  title: text("title"),
  subtitle: text("subtitle"),

  message: text("message"),

  vision: text("vision"),
  mission: text("mission"),

  objectives: text("objectives"),

  process: text("process"),
});

/* ===========================
   👥 MUSIC PEOPLE
=========================== */
export const musicPeople = pgTable(
  "music_people",
  {
    id: serial("id").primaryKey(),

    // faculty | student
    roleType: text("role_type").notNull(),

    // male | female
    gender: text("gender"),

    name: text("name").notNull(),

    designation: text("designation"),

    branch: text("branch"),
    year: text("year"),

    img: text("img"),
  },
  (table) => ({
    roleIdx: index("music_people_role_idx").on(
      table.roleType
    ),
  })
);

/* ===========================
   🎸 MUSIC EQUIPMENT
=========================== */
export const musicEquipment = pgTable(
  "music_equipment",
  {
    id: serial("id").primaryKey(),

    item: text("item").notNull(),

    cost: text("cost"),
  }
);

/* ===========================
   🎶 MUSIC MEMBERS
=========================== */
export const musicMembers = pgTable(
  "music_members",
  {
    id: serial("id").primaryKey(),

    instrument: text("instrument"),

    name: text("name").notNull(),

    branch: text("branch"),

    year: text("year"),
  }
);

/* ===========================
   🖼️ MUSIC IMAGES
=========================== */
export const musicImages = pgTable(
  "music_images",
  {
    id: serial("id").primaryKey(),

    url: text("url").notNull(),
  }
);
export const studentClubs = pgTable("student_clubs", {
  id: serial("id").primaryKey(),

  slug: text("slug").notNull(),

  name: text("name").notNull(),

  category: text("category"),

  title: text("title"),

  description: text("description"),

  badge: text("badge"),

  heroImage: text("hero_image"),
});
export const studentClubContent = pgTable(
  "student_club_content",
  {
    id: serial("id").primaryKey(),

    clubId: integer("club_id").notNull(),

    sectionType: text("section_type").notNull(),

    heading: text("heading"),

    content: text("content"),

    image: text("image"),
  }
);
export const studentClubImages = pgTable(
  "student_club_images",
  {
    id: serial("id").primaryKey(),

    clubId: integer("club_id").notNull(),

    url: text("url").notNull(),
  }
);



export const departments = pgTable("departments", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  hod: text("hod"),
  description: text("description"),
  image: text("image"),
  vision: text("vision"),
  mission: text("mission"),
  hod_photo: text("hod_photo"),
  hod_message: text("hod_message"),
  hod_contact: text("hod_contact"),
  about_details: text("about_details"),
  created_at: timestamp("created_at").defaultNow(),
});

export const faculty = pgTable("faculty", {
  id: serial("id").primaryKey(),
  dept_id: uuid("dept_id").references(() => departments.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  designation: text("designation"),
  photo_url: text("photo_url"),
  profile_link: text("profile_link"),
  specialization: text("specialization"),
});

export const achievements = pgTable("achievements", {
  id: uuid("id").primaryKey().defaultRandom(),
  dept_id: uuid("dept_id").references(() => departments.id, { onDelete: 'cascade' }),
  category: varchar("category", { length: 50 }),
  subcategory: varchar("subcategory", { length: 100 }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  year: varchar("year", { length: 20 }),
  course: varchar("course", { length: 50 }),
  created_at: timestamp("created_at").defaultNow(),
});

export const laboratories = pgTable("laboratories", {
  id: serial("id").primaryKey(),
  dept_id: uuid("dept_id").references(() => departments.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  description: text("description"),
  location: text("location"),
  photo_url: text("photo_url"),
  specs: jsonb("specs"), // For dynamic equipment lists
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  dept_id: uuid("dept_id").references(() => departments.id, { onDelete: 'cascade' }),
  level: text("level"), // UG/PG
  name: text("name").notNull(),
  syllabus_url: text("syllabus_url"),
  regulation: text("regulation"),
});

export const departmentGallery = pgTable("department_gallery", {
  id: uuid("id").primaryKey().defaultRandom(),
  dept_id: uuid("dept_id").references(() => departments.id, { onDelete: 'cascade' }),
  title: varchar("title", { length: 255 }),
  image_url: text("image_url").notNull(),
  category: varchar("category", { length: 100 }),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow(),
});