CREATE TABLE "enrollments_table" (
	"userId" uuid NOT NULL,
	"coursesId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "courses_tabel" RENAME TO "courses_table";--> statement-breakpoint
ALTER TABLE "courses_table" DROP CONSTRAINT "courses_tabel_title_unique";--> statement-breakpoint
ALTER TABLE "enrollments_table" ADD CONSTRAINT "enrollments_table_userId_users_table_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollments_table" ADD CONSTRAINT "enrollments_table_coursesId_courses_table_id_fk" FOREIGN KEY ("coursesId") REFERENCES "public"."courses_table"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses_table" ADD CONSTRAINT "courses_table_title_unique" UNIQUE("title");