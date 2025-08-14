CREATE TABLE "courses_tabel" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	CONSTRAINT "courses_tabel_title_unique" UNIQUE("title")
);
