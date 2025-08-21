import { timestamp } from "drizzle-orm/pg-core";
import { pgTable, uuid, text } from "drizzle-orm/pg-core";

export const users = pgTable("users_table", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  email: text().notNull().unique(),
});

export const courses = pgTable("courses_table", {
  id: uuid().primaryKey().defaultRandom(),
  title: text().notNull().unique(),
  description: text(),
});

export const enrollments = pgTable("enrollments_table", {
  userId: uuid()
    .notNull()
    .references(() => users.id),
  coursesId: uuid()
    .notNull()
    .references(() => courses.id),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});
