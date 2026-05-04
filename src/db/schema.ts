import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core';

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
