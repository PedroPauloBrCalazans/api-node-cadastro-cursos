ALTER TABLE "enrollments_table" ALTER COLUMN "createdAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "enrollments_table" ALTER COLUMN "createdAt" SET DEFAULT now();