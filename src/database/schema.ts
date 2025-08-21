import { uniqueIndex } from "drizzle-orm/pg-core";
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

export const enrollments = pgTable(
  "enrollments_table",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid()
      .notNull()
      .references(() => users.id),
    coursesId: uuid()
      .notNull()
      .references(() => courses.id),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex().on(table.userId, table.coursesId)] // constraints, não permitir que o user se escreva no mesmo curso 2 ou mais vezes
);
