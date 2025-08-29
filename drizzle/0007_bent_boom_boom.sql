CREATE TYPE "public"."user_role" AS ENUM('student', 'manager');--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "role" "user_role" DEFAULT 'student' NOT NULL;