import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";


// ==============================
// 🔹 ENUMS (IMPORTANT)
// ==============================
export const hostelTypeEnum = pgEnum("hostel_type", [
  "office",
  "girls",
  "boys",
]);

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
// ==============================
// 🔹 PLACEMENT TABLES
// ==============================

export const placementYears = pgTable(
  "placement_years",
  {
    id: serial("id").primaryKey(),
    year: text("year").notNull(),
    offers: integer("offers").notNull(),
    top: text("top").notNull(), // "42 LPA"
    recruiters: integer("recruiters").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    yearIdx: index("placement_year_idx").on(table.year),
  })
);


export const placementHighlights = pgTable("placement_highlights", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  branch: text("branch").notNull(),
  company: text("company").notNull(),
  package: text("package").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
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


export const recruiters = pgTable(
  "recruiters",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    url: text("url").notNull(),
  },
  (table) => ({
    nameIdx: index("recruiter_name_idx").on(table.name),
  })
);

export const placementGallery = pgTable("placement_gallery", {
  id: serial("id").primaryKey(),
  src: text("src").notNull(),
  caption: text("caption").notNull(),
});

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
  extn: text("extn"),
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
;

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
   🔹 ENUM (recommended)
=========================== */


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